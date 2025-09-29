import Constants from 'expo-constants';

type GenerateParams = {
  imageUri: string;
  preset: string;
};

export type GenerateResult = {
  ok: boolean;
  url?: string;
  error?: string;
};

// Preset -> prompt haritalama
const PRESET_PROMPTS: Record<string, string> = {
  christmas_table:
    "A festive Christmas table setup with warm lights, pine branches and soft bokeh, product centered, photorealistic, studio lighting, natural shadows, 4k",
  beach_cafe:
    "A sunny beach cafe table scene with sea in the background, soft natural light, light wood table, product centered, photorealistic, 4k",
  minimal_office:
    "Minimalist white office desk with soft daylight, faint shadows, clean background, product centered, photorealistic, 4k",
};

const PLACEHOLDERS: Record<string, string> = {
  christmas_table: 'https://images.unsplash.com/photo-1512386233331-5c180f0b5b4e?q=80&w=1200&auto=format&fit=crop',
  beach_cafe: 'https://images.unsplash.com/photo-1498654200943-1088dd4438ae?q=80&w=1200&auto=format&fit=crop',
  minimal_office: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1200&auto=format&fit=crop',
};

export async function generateImage({ imageUri, preset }: GenerateParams): Promise<GenerateResult> {
  const extra = Constants.expoConfig?.extra as any;
  const MOCK_MODE = !!extra?.MOCK_MODE;
  const FAL_ENDPOINT = extra?.FAL_ENDPOINT as string | undefined;
  const FAL_API_KEY = extra?.FAL_API_KEY as string | undefined;

  // 1) Mock modu: anahtar/endpoint yoksa veya özellikle istenirse
  if (MOCK_MODE || !FAL_ENDPOINT || !FAL_API_KEY) {
    // 800ms bekletip placeholder dönelim (demo akışı)
    await new Promise(r => setTimeout(r, 800));
    return { ok: true, url: PLACEHOLDERS[preset] ?? PLACEHOLDERS.minimal_office };
  }

  // 2) Gerçek çağrı (örnek şema)
  // Burada tipik bir multipart upload gösteriyoruz.
  try {
    const body = new FormData();
    body.append('prompt', PRESET_PROMPTS[preset] ?? PRESET_PROMPTS.minimal_office);

    // RN/Expo'da yerel görseli multipart'a böyle ekliyoruz:
    // @ts-ignore: React Native FormData file object
body.append('image', {
  uri: imageUri,
  name: 'input.jpg',
  type: 'image/jpeg',
} as any);


const res = await fetch(FAL_ENDPOINT, {
  method: 'POST',
  headers: {
    // ÖNEMLİ: Bearer değil, Key
    Authorization: `Key ${FAL_API_KEY}`,
    // FormData kullanırken Content-Type verme; boundary’i fetch ayarlar.
  },
  body,
});

    if (!res.ok) {
      const txt = await res.text();
      return { ok: false, error: `FAL error ${res.status}: ${txt}` };
    }

    // API yanıtının şeması sağlayıcıya göre değişir.
    // Örneğin { images: [{ url: "..." }]} veya { output_url: "..." }
    const data = await res.json();

    // Aşağıdaki iki satırdan biri gerçek API şemasına göre uyarlanmalı:
    const url = data?.images?.[0]?.url || data?.output_url || data?.url;

    if (!url) {
      return { ok: false, error: 'FAL response has no image url' };
    }

    return { ok: true, url };
  } catch (e: any) {
    return { ok: false, error: e?.message ?? 'Unknown error' };
  }
}
