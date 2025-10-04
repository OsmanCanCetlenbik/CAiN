declare module '@react-navigation/native' {
  export type ParamListBase = Record<string, object | undefined>;
  export type NavigationProp<ParamList extends ParamListBase = ParamListBase> = {
    navigate: (...args: any[]) => void;
    goBack: () => void;
    replace: (...args: any[]) => void;
    reset: (...args: any[]) => void;
    setOptions: (...args: any[]) => void;
  };
  export type RouteProp<ParamList extends ParamListBase, RouteName extends keyof ParamList> = {
    key: string;
    name: RouteName;
    params: ParamList[RouteName];
  };
  export const NavigationContainer: any;
  export const DefaultTheme: any;
  export const DarkTheme: any;
  export function useNavigation<T extends NavigationProp = NavigationProp>(): T;
  export function useRoute<ParamList extends ParamListBase = ParamListBase, RouteName extends keyof ParamList = keyof ParamList>(): RouteProp<ParamList, RouteName>;
  export function useFocusEffect(effect: () => void | (() => void)): void;
  export function useIsFocused(): boolean;
  export type NavigationContainerRef<ParamList extends ParamListBase = ParamListBase> = NavigationProp<ParamList> & { dispatch: (...args: any[]) => void };
}
