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
    tradition: str  # ashkenaz, sephardi, chabad


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
                    content=f"""You are a food identification expert. Analyze the image and identify what food items are visible.
Return ONLY valid JSON in this exact format:
{{
  "matches": [
    {{"food_name": "english_name", "hebrew_name": "שם בעברית", "confidence": 0.95, "category": "category"}}
  ],
  "raw_description": "Brief description of what you see"
}}

Known foods in our database: {food_list_str}

Rules:
1. Try to match to known foods from the list above
2. If the food is not in the list, still identify it with your best guess
3. Confidence should be between 0.0 and 1.0
4. Return up to 3 matches ordered by confidence
5. hebrew_name should be the Hebrew name of the food
6. category should be one of: ירק, פרי העץ, פרי האדמה, משקה, בשר, דג, מאפה, לחם, יין, עוגה, שבעת המינים, קטניות, דגנים, ממתק, חלבי, תבשיל, מנה מורכבת"""
                ),
                ChatMessage(
                    role="user",
                    content=[
                        {"type": "text", "text": "What food is in this image? Identify it precisely."},
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

        # Get Hebrew name from AI (quick call)
        hebrew_name = data.food_name.replace("_", " ")

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