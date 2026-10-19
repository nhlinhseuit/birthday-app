export type SupabaseConfig = { url: string; anonKey: string };

// Expo inlines EXPO_PUBLIC_* at build time, so they must be read as literal process.env.X.
export function readSupabaseConfig(
  url = process.env.EXPO_PUBLIC_SUPABASE_URL,
  anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
): SupabaseConfig | null {
  if (!url || !anonKey) return null;
  return { url: url.replace(/\/+$/, ''), anonKey };
}
