import { readSupabaseConfig } from '../env';
import { checkSupabaseHealth } from '../supabase';

const cfg = { url: 'https://example.supabase.co', anonKey: 'key' };
const fakeFetch = (status: number) =>
  jest.fn().mockResolvedValue({ ok: status >= 200 && status < 300, status }) as unknown as typeof fetch;

describe('readSupabaseConfig', () => {
  it('returns null when a variable is missing', () => {
    expect(readSupabaseConfig('', 'key')).toBeNull();
    expect(readSupabaseConfig('https://x.supabase.co', undefined)).toBeNull();
  });

  it('strips trailing slashes from the URL', () => {
    expect(readSupabaseConfig('https://x.supabase.co/', 'k')).toEqual({
      url: 'https://x.supabase.co',
      anonKey: 'k',
    });
  });
});

describe('checkSupabaseHealth', () => {
  it('reports missing config', async () => {
    expect((await checkSupabaseHealth(null)).ok).toBe(false);
  });

  it('calls the auth health endpoint with the api key', async () => {
    const f = fakeFetch(200);
    expect(await checkSupabaseHealth(cfg, f)).toEqual({ ok: true, message: expect.any(String) });
    expect(f).toHaveBeenCalledWith('https://example.supabase.co/auth/v1/health', {
      headers: { apikey: 'key' },
    });
  });

  it('flags a wrong key', async () => {
    expect((await checkSupabaseHealth(cfg, fakeFetch(401))).message).toContain('401');
  });

  it('handles network failure', async () => {
    const f = jest.fn().mockRejectedValue(new Error('offline')) as unknown as typeof fetch;
    expect((await checkSupabaseHealth(cfg, f)).ok).toBe(false);
  });
});
