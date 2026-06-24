import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { createClient } from '@metagptx/web-sdk';

const client = createClient();

interface FoodMatch {
  food_name: string;
  hebrew_name: string;
  confidence: number;
  category: string;
}

export default function ResultsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { matches, rawDescription, tradition, image } = location.state || {};

  const [selectedFood, setSelectedFood] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!matches || !tradition) {
    navigate('/');
    return null;
  }

  const handleSelectFood = async (foodName: string) => {
    setSelectedFood(foodName);
    setLoading(true);
    setError('');

    try {
      const response = await client.apiCall.invoke({
        url: '/api/v1/food/blessing',
        method: 'POST',
        data: { food_name: foodName, tradition },
      });

      navigate('/blessing', {
        state: {
          blessing: response.data,
          tradition,
          image,
        },
      });
    } catch (e: any) {
      const detail = e?.data?.detail || e?.response?.data?.detail || e?.message || 'שגיאה בחיפוש הברכה';
      setError(detail);
      setSelectedFood(null);
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-50';
    if (confidence >= 0.5) return 'text-amber-600 bg-amber-50';
    return 'text-red-600 bg-red-50';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.8) return 'ודאות גבוהה';
    if (confidence >= 0.5) return 'ודאות בינונית';
    return 'ודאות נמוכה';
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col">
      {/* Header */}
      <header className="w-full py-4 px-4 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate(`/upload?tradition=${tradition}`)}
          className="text-[#1e3a5f] font-medium"
        >
          ← חזרה
        </Button>
        <h1 className="text-xl font-bold text-[#1e3a5f]">תוצאות הזיהוי</h1>
        <div className="w-16" />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center px-4 pb-12">
        <div className="w-full max-w-lg space-y-6">
          {/* Image thumbnail */}
          {image && (
            <Card className="overflow-hidden rounded-2xl">
              <img
                src={image}
                alt="המאכל שצולם"
                className="w-full h-40 object-cover"
              />
            </Card>
          )}

          {/* Description */}
          {rawDescription && (
            <p className="text-center text-sm text-[#1a1a2e]/60 italic">
              {rawDescription}
            </p>
          )}

          {/* Results */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-[#1e3a5f] text-center">
              בחר את המאכל הנכון:
            </h2>

            {(matches as FoodMatch[]).map((match, index) => (
              <Card
                key={index}
                className={`cursor-pointer transition-all duration-300 border-2 ${
                  selectedFood === match.food_name
                    ? 'border-[#d4a843] shadow-lg'
                    : 'border-transparent hover:border-[#d4a843]/30 hover:shadow-md'
                }`}
                onClick={() => !loading && handleSelectFood(match.food_name)}
              >
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-[#1e3a5f]">
                      {match.hebrew_name}
                    </h3>
                    <p className="text-sm text-[#1a1a2e]/60">
                      {match.category}
                    </p>
                  </div>
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${getConfidenceColor(match.confidence)}`}>
                    {getConfidenceLabel(match.confidence)}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Not found option */}
          <Button
            variant="outline"
            onClick={() => navigate('/doubt', { state: { tradition } })}
            className="w-full py-4 text-base border-[#1e3a5f]/20 text-[#1e3a5f]"
          >
            המאכל שלי לא מופיע כאן 🤔
          </Button>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
              <p className="text-red-600 font-medium">{error}</p>
            </div>
          )}

          {loading && (
            <div className="flex justify-center py-4">
              <svg className="animate-spin h-8 w-8 text-[#1e3a5f]" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}