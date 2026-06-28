/**
 * Food Recognition Service
 * Combines AI (gemini-2.5-pro) with MobileNet for accurate food identification.
 * 
 * Model Architecture:
 * - Primary: client.ai.gentxt (gemini-2.5-pro) - Multimodal, understands Israeli/Middle Eastern cuisine
 * - Secondary: MobileNet V2 (TensorFlow.js) - Local classification, fast fallback
 * 
 * Future: MobileNetV3-Small and EfficientNet-B0 can be integrated by converting
 * their SavedModel/keras files to TF.js format and loading with tf.loadGraphModel().
 * See INTEGRATION_GUIDE below.
 */

import { createClient } from '@metagptx/web-sdk';
import { getKnownFoodNames, findCanonicalFoodName } from '@/data/blessings';

// Lazy-load TensorFlow.js and MobileNet to reduce initial bundle size
type TFModule = typeof import('@tensorflow/tfjs');
type MobileNetModule = typeof import('@tensorflow-models/mobilenet');

let tfLib: TFModule | null = null;
let mobilenetLib: MobileNetModule | null = null;

async function loadTensorFlow(): Promise<TFModule> {
  if (!tfLib) {
    tfLib = await import('@tensorflow/tfjs');
  }
  return tfLib;
}

async function loadMobileNet(): Promise<MobileNetModule> {
  if (!mobilenetLib) {
    mobilenetLib = await import('@tensorflow-models/mobilenet');
  }
  return mobilenetLib;
}

const client = createClient();

// ============================================================
// INTEGRATION GUIDE: MobileNetV3-Small & EfficientNet-B0
// ============================================================
// To integrate MobileNetV3-Small or EfficientNet-B0:
//
// 1. Convert the model to TF.js format:
//    pip install tensorflowjs
//    tensorflowjs_converter --input_format=tf_saved_model \
//      --output_format=tfjs_graph_model \
//      ./mobilenet_v3_small ./mobilenet_v3_small_web
//
// 2. Host the model files (model.json + shards) in public/models/
//
// 3. Load with tf.loadGraphModel():
//    const model = await tf.loadGraphModel('/models/mobilenet_v3_small/model.json');
//
// 4. Preprocess input (typically 224x224, normalized to [0,1] or [-1,1]):
//    const input = tf.browser.fromPixels(img).resizeBilinear([224,224]).toFloat()
//      .div(127.5).sub(1).expandDims(0);
//
// 5. Run inference:
//    const predictions = model.predict(input) as tf.Tensor;
//    const logits = await predictions.data();
//
// 6. Map logits to ImageNet class names using the model's label file
//
// The LocalClassifier interface below is designed to support any model.
// ============================================================

