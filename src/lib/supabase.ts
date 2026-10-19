import 'react-native-url-polyfill/auto';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { AppState, Platform } from 'react-native';

import { readSupabaseConfig } from './env';

const config = readSupabaseConfig();

export const supabase: SupabaseClient | null = config
  ? createClient(config.url, config.anonKey, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    })
  : null;

// Only refresh tokens while the app is in the foreground.
if (supabase && Platform.OS !== 'web') {
  AppState.addEventListener('change', (state) => {
    if (state === 'active') supabase.auth.startAutoRefresh();
    else supabase.auth.stopAutoRefresh();
  });
}

export type HealthResult = { ok: boolean; message: string };

export async function checkSupabaseHealth(
  cfg = config,
  fetchFn: typeof fetch = fetch,
): Promise<HealthResult> {
  if (!cfg) {
    return {
      ok: false,
      message: 'Thiếu EXPO_PUBLIC_SUPABASE_URL hoặc EXPO_PUBLIC_SUPABASE_ANON_KEY trong file .env',
    };
  }
  try {
    const res = await fetchFn(`${cfg.url}/auth/v1/health`, { headers: { apikey: cfg.anonKey } });
    if (res.ok) return { ok: true, message: 'Kết nối Supabase thành công ✓' };
    if (res.status === 401) return { ok: false, message: 'Sai anon/publishable key (401)' };
    return { ok: false, message: `Supabase trả về lỗi ${res.status}` };
  } catch {
    return { ok: false, message: 'Không kết nối được tới Supabase. Kiểm tra mạng và URL.' };
  }
}
