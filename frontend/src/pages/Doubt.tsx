import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const hotlines = [
  {
    tradition: 'ashkenaz',
    name: 'קו הלכה - אשכנז',
    number: '072-215-2222',
    description: 'מענה הלכתי לפי מנהגי אשכנז',
    icon: '🕎',
  },
  {
    tradition: 'sephardi',
    name: 'קו הלכה - ספרד',
    number: '02-652-5555',
    description: 'מענה הלכתי לפי מנהגי ספרד',
    icon: '🕌',
  },
  {
    tradition: 'mizrachi',
    name: 'קו הלכה - עדות המזרח',
    number: '*3030',
    description: 'מענה הלכתי לפי מנהגי עדות המזרח',
    icon: '🌟',
  },
  {
    tradition: 'chabad',
    name: 'קו הלכה - חב״ד',
    number: '077-225-1770',
    description: 'מענה הלכתי לפי מנהגי חב״ד',
    icon: '✡️',
  },
];

export default function DoubtPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const tradition = location.state?.tradition || '';

  // Sort hotlines to show user's tradition first
  const sortedHotlines = [...hotlines].sort((a, b) => {
    if (a.tradition === tradition) return -1;
    if (b.tradition === tradition) return 1;
    return 0;
  });

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col">
      {/* Header */}
      <header className="w-full py-4 px-4 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="text-[#1e3a5f] font-medium"
        >
          ← חזרה
        </Button>
        <h1 className="text-xl font-bold text-[#1e3a5f]">שאל רב</h1>
        <div className="w-16" />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center px-4 pb-12">
        <div className="w-full max-w-lg space-y-6">
          {/* Info Card */}
          <Card className="bg-gradient-to-b from-amber-50 to-[#faf8f5] border-[#d4a843]/20">
            <CardContent className="p-6 text-center space-y-3">
              <span className="text-4xl">📖</span>
              <h2 className="text-xl font-bold text-[#1e3a5f]">
                לא בטוח מה הברכה?
              </h2>
              <p className="text-[#1a1a2e]/70">
                במקרים מורכבים או כשיש ספק, מומלץ לפנות לקו הלכה לקבלת פסיקה מדויקת
              </p>
            </CardContent>
          </Card>

          {/* Hotlines */}
          <div className="space-y-3">
            {sortedHotlines.map((hotline) => (
              <Card
                key={hotline.tradition}
                className={`transition-all ${
                  hotline.tradition === tradition
                    ? 'border-[#d4a843] shadow-lg spiritual-glow'
                    : 'border-transparent'
                }`}
              >
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{hotline.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-bold text-[#1e3a5f]">{hotline.name}</h3>
                      <p className="text-sm text-[#1a1a2e]/60">{hotline.description}</p>
                    </div>
                  </div>
                  <a
                    href={`tel:${hotline.number}`}
                    className="block w-full text-center bg-[#1e3a5f] text-white font-bold py-3 rounded-xl text-lg hover:bg-[#1e3a5f]/90 transition-colors"
                  >
                    📞 {hotline.number}
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Tips */}
          <Card className="bg-[#fffef9]">
            <CardContent className="p-5 space-y-3">
              <h3 className="font-bold text-[#1e3a5f] text-center">💡 טיפים</h3>
              <ul className="space-y-2 text-sm text-[#1a1a2e]/70">
                <li className="flex gap-2">
                  <span>•</span>
                  <span>כשיש ספק בברכה ראשונה - מברכים &quot;שהכל נהיה בדברו&quot;</span>
                </li>
                <li className="flex gap-2">
                  <span>•</span>
                  <span>כשיש ספק בברכה אחרונה - עדיף לא לברך</span>
                </li>
                <li className="flex gap-2">
                  <span>•</span>
                  <span>מאכל מורכב - הברכה נקבעת לפי הרכיב העיקרי</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Back Button */}
          <Button
            onClick={() => navigate('/')}
            className="w-full py-5 text-lg font-bold bg-[#d4a843] hover:bg-[#d4a843]/90 text-white rounded-xl"
          >
            חזרה להתחלה
          </Button>
        </div>
      </main>
    </div>
  );
}