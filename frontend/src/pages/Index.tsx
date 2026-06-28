import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getBlessing } from '@/data/blessings';

const traditions = [
  {
    id: 'ashkenaz',
    name: 'אשכנז',
    description: 'מנהג אשכנז (ליטאי וחסידי)',
    icon: '🕎',
    gradient: 'from-blue-50 to-indigo-50',
    border: 'border-blue-200/50',
    hoverBorder: 'hover:border-blue-300',
    iconBg: 'bg-blue-100',
  },
  {
    id: 'sephardi',
    name: 'ספרד',
    description: 'מנהג ספרד (קרוב למנהג אשכנז)',
    icon: '🕌',
    gradient: 'from-teal-50 to-emerald-50',
    border: 'border-teal-200/50',
    hoverBorder: 'hover:border-teal-300',
    iconBg: 'bg-teal-100',
  },
  {
    id: 'mizrachi',
    name: 'עדות המזרח',
    description: 'מנהג עדות המזרח (תימן, עיראק, מרוקו וכו׳)',
    icon: '🌟',
    gradient: 'from-amber-50 to-orange-50',
    border: 'border-amber-200/50',
    hoverBorder: 'hover:border-amber-300',
    iconBg: 'bg-amber-100',
  },
  {
    id: 'chabad',
    name: 'חב״ד',
    description: 'מנהג חב״ד',
    icon: '✡️',
    gradient: 'from-purple-50 to-violet-50',
    border: 'border-purple-200/50',
    hoverBorder: 'hover:border-purple-300',
    iconBg: 'bg-purple-100',
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [selectedTradition, setSelectedTradition] = useState<string | null>(null);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualFoodName, setManualFoodName] = useState('');
  const [manualError, setManualError] = useState('');

  const handleContinue = () => {
    if (selectedTradition) {
      navigate(`/upload?tradition=${selectedTradition}`);
    }
  };

  const handleManualSearch = () => {
    const trimmed = manualFoodName.trim();
    if (!trimmed) {
      setManualError('אנא הקלד שם מאכל');
      return;
    }
    if (!selectedTradition) {
      setManualError('אנא בחר מסורת קודם');
      return;
    }

    const blessing = getBlessing(trimmed, selectedTradition, trimmed);

    if (!blessing) {
      setManualError(`המאכל "${trimmed}" לא נמצא במאגר. פנה לקו הלכה לקבלת הדרכה.`);
      return;
    }

    navigate('/blessing', {
      state: {
        blessing,
        tradition: selectedTradition,
        image: null,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#faf8f5] via-white to-[#faf8f5] flex flex-col">
      {/* Hero Header */}
      <header className="relative w-full py-10 px-4 text-center overflow-hidden">
        {/* Decorative background circles */}
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#d4a843]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-[#1e3a5f]/5 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          <div className="animate-float inline-block mb-5">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-[#d4a843]/20 to-[#d4a843]/5 flex items-center justify-center animate-pulse-gold">
              <span className="text-5xl">🙏</span>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold gradient-text mb-3">
            תן ברכה
          </h1>
          <p className="text-lg text-[#1a1a2e]/60 max-w-md mx-auto leading-relaxed">
            צלם את המאכל שלך וקבל את הברכה המתאימה<br />
            לפי המסורת שלך
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-12">
        <div className="w-full max-w-xl space-y-8">
          {/* Tradition Selection */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#1e3a5f] text-center">
              בחר את המסורת שלך
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {traditions.map((tradition) => (
                <Card
                  key={tradition.id}
                  className={`cursor-pointer card-hover border-2 transition-all duration-300 ${
                    selectedTradition === tradition.id
                      ? 'border-[#d4a843] shadow-lg spiritual-glow scale-[1.02]'
                      : `${tradition.border} ${tradition.hoverBorder} hover:shadow-md`
                  } bg-gradient-to-br ${tradition.gradient}`}
                  onClick={() => setSelectedTradition(tradition.id)}
                >
                  <CardContent className="flex flex-col items-center justify-center p-6 text-center min-h-[150px]">
                    <div className={`w-14 h-14 rounded-2xl ${tradition.iconBg} flex items-center justify-center mb-3`}>
                      <span className="text-3xl">{tradition.icon}</span>
                    </div>
                    <h3 className="text-lg font-bold text-[#1e3a5f] mb-1">
                      {tradition.name}
                    </h3>
                    <p className="text-xs text-[#1a1a2e]/50 leading-tight">
                      {tradition.description}
                    </p>
                    {selectedTradition === tradition.id && (
                      <div className="mt-3 w-7 h-7 rounded-full bg-[#d4a843] flex items-center justify-center animate-scale-in">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleContinue}
              disabled={!selectedTradition}
              className="w-full py-6 text-lg font-bold bg-gradient-to-l from-[#1e3a5f] to-[#2d5a8e] hover:from-[#2d5a8e] hover:to-[#1e3a5f] text-white rounded-2xl transition-all duration-300 disabled:opacity-40 shadow-lg shadow-[#1e3a5f]/20"
            >
              📸 צלם את המאכל
            </Button>

            {/* Manual food name input */}
            {!showManualInput ? (
              <Button
                variant="outline"
                onClick={() => setShowManualInput(true)}
                disabled={!selectedTradition}
                className="w-full py-5 text-base font-bold border-2 border-[#d4a843]/30 text-[#d4a843] hover:bg-[#d4a843]/10 hover:border-[#d4a843]/50 rounded-2xl disabled:opacity-40 transition-all duration-300"
              >
                ✍️ הקלדת שם המאכל
              </Button>
            ) : (
              <Card className="border-2 border-[#d4a843]/30 bg-gradient-to-br from-[#fffef9] to-white rounded-2xl animate-scale-in">
                <CardContent className="p-6 space-y-4">
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto rounded-2xl bg-[#d4a843]/10 flex items-center justify-center mb-3">
                      <span className="text-2xl">✍️</span>
                    </div>
                    <h3 className="text-base font-bold text-[#1e3a5f]">
                      רשום את שם המאכל
                    </h3>
                    <p className="text-sm text-[#1a1a2e]/50 mt-1">
                      הקלד את שם המאכל ונמצא לך את הברכה
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={manualFoodName}
                      onChange={(e) => {
                        setManualFoodName(e.target.value);
                        setManualError('');
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleManualSearch();
                      }}
                      placeholder="למשל: פסטה, בורקס, תפוח..."
                      className="flex-1 px-4 py-3 rounded-xl border-2 border-[#1e3a5f]/10 text-right text-base focus:outline-none focus:border-[#d4a843] focus:ring-4 focus:ring-[#d4a843]/10 bg-white transition-all"
                      dir="rtl"
                      autoFocus
                    />
                    <Button
                      onClick={handleManualSearch}
                      className="px-6 py-3 bg-gradient-to-l from-[#d4a843] to-[#c49a38] hover:from-[#c49a38] hover:to-[#d4a843] text-white font-bold rounded-xl shadow-md shadow-[#d4a843]/20"
                    >
                      חפש
                    </Button>
                  </div>
                  {manualError && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center">
                      <p className="text-red-600 text-sm font-medium">{manualError}</p>
                      {manualError.includes('לא נמצא') && (
                        <Button
                          variant="ghost"
                          onClick={() => navigate('/doubt', { state: { tradition: selectedTradition } })}
                          className="mt-2 text-[#1e3a5f] underline text-sm"
                        >
                          פנה לקו הלכה 📞
                        </Button>
                      )}
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setShowManualInput(false);
                      setManualFoodName('');
                      setManualError('');
                    }}
                    className="w-full text-sm text-[#1a1a2e]/40 hover:text-[#1a1a2e]/60"
                  >
                    ביטול
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center">
        <p className="text-sm text-[#1a1a2e]/30">תן ברכה — זיהוי מאכלים וברכות על פי ההלכה</p>
      </footer>
    </div>
  );
}