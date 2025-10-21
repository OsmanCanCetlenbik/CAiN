declare module 'react' {
  export type ReactNode = any;
  export type ReactElement = any;
  export type PropsWithChildren<P> = P & { children?: ReactNode };
  export type FC<P = {}> = (props: PropsWithChildren<P>) => ReactElement | null;
  export type ComponentType<P = {}> = FC<P>;
  export type Dispatch<A = any> = (value: A) => void;
  export type SetStateAction<S> = S | ((prev: S) => S);
  export interface MutableRefObject<T> {
    current: T;
  }
  export function createContext<T = any>(defaultValue: T): any;
  export function useContext<T = any>(context: any): T;
  export function useState<S = any>(initialState?: S | (() => S)): [S, Dispatch<SetStateAction<S>>];
  export function useEffect(effect: () => void | (() => void), deps?: any[]): void;
  export function useLayoutEffect(effect: () => void | (() => void), deps?: any[]): void;
  export function useMemo<T>(factory: () => T, deps?: any[]): T;
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps?: any[]): T;
  export function useRef<T = any>(initialValue?: T): MutableRefObject<T>;
  export function useReducer(...args: any[]): any;
  export function forwardRef<T, P = {}>(component: any): any;
  export function memo<T>(component: T): T;
  export function useId(): string;
  export const Fragment: any;
  export const Children: any;
  const React: {
    createElement: (...args: any[]) => any;
    useState: typeof useState;
    useEffect: typeof useEffect;
    useLayoutEffect: typeof useLayoutEffect;
    useMemo: typeof useMemo;
    useCallback: typeof useCallback;
    useRef: typeof useRef;
    useReducer: typeof useReducer;
    useContext: typeof useContext;
    createContext: typeof createContext;
    forwardRef: typeof forwardRef;
    memo: typeof memo;
    useId: typeof useId;
    Fragment: any;
    Children: any;
  };
  export default React;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}
