declare module '@react-native-async-storage/async-storage' {
  export type AsyncStorageValue = string | null;
  const AsyncStorage: {
    getItem(key: string): Promise<AsyncStorageValue>;
    setItem(key: string, value: string): Promise<void>;
    removeItem(key: string): Promise<void>;
    clear(): Promise<void>;
  };
  export default AsyncStorage;
}
