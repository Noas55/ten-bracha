# תן ברכה - Ten Bracha

אפליקציית זיהוי מאכלים וברכות על פי ההלכה

## תיאור הפרויקט

"תן ברכה" היא אפליקציה שמאפשרת לצלם מאכל ולקבל את הברכה המתאימה לפי המסורת ההלכתית של המשתמש (אשכנז, ספרד/עדות המזרח, חב״ד).

### תכונות עיקריות
- 📸 צילום או העלאת תמונת מאכל
- 🤖 זיהוי אוטומטי של המאכל באמצעות AI (Gemini 2.5 Pro)
- 🙏 הצגת ברכה ראשונה ואחרונה לפי המסורת
- 📞 הפניה לקווי הלכה במקרים מורכבים
- 🌐 ממשק עברי RTL מלא

## טכנולוגיות

### Frontend
- React + TypeScript
- Vite
- Tailwind CSS
- shadcn/ui

### Backend
- FastAPI (Python)
- PostgreSQL
- AIHubService (Gemini 2.5 Pro)
- Atoms Cloud

## מבנה הפרויקט

```
app/
├── backend/
│   ├── routers/
│   │   └── food_recognition.py   # API לזיהוי מאכלים וברכות
│   ├── models/
│   │   └── foods.py              # מודל מסד נתונים
│   ├── services/
│   │   └── foods.py              # שירותי CRUD
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Index.tsx         # דף הבית - בחירת מסורת
│   │   │   ├── Upload.tsx        # העלאת תמונה
│   │   │   ├── Results.tsx       # תוצאות זיהוי
│   │   │   ├── Blessing.tsx      # הצגת ברכה
│   │   │   └── Doubt.tsx         # הפניה לקו הלכה
│   │   ├── App.tsx
│   │   └── index.css
│   └── package.json
└── README.md
```

## התקנה והרצה

### Frontend
```bash
cd frontend
pnpm install
pnpm run dev
```

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

## רישיון

פרויקט גמר - כל הזכויות שמורות