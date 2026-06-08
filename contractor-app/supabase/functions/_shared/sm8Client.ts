// _shared/sm8Client.ts — the ONLY code that holds the SM8 API key (PHASE-1-PLAN.md §2 non-negotiable #1).
// SSRF guard: we NEVER fetch a URL handed to us by a webhook. We validate the job UUID and
// RECONSTRUCT the URL ourselves, then hard-assert host = api.servicem8.com before attaching the key —
// so a spoofed webhook can't point our authed fetch at an attacker host (which would leak the key).
// Retries: 5xx + 429 only (transient); NEVER 4xx. The key comes from an Edge secret, never the client.

const SM8_BASE = 'https://api.servicem8.com/api_1.0';
const SM8_HOST = 'api.servicem8.com';

/** Strict UUID — prevents arbitrary ServiceM8 job-path probing + DB uuid errors (Cleo P2). */
export function isValidUuid(uuid: unknown): uuid is string {
  return typeof uuid === 'string' &&
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(uuid);
}

/** Belt-and-braces: only ever attach the API key to an api.servicem8.com HTTPS job URL.
 *  Rejects userinfo, non-443 ports, and off-path URLs too (hardened for any future resource_url use). */
export function assertSm8Url(url: string): void {
  let u: URL;
  try { u = new URL(url); } catch { throw new Sm8Error(400, 'invalid URL'); }
  if (
    u.protocol !== 'https:' ||
    u.hostname !== SM8_HOST ||
    u.username !== '' || u.password !== '' ||
    (u.port !== '' && u.port !== '443') ||
    !u.pathname.startsWith('/api_1.0/')
  ) {
    throw new Sm8Error(400, 'refusing to attach key to non-ServiceM8 URL'); // SSRF guard
  }
}

function apiKey(): string {
  const k = Deno.env.get('SM8_API_KEY');
  if (!k) throw new Sm8Error(500, 'SM8_API_KEY not configured');
  return k;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export class Sm8Error extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'Sm8Error';
  }
}

/** Retry transient failures (5xx/429) only — NEVER 4xx (won't succeed; wastes the 180/min budget). */
export async function withBackoff<T>(fn: () => Promise<T>, tries = 3, baseMs = 400): Promise<T> {
  let lastErr: unknown;
  for (let i = 0; i < tries; i++) {
    try {
      return await fn();
    } catch (e) {
      lastErr = e;
      const status = (e as { status?: number }).status;
      if (status !== undefined && status < 500 && status !== 429) throw e; // 4xx → don't retry
      if (i < tries - 1) await sleep(baseMs * 2 ** i);
    }
  }
  throw lastErr;
}

/**
 * GET a ServiceM8 job by UUID. The URL is RECONSTRUCTED from the validated UUID — we never fetch a
 * webhook-supplied resource_url. Returns RAW SM8 job JSON; the caller MUST pass it through
 * contactFilter.sm8JobToMirror before storing or returning it.
 */
export async function getJob(uuid: string): Promise<Record<string, unknown>> {
  if (!isValidUuid(uuid)) throw new Sm8Error(400, 'invalid job uuid');
  const url = `${SM8_BASE}/job/${uuid}.json`;
  assertSm8Url(url);
  return await withBackoff(async () => {
    const res = await fetch(url, {
      headers: { 'X-API-Key': apiKey(), 'Accept': 'application/json' },
    });
    if (!res.ok) {
      await res.text().catch(() => {}); // drain; never surface SM8's body to callers
      throw new Sm8Error(res.status, `sm8 GET job ${res.status}`);
    }
    return await res.json() as Record<string, unknown>;
  });
}
