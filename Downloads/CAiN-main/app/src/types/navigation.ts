export type RootStackParamList = {
    Intro: undefined;
    Landing: undefined;
    Auth: undefined; // kullanıcı giriş ekranı
    Upload: undefined;
    Style: { imageUri: string };
    Results: { imageUri: string; preset: string; resultUrl?: string };
    Paywall: undefined;
    History: undefined;
  };
  