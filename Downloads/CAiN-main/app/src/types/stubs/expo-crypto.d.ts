declare module 'expo-crypto' {
  export function digestStringAsync(algorithm: string, data: string): Promise<string>;
}
