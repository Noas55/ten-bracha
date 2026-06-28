import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { recognizeFood, preloadMobileNet } from '@/services/foodRecognition';

export default function UploadPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tradition = searchParams.get('tradition') || 'ashkenaz';

  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [progressText, setProgressText] = useState('');
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [modelReady, setModelReady] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    preloadMobileNet()
      .then(() => setModelReady(true))
      .catch(() => {});
  }, []);

  const handleFileSelect = useCallback((file: File) => {
    // Accept both standard images and HEIC (iPhone format)
    const isImage = file.type.startsWith('image/') || file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif');
    if (!isImage) {
      setError('אנא בחר קובץ תמונה בלבד');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setError('גודל הקובץ חייב להיות עד 20MB');
      return;
    }
    setError('');
    setProgressText('מכין תמונה...');
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setImage(result);
        setProgressText('');
      } else {
        setError('שגיאה בקריאת התמונה. נסה שוב.');
        setProgressText('');
      }
    };
    reader.onerror = () => {
      setError('שגיאה בקריאת התמונה. נסה תמונה אחרת.');
      setProgressText('');
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
    setProgressText('מכין תמונה...');

    try {
      const result = await recognizeFood(image, (step) => {
        setProgressText(step);
      });

      navigate('/results', {
        state: {
          matches: result.matches,
          rawDescription: result.raw_description,
          modelUsed: result.model_used,
          tradition,
          image,
        },
      });
    } catch (e: any) {
      const detail = e?.data?.detail || e?.response?.data?.detail || e?.message || 'שגיאה בזיהוי המאכל';
      setError(detail);
    } finally {
      setLoading(false);
      setProgressText('');
    }
  };

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
                className={`upload-zone cursor-pointer transition-all rounded-2xl ${dragOver ? 'drag-over' : ''}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
              >
                <CardContent className="flex flex-col items-center justify-center py-20 px-6 text-center">
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#d4a843]/20 to-[#d4a843]/5 flex items-center justify-center mb-5">
                    <span className="text-5xl">📸</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#1e3a5f] mb-2">
                    העלה תמונה של המאכל
                  </h3>
                  <p className="text-sm text-[#1a1a2e]/50 mb-4">
                    גרור תמונה לכאן או לחץ לבחירה
                  </p>
                  <p className="text-xs text-[#1a1a2e]/30">
                    JPG, PNG, WEBP — עד 10MB
                  </p>
                </CardContent>
              </Card>

              {/* Camera Button */}
              <Button
                onClick={() => cameraInputRef.current?.click()}
                className="w-full py-6 text-lg font-bold bg-gradient-to-l from-[#d4a843] to-[#c49a38] hover:from-[#c49a38] hover:to-[#d4a843] text-white rounded-2xl shadow-lg shadow-[#d4a843]/20 transition-all duration-300"
              >
                📷 צלם עכשיו
              </Button>

              {/* Model Status */}
              <div className="text-center">
                <p className="text-xs text-[#1a1a2e]/30">
                  {modelReady ? '✅ מודל זיהוי מקומי מוכן' : '⏳ טוען מודל זיהוי מקומי...'}
                  {' • '}AI (gemini-2.5-pro) זמין
                </p>
              </div>

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
              <Card className="overflow-hidden rounded-2xl shadow-xl">
                <img
                  src={image}
                  alt="תמונת המאכל"
                  className="w-full h-72 object-cover"
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
                  disabled={loading}
                  className="flex-1 py-5 text-base font-medium border-2 border-[#1e3a5f]/10 text-[#1e3a5f] hover:bg-[#1e3a5f]/5 rounded-2xl"
                >
                  תמונה אחרת
                </Button>
                <Button
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="flex-1 py-5 text-base font-bold bg-gradient-to-l from-[#1e3a5f] to-[#2d5a8e] hover:from-[#2d5a8e] hover:to-[#1e3a5f] text-white rounded-2xl shadow-lg shadow-[#1e3a5f]/20 transition-all duration-300"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      {progressText || 'מזהה...'}
                    </span>
                  ) : (
                    'זהה את המאכל ✨'
                  )}
                </Button>
              </div>
            </>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-center">
              <p className="text-red-600 font-medium">{error}</p>
              <Button
                variant="ghost"
                onClick={handleAnalyze}
                className="mt-2 text-red-600 underline"
                disabled={loading}
              >
                נסה שוב
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}