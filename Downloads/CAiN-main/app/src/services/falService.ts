// src/services/falService.ts
// Tamamen yenilendi: “ürünü kilitle, sadece arka planı değiştir” (maskeli inpaint) akışı entegre.
// - 3 adım: rembg → transparent_image_to_mask (+opsiyonel invert/grow) → inpaint
// - Eski i2i (image-to-image) fonksiyonu da geriye dönük uyumluluk için bırakıldı.
// - Expo/React Native ortamında doğrudan FAL REST API (https://fal.run/<model>) çağrıları kullanılır.

import Constants from 'expo-constants';
import * as FileSystem from 'expo-file-system';

type Nullable<T> = T | null | undefined;

type InpaintOptions = {
  imageUri?: string;          // cihazdaki dosya (file://)
  imageUrl?: string;          // http(s) veya data URI
  prompt: string;
  negativePrompt?: string;
  steps?: number;             // default 30
  guidanceScale?: number;     // default 2.7
  strength?: number;          // default 0.9
  seed?: number;
  // Mask oluşturma ayarları:
  threshold?: number;         // default 128
  invertMask?: boolean;       // default true (arka planı beyaz, ürün siyah → model arka planı değiştirir)
  growPx?: number;            // default 6 (kenarları biraz genişlet)
  // Çıkış:
  outputFormat?: 'png' | 'jpeg' | 'jpg' | 'webp'; // default png
};

type I2IOptions = {
  imageUri?: string;
  imageUrl?: string;
  prompt: string;
  steps?: number;             // default 40
  guidanceScale?: number;     // default 3.5
  strength?: number;          // default 0.75
  seed?: number;
  outputFormat?: 'png' | 'jpeg' | 'jpg' | 'webp'; // default png
};

type FalResponse = Record<string, any>;

/* -----------------------------------------------------------
   ENV / CONFIG
----------------------------------------------------------- */

function getFalKey(): string {
  // Expo: app.config.js → extra: { FAL_API_KEY: '...' }
  const fromExtra = (Constants as any)?.expoConfig?.extra?.FAL_API_KEY;
  const fromBare = (Constants as any)?.manifest2?.extra?.FAL_API_KEY; // EAS build'lerde yeni manifest
  const fromProcess = (process as any)?.env?.FAL_API_KEY;
  const key = fromExtra || fromBare || fromProcess;
  if (!key) {
    throw new Error(
      '[FAL] API anahtarı bulunamadı. app.config.js -> extra.FAL_API_KEY veya .env/FAL_API_KEY tanımlayın.'
    );
  }
  return key;
}

const FAL_BASE = 'https://fal.run'; // sync REST
const DEFAULT_HEADERS = () => ({
  'Content-Type': 'application/json',
  Authorization: `Key ${getFalKey()}`,
});

/* -----------------------------------------------------------
   UTIL
----------------------------------------------------------- */

function pickFirstUrl(obj: any): string | undefined {
  if (!obj) return undefined;
  const candidates: string[] = [];
  const push = (v?: string) => v && candidates.push(v);

  push(obj?.image?.url);
  push(obj?.mask?.url);
  if (Array.isArray(obj?.images)) {
    obj.images.forEach((im: any) => push(im?.url));
  }
  push(obj?.output?.image?.url);
  push(obj?.output?.mask?.url);
  push(obj?.url);
  return candidates[0];
}

async function fileToDataUri(fileUri: string): Promise<string> {
  // RN/Expo dosya URI'sından base64 data URI üretir
  // FileSystem.EncodingType.Base64 yerine doğrudan 'base64' stringi kullanılıyor
  const base64 = await FileSystem.readAsStringAsync(fileUri, { encoding: 'base64' });
  // Basit uzantı tahmini
  const ext = (fileUri.split('.').pop() || 'jpg').toLowerCase();
  const mime = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';
  return `data:${mime};base64,${base64}`;
}

