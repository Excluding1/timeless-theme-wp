// _shared/dedup.ts — best-effort same-UUID debounce within a warm instance.
// CORRECTNESS DOES NOT DEPEND ON THIS: the real idempotency is the upsert on
// job_mirror.sm8_job_uuid (primary key) — processing the same webhook twice yields the same row.
// This just avoids a redundant SM8 GET under SM8/GHL retry bursts. (Full pgmq governor = Phase 4.)
const seen = new Map<string, number>();
const WINDOW_MS = 2000;

export function isDuplicate(key: string): boolean {
  const now = Date.now();
  if (seen.size > 500) {
    for (const [k, t] of seen) if (now - t > WINDOW_MS) seen.delete(k);
  }
  const last = seen.get(key);
  if (last !== undefined && now - last < WINDOW_MS) return true;
  seen.set(key, now);
  return false;
}
