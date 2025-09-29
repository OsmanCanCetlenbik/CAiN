import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

type User = {
  id: string;       // uuid benzeri random
  name?: string;
  email?: string;
  createdAt: number;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (data: { name?: string; email?: string }) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);
const KEY = 'cain/auth/user';

function randomId() {
  return 'u_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem(KEY);
      if (raw) setUser(JSON.parse(raw));
      setLoading(false);
    })();
  }, []);

  const signIn = async ({ name, email }: { name?: string; email?: string }) => {
    // Basit validasyon
    if (!name && !email) {
      Alert.alert('Giriş', 'En az bir isim ya da e-posta gir.');
      return;
    }
    const u: User = {
      id: randomId(),
      name: name?.trim() || undefined,
      email: email?.trim() || undefined,
      createdAt: Date.now(),
    };
    await AsyncStorage.setItem(KEY, JSON.stringify(u));
    setUser(u);
  };

  const signOut = async () => {
    await AsyncStorage.removeItem(KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
