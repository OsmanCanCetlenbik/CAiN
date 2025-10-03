import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';
import { supabase } from '../services/supabase';

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
      try {
        if (user) {
          const { data, error } = await supabase
            .from('history')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
          if (error) throw error;
          const mapped = (data ?? []).map((d: any) => ({
            id: d.id,
            userId: d.user_id,
            inputUri: d.input_uri,
            outputUri: d.output_uri,
            preset: d.preset,
            favorite: d.favorite ?? false,
            createdAt: new Date(d.created_at ?? Date.now()).getTime(),
          }));
          if (mapped.length > 0) {
            setItems(mapped);
          } else {
            // Supabase boş döndüyse local cache'e bak
            const raw = await AsyncStorage.getItem(key);
            setItems(raw ? JSON.parse(raw) : []);
          }
        } else {
          const raw = await AsyncStorage.getItem(key);
          setItems(raw ? JSON.parse(raw) : []);
        }
      } catch (e) {
        console.warn('History load failed, falling back to local', e);
        const raw = await AsyncStorage.getItem(key);
        setItems(raw ? JSON.parse(raw) : []);
      } finally {
        setLoading(false);
      }
    })();
  }, [key, user?.id]);

  const persist = async (next: HistoryItem[] | ((prev: HistoryItem[]) => HistoryItem[])) => {
    if (typeof next === 'function') {
      setItems(prev => {
        const computed = (next as (p: HistoryItem[]) => HistoryItem[])(prev);
        AsyncStorage.setItem(key, JSON.stringify(computed));
        return computed;
      });
    } else {
      setItems(next);
      await AsyncStorage.setItem(key, JSON.stringify(next));
    }
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
    try {
      // Önce local'i güncelle, sonra Supabase'e dene
      await persist(prev => [newItem, ...prev]);

      if (user && user.id !== 'guest') {
        // Kullanıcı tablosunda satırın varlığını garanti et
        try {
          await supabase.from('users').upsert({ id: user.id, name: (user as any).username ?? null }).throwOnError();
        } catch (e) {
          // No-op: tarih ekleme denemeye devam et
        }
        await supabase.from('history').insert({
          id: newItem.id,
          user_id: newItem.userId,
          input_uri: newItem.inputUri,
          output_uri: newItem.outputUri,
          preset: newItem.preset,
          favorite: false,
        }).throwOnError();
      }
    } catch (e) {
      console.warn('Supabase insert history failed', e);
    }
    // Local zaten güncellendi
  };

  const remove: HistoryCtx['remove'] = async (id) => {
    try { if (user) { await supabase.from('history').delete().eq('id', id).throwOnError(); } } catch {}
    await persist(items.filter(i => i.id !== id));
  };

  const toggleFavorite: HistoryCtx['toggleFavorite'] = async (id) => {
    const next = items.map(i => i.id === id ? { ...i, favorite: !i.favorite } : i);
    await persist(next);
    try { 
      if (user) { 
        const fav = next.find(i => i.id === id)?.favorite ?? false;
        await supabase.from('history').update({ favorite: fav }).eq('id', id).throwOnError();
      }
    } catch {}
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
