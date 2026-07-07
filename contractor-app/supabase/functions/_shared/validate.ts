// _shared/validate.ts — Phase-6 input validation. Every sub-supplied value gets a strict shape
// BEFORE it can touch the database (jsonb columns must never become an unbounded blob store).
export const UUID_RE = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const WINDOWS = new Set(['morning', 'afternoon', 'anytime']);

export type Availability = { dates: string[]; window: string };

/**
 * The ONLY availability shape we store: { dates: ["YYYY-MM-DD", ...] (1..7, real dates), window }.
 * Anything else -> null (caller 400s). Previously the raw payload landed in the jsonb column as-is.
 */
export function parseAvailability(payload: unknown): Availability | null {
  if (typeof payload !== 'object' || payload === null || Array.isArray(payload)) return null;
  const p = payload as Record<string, unknown>;
  if (!Array.isArray(p.dates) || p.dates.length === 0 || p.dates.length > 7) return null;
  const dates: string[] = [];
  for (const d of p.dates) {
    if (typeof d !== 'string' || !ISO_DATE_RE.test(d)) return null;
    const t = new Date(`${d}T00:00:00Z`).getTime();
    if (Number.isNaN(t)) return null;                    // e.g. 2026-13-45
    dates.push(d);
  }
  const window = typeof p.window === 'string' && WINDOWS.has(p.window) ? p.window : null;
  if (!window) return null;
  return { dates, window };
}

/**
 * Free-text reason fields (decline / hand-back / problem): trim, drop control chars, cap length.
 * Returns null for empty/absent (reasons are OPTIONAL, never required — Fair-Work).
 */
export function cleanReason(v: unknown, max = 500): string | null {
  if (typeof v !== 'string') return null;
  const cleaned = [...v]
    .filter((ch) => {
      const c = ch.codePointAt(0) ?? 0;
      return c === 0x0a || (c > 0x1f && c !== 0x7f); // keep newlines; drop other control chars
    })
    .join('')
    .trim()
    .slice(0, max);
  return cleaned.length > 0 ? cleaned : null;
}
