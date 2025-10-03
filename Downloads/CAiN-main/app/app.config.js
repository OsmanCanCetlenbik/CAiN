// app.config.js
import 'dotenv/config';

export default {
  expo: {
    name: 'CAiN',
    slug: 'cain',
    version: '1.0.0',
    userInterfaceStyle: 'light',
    newArchEnabled: true,

    icon: './assets/icon.png',
    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },

    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.osmancancetlenbik.cain',
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },

    android: {
      package: 'com.osmancancetlenbik.cain', // <- Android package ekledik
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
    },

    web: {
      favicon: './assets/favicon.png',
    },

    extra: {
      // EAS proje kimliği (dinamik config kullandığın için elle eklenmeli)
      eas: {
        projectId: 'd996ef4e-114c-4a83-b614-b2cfa6acdb80',
      },

      // Ortam değişkenleri / entegrasyon anahtarları
      FAL_API_KEY:
        process.env.FAL_API_KEY ??
        '4be1e5eb-1dbb-479d-a0f6-10e1dedead6a:2342de6b62678e7b3bae12937ced8c51',
      FAL_ENDPOINT:
        process.env.FAL_ENDPOINT ?? 'https://fal.run/fal-ai/flux/dev/image-to-image',

      // Mock modu (string 'true' gelirse true)
      MOCK_MODE: process.env.MOCK_MODE === 'true',

      // Adapty anahtarı (varsa gerçek mod açılır)
      ADAPTY_APP_KEY: process.env.ADAPTY_APP_KEY,

      // Supabase
      EXPO_PUBLIC_SUPABASE_URL:
        process.env.EXPO_PUBLIC_SUPABASE_URL ??
        'https://lgwbrkfngqwgcjxndvvi.supabase.co',
      EXPO_PUBLIC_SUPABASE_ANON_KEY:
        process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ??
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxnd2Jya2ZuZ3F3Z2NqeG5kdnZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MjI1MjgsImV4cCI6MjA3NDk5ODUyOH0.cIPkAlMRc5U6GqtAvdhHbWYGr8fHgGO4pzgjZtqTNjo',
    },
  },
};
