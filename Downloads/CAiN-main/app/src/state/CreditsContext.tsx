import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

type CreditsContextType = {
  credits: number;
  loading: boolean;
  consume: (n?: number) => Promise<boolean>; // yeterse düş, true dön; yetmezse false
  add: (n: number) => Promise<void>;
  reset: (n: number) => Promise<void>;
};

const CreditsContext = createContext<CreditsContextType | null>(null);
const KEY_BASE = 'cain/credits/';
const INITIAL_REGISTERED = 3; // kayıtlı kullanıcıya 3 deneme
const INITIAL_GUEST = 1;      // misafire 1 deneme

export function CreditsProvider({ children }: { children?: ReactNode }) {
  const { user } = useAuth();
  const [credits, setCredits] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const key = KEY_BASE + (user?.id ?? 'guest');
      const saved = await AsyncStorage.getItem(key);
      if (saved != null) {
        setCredits(parseInt(saved, 10));
      } else {
        const initial = user && user.id !== 'guest' ? INITIAL_REGISTERED : INITIAL_GUEST;
        await AsyncStorage.setItem(key, String(initial));
        setCredits(initial);
      }
      setLoading(false);
    })();
  }, [user?.id]);

  const persist = async (v: number) => {
    setCredits(v);
    const key = KEY_BASE + (user?.id ?? 'guest');
    await AsyncStorage.setItem(key, String(v));
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
