import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { supabase } from '../services/supabase';
// expo-crypto: Expo Go'da mevcut; yoksa build ortamında dinamik düşelim
let ExpoCrypto: undefined | { CryptoDigestAlgorithm: any; digestStringAsync: (alg: any, data: string) => Promise<string> };
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  ExpoCrypto = require('expo-crypto');
} catch (_) {
  ExpoCrypto = undefined;
}

// Kendi local user tipin (Supabase User ile karışmasın diye isim değiştirdim)
export type LocalUser = {
  id: string;        // uuid benzeri random
  username: string;
  createdAt: number;
};

type AuthContextType = {
  user: LocalUser | null;
  loading: boolean;
  signIn: (data: { username: string; password: string; isSignUp?: boolean }) => Promise<void>;
  signInGuest: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);
const KEY = 'cain/auth/user';

function randomId() {
  return 'u_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function AuthProvider({ children }: { children?: ReactNode }) {
  const [user, setUser] = useState<LocalUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem(KEY);
      if (raw) setUser(JSON.parse(raw));
      setLoading(false);
    })();
  }, []);

  const signIn = async ({
    username,
    password,
    isSignUp,
  }: {
    username: string;
    password: string;
    isSignUp?: boolean;
  }) => {
    try {
      const trimmedUsername = (username ?? '').trim();
      const trimmedPassword = (password ?? '').trim();
      if (!trimmedUsername || !trimmedPassword) {
        Alert.alert('Giriş', 'Kullanıcı adı ve şifre zorunludur.');
        return;
      }
      if (trimmedPassword.length < 6) {
        Alert.alert('Giriş', 'Şifre en az 6 karakter olmalıdır.');
        return;
      }

      let finalUser: LocalUser | null = null;
      const passwordHash = ExpoCrypto
        ? await ExpoCrypto.digestStringAsync(ExpoCrypto.CryptoDigestAlgorithm.SHA256, trimmedPassword)
        : trimmedPassword;

      if (isSignUp) {
        // Kullanıcı adı alınmış mı?
        const { data: existing, error: exErr } = await supabase
          .from('users')
          .select('id')
          .eq('name', trimmedUsername)
          .limit(1)
          .maybeSingle();
        if (exErr) throw exErr;
        if (existing?.id) {
          Alert.alert('Kayıt', 'Bu kullanıcı adı zaten kayıtlı.');
          return;
        }
        const newId = randomId();
        await supabase.from('users').insert({ id: newId, name: trimmedUsername }).throwOnError();
        // Parola kaydı (auth_users: user_id, username, password_hash)
        try {
          await supabase.from('auth_users').insert({ user_id: newId, username: trimmedUsername, password_hash: passwordHash }).throwOnError();
        } catch (e) {
          // tablo yoksa kullanıcıyı geri al
          console.warn('auth_users insert failed (table missing?):', e);
        }
        finalUser = { id: newId, username: trimmedUsername, createdAt: Date.now() };
      } else {
        // Giriş: backend doğrulama (önce auth_users varsa parola doğrula)
        let authedUserId: string | null = null;
        try {
          const { data: authRow, error: authErr } = await supabase
            .from('auth_users')
            .select('user_id')
            .eq('username', trimmedUsername)
            .eq('password_hash', passwordHash)
            .limit(1)
            .maybeSingle();
          if (authErr) throw authErr;
          authedUserId = authRow?.user_id ?? null;
        } catch (e) {
          // tablo yoksa isim bazlı doğrulamaya geri düş
          authedUserId = null;
        }

        if (!authedUserId) {
          const { data: row, error: selErr } = await supabase
            .from('users')
            .select('id')
            .eq('name', trimmedUsername)
            .limit(1)
            .maybeSingle();
          if (selErr) throw selErr;
          if (!row?.id) {
            Alert.alert('Giriş', 'Kullanıcı bulunamadı. Lütfen kayıt olun.');
            return;
          }
          authedUserId = row.id;
        }

        finalUser = { id: authedUserId as string, username: trimmedUsername, createdAt: Date.now() };
      }

      if (!finalUser) return;

      await AsyncStorage.setItem(KEY, JSON.stringify(finalUser));
      setUser(finalUser);
    } catch (e) {
      console.error('SignIn failed:', e);
      Alert.alert('Giriş Hatası', 'Bir sorun oluştu. Tekrar deneyin.');
    }
  };

  const signOut = async () => {
    await AsyncStorage.removeItem(KEY);
    setUser(null);
  };

  const signInGuest = async () => {
    const u: LocalUser = { id: 'guest', username: 'Misafir', createdAt: Date.now() };
    await AsyncStorage.setItem(KEY, JSON.stringify(u));
    setUser(u);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signInGuest, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
