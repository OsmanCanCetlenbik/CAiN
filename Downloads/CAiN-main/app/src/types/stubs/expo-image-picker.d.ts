declare module 'expo-image-picker' {
  export type PermissionStatus = 'granted' | 'denied' | 'undetermined';
  export interface PermissionResponse {
    status: PermissionStatus;
    granted: boolean;
    canAskAgain: boolean;
  }
  export interface ImagePickerAsset {
    uri: string;
    width?: number;
    height?: number;
    fileName?: string;
    type?: string;
  }
  export interface ImagePickerResult {
    canceled: boolean;
    assets?: ImagePickerAsset[];
  }
  export interface ImagePickerOptions {
    mediaTypes?: typeof MediaTypeOptions[keyof typeof MediaTypeOptions];
    allowsEditing?: boolean;
    quality?: number;
    base64?: boolean;
    aspect?: [number, number];
  }
  export const MediaTypeOptions: {
    Images: 'Images';
    Videos: 'Videos';
    All: 'All';
  };
  export function requestMediaLibraryPermissionsAsync(): Promise<PermissionResponse>;
  export function launchImageLibraryAsync(options?: ImagePickerOptions): Promise<ImagePickerResult>;
}