// ImageNet class name → our food_name mapping
const IMAGENET_TO_FOOD: Record<string, string> = {
  'pizza': 'pizza',
  'cheeseburger': 'burger',
  'hotdog': 'hot_dog',
  'hot dog': 'hot_dog',
  'ice cream': 'ice_cream',
  'ice lolly': 'ice_cream',
  'chocolate sauce': 'chocolate',
  'pretzel': 'pretzels',
  'bagel': 'bread',
  'French loaf': 'bread',
  'bread': 'bread',
  'guacamole': 'avocado',
  'soup bowl': 'soup',
  'espresso': 'coffee',
  'coffee': 'coffee',
  'cup': 'coffee',
  'wine bottle': 'wine',
  'red wine': 'wine',
  'beer glass': 'beer',
  'beer bottle': 'beer',
  'pop bottle': 'cola',
  'water bottle': 'water',
  'banana': 'banana',
  'orange': 'orange',
  'lemon': 'fruit_salad',
  'pineapple': 'fruit_salad',
  'strawberry': 'strawberry',
  'apple': 'apple',
  'Granny Smith': 'apple',
  'fig': 'figs',
  'pomegranate': 'pomegranate',
  'cucumber': 'cucumber',
  'broccoli': 'mixed_salad',
  'cauliflower': 'mixed_salad',
  'mushroom': 'mixed_salad',
  'corn': 'corn',
  'ear': 'corn',
  'dough': 'cake',
  'bakery': 'bread',
  'trifle': 'cake',
  'carbonara': 'pasta',
  'spaghetti squash': 'pasta',
  'plate': 'mixed_salad',
  'salad': 'mixed_salad',
  'french fries': 'french_fries',
  'fries': 'french_fries',
  'burrito': 'shawarma',
  'falafel': 'falafel',
  'hummus': 'hummus',
  'schnitzel': 'schnitzel',
  'croissant': 'croissant',
  'waffle': 'cake',
  'pancake': 'cake',
  'doughnut': 'donut',
  'cookie': 'cookies',
  'cracker': 'crackers',
  'candy': 'candy',
  'chocolate': 'chocolate',
  'potpie': 'borekas',
  'meat loaf': 'meat',
  'steak': 'meat',
  'fish': 'fish',
  'goldfish': 'fish',
  'coho': 'fish',
  'tench': 'fish',
  'eel': 'fish',
  'rock beauty': 'fish',
  'lionfish': 'fish',
  'puffer': 'fish',
  'hen': 'schnitzel',
  'cock': 'schnitzel',
  'turkey': 'schnitzel',
  'goose': 'meat',
  'quail': 'meat',
  'pea': 'mixed_salad',
  'bell pepper': 'mixed_salad',
  'head cabbage': 'mixed_salad',
  'artichoke': 'mixed_salad',
  'cardoon': 'mixed_salad',
  'spaghetti': 'pasta',
  'carbonara': 'pasta',
  'carrot': 'carrot',
  'zucchini': 'mixed_salad',
  'cucumber': 'cucumber',
  'grocery store': 'mixed_salad',
  'menu': 'mixed_salad',
  'dinner table': 'mixed_salad',
  'restaurant': 'mixed_salad',
  'tray': 'mixed_salad',
  'mixing bowl': 'soup',
  'soup': 'soup',
  'consomme': 'soup',
  'pot': 'soup',
  'cauldron': 'soup',
  'eggnog': 'milk',
  'milk can': 'milk',
  'water jug': 'water',
  'coffee mug': 'coffee',
  'teapot': 'tea',
  'tea': 'tea',
  'goblet': 'wine',
  'wine': 'wine',
  'redwine': 'wine',
};

export interface FoodMatch {
  food_name: string;
  hebrew_name: string;
  confidence: number;
  category: string;
  source: 'ai' | 'mobilenet' | 'combined';
}

export interface RecognitionResult {
  matches: FoodMatch[];
  raw_description: string;
  model_used: string;
}

// ============================================================
// Image Utilities
// ============================================================

/**
 * Resize a base64 data URL image to reduce payload size for AI API
 */
export function resizeImage(
  dataUrl: string,
  maxWidth: number = 1024,
  maxHeight: number = 1024,
  quality: number = 0.85
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;

      // Only resize if larger than max dimensions
      if (width <= maxWidth && height <= maxHeight) {
        resolve(dataUrl);
        return;
      }

      const ratio = Math.min(maxWidth / width, maxHeight / height);
      width = Math.round(width * ratio);
      height = Math.round(height * ratio);

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Cannot create canvas context'));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);

      // Determine output format
      const isJpeg = dataUrl.startsWith('data:image/jpeg') || dataUrl.startsWith('data:image/jpg');
      const mimeType = isJpeg ? 'image/jpeg' : 'image/jpeg'; // Always use JPEG for smaller size
      resolve(canvas.toDataURL(mimeType, quality));
    };
    img.onerror = () => reject(new Error('Failed to load image for resizing'));
    img.src = dataUrl;
  });
}

/**
 * Convert a data URL to an HTML Image element for MobileNet
 */
function dataUrlToImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = dataUrl;
  });
}

// ============================================================
// MobileNet Local Classifier
// ============================================================

let mobileNetModel: any | null = null;
let modelLoading: Promise<any> | null = null;

/**
 * Pre-load MobileNet model (call early for faster inference later)
 */
export async function preloadMobileNet(): Promise<void> {
  try {
    if (!mobileNetModel && !modelLoading) {
      modelLoading = (async () => {
        const tf = await loadTensorFlow();
        const mn = await loadMobileNet();
        await tf.ready();
        // version: 2, alpha: 0.5 = MobileNet V2 Small (fastest)
        // For MobileNetV3-Small: replace with tf.loadGraphModel('/models/mobilenet_v3_small/model.json')
        // For EfficientNet-B0: replace with tf.loadGraphModel('/models/efficientnet_b0/model.json')
        const model = await mn.load({ version: 2, alpha: 0.5 });
        mobileNetModel = model;
        modelLoading = null;
        return model;
      })();
      await modelLoading;
    }
  } catch (e) {
    console.warn('MobileNet preload failed:', e);
    modelLoading = null;
  }
}

