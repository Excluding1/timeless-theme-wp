// _shared/rateLimit.ts — lightweight per-key sliding-window limiter for the sub-facing functions.
// BEST-EFFORT / PER-INSTANCE: Edge Functions scale to N isolates, each with its own window — this is
// a brake on a runaway/abusive client, not a hard quota. The HARD limits live in the database
// (job_messages trigger: 10/hr + 30/day). Memory-bounded: the map is pruned on every check.
const buckets = new Map<string, number[]>();

/** True if `key` has exceeded `limit` calls in the past `windowMs`. Records this call otherwise. */
export function rateLimited(key: string, limit: number, windowMs = 60_000): boolean {
  const now = Date.now();
  if (buckets.size > 2000) {
    for (const [k, times] of buckets) {
      if (times.length === 0 || now - times[times.length - 1] > windowMs) buckets.delete(k);
    }
  }
  const times = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (times.length >= limit) {
    buckets.set(key, times);
    return true;
  }
  times.push(now);
  buckets.set(key, times);
  return false;
}
