// Demo / test mode. Lets Allan drive the WHOLE app locally with ZERO backend —
// no Supabase, no login, no real data. Opening the app with `?demo=1` (or tapping
// "Explore demo mode" on the sign-in screen) turns it on; it then runs entirely on
// the in-memory mock (lib/mockApi.ts) and no-ops every network write.
//
// GATED so PRODUCTION is untouched: isDemo() is false unless explicitly turned on.
// When it IS on, api.ts serves mockApi (even if VITE_SUPABASE_* is configured),
// the store skips the Supabase auth/session path, and push registration no-ops.

const KEY = 'tj_demo';

function readFlag(): boolean {
  try {
    return typeof localStorage !== 'undefined' && localStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
}

function writeFlag(on: boolean): void {
  try {
    localStorage.setItem(KEY, on ? '1' : '0');
  } catch {
    /* private mode / storage disabled — the in-memory cache below still holds */
  }
}

// Resolve ONCE at module load so `api.ts` can pick the right implementation as it
// evaluates its top-level export. Reading the URL here also persists the choice, so
// demo mode survives in-app navigation (deep links, route changes) AND a reload.
// `?demo=0` explicitly turns it off again.
let cached: boolean = (() => {
  if (typeof window === 'undefined') return false;
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.has('demo')) {
      const on = params.get('demo') !== '0';
      writeFlag(on);
      return on;
    }
  } catch {
    /* ignore malformed query */
  }
  return readFlag();
})();

/** True when the app is running in the offline demo/test sandbox. */
export function isDemo(): boolean {
  return cached;
}

/** Turn demo mode on (the sign-in button reloads with `?demo=1` right after). */
export function enableDemo(): void {
  cached = true;
  writeFlag(true);
}

/** Turn demo mode off (used if we ever add an "exit demo" affordance). */
export function disableDemo(): void {
  cached = false;
  writeFlag(false);
}

/** URL that (re)enters demo mode on a clean load, respecting any deploy base path. */
export function demoEntryUrl(): string {
  const base = (import.meta as unknown as { env: { BASE_URL?: string } }).env?.BASE_URL || '/';
  return `${base}?demo=1`;
}