/**
 * Classify an image using MobileNet
 */
async function classifyWithMobileNet(dataUrl: string): Promise<FoodMatch[]> {
  try {
    if (!mobileNetModel) {
      await preloadMobileNet();
    }
    if (!mobileNetModel) return [];

    const imgElement = await dataUrlToImage(dataUrl);
    const predictions = await mobileNetModel.classify(imgElement, 10);

    const matches: FoodMatch[] = [];
    const seen = new Set<string>();

    for (const pred of predictions) {
      const className = pred.className.toLowerCase();
      // Check each part of the class name (MobileNet returns "class1, class2" format)
      const parts = className.split(',').map(s => s.trim());

      for (const part of parts) {
        const foodName = IMAGENET_TO_FOOD[part];
        if (foodName && !seen.has(foodName)) {
          seen.add(foodName);
          // Map to our known food names
          const canonical = findCanonicalFoodName(foodName) || foodName;
          matches.push({
            food_name: canonical,
            hebrew_name: '', // Will be filled by blessings data
            confidence: Math.min(pred.probability * 0.7, 0.7), // Cap MobileNet confidence
            category: '',
            source: 'mobilenet',
          });
        }
      }
    }

    return matches;
  } catch (e) {
    console.warn('MobileNet classification failed:', e);
    return [];
  }
}

// ============================================================
// AI Recognition (Primary)
// ============================================================

/**
 * Recognize food using AI (gemini-2.5-pro multimodal)
 */
async function recognizeWithAI(dataUrl: string): Promise<FoodMatch[]> {
  const knownFoods = getKnownFoodNames();
  const foodListStr = knownFoods.join(', ');

  const systemPrompt = `You are a food identification expert specializing in Israeli, Middle Eastern, and international cuisine. Analyze the image and identify what food items are visible.

Return ONLY valid JSON in this exact format:
{
  "matches": [
    {"food_name": "english_name", "hebrew_name": "שם בעברית", "confidence": 0.95, "category": "category"}
  ],
  "raw_description": "Brief description of what you see"
}

Known foods in our database: ${foodListStr}

CRITICAL RULES:
1. You MUST try to match the food to one of the known foods from the list above. This is the most important rule.
2. For borekas/bourekas/burekas/börek - ALWAYS use "borekas" as the food_name
3. For falafel - use "falafel"
4. For shawarma - use "shawarma"
5. For schnitzel - use "schnitzel"
6. For hummus - use "hummus"
7. For malawach - use "malawach"
8. For jachnun - use "jachnun"
9. For sabich - use "sabich"
10. If the food is not in the list, still identify it with your best guess using a simple English name (lowercase, underscores for spaces)
11. Confidence should be between 0.0 and 1.0
12. Return up to 3 matches ordered by confidence
13. hebrew_name should be the Hebrew name of the food
14. category should be one of: ירק, פרי העץ, פרי האדמה, משקה, בשר, דג, מאפה, לחם, יין, עוגה, שבעת המינים, קטניות, דגנים, ממתק, חלבי, תבשיל, מנה מורכבת`;

  const response = await client.ai.gentxt({
    messages: [
      { role: 'system', content: systemPrompt },
      {
        role: 'user',
        content: [
          { type: 'text', text: 'What food is in this image? Identify it precisely. Make sure to use the exact food_name from the known foods list if possible.' },
          { type: 'image_url', image_url: { url: dataUrl } },
        ],
      },
    ],
    model: 'gemini-2.5-pro',
    stream: false,
  });

  const rawContent = response.data.content.trim();

  // Extract JSON from response
  let payloadText = rawContent;
  if (rawContent.startsWith('```')) {
    const match = rawContent.match(/```(?:json)?\n([\s\S]*?)```/);
    if (match) payloadText = match[1].trim();
  }
  const start = payloadText.indexOf('{');
  const end = payloadText.lastIndexOf('}');
  if (start >= 0 && end > start) {
    payloadText = payloadText.substring(start, end + 1);
  }

  let payload: any;
  try {
    payload = JSON.parse(payloadText);
  } catch {
    // Try repair
    try {
      const repairResponse = await client.ai.gentxt({
        messages: [
          { role: 'system', content: 'Fix this into valid JSON only. Return ONLY the JSON object, no other text.' },
          { role: 'user', content: payloadText },
        ],
        model: 'gemini-2.5-pro',
        stream: false,
      });
      const repaired = repairResponse.data.content.trim();
      const rStart = repaired.indexOf('{');
      const rEnd = repaired.lastIndexOf('}');
      if (rStart >= 0 && rEnd > rStart) {
        payload = JSON.parse(repaired.substring(rStart, rEnd + 1));
      }
    } catch {
      throw new Error('לא הצלחנו לזהות את המאכל. נסה שוב עם תמונה ברורה יותר.');
    }
  }

  const matches = payload?.matches || [];
  return matches.map((m: any) => ({
    food_name: m.food_name || '',
    hebrew_name: m.hebrew_name || '',
    confidence: m.confidence || 0.5,
    category: m.category || '',
    source: 'ai' as const,
  }));
}

