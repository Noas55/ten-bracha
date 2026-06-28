import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BLESSING_FULL_TEXT } from '@/data/blessings';

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
      <div className="min-h-screen bg-gradient-to-b from-[#faf8f5] via-white to-[#faf8f5] flex flex-col">
        <header className="w-full py-4 px-4 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-[#1e3a5f] font-medium hover:bg-[#1e3a5f]/5 rounded-xl"
          >
            → התחלה מחדש
          </Button>
          <h1 className="text-xl font-bold text-[#1e3a5f]">נדרשת הבהרה</h1>
          <div className="w-16" />
        </header>

        <main className="flex-1 flex flex-col items-center justify-center px-4 pb-12">
          <div className="w-full max-w-lg space-y-6">
            <Card className="spiritual-glow border-2 border-[#d4a843]/30 rounded-2xl bg-gradient-to-br from-[#fffef9] to-white">
              <CardContent className="p-7 text-center space-y-5">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-100 flex items-center justify-center">
                  <span className="text-4xl">⚠️</span>
                </div>
                <h2 className="text-xl font-bold text-[#1e3a5f]">
                  מקרה מורכב — יש לשאול רב
                </h2>
                <p className="text-[#1a1a2e]/60">
                  המאכל <strong className="text-[#1e3a5f]">{blessingData.hebrew_name}</strong> ({blessingData.category}) דורש בירור נוסף
                </p>
                {blessingData.note && (
                  <div className="bg-amber-50/80 rounded-xl p-4">
                    <p className="text-sm text-[#1a1a2e]/70">
                      💡 {blessingData.note}
                    </p>
                  </div>
                )}
                {blessingData.first_blessing !== 'דורש שאלת הבהרה' && blessingData.first_blessing !== 'תלוי בכמות' && (
                  <div className="bg-[#faf8f5] rounded-xl p-5">
                    <p className="text-xs text-[#1a1a2e]/40 mb-2">ברכה ראשונה (במקרה הרגיל):</p>
                    <p className="blessing-text text-xl">{blessingData.first_blessing}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Hotline */}
            {blessingData.hotline && (
              <Card className="bg-gradient-to-l from-[#1e3a5f] to-[#2d5a8e] text-white rounded-2xl shadow-lg">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-white/10 flex items-center justify-center">
                    <span className="text-3xl">📞</span>
                  </div>
                  <h3 className="text-lg font-bold">קו הלכה</h3>
                  <p className="text-white/70 text-sm">
                    לפסיקה מדויקת לפי מנהג {traditionNames[tradition]}
                  </p>
                  <a
                    href={`tel:${blessingData.hotline}`}
                    className="inline-block bg-gradient-to-l from-[#d4a843] to-[#c49a38] text-[#1e3a5f] font-bold px-8 py-3 rounded-xl text-lg shadow-md"
                  >
                    {blessingData.hotline}
                  </a>
                </CardContent>
              </Card>
            )}

            <Button
              onClick={() => navigate('/')}
              className="w-full py-5 text-lg font-bold bg-gradient-to-l from-[#1e3a5f] to-[#2d5a8e] hover:from-[#2d5a8e] hover:to-[#1e3a5f] text-white rounded-2xl shadow-lg shadow-[#1e3a5f]/20"
            >
              חזרה להתחלה
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#faf8f5] via-white to-[#faf8f5] flex flex-col">
      {/* Header */}
      <header className="w-full py-4 px-4 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="text-[#1e3a5f] font-medium hover:bg-[#1e3a5f]/5 rounded-xl"
        >
          → התחלה מחדש
        </Button>
        <h1 className="text-xl font-bold text-[#1e3a5f]">הברכה שלך</h1>
        <div className="w-16" />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center px-4 pb-12">
        <div className="w-full max-w-lg space-y-6">
          {/* Food Info */}
          <div className="text-center space-y-3 animate-fade-in-up">
            {image && (
              <div className="w-24 h-24 mx-auto rounded-2xl overflow-hidden border-3 border-[#d4a843]/30 shadow-lg mb-2">
                <img src={image} alt="" className="w-full h-full object-cover" />
              </div>
            )}
            <h2 className="text-xl font-bold text-[#1e3a5f]">
              {blessingData.hebrew_name}
            </h2>
            <div className="flex items-center justify-center gap-2">
              <span className="text-sm text-[#1a1a2e]/40 bg-[#1e3a5f]/5 px-3 py-1 rounded-full">
                {blessingData.category}
              </span>
              <span className="text-sm text-[#1a1a2e]/40 bg-[#d4a843]/10 px-3 py-1 rounded-full">
                מנהג {traditionNames[tradition]}
              </span>
            </div>
          </div>

          {/* First Blessing */}
          <Card className="spiritual-glow border-2 border-[#d4a843]/30 bg-gradient-to-b from-[#fffef9] to-white rounded-2xl animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <CardContent className="p-7 text-center space-y-5">
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#d4a843]/10 flex items-center justify-center">
                  <span className="text-xl">✨</span>
                </div>
                <h3 className="text-lg font-bold text-[#1e3a5f]">ברכה ראשונה</h3>
                <div className="w-10 h-10 rounded-xl bg-[#d4a843]/10 flex items-center justify-center">
                  <span className="text-xl">✨</span>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#d4a843]/10">
                <p className="blessing-text text-xl leading-relaxed">
                  בָּרוּךְ אַתָּה ה׳ אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם
                </p>
                <div className="w-16 h-0.5 mx-auto bg-gradient-to-l from-transparent via-[#d4a843]/40 to-transparent my-3" />
                <p className="blessing-text text-2xl leading-relaxed text-[#d4a843]">
                  {blessingData.first_blessing}
                </p>
              </div>
              {blessingData.note && (
                <div className="bg-[#faf8f5] rounded-xl p-4">
                  <p className="text-sm text-[#1a1a2e]/60">
                    💡 {blessingData.note}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* After Blessing Toggle */}
          {!showAfterBlessing ? (
            <Button
              onClick={() => setShowAfterBlessing(true)}
              variant="outline"
              className="w-full py-5 text-base font-bold border-2 border-[#4a7c59]/30 text-[#4a7c59] hover:bg-[#4a7c59]/5 rounded-2xl transition-all duration-300"
            >
              הצג ברכה אחרונה 🌿
            </Button>
          ) : (
            <Card className="border-2 border-[#4a7c59]/30 bg-gradient-to-b from-green-50/50 to-white rounded-2xl animate-scale-in">
              <CardContent className="p-7 text-center space-y-5">
                <div className="flex items-center justify-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#4a7c59]/10 flex items-center justify-center">
                    <span className="text-xl">🌿</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#4a7c59]">ברכה אחרונה</h3>
                  <div className="w-10 h-10 rounded-xl bg-[#4a7c59]/10 flex items-center justify-center">
                    <span className="text-xl">🌿</span>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#4a7c59]/10">
                  <p className="blessing-text text-xl text-[#4a7c59] whitespace-pre-line leading-relaxed">
                    {BLESSING_FULL_TEXT[blessingData.last_blessing] || blessingData.last_blessing}
                  </p>
                </div>
                <p className="text-xs text-[#1a1a2e]/40">
                  * ברכה אחרונה נאמרת רק אם נאכל/נשתה שיעור מספיק
                </p>
              </CardContent>
            </Card>
          )}

          {/* Start Over */}
          <Button
            onClick={() => navigate('/')}
            className="w-full py-5 text-lg font-bold bg-gradient-to-l from-[#1e3a5f] to-[#2d5a8e] hover:from-[#2d5a8e] hover:to-[#1e3a5f] text-white rounded-2xl shadow-lg shadow-[#1e3a5f]/20 transition-all duration-300"
          >
            ברכה על מאכל נוסף 🙏
          </Button>
        </div>
      </main>
    </div>
  );
}