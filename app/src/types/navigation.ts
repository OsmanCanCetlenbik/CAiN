export type RootStackParamList = {
    Auth: undefined; // kullanıcı giriş ekranı
    Upload: undefined;
    Style: { imageUri: string };
    Results: { imageUri: string; preset: string; resultUrl?: string };
    Paywall: undefined;
    History: undefined;
  };
  