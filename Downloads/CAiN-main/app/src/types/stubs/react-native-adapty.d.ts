declare module 'react-native-adapty' {
  export type AdaptyProfile = Record<string, any>;
  export interface AdaptyPaywall {
    identifier: string;
    variationId?: string;
    developerId?: string;
  }
  export type AdaptyListener = (event: string, payload: any) => void;
  export const Adapty: {
    activate(apiKey: string): Promise<void>;
    identify(customerUserId: string): Promise<void>;
    logout(): Promise<void>;
    getPaywalls(): Promise<{ paywalls: AdaptyPaywall[] }>;
    makePurchase(productId: string): Promise<any>;
    setLogLevel(level: string): void;
    setFallbackPaywalls(paywalls: any): void;
    addEventListener(listener: AdaptyListener): void;
    removeEventListener(listener: AdaptyListener): void;
  };
  export default Adapty;
}