// ============================================================
// Combined Recognition
// ============================================================

/**
 * Main food recognition function.
 * Uses AI as primary, MobileNet as secondary, combines results.
 */
export async function recognizeFood(
  imageDataUrl: string,
  onProgress?: (step: string) => void
): Promise<RecognitionResult> {
  // Step 1: Resize image for API
  onProgress?.('מכין תמונה...');
  const resizedImage = await resizeImage(imageDataUrl);

  // Step 2: Run both recognizers in parallel
  onProgress?.('מזהה מאכל...');

  const [aiResult, mobileNetResult] = await Promise.allSettled([
    recognizeWithAI(resizedImage),
    classifyWithMobileNet(resizedImage),
  ]);

  const aiMatches = aiResult.status === 'fulfilled' ? aiResult.value : [];
  const mnMatches = mobileNetResult.status === 'fulfilled' ? mobileNetResult.value : [];

  // Step 3: Combine results
  const combined = combineResults(aiMatches, mnMatches);

  if (combined.length === 0) {
    throw new Error('לא זוהה מאכל בתמונה. נסה תמונה ברורה יותר של מאכל יחיד.');
  }

  // Determine which model was used
  const modelUsed = aiMatches.length > 0
    ? mnMatches.length > 0 ? 'AI + MobileNet' : 'AI (gemini-2.5-pro)'
    : 'MobileNet V2';

  return {
    matches: combined,
    raw_description: aiMatches.length > 0 ? `זוהה על ידי ${modelUsed}` : 'זוהה על ידי מודל מקומי (MobileNet)',
    model_used: modelUsed,
  };
}

/**
 * Combine AI and MobileNet results, prioritizing AI but boosting confidence
 * when both agree.
 */
function combineResults(aiMatches: FoodMatch[], mnMatches: FoodMatch[]): FoodMatch[] {
  const result: FoodMatch[] = [];
  const seen = new Map<string, FoodMatch>();

  // Add AI results first (higher priority)
  for (const match of aiMatches) {
    const canonical = findCanonicalFoodName(match.food_name) || match.food_name;
    if (!seen.has(canonical)) {
      const combined: FoodMatch = {
        ...match,
        food_name: canonical,
        source: 'ai',
      };
      seen.set(canonical, combined);
      result.push(combined);
    }
  }

  // Check if MobileNet agrees with any AI result
  for (const mnMatch of mnMatches) {
    const canonical = findCanonicalFoodName(mnMatch.food_name) || mnMatch.food_name;
    if (seen.has(canonical)) {
      // Both agree - boost confidence
      const existing = seen.get(canonical)!;
      existing.confidence = Math.min(existing.confidence + mnMatch.confidence * 0.2, 1.0);
      existing.source = 'combined';
    } else {
      // MobileNet found something AI didn't - add with lower priority
      const combined: FoodMatch = {
        ...mnMatch,
        food_name: canonical,
        confidence: mnMatch.confidence * 0.6, // Reduce confidence for MobileNet-only results
        source: 'mobilenet',
      };
      seen.set(canonical, combined);
      result.push(combined);
    }
  }

  // Sort by confidence
  result.sort((a, b) => b.confidence - a.confidence);

  return result.slice(0, 5); // Return top 5
}