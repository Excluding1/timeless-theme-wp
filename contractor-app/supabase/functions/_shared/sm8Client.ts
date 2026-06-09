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

/** Single fetch chokepoint. `redirect: 'manual'` so a 3xx can NEVER forward our method/body/X-API-Key
 *  off the pinned URL (SSRF hardening — Cleo P1#5); any 3xx is treated as failure. Drains + hides SM8's
 *  body on error (never surfaced to a caller). The caller has already assertSm8Url'd `url`. */
async function sm8Fetch(url: string, init: RequestInit): Promise<Response> {
  const res = await fetch(url, { ...init, redirect: 'manual' });
  if (res.status >= 300 && res.status < 400) {            // a redirect we refuse to follow
    await res.text().catch(() => {});                     // drain (null-safe); never follow
    throw new Sm8Error(res.status, `sm8 ${init.method ?? 'GET'} redirect ${res.status}`);
  }
  if (!res.ok) {                                          // also catches the opaqueredirect (status 0) case
    await res.text().catch(() => {});                     // drain; never surface SM8's body to callers
    throw new Sm8Error(res.status, `sm8 ${init.method ?? 'GET'} ${res.status}`);
  }
  return res;
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
    const res = await sm8Fetch(url, { headers: { 'X-API-Key': apiKey(), 'Accept': 'application/json' } });
    return await res.json() as Record<string, unknown>;
  });
}

// The ONLY job fields the backend may ever WRITE. Body is built field-by-field; NEVER spread caller
// input — so customer contact has no path to ride along on a write (Cleo P1#6 / D). queue_uuid is
// listed for the deferred accept-writeback; today only `status` is used.
const WRITABLE_JOB_FIELDS = new Set(['status', 'queue_uuid']);

/**
 * Update a ServiceM8 job (PARTIAL update — POST only the changed fields, per developer.servicem8.com
 * /reference/updatejobs). URL reconstructed from the validated UUID, host-pinned, manual-redirect.
 * Body = ALLOWLIST (WRITABLE_JOB_FIELDS), asserted again immediately before the fetch.
 * Verified live 2026-06-09: POST {status:"Completed"} -> 200 {"errorCode":0,"message":"OK"}, and SM8
 * auto-stamps completion_date + completion_actioned_by_uuid (the account owner, NOT the sub) — so we
 * send `status` ALONE; no completion_date/active needed.
 */
export async function updateJob(uuid: string, fields: Record<string, unknown>): Promise<void> {
  if (!isValidUuid(uuid)) throw new Sm8Error(400, 'invalid job uuid');

  const body: Record<string, string> = {};
  for (const [k, v] of Object.entries(fields)) {
    if (WRITABLE_JOB_FIELDS.has(k) && typeof v === 'string' && v.length > 0) body[k] = v;
  }
  if (Object.keys(body).length === 0) throw new Sm8Error(400, 'no writable fields');
  // Defence-in-depth: refuse if ANY key slipped past the allowlist (guards a future spread/refactor).
  if (!Object.keys(body).every((k) => WRITABLE_JOB_FIELDS.has(k))) {
    throw new Sm8Error(400, 'disallowed write field');
  }

  const url = `${SM8_BASE}/job/${uuid}.json`;
  assertSm8Url(url);
  await withBackoff(async () => {
    const res = await sm8Fetch(url, {
      method: 'POST',
      headers: { 'X-API-Key': apiKey(), 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(body),
    });
    // SM8 signals app-level failure as errorCode!=0 even on HTTP 200 — treat as retryable (>=500).
    const data = await res.json().catch(() => ({} as Record<string, unknown>));
    if (data && typeof data.errorCode !== 'undefined' && Number(data.errorCode) !== 0) {
      throw new Sm8Error(502, `sm8 errorCode ${data.errorCode}`);
    }
  });
}
