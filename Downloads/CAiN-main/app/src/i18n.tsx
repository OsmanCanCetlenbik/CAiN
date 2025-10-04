import React from 'react';
import type { ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Locale = 'tr' | 'en';

const dict: Record<Locale, Record<string, string>> = {
  tr: {
    upload_title: 'Ürün Fotoğrafını Yükle',
    upload_subtitle: 'Fotoğrafını seç ve AI ile profesyonel görseller oluştur',
    select_photo: 'Fotoğraf Seç',
    continue: 'Devam Et',
    view_history: 'Geçmişi Gör',
    style_select_title: 'Tarz Seç',
    style_select_subtitle: 'Ürününü hangi stilde göstermek istiyorsun?',
    nav_landing: 'CAiN',
    nav_auth: 'Giriş',
    nav_upload: 'CAiN – Ürün Yükle',
    nav_style: 'Tarz Seç',
    nav_results: 'Sonuç',
    nav_history: 'Geçmiş',
    nav_paywall: 'Kredi Paketleri',
    share: 'Paylaş',
    open_link: 'Linki Aç',
    different_style: 'Farklı Tarz',
    go_start: 'Başa Dön',
    image_ready: 'Görsel Hazır! ✨',
    generate_4_variants: '4 Varyant Üret',
    variant_error_title: 'Varyant Üretim Hatası',
    image_not_fetched: 'Görsel Alınamadı',
    try_again: 'Tekrar Dene',
    something_wrong_try_again: 'Bir sorun oluştu. Lütfen tekrar deneyin.',
    back: 'Geri',
    tips_title: 'İpuçları',
    tip_1: 'Ürün tek başına ve net olmalı',
    tip_2: 'Kontrastlı arka plan tercih et',
    tip_3: 'İyi aydınlatma kullan',
    category_all: 'Tümü',
    category_modern: 'Modern',
    category_natural: 'Doğal',
    category_luxury: 'Lüks',
    category_outdoor: 'Açık Hava',
    category_seasonal: 'Sezonluk',
    category_custom: 'Özel',
    category_futuristic: 'Fütüristik',
    category_dramatic: 'Dramatik',
    category_home: 'Ev',
    ai_powered: 'Yapay Zeka Destekli',
    hero_line1: '10 Saniyede',
    hero_line2: 'Profesyonel Ürün Görseli',
    hero_sub_1: 'Fotoğrafını yükle, 10+ tema ile tek dokunuşta',
    hero_sub_2: 'hazır görseller',
    hero_sub_3: 'elde et.',
    feat_fast: 'Hızlı',
    feat_fast_desc: '10 saniyede sonuç',
    feat_variety: 'Çeşitli',
    feat_variety_desc: '10+ farklı tema',
    feat_easy: 'Kolay',
    feat_easy_desc: 'Tek dokunuş',
    feat_quality: 'Kaliteli',
    feat_quality_desc: 'Profesyonel sonuç',
    why_cain: 'Neden CAiN?',
    benefit_1: 'Tek dokunuşla 4 varyant üret',
    benefit_2: 'LoRA ile markana özel stil',
    benefit_3: 'Paylaş, indir, anında yayınla',
    get_started: 'Hemen Başla',
    free_trial_hint: 'Ücretsiz deneme ile başla',
    locale_button: 'Dil',
    sign_in_start: 'Giriş Yap ve Başla',
    continue_guest: 'Misafir Olarak Devam',
    continue_to_upload: 'Yüklemeye Devam',
    sign_out: 'Çıkış Yap',
    intro_title: 'Ürün görsellerini saniyeler içinde oluştur',
    intro_subtitle: 'Yükle, stil seç, paylaş. Hepsi tek ekranda.',
    intro_step1: '1️⃣ Fotoğrafını yükle',
    intro_step2: '2️⃣ Stili seç',
    intro_step3: '3️⃣ Paylaş ve geçmişten yönet',
    intro_cta: 'Başlayalım',
    guest_try: 'Misafir olarak devam et (1 deneme)',
  },
  en: {
    upload_title: 'Upload Product Photo',
    upload_subtitle: 'Pick a photo and generate professional visuals with AI',
    select_photo: 'Choose Photo',
    continue: 'Continue',
    view_history: 'View History',
    style_select_title: 'Choose Style',
    style_select_subtitle: 'Which style do you want to showcase your product in?',
    nav_landing: 'CAiN',
    nav_auth: 'Sign In',
    nav_upload: 'CAiN – Upload',
    nav_style: 'Choose Style',
    nav_results: 'Result',
    nav_history: 'History',
    nav_paywall: 'Credit Packs',
    share: 'Share',
    open_link: 'Open Link',
    different_style: 'Different Style',
    go_start: 'Go to Start',
    image_ready: 'Image Ready! ✨',
    generate_4_variants: 'Generate 4 Variants',
    variant_error_title: 'Variant Generation Error',
    image_not_fetched: 'Image Not Retrieved',
    try_again: 'Try Again',
    something_wrong_try_again: 'Something went wrong. Please try again.',
    back: 'Back',
    tips_title: 'Tips',
    tip_1: 'Use a single, sharp product',
    tip_2: 'Prefer a contrasting background',
    tip_3: 'Use good lighting',
    category_all: 'All',
    category_modern: 'Modern',
    category_natural: 'Natural',
    category_luxury: 'Luxury',
    category_outdoor: 'Outdoor',
    category_seasonal: 'Seasonal',
    category_custom: 'Custom',
    category_futuristic: 'Futuristic',
    category_dramatic: 'Dramatic',
    category_home: 'Home',
    ai_powered: 'AI Powered',
    hero_line1: 'In 10 Seconds',
    hero_line2: 'Professional Product Visuals',
    hero_sub_1: 'Upload your photo, with 10+ themes',
    hero_sub_2: 'ready visuals',
    hero_sub_3: 'in one tap.',
    feat_fast: 'Fast',
    feat_fast_desc: 'Results in 10 seconds',
    feat_variety: 'Variety',
    feat_variety_desc: '10+ different themes',
    feat_easy: 'Easy',
    feat_easy_desc: 'One tap',
    feat_quality: 'Quality',
    feat_quality_desc: 'Professional results',
    why_cain: 'Why CAiN?',
    benefit_1: 'Generate 4 variants in one tap',
    benefit_2: 'Brand style with LoRA',
    benefit_3: 'Share, download, publish instantly',
    get_started: 'Get Started',
    free_trial_hint: 'Start with a free trial',
    locale_button: 'Language',
    sign_in_start: 'Sign In & Start',
    continue_guest: 'Continue as Guest',
    continue_to_upload: 'Continue to Upload',
    sign_out: 'Sign Out',
    intro_title: 'Create product visuals in seconds',
    intro_subtitle: 'Upload, pick a style, share. All in one screen.',
    intro_step1: '1️⃣ Upload your photo',
    intro_step2: '2️⃣ Choose a style',
    intro_step3: '3️⃣ Share and manage in history',
    intro_cta: 'Get Started',
    guest_try: 'Continue as Guest (1 try)',
  },
};

type I18nContextType = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
};

const I18nContext = React.createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children?: ReactNode }) {
  const sys = (Intl as any)?.DateTimeFormat?.().resolvedOptions?.().locale as string | undefined;
  const fallBack: Locale = sys && sys.toLowerCase().startsWith('tr') ? 'tr' : 'en';
  const [locale, _setLocale] = React.useState<Locale>(fallBack);
  const [hydrated, setHydrated] = React.useState(false);

  // hydrate saved locale
  React.useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem('app_locale');
        if (saved === 'tr' || saved === 'en') {
          _setLocale(saved);
        }
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  const setLocale = React.useCallback(async (l: Locale) => {
    _setLocale(l);
    try {
      await AsyncStorage.setItem('app_locale', l);
    } catch {}
  }, []);

  const t = React.useCallback((key: string) => {
    return dict[locale]?.[key] ?? dict['en'][key] ?? key;
  }, [locale]);

  // Do not block UI; consumers can render with current value while hydrating
  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextType {
  const ctx = React.useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}


