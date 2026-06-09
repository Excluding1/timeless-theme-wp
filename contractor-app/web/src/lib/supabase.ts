import { createClient } from '@supabase/supabase-js';

const env = (import.meta as unknown as { env: Record<string, string | undefined> }).env;
const url = env.VITE_SUPABASE_URL;
const anon = env.VITE_SUPABASE_ANON_KEY;

/** Real backend is available only when both env vars are set (else the app stays on mock data). */
export const supabaseConfigured = !!url && !!anon;

// One browser client; persists the session so the sub stays logged in across app opens.
export const supabase = createClient(url ?? '', anon ?? '', {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
});

export const FUNCTIONS_URL = `${url ?? ''}/functions/v1`;
export const ANON_KEY = anon ?? '';
