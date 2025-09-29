import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type CreditsContextType = {
  credits: number;
  loading: boolean;
  consume: (n?: number) => Promise<boolean>; // yeterse düş, true dön; yetmezse false
  add: (n: number) => Promise<void>;
  reset: (n: number) => Promise<void>;
};

const CreditsContext = createContext<CreditsContextType | null>(null);
const KEY = 'cain/credits';
const INITIAL = 10; // ilk kurulumda hediye 10

export function CreditsProvider({ children }: { children: ReactNode }) {
  const [credits, setCredits] = useState<number>(INITIAL);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(KEY);
      if (saved != null) setCredits(parseInt(saved, 10));
      else await AsyncStorage.setItem(KEY, String(INITIAL));
      setLoading(false);
    })();
  }, []);

  const persist = async (v: number) => {
    setCredits(v);
    await AsyncStorage.setItem(KEY, String(v));
  };

  const consume = async (n = 1) => {
    if (credits < n) return false;
    await persist(credits - n);
    return true;
    };

  const add = async (n: number) => persist(credits + n);
  const reset = async (n: number) => persist(n);

  return (
    <CreditsContext.Provider value={{ credits, loading, consume, add, reset }}>
      {children}
    </CreditsContext.Provider>
  );
}

export function useCredits() {
  const ctx = useContext(CreditsContext);
  if (!ctx) throw new Error('useCredits must be used within CreditsProvider');
  return ctx;
}
