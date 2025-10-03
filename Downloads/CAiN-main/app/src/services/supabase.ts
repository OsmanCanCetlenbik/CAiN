import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const extra = (Constants.expoConfig?.extra ?? {}) as any;

const SUPABASE_URL = (extra.EXPO_PUBLIC_SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL) as string;
const SUPABASE_ANON_KEY = (extra.EXPO_PUBLIC_SUPABASE_ANON_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY) as string;

if (!SUPABASE_URL) {
  throw new Error('Supabase URL is missing. Set EXPO_PUBLIC_SUPABASE_URL in app.config.js extra.');
}
if (!SUPABASE_ANON_KEY) {
  throw new Error('Supabase anon key is missing. Set EXPO_PUBLIC_SUPABASE_ANON_KEY in app.config.js extra.');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});

export type DbUser = {
  id: string;
  name?: string;
  email?: string;
  created_at?: string;
};

export type DbHistory = {
  id: string;
  user_id: string;
  input_uri: string;
  output_uri: string;
  preset: string;
  favorite?: boolean;
  created_at?: string;
};
