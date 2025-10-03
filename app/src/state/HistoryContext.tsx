import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

export type HistoryItem = {
  id: string;
  userId: string;
  inputUri: string;
  outputUri: string;
  preset: string;
  createdAt: number;
  favorite?: boolean;
};

type HistoryCtx = {
  items: HistoryItem[];
  loading: boolean;
  add: (item: Omit<HistoryItem, 'id' | 'createdAt' | 'userId'>) => Promise<void>;
  remove: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
};

const HistoryContext = createContext<HistoryCtx | null>(null);

export function HistoryProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const key = user ? `cain/history/${user.id}` : 'cain/history/guest';

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem(key);
      setItems(raw ? JSON.parse(raw) : []);
      setLoading(false);
    })();
  }, [key]);

  const persist = async (next: HistoryItem[]) => {
    setItems(next);
    await AsyncStorage.setItem(key, JSON.stringify(next));
  };

  const add: HistoryCtx['add'] = async ({ inputUri, outputUri, preset }) => {
    const newItem: HistoryItem = {
      id: 'h_' + Math.random().toString(36).slice(2) + Date.now().toString(36),
      userId: user?.id ?? 'guest',
      inputUri,
      outputUri,
      preset,
      createdAt: Date.now(),
    };
    await persist([newItem, ...items]);
  };

  const remove: HistoryCtx['remove'] = async (id) => {
    await persist(items.filter(i => i.id !== id));
  };

  const toggleFavorite: HistoryCtx['toggleFavorite'] = async (id) => {
    const next = items.map(i => i.id === id ? { ...i, favorite: !i.favorite } : i);
    await persist(next);
  };

  const clearAll = async () => {
    await persist([]);
  };

  return (
    <HistoryContext.Provider value={{ items, loading, add, remove, toggleFavorite, clearAll }}>
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistoryList() {
  const ctx = useContext(HistoryContext);
  if (!ctx) throw new Error('useHistoryList must be used within HistoryProvider');
  return ctx;
}
