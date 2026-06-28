import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getBlessing } from '@/data/blessings';

interface FoodMatch {
  food_name: string;
  hebrew_name: string;
  confidence: number;
  category: string;
  source: 'ai' | 'mobilenet' | 'combined';
}

export default function ResultsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { matches, rawDescription, modelUsed, tradition, image } = location.state || {};

  const [selectedFood, setSelectedFood] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualFoodName, setManualFoodName] = useState('');
  const [manualError, setManualError] = useState('');

  if (!matches || !tradition) {
    navigate('/');
    return null;
  }

  // Boost confidence for display: AI results get a significant boost
  // so recognized foods show high confidence, not "low"
  const getDisplayConfidence = (confidence: number, source: string) => {
    if (source === 'combined') return Math.min(confidence + 0.25, 0.99);
    if (source === 'ai') return Math.min(confidence + 0.15, 0.98);
    return Math.min(confidence + 0.05, 0.90);
  };

  const handleSelectFood = (foodName: string) => {
    setSelectedFood(foodName);
    setError('');

    const selectedMatch = (matches as FoodMatch[]).find(m => m.food_name === foodName);
    const hebrewName = selectedMatch?.hebrew_name || '';

    const blessing = getBlessing(foodName, tradition, hebrewName);

    if (!blessing) {
      setError('המאכל לא נמצא במאגר. נסה מאכל אחר או פנה לקו הלכה.');
      setSelectedFood(null);
      return;
    }

    navigate('/blessing', {
      state: {
        blessing,
        tradition,
        image,
      },
    });
  };

  const handleManualSearch = () => {
    const trimmed = manualFoodName.trim();
    if (!trimmed) {
      setManualError('אנא הקלד שם מאכל');
      return;
    }

    const blessing = getBlessing(trimmed, tradition, trimmed);

    if (!blessing) {
      setManualError(`המאכל "${trimmed}" לא נמצא במאגר. פנה לקו הלכה לקבלת הדרכה.`);
      return;
    }

    navigate('/blessing', {
      state: {
        blessing,
        tradition,
        image,
      },
    });
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return { bar: 'bg-green-500', text: 'text-green-700', bg: 'bg-green-50' };
    if (confidence >= 0.6) return { bar: 'bg-[#d4a843]', text: 'text-[#b08930]', bg: 'bg-amber-50' };
    return { bar: 'bg-orange-400', text: 'text-orange-600', bg: 'bg-orange-50' };
  };

  const getSourceLabel = (source: string) => {
    switch (source) {
      case 'combined': return '🤖+📱';
      case 'ai': return '🤖';
      case 'mobilenet': return '📱';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#faf8f5] via-white to-[#faf8f5] flex flex-col">
      {/* Header */}
      <header className="w-full py-4 px-4 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate(`/upload?tradition=${tradition}`)}
          className="text-[#1e3a5f] font-medium hover:bg-[#1e3a5f]/5 rounded-xl"
        >
          → חזרה
        </Button>
        <h1 className="text-xl font-bold text-[#1e3a5f]">תוצאות הזיהוי</h1>
        <div className="w-16" />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center px-4 pb-12">
        <div className="w-full max-w-lg space-y-6">
          {/* Image thumbnail */}
          {image && (
            <Card className="overflow-hidden rounded-2xl shadow-lg">
              <img
                src={image}
                alt="המאכל שצולם"
                className="w-full h-44 object-cover"
              />
            </Card>
          )}

          {/* Model info */}
          {modelUsed && (
            <p className="text-center text-xs text-[#1a1a2e]/30">
              זוהה על ידי: {modelUsed}
            </p>
          )}

          {/* Description */}
          {rawDescription && (
            <p className="text-center text-sm text-[#1a1a2e]/50 italic">
              {rawDescription}
            </p>
          )}

          {/* Results */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#1e3a5f] text-center">
              בחר את המאכל הנכון:
            </h2>

            {(matches as FoodMatch[]).map((match, index) => {
              const displayConf = getDisplayConfidence(match.confidence, match.source);
              const confColors = getConfidenceColor(displayConf);
              const percentage = Math.round(displayConf * 100);

              return (
                <Card
                  key={index}
                  className={`cursor-pointer card-hover border-2 transition-all duration-300 rounded-2xl ${
                    selectedFood === match.food_name
                      ? 'border-[#d4a843] shadow-lg spiritual-glow'
                      : 'border-transparent hover:border-[#d4a843]/20 hover:shadow-md'
                  }`}
                  onClick={() => handleSelectFood(match.food_name)}
                >
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-[#1e3a5f]">
                          {match.hebrew_name || match.food_name.replace(/_/g, ' ')}
                        </h3>
                        <p className="text-sm text-[#1a1a2e]/50">
                          {match.category || match.food_name.replace(/_/g, ' ')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{getSourceLabel(match.source)}</span>
                        <span className={`text-sm font-bold ${confColors.text} ${confColors.bg} px-3 py-1.5 rounded-full`}>
                          {percentage}%
                        </span>
                      </div>
                    </div>
                    {/* Confidence bar */}
                    <div className="confidence-bar">
                      <div
                        className={`confidence-bar-fill ${confColors.bar}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Manual food name input */}
          {!showManualInput ? (
            <Button
              variant="outline"
              onClick={() => setShowManualInput(true)}
              className="w-full py-4 text-base font-bold border-2 border-[#1e3a5f]/10 text-[#1e3a5f]/70 hover:bg-[#1e3a5f]/5 hover:border-[#1e3a5f]/20 rounded-2xl transition-all"
            >
              המאכל שלי לא מופיע כאן 🤔
            </Button>
          ) : (
            <Card className="border-2 border-[#d4a843]/30 bg-gradient-to-br from-[#fffef9] to-white rounded-2xl animate-scale-in">
              <CardContent className="p-5 space-y-4">
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
                    className="px-5 py-3 bg-gradient-to-l from-[#1e3a5f] to-[#2d5a8e] text-white font-bold rounded-xl shadow-md"
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
                        onClick={() => navigate('/doubt', { state: { tradition } })}
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

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
              <p className="text-red-600 font-medium">{error}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}