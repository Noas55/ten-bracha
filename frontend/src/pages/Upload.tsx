import { useState, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { createClient } from '@metagptx/web-sdk';

const client = createClient();

export default function UploadPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tradition = searchParams.get('tradition') || 'ashkenaz';

  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('אנא בחר קובץ תמונה בלבד');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('גודל הקובץ חייב להיות עד 10MB');
      return;
    }
    setError('');
    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOver(false);
  }, []);

  const handleAnalyze = async () => {
    if (!image) return;
    setLoading(true);
    setError('');

    try {
      const response = await client.apiCall.invoke({
        url: '/api/v1/food/recognize',
        method: 'POST',
        data: { image },
        options: { timeout: 600_000 },
      });

      const result = response.data;
      // Navigate to results page with data
      navigate('/results', {
        state: {
          matches: result.matches,
          rawDescription: result.raw_description,
          tradition,
          image,
        },
      });
    } catch (e: any) {
      const detail = e?.data?.detail || e?.response?.data?.detail || e?.message || 'שגיאה בזיהוי המאכל';
      setError(detail);
    } finally {
      setLoading(false);
    }
  };

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
        <h1 className="text-xl font-bold text-[#1e3a5f]">צלם את המאכל</h1>
        <div className="w-16" />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-12">
        <div className="w-full max-w-lg space-y-6">
          {!image ? (
            <>
              {/* Upload Zone */}
              <Card
                className={`upload-zone cursor-pointer transition-all ${dragOver ? 'drag-over' : ''}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
              >
                <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
                  <div className="text-5xl mb-4">📸</div>
                  <h3 className="text-lg font-semibold text-[#1e3a5f] mb-2">
                    העלה תמונה של המאכל
                  </h3>
                  <p className="text-sm text-[#1a1a2e]/60 mb-4">
                    גרור תמונה לכאן או לחץ לבחירה
                  </p>
                  <p className="text-xs text-[#1a1a2e]/40">
                    JPG, PNG, WEBP - עד 10MB
                  </p>
                </CardContent>
              </Card>

              {/* Camera Button */}
              <Button
                onClick={() => cameraInputRef.current?.click()}
                className="w-full py-5 text-lg font-bold bg-[#d4a843] hover:bg-[#d4a843]/90 text-white rounded-xl"
              >
                📷 צלם עכשיו
              </Button>

              {/* Hidden Inputs */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(file);
                }}
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(file);
                }}
              />
            </>
          ) : (
            <>
              {/* Image Preview */}
              <Card className="overflow-hidden rounded-2xl shadow-lg">
                <img
                  src={image}
                  alt="תמונת המאכל"
                  className="w-full h-64 object-cover"
                />
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setImage(null);
                    setError('');
                  }}
                  className="flex-1 py-5 text-base font-medium border-[#1e3a5f]/20 text-[#1e3a5f]"
                >
                  בחר תמונה אחרת
                </Button>
                <Button
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="flex-1 py-5 text-base font-bold bg-[#1e3a5f] hover:bg-[#1e3a5f]/90 text-white"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      מזהה...
                    </span>
                  ) : (
                    'זהה את המאכל'
                  )}
                </Button>
              </div>
            </>
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