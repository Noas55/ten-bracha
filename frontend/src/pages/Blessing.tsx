import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface BlessingData {
  food_name: string;
  hebrew_name: string;
  category: string;
  tradition: string;
  first_blessing: string;
  last_blessing: string;
  note: string;
  requires_clarification: boolean;
  hotline: string | null;
}

export default function BlessingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { blessing, tradition, image } = location.state || {};
  const [showAfterBlessing, setShowAfterBlessing] = useState(false);

  if (!blessing) {
    navigate('/');
    return null;
  }

  const blessingData = blessing as BlessingData;

  const traditionNames: Record<string, string> = {
    ashkenaz: 'אשכנז',
    sephardi: 'ספרד',
    mizrachi: 'עדות המזרח',
    chabad: 'חב״ד',
  };

  // If requires clarification, redirect to doubt page
  if (blessingData.requires_clarification) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex flex-col">
        <header className="w-full py-4 px-4 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-[#1e3a5f] font-medium"
          >
            ← התחלה מחדש
          </Button>
          <h1 className="text-xl font-bold text-[#1e3a5f]">נדרשת הבהרה</h1>
          <div className="w-16" />
        </header>

        <main className="flex-1 flex flex-col items-center justify-center px-4 pb-12">
          <div className="w-full max-w-lg space-y-6">
            <Card className="spiritual-glow border-[#d4a843]/30">
              <CardContent className="p-6 text-center space-y-4">
                <span className="text-5xl">⚠️</span>
                <h2 className="text-xl font-bold text-[#1e3a5f]">
                  מקרה מורכב - יש לשאול רב
                </h2>
                <p className="text-[#1a1a2e]/70">
                  המאכל <strong>{blessingData.hebrew_name}</strong> ({blessingData.category}) דורש בירור נוסף
                </p>
                {blessingData.note && (
                  <p className="text-sm text-[#1a1a2e]/60 bg-amber-50 rounded-lg p-3">
                    💡 {blessingData.note}
                  </p>
                )}
                {blessingData.first_blessing !== 'דורש שאלת הבהרה' && blessingData.first_blessing !== 'תלוי בכמות' && (
                  <div className="bg-[#faf8f5] rounded-xl p-4">
                    <p className="text-sm text-[#1a1a2e]/60 mb-1">ברכה ראשונה (במקרה הרגיל):</p>
                    <p className="blessing-text text-lg">{blessingData.first_blessing}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Hotline */}
            {blessingData.hotline && (
              <Card className="bg-[#1e3a5f] text-white">
                <CardContent className="p-5 text-center space-y-3">
                  <h3 className="text-lg font-bold">📞 קו הלכה</h3>
                  <p className="text-white/80 text-sm">
                    לפסיקה מדויקת לפי מנהג {traditionNames[tradition]}
                  </p>
                  <a
                    href={`tel:${blessingData.hotline}`}
                    className="inline-block bg-[#d4a843] text-[#1e3a5f] font-bold px-6 py-3 rounded-xl text-lg"
                  >
                    {blessingData.hotline}
                  </a>
                </CardContent>
              </Card>
            )}

            <Button
              onClick={() => navigate('/')}
              className="w-full py-5 text-lg font-bold bg-[#1e3a5f] hover:bg-[#1e3a5f]/90 text-white rounded-xl"
            >
              חזרה להתחלה
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col">
      {/* Header */}
      <header className="w-full py-4 px-4 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="text-[#1e3a5f] font-medium"
        >
          ← התחלה מחדש
        </Button>
        <h1 className="text-xl font-bold text-[#1e3a5f]">הברכה שלך</h1>
        <div className="w-16" />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center px-4 pb-12">
        <div className="w-full max-w-lg space-y-6">
          {/* Food Info */}
          <div className="text-center space-y-2">
            {image && (
              <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-3 border-[#d4a843] shadow-lg mb-3">
                <img src={image} alt="" className="w-full h-full object-cover" />
              </div>
            )}
            <h2 className="text-lg font-semibold text-[#1a1a2e]/70">
              {blessingData.hebrew_name} • {blessingData.category}
            </h2>
            <p className="text-sm text-[#1a1a2e]/50">
              מנהג {traditionNames[tradition]}
            </p>
          </div>

          {/* First Blessing */}
          <Card className="spiritual-glow border-[#d4a843]/30 bg-gradient-to-b from-[#fffef9] to-[#faf8f5]">
            <CardContent className="p-6 text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl">✨</span>
                <h3 className="text-lg font-bold text-[#1e3a5f]">ברכה ראשונה</h3>
                <span className="text-2xl">✨</span>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm">
                <p className="blessing-text text-2xl leading-relaxed">
                  בָּרוּךְ אַתָּה ה׳ אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם
                </p>
                <p className="blessing-text text-2xl leading-relaxed mt-2 text-[#d4a843]">
                  {blessingData.first_blessing}
                </p>
              </div>
              {blessingData.note && (
                <p className="text-sm text-[#1a1a2e]/60 italic">
                  💡 {blessingData.note}
                </p>
              )}
            </CardContent>
          </Card>

          {/* After Blessing Toggle */}
          {!showAfterBlessing ? (
            <Button
              onClick={() => setShowAfterBlessing(true)}
              variant="outline"
              className="w-full py-5 text-base font-medium border-[#d4a843] text-[#1e3a5f] hover:bg-[#d4a843]/5"
            >
              הצג ברכה אחרונה 🙏
            </Button>
          ) : (
            <Card className="border-[#4a7c59]/30 bg-gradient-to-b from-green-50/50 to-[#faf8f5]">
              <CardContent className="p-6 text-center space-y-4">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl">🌿</span>
                  <h3 className="text-lg font-bold text-[#4a7c59]">ברכה אחרונה</h3>
                  <span className="text-2xl">🌿</span>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-sm">
                  <p className="blessing-text text-xl text-[#4a7c59]">
                    {blessingData.last_blessing}
                  </p>
                </div>
                <p className="text-xs text-[#1a1a2e]/50">
                  * ברכה אחרונה נאמרת רק אם נאכל/נשתה שיעור מספיק
                </p>
              </CardContent>
            </Card>
          )}

          {/* Start Over */}
          <Button
            onClick={() => navigate('/')}
            className="w-full py-5 text-lg font-bold bg-[#1e3a5f] hover:bg-[#1e3a5f]/90 text-white rounded-xl"
          >
            ברכה על מאכל נוסף
          </Button>
        </div>
      </main>
    </div>
  );
}