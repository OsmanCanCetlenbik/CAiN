export interface ConstantsManifest {
  extra?: Record<string, any>;
}

export interface ExpoConfig {
  extra?: Record<string, any>;
}

export interface ConstantsType {
  appOwnership?: string | null;
  manifest?: ConstantsManifest | null;
  manifest2?: { extra?: Record<string, any> } | null;
  expoConfig?: ExpoConfig | null;
}

declare const Constants: ConstantsType;

export default Constants;
