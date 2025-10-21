export type EncodingType = 'utf8' | 'base64';

export interface ReadAsStringOptions {
  encoding?: EncodingType | 'base64';
}

export interface DownloadOptions {
  md5?: boolean;
  headers?: Record<string, string>;
}

export declare const cacheDirectory: string | null | undefined;

export declare function readAsStringAsync(
  uri: string,
  options?: ReadAsStringOptions
): Promise<string>;

export declare function downloadAsync(
  uri: string,
  fileUri: string,
  options?: DownloadOptions
): Promise<{ uri: string; status: number }>;
