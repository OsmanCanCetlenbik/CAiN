declare module '@react-navigation/native-stack' {
  import type { ParamListBase, RouteProp, NavigationProp } from '@react-navigation/native';
  export type NativeStackNavigationProp<ParamList extends ParamListBase = ParamListBase, RouteName extends keyof ParamList = keyof ParamList> = NavigationProp<ParamList> & {
    push: (...args: any[]) => void;
  };
  export type NativeStackScreenProps<ParamList extends ParamListBase = ParamListBase, RouteName extends keyof ParamList = keyof ParamList> = {
    navigation: NativeStackNavigationProp<ParamList, RouteName>;
    route: RouteProp<ParamList, RouteName>;
  };
  export function createNativeStackNavigator<ParamList extends ParamListBase = ParamListBase>(): {
    Navigator: any;
    Screen: any;
  };
}
