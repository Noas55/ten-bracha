# @File: backend/routers/food_recognition.py
# @Desc: API route for food recognition using AI
import logging
import json
import re
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional, List

from core.database import get_db
from models.foods import Foods
from services.aihub import AIHubService
from schemas.aihub import GenTxtRequest, ChatMessage

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/food", tags=["food"])


class FoodRecognitionRequest(BaseModel):
    image: str  # base64 data URI of the food image


class FoodMatch(BaseModel):
    food_name: str
    hebrew_name: str
    confidence: float
    category: str


class FoodRecognitionResponse(BaseModel):
    matches: List[FoodMatch]
    raw_description: str


class BlessingRequest(BaseModel):
    food_name: str
    tradition: str  # ashkenaz, sephardi, mizrachi, chabad
    hebrew_name: Optional[str] = None  # from AI recognition


class BlessingResponse(BaseModel):
    food_name: str
    hebrew_name: str
    category: str
    tradition: str
    first_blessing: str
    last_blessing: str
    note: str
    requires_clarification: bool
    hotline: Optional[str] = None


@router.post("/recognize", response_model=FoodRecognitionResponse)
async def recognize_food(
    data: FoodRecognitionRequest,
    db: AsyncSession = Depends(get_db),
):
    """Recognize food from an image using AI multimodal model"""
    try:
        # Get all food names from database for reference
        result = await db.execute(select(Foods))
        all_foods = result.scalars().all()
        food_names = list(set(f.food_name for f in all_foods))

        await db.rollback()  # Close transaction before slow AI call

        service = AIHubService()

        food_list_str = ", ".join(food_names)

        request = GenTxtRequest(
            messages=[
                ChatMessage(
                    role="system",
                    content=f"""You are a food identification expert specializing in Israeli and Middle Eastern cuisine. Analyze the image and identify what food items are visible.
Return ONLY valid JSON in this exact format:
{{
  "matches": [
    {{"food_name": "english_name", "hebrew_name": "שם בעברית", "confidence": 0.95, "category": "category"}}
  ],
  "raw_description": "Brief description of what you see"
}}

Known foods in our database: {food_list_str}

CRITICAL RULES:
1. You MUST try to match the food to one of the known foods from the list above. This is the most important rule.
2. For borekas/bourekas/burekas/börek - ALWAYS use "borekas" as the food_name
3. For falafel - use "falafel"
4. For shawarma - use "shawarma"
5. For schnitzel - use "schnitzel"
6. For hummus - use "hummus"
7. For malawach - use "malawach"
8. For jachnun - use "jachnun"
9. For sabich - use "sabich"
10. If the food is not in the list, still identify it with your best guess using a simple English name (lowercase, underscores for spaces)
11. Confidence should be between 0.0 and 1.0
12. Return up to 3 matches ordered by confidence
13. hebrew_name should be the Hebrew name of the food
14. category should be one of: ירק, פרי העץ, פרי האדמה, משקה, בשר, דג, מאפה, לחם, יין, עוגה, שבעת המינים, קטניות, דגנים, ממתק, חלבי, תבשיל, מנה מורכבת"""
                ),
                ChatMessage(
                    role="user",
                    content=[
                        {"type": "text", "text": "What food is in this image? Identify it precisely. Make sure to use the exact food_name from the known foods list if possible."},
                        {"type": "image_url", "image_url": {"url": data.image}}
                    ]
                )
            ],
            model="gemini-2.5-pro"
        )

        response = await service.gentxt(request)
        raw_content = response.content.strip()

        # Extract JSON from response
        def extract_json_block(text: str) -> str:
            if text.startswith("```"):
                match = re.search(r"```(?:json)?\n(.*?)```", text, re.DOTALL)
                if match:
                    text = match.group(1).strip()
            start = text.find("{")
            end = text.rfind("}")
            if start >= 0 and end > start:
                return text[start:end + 1]
            return text

        payload_text = extract_json_block(raw_content)

        try:
            payload = json.loads(payload_text)
        except json.JSONDecodeError:
            # Retry with repair
            repair_request = GenTxtRequest(
                messages=[
                    ChatMessage(role="system", content="Fix this into valid JSON only. Return ONLY the JSON."),
                    ChatMessage(role="user", content=payload_text),
                ],
                model="gemini-2.5-pro",
            )
            repaired = await service.gentxt(repair_request)
            try:
                payload = json.loads(extract_json_block(repaired.content.strip()))
            except json.JSONDecodeError:
                raise HTTPException(status_code=500, detail="לא הצלחנו לזהות את המאכל. נסה שוב עם תמונה ברורה יותר.")

        matches = payload.get("matches", [])
        raw_description = payload.get("raw_description", "")

        return FoodRecognitionResponse(
            matches=[FoodMatch(**m) for m in matches[:3]],
            raw_description=raw_description
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Food recognition error: {e}")
        raise HTTPException(status_code=500, detail=f"שגיאה בזיהוי המאכל: {str(e)}")


# Common food name aliases for fuzzy matching
FOOD_ALIASES: dict[str, list[str]] = {
    "borekas": ["bourekas", "burekas", "börek", "burek", "bourek", "burikas", "בורקס", "בורקסים"],
    "falafel": ["falafel", "פלאפל"],
    "hummus": ["hummus", "chummus", "חומוס"],
    "shawarma": ["shawarma", "shwarma", "שווארמה"],
    "schnitzel": ["schnitzel", "שניצל"],
    "malawach": ["malawach", "malawah", "מלווח"],
    "jachnun": ["jachnun", "jahnun", "ג'חנון"],
    "sabich": ["sabich", "sabih", "סביח"],
    "croissant": ["croissant", "קרואסון"],
    "donut": ["donut", "doughnut", "סופגנייה", "סופגניה"],
    "pizza": ["pizza", "פיצה"],
    "burger": ["burger", "hamburger", "המבורגר", "בורגר"],
    "hot_dog": ["hot_dog", "hotdog", "הוט דוג", "נקניקייה"],
    "pretzels": ["pretzels", "pretzel", "בייגלה", "בייגלעך"],
    "crackers": ["crackers", "cracker", "קרקרים"],
    "couscous": ["couscous", "קוסקוס"],
    "ice_cream": ["ice_cream", "icecream", "גלידה"],
    "cookies": ["cookies", "cookie", "עוגיות", "עוגייה"],
    "chocolate": ["chocolate", "שוקולד"],
    "popcorn": ["popcorn", "פופקורן", "פופקורן"],
    "french_fries": ["french_fries", "fries", "chips", "צ'יפס", "טוגנים"],
    "chips": ["chips", "potato_chips", "צ'יפס"],
    "sweet_bun": ["sweet_bun", "לחמנייה מתוקה", "לחמניה מתוקה", "פשטידה"],
    "toast": ["toast", "טוסט", "טוסט ממולא"],
    "sushi": ["sushi", "סושי"],
    "smoothie": ["smoothie", "סמוט'י", "שייק"],
    "energy_drink": ["energy_drink", "אנרג'י דרינק", "משקה אנרגיה"],
    "fruit_salad": ["fruit_salad", "סלט פירות"],
    "mixed_salad": ["mixed_salad", "סלט ירקות", "סלט"],
    "soup": ["soup", "מרק"],
}


def find_matching_food_name(input_name: str) -> str | None:
    """Find the canonical food name from an alias or variant spelling."""
    normalized = input_name.strip().lower().replace(" ", "_")
    # Direct match
    if normalized in FOOD_ALIASES:
        return normalized
    # Check if input matches any alias
    for canonical, aliases in FOOD_ALIASES.items():
        if normalized in [a.lower().replace(" ", "_") for a in aliases]:
            return canonical
    # Check if input is a substring of any alias or vice versa
    for canonical, aliases in FOOD_ALIASES.items():
        all_names = [canonical.lower()] + [a.lower().replace(" ", "_") for a in aliases]
        for name in all_names:
            if name in normalized or normalized in name:
                return canonical
    return None


@router.post("/blessing", response_model=BlessingResponse)
async def get_blessing(
    data: BlessingRequest,
    db: AsyncSession = Depends(get_db),
):
    """Get the appropriate blessing for a food based on tradition"""
    try:
        # Map tradition to database values - 4 distinct traditions
        tradition_map = {
            "ashkenaz": "אשכנז / חב״ד",
            "sephardi": "ספרד",
            "mizrachi": "עדות המזרח",
            "chabad": "אשכנז / חב״ד",
        }

        # First try to find tradition-specific entry
        tradition_value = tradition_map.get(data.tradition, "הכל")

        # Try exact match first
        result = await db.execute(
            select(Foods).where(
                Foods.food_name == data.food_name,
                Foods.tradition == tradition_value
            )
        )
        food = result.scalars().first()

        # If not found, try the universal entry
        if not food:
            result = await db.execute(
                select(Foods).where(
                    Foods.food_name == data.food_name,
                    Foods.tradition == "הכל"
                )
            )
            food = result.scalars().first()

        # If still not found, try fuzzy matching via aliases
        if not food:
            canonical_name = find_matching_food_name(data.food_name)
            if canonical_name:
                result = await db.execute(
                    select(Foods).where(
                        Foods.food_name == canonical_name,
                        Foods.tradition == tradition_value
                    )
                )
                food = result.scalars().first()

                if not food:
                    result = await db.execute(
                        select(Foods).where(
                            Foods.food_name == canonical_name,
                            Foods.tradition == "הכל"
                        )
                    )
                    food = result.scalars().first()

        # Last resort: try ILIKE search in database
        if not food:
            result = await db.execute(
                select(Foods).where(
                    Foods.food_name.ilike(f"%{data.food_name}%"),
                    Foods.tradition == tradition_value
                )
            )
            food = result.scalars().first()

            if not food:
                result = await db.execute(
                    select(Foods).where(
                        Foods.food_name.ilike(f"%{data.food_name}%"),
                        Foods.tradition == "הכל"
                    )
                )
                food = result.scalars().first()

        if not food:
            raise HTTPException(status_code=404, detail="המאכל לא נמצא במאגר")

        # Determine hotline based on tradition
        hotline_map = {
            "ashkenaz": "072-215-2222",
            "sephardi": "02-652-5555",
            "mizrachi": "*3030",
            "chabad": "077-225-1770",
        }
        hotline = hotline_map.get(data.tradition) if food.requires_clarification else None

        # Use Hebrew name from AI recognition, or fall back to food_name
        hebrew_name = data.hebrew_name or data.food_name.replace("_", " ")

        return BlessingResponse(
            food_name=data.food_name,
            hebrew_name=hebrew_name,
            category=food.category,
            tradition=data.tradition,
            first_blessing=food.first_blessing,
            last_blessing=food.last_blessing,
            note=food.note or "",
            requires_clarification=food.requires_clarification or False,
            hotline=hotline
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Blessing lookup error: {e}")
        raise HTTPException(status_code=500, detail=f"שגיאה בחיפוש הברכה: {str(e)}")


@router.get("/list")
async def list_foods(
    db: AsyncSession = Depends(get_db),
):
    """Get all foods from the database"""
    try:
        result = await db.execute(select(Foods))
        foods = result.scalars().all()

        return {
            "foods": [
                {
                    "id": f.id,
                    "food_name": f.food_name,
                    "category": f.category,
                    "tradition": f.tradition,
                    "first_blessing": f.first_blessing,
                    "last_blessing": f.last_blessing,
                    "note": f.note,
                    "requires_clarification": f.requires_clarification,
                }
                for f in foods
            ]
        }
    except Exception as e:
        logger.error(f"List foods error: {e}")
        raise HTTPException(status_code=500, detail=str(e))