function ensureInputSource(imageUri?: string, imageUrl?: string): { isUrl: boolean; value: string } {
  if (!imageUri && !imageUrl) throw new Error('[FAL] imageUri veya imageUrl vermelisiniz');
  if (imageUrl) return { isUrl: true, value: imageUrl };
  return { isUrl: false, value: imageUri! };
}

async function falInvoke(modelId: string, payload: Record<string, any>): Promise<FalResponse> {
  const res = await fetch(`${FAL_BASE}/${modelId}`, {
    method: 'POST',
    headers: DEFAULT_HEADERS(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`[FAL] ${modelId} failed: ${res.status} ${res.statusText} ${text}`);
  }
  return res.json();
}

export async function downloadToCache(resultUrl: string, filename?: string): Promise<string> {
  if (!('cacheDirectory' in FileSystem) || !FileSystem.cacheDirectory) {
    throw new Error('[FAL] FileSystem.cacheDirectory mevcut değil');
  }
  const name = filename || `fal_${Date.now()}.png`;
  const outPath = FileSystem.cacheDirectory + name;
  const { uri, status } = await FileSystem.downloadAsync(resultUrl, outPath);
  if (status !== 200) throw new Error(`[FAL] Dosya indirilemedi: ${status}`);
  return uri;
}

/* -----------------------------------------------------------
   STEP 1: REMBG — arka planı sil → şeffaf PNG
   model: fal-ai/imageutils/rembg
   giriş: image_url (http/https/data URI) veya image_base64
----------------------------------------------------------- */

async function stepRembg(imageInput: string, isUrl: boolean): Promise<string> {
  const payload = isUrl ? { image_url: imageInput } : { image_base64: imageInput };
  const json = await falInvoke('fal-ai/imageutils/rembg', payload);
  const transparentUrl = pickFirstUrl(json) || json?.image?.url;
  if (!transparentUrl) throw new Error('[FAL] rembg çıktısı alınamadı');
  return transparentUrl;
}

/* -----------------------------------------------------------
   STEP 2: Transparent → Mask
   model: fal_ai/workflowutils/transparent_image_to_mask
   giriş: image_url (transparent PNG)
   Not: Bu maske default olarak "ürün beyaz / arka plan siyah" üretir.
   Arka planı değiştirmek istiyorsak maskeyi invert etmeliyiz (arka plan beyaz).
----------------------------------------------------------- */

async function stepTransparentToMask(transparentPngUrl: string, threshold = 128): Promise<string> {
  const json = await falInvoke('fal_ai/workflowutils/transparent_image_to_mask', {
    image_url: transparentPngUrl,
    threshold,
  });
  const maskUrl = pickFirstUrl(json) || json?.mask?.url || json?.image?.url;
  if (!maskUrl) throw new Error('[FAL] transparent→mask çıktısı alınamadı');
  return maskUrl;
}

async function stepInvertMask(maskUrl: string): Promise<string> {
  const json = await falInvoke('fal_ai/workflowutils/invert-mask', { image_url: maskUrl });
  const out = pickFirstUrl(json) || json?.mask?.url || json?.image?.url;
  if (!out) throw new Error('[FAL] invert-mask çıktısı alınamadı');
  return out;
}

async function stepGrowMask(maskUrl: string, pixels = 6, threshold = 128): Promise<string> {
  if (!pixels || pixels <= 0) return maskUrl;
  const json = await falInvoke('fal_ai/workflowutils/grow-mask', {
    image_url: maskUrl,
    pixels,
    threshold,
  });
  const out = pickFirstUrl(json) || json?.mask?.url || json?.image?.url;
  if (!out) throw new Error('[FAL] grow-mask çıktısı alınamadı');
  return out;
}

/* -----------------------------------------------------------
   STEP 3: Inpaint — ürünü koru, arka planı üret
   model: fal-ai/flux-kontext-lora/inpaint
   giriş:
     - image_url  : ORİJİNAL görüntü (ürün + arka plan)
     - mask_url   : BEYAZ = değişecek bölge (arka plan) / SİYAH = korunacak (ürün)
     - prompt     : arka plan açıklaması
----------------------------------------------------------- */

async function stepInpaint(
  originalImageInput: string,
  isUrl: boolean,
  {
    prompt,
    negativePrompt,
    steps = 30,
    guidanceScale = 2.7,
    strength = 0.9,
    seed,
    outputFormat = 'png',
  }: Required<Pick<InpaintOptions, 'prompt'>> &
    Pick<InpaintOptions, 'negativePrompt' | 'steps' | 'guidanceScale' | 'strength' | 'seed' | 'outputFormat'>,
  maskUrl: string
): Promise<string> {
  const payload: Record<string, any> = {
    image_url: isUrl ? originalImageInput : undefined,
    image_base64: isUrl ? undefined : originalImageInput,
    mask_url: maskUrl,
    prompt,
    negative_prompt: negativePrompt || undefined,
    num_inference_steps: steps,
    guidance_scale: guidanceScale,
    strength,
    seed,
    output_format: outputFormat,
  };

  const json = await falInvoke('fal-ai/flux-kontext-lora/inpaint', payload);
  const outUrl = pickFirstUrl(json) || json?.image?.url;
  if (!outUrl) throw new Error('[FAL] inpaint çıktısı alınamadı');
  return outUrl;
}

/* -----------------------------------------------------------
   PUBLIC: Pro Inpaint (ürünü kilitle, arka planı değiştir)
----------------------------------------------------------- */

export async function proInpaint(opts: InpaintOptions): Promise<{
  resultUrl: string;
  debug: { transparentUrl: string; maskUrl: string };
}> {
  const {
    imageUri,
    imageUrl,
    prompt,
    negativePrompt,
    steps = 30,
    guidanceScale = 2.7,
    strength = 0.9,
    seed,
    threshold = 128,
    invertMask = true,
    growPx = 6,
    outputFormat = 'png',
  } = opts;

  // 0) Girdi hazırla
  const src = ensureInputSource(imageUri, imageUrl);
  const originalInput = src.isUrl ? src.value : await fileToDataUri(src.value);

  // 1) Arka plan sil → şeffaf PNG
  const transparentUrl = await stepRembg(originalInput, src.isUrl);

  // 2) Şeffaf → maske (ürün beyaz / arka plan siyah)
  let maskUrl = await stepTransparentToMask(transparentUrl, threshold);

  // 2.a) Arka planı değiştireceğimiz için maskeyi tersine çevir (arka planı beyaz yap)
  if (invertMask) maskUrl = await stepInvertMask(maskUrl);

  // 2.b) Kenarları bir miktar genişlet (haleleri azaltır)
  maskUrl = await stepGrowMask(maskUrl, growPx, 128);

  // 3) Inpaint çağrısı
  const resultUrl = await stepInpaint(
    originalInput,
    src.isUrl,
    { prompt, negativePrompt, steps, guidanceScale, strength, seed, outputFormat },
    maskUrl
  );

  return { resultUrl, debug: { transparentUrl, maskUrl } };
}

/* -----------------------------------------------------------
   BACKWARD COMPAT: Basit i2i (image-to-image) akışı
   model: fal-ai/flux/dev/image-to-image
   Not: Ürünü sabit tutmak istiyorsan proInpaint’i tercih et.
----------------------------------------------------------- */

export async function generateImageToImage(opts: I2IOptions): Promise<{ resultUrl: string }> {
  const {
    imageUri,
    imageUrl,
    prompt,
    steps = 40,
    guidanceScale = 3.5,
    strength = 0.75,
    seed,
    outputFormat = 'png',
  } = opts;

  const src = ensureInputSource(imageUri, imageUrl);
  const input = src.isUrl ? src.value : await fileToDataUri(src.value);

  const payload: Record<string, any> = {
    prompt,
    num_inference_steps: steps,
    guidance_scale: guidanceScale,
    strength,
    seed,
    output_format: outputFormat,
  };

  if (src.isUrl) payload.image_url = input;
  else payload.image_base64 = input;

  const json = await falInvoke('fal-ai/flux/dev/image-to-image', payload);
  const outUrl = pickFirstUrl(json);
  if (!outUrl) throw new Error('[FAL] i2i çıktısı alınamadı');
  return { resultUrl: outUrl };
}

/* -----------------------------------------------------------
   PRESET PROMPTS (ürünü koruyarak sahne/arka plan üretimi için)
----------------------------------------------------------- */

export const PRESET_PROMPTS: Record<string, string> = {
  // SEZONLUK
  christmas_table:
    'Keep the original product unchanged (shape, color, logo). Place it on an elegant Christmas dinner table, warm ambient lights, soft bokeh, pine branches and subtle ornaments in the background, shallow depth of field, professional product photography, clean composition, no people, no text, no watermark.',
  // DOĞAL / OUTDOOR
  beach_cafe:
    'Keep the product exactly the same. Background: airy beach café terrace with wooden table, sea horizon far behind, bright morning light, soft shadows, lifestyle e-commerce composition, no people, no logos, no text.',
  outdoor_picnic:
    'Keep the product unchanged. Background: picnic blanket on fresh grass with soft sunlight, minimal props, natural color palette, catalog-ready look, no hands, no people, no brand text.',
  rustic_wood_table:
    'Preserve the original product. Background: rustic wooden tabletop with gentle side light, warm tones, subtle vignette, sharp details, commercial product backdrop, no extra props covering the product.',
  // MODERN / MİNİMAL
  minimal_office:
    'Keep the original product. Background: clean white studio setup with soft gradient backdrop, minimal office vibe, controlled reflections, high contrast edges, e-commerce studio quality, no text, no people.',
  pastel_minimal:
    'Keep the product as is. Background: pastel gradient studio backdrop (muted peach/mint), softbox lighting, smooth shadow under the product, modern catalog style, no text, no logos.',
  // EV / İÇ MEKAN
  cozy_living_room:
    'Keep the product unchanged. Background: cozy living room scene with soft warm light, blurred sofa and bookshelf, tasteful decor, shallow depth of field, professional catalog look, no humans, no text.',
  marble_kitchen:
    'Preserve the product. Background: premium white marble kitchen counter with soft daylight from window, slight reflection on surface, clean lifestyle photo for e-commerce, no clutter, no text.',
  industrial_loft:
    'Keep the product the same. Background: industrial loft interior with concrete wall, large window light, modern aesthetic, crisp details, catalog photography, no people, no typography.',
  // BİTKİSEL / BOTANİK
  botanical_studio:
    'Keep the original product unchanged. Background: indoor plant studio with soft daylight, out-of-focus greenery, simple plinth or table, fresh and natural look, 4K quality, no text, no people.',
  // FUTURISTIC / DRAMATIC / LUXURY
  neon_cyberpunk:
    'Keep the product unchanged. Background: neon cyberpunk city hues (teal-magenta), reflective surface under product, rim light, dramatic yet clean composition, no text or people.',
  dark_mood:
    'Preserve the product. Background: dark luxury studio, single soft side light, subtle haze, premium look with glossy reflections, high-end product photography, no text, no people.',
};

/* -----------------------------------------------------------
   KULLANIM ÖRNEKLERİ
----------------------------------------------------------- */
/*
  // 1) PRO INPAINT: ürünü kilitle, arka planı değiştir
  const { resultUrl, debug } = await proInpaint({
    imageUri: localFileUri, // veya imageUrl
    prompt: PRESET_PROMPTS.marble_kitchen,
    steps: 30,
    guidanceScale: 2.7,
    strength: 0.9,
    invertMask: true,
    growPx: 6,
    outputFormat: 'png',
  });
  const saved = await downloadToCache(resultUrl, 'result.png');

  // 2) Basit i2i:
  const { resultUrl } = await generateImageToImage({
    imageUri: localFileUri, // veya imageUrl
    prompt: PRESET_PROMPTS.pastel_minimal,
    steps: 40,
    guidanceScale: 3.5,
    strength: 0.75,
    outputFormat: 'png',
  });
*/
