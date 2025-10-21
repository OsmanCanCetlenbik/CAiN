declare module 'react-native' {
  export type StyleProp<T> = T | T[] | null | undefined;
  export interface ViewStyle { [key: string]: any; }
  export interface TextStyle { [key: string]: any; }
  export interface ImageStyle { [key: string]: any; }
  export interface LayoutRectangle {
    x: number;
    y: number;
    width: number;
    height: number;
  }
  export interface ListRenderItemInfo<T> {
    item: T;
    index: number;
    separators: any;
  }
  export const View: any;
  export const Text: any;
  export const Image: any;
  export const ScrollView: any;
  export const TouchableOpacity: any;
  export const SafeAreaView: any;
  export const TextInput: any;
  export const Modal: any;
  export const Dimensions: { get: (dim: string) => { width: number; height: number } };
  export const StyleSheet: { create<T extends Record<string, any>>(styles: T): T };
  export const ActivityIndicator: any;
  export const Alert: { alert: (...args: any[]) => void };
  export const Share: { share: (...args: any[]) => Promise<any> };
  export const Linking: { openURL: (url: string) => Promise<void> };
  export const Animated: {
    Value: new (value: number) => any;
    timing: (...args: any[]) => any;
    loop: (...args: any[]) => any;
    sequence: (...args: any[]) => any;
    stagger: (...args: any[]) => any;
    View: any;
    Text: any;
  };
  export const Easing: Record<string, any>;
  export const Platform: { OS: 'ios' | 'android' | 'web' | string };
  export const Pressable: any;
  export const FlatList: any;
  export type ViewProps = Record<string, any>;
  export type TextProps = Record<string, any>;
  export type ImageProps = Record<string, any>;
  export type ScrollViewProps = Record<string, any>;
  export type TouchableOpacityProps = Record<string, any>;
  export type NativeSyntheticEvent<T> = { nativeEvent: T };
  export interface GestureResponderEvent extends NativeSyntheticEvent<any> {}
}
