import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const hotlines = [
  {
    tradition: 'ashkenaz',
    name: 'קו הלכה — אשכנז',
    number: '072-215-2222',
    description: 'מענה הלכתי לפי מנהגי אשכנז',
    icon: '🕎',
    gradient: 'from-blue-50 to-indigo-50',
    iconBg: 'bg-blue-100',
  },
  {
    tradition: 'sephardi',
    name: 'קו הלכה — ספרד',
    number: '02-652-5555',
    description: 'מענה הלכתי לפי מנהגי ספרד',
    icon: '🕌',
    gradient: 'from-teal-50 to-emerald-50',
    iconBg: 'bg-teal-100',
  },
  {
    tradition: 'mizrachi',
    name: 'קו הלכה — עדות המזרח',
    number: '*3030',
    description: 'מענה הלכתי לפי מנהגי עדות המזרח',
    icon: '🌟',
    gradient: 'from-amber-50 to-orange-50',
    iconBg: 'bg-amber-100',
  },
  {
    tradition: 'chabad',
    name: 'קו הלכה — חב״ד',
    number: '077-225-1770',
    description: 'מענה הלכתי לפי מנהגי חב״ד',
    icon: '✡️',
    gradient: 'from-purple-50 to-violet-50',
    iconBg: 'bg-purple-100',
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
    <div className="min-h-screen bg-gradient-to-b from-[#faf8f5] via-white to-[#faf8f5] flex flex-col">
      {/* Header */}
      <header className="w-full py-4 px-4 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="text-[#1e3a5f] font-medium hover:bg-[#1e3a5f]/5 rounded-xl"
        >
          → חזרה
        </Button>
        <h1 className="text-xl font-bold text-[#1e3a5f]">שאל רב</h1>
        <div className="w-16" />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center px-4 pb-12">
        <div className="w-full max-w-lg space-y-6">
          {/* Info Card */}
          <Card className="bg-gradient-to-br from-[#fffef9] to-white border-2 border-[#d4a843]/20 rounded-2xl">
            <CardContent className="p-7 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-[#d4a843]/10 flex items-center justify-center">
                <span className="text-4xl">📖</span>
              </div>
              <h2 className="text-xl font-bold text-[#1e3a5f]">
                לא בטוח מה הברכה?
              </h2>
              <p className="text-[#1a1a2e]/60 leading-relaxed">
                במקרים מורכבים או כשיש ספק, מומלץ לפנות לקו הלכה לקבלת פסיקה מדויקת
              </p>
            </CardContent>
          </Card>

          {/* Hotlines */}
          <div className="space-y-4">
            {sortedHotlines.map((hotline) => (
              <Card
                key={hotline.tradition}
                className={`card-hover border-2 transition-all duration-300 rounded-2xl bg-gradient-to-br ${hotline.gradient} ${
                  hotline.tradition === tradition
                    ? 'border-[#d4a843] shadow-lg spiritual-glow'
                    : 'border-transparent'
                }`}
              >
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl ${hotline.iconBg} flex items-center justify-center`}>
                      <span className="text-2xl">{hotline.icon}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-[#1e3a5f]">{hotline.name}</h3>
                      <p className="text-sm text-[#1a1a2e]/50">{hotline.description}</p>
                    </div>
                  </div>
                  <a
                    href={`tel:${hotline.number}`}
                    className="block w-full text-center bg-gradient-to-l from-[#1e3a5f] to-[#2d5a8e] text-white font-bold py-3.5 rounded-xl text-lg hover:from-[#2d5a8e] hover:to-[#1e3a5f] transition-all shadow-md shadow-[#1e3a5f]/10"
                  >
                    📞 {hotline.number}
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Tips */}
          <Card className="bg-gradient-to-br from-[#fffef9] to-white border-2 border-[#d4a843]/10 rounded-2xl">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#d4a843]/10 flex items-center justify-center">
                  <span className="text-lg">💡</span>
                </div>
                <h3 className="font-bold text-[#1e3a5f]">טיפים</h3>
              </div>
              <ul className="space-y-3 text-sm text-[#1a1a2e]/60">
                <li className="flex gap-3 items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d4a843] mt-2 shrink-0" />
                  <span>כשיש ספק בברכה ראשונה — מברכים &quot;שהכל נהיה בדברו&quot;</span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d4a843] mt-2 shrink-0" />
                  <span>כשיש ספק בברכה אחרונה — עדיף לא לברך</span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d4a843] mt-2 shrink-0" />
                  <span>מאכל מורכב — הברכה נקבעת לפי הרכיב העיקרי</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Back Button */}
          <Button
            onClick={() => navigate('/')}
            className="w-full py-5 text-lg font-bold bg-gradient-to-l from-[#d4a843] to-[#c49a38] hover:from-[#c49a38] hover:to-[#d4a843] text-white rounded-2xl shadow-lg shadow-[#d4a843]/20 transition-all duration-300"
          >
            חזרה להתחלה 🙏
          </Button>
        </div>
      </main>
    </div>
  );
}