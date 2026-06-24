import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const traditions = [
  {
    id: 'ashkenaz',
    name: 'אשכנז',
    description: 'מנהג אשכנז (ליטאי וחסידי)',
    icon: '🕎',
    color: 'from-blue-500/10 to-blue-600/5',
  },
  {
    id: 'sephardi',
    name: 'ספרד',
    description: 'מנהג ספרד (קרוב למנהג אשכנז)',
    icon: '🕌',
    color: 'from-teal-500/10 to-teal-600/5',
  },
  {
    id: 'mizrachi',
    name: 'עדות המזרח',
    description: 'מנהג עדות המזרח (תימן, עיראק, מרוקו וכו׳)',
    icon: '🌟',
    color: 'from-amber-500/10 to-amber-600/5',
  },
  {
    id: 'chabad',
    name: 'חב״ד',
    description: 'מנהג חב״ד',
    icon: '✡️',
    color: 'from-purple-500/10 to-purple-600/5',
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [selectedTradition, setSelectedTradition] = useState<string | null>(null);

  const handleContinue = () => {
    if (selectedTradition) {
      navigate(`/upload?tradition=${selectedTradition}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col">
      {/* Header */}
      <header className="w-full py-6 px-4 text-center">
        <div className="animate-float inline-block mb-4">
          <span className="text-5xl">🙏</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-[#1e3a5f] mb-2">
          תן ברכה
        </h1>
        <p className="text-lg text-[#1a1a2e]/70 max-w-md mx-auto">
          צלם את המאכל שלך וקבל את הברכה המתאימה לפי המסורת שלך
        </p>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-12">
        <div className="w-full max-w-xl space-y-6">
          <h2 className="text-xl font-semibold text-[#1e3a5f] text-center mb-4">
            בחר את המסורת שלך
          </h2>

          <div className="grid grid-cols-2 gap-3">
            {traditions.map((tradition) => (
              <Card
                key={tradition.id}
                className={`cursor-pointer transition-all duration-300 border-2 ${
                  selectedTradition === tradition.id
                    ? 'border-[#d4a843] shadow-lg spiritual-glow'
                    : 'border-transparent hover:border-[#d4a843]/30 hover:shadow-md'
                } bg-gradient-to-l ${tradition.color}`}
                onClick={() => setSelectedTradition(tradition.id)}
              >
                <CardContent className="flex flex-col items-center justify-center p-5 text-center min-h-[140px]">
                  <span className="text-4xl mb-2">{tradition.icon}</span>
                  <h3 className="text-lg font-bold text-[#1e3a5f] mb-1">
                    {tradition.name}
                  </h3>
                  <p className="text-xs text-[#1a1a2e]/60 leading-tight">
                    {tradition.description}
                  </p>
                  {selectedTradition === tradition.id && (
                    <div className="mt-2 w-6 h-6 rounded-full bg-[#d4a843] flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <Button
            onClick={handleContinue}
            disabled={!selectedTradition}
            className="w-full py-6 text-lg font-bold bg-[#1e3a5f] hover:bg-[#1e3a5f]/90 text-white rounded-xl transition-all duration-300 disabled:opacity-40"
          >
            המשך לצילום המאכל
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-sm text-[#1a1a2e]/40">
        <p>תן ברכה - זיהוי מאכלים וברכות על פי ההלכה</p>
      </footer>
    </div>
  );
}