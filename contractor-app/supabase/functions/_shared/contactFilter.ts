// _shared/contactFilter.ts — THE security core (PHASE-1-PLAN.md §2, non-negotiable #2).
// Hardened 2026-06-09 after Cleo's adversarial review (she FAILED the v1 scrubber on obfuscation):
//   - normalize before scanning: NFKC folds fullwidth/unicode digits to ASCII; drop zero-width chars;
//     turn control chars into spaces; join spaced "@" — so obfuscated contact can't slip past.
//   - detect emails (plain + "jane at example dot com") and phones by DIGIT COUNT (7-15 after de-sep),
//     not just AU prefixes — catches international + spaced + unicode.
//   - strictStr(): arrays/objects/booleans -> null, so PII can't ride in via an unexpected SM8 shape.
//   - assertNoContact(): a fail-closed gate the callers run before any upsert/return.
//
// Layered guarantees: (1) allowlist — read named fields only, never `...raw`; (2) job_mirror has no
// contact columns; (3) stripContact scrubs every human-readable field; (4) assertNoContact throws if
// anything survives. SM8 shape grounded in docs/specs/make-scenario-1-main-build.md (B4).

const STRICT_UUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

// Code points for zero-width chars (numeric, so the source stays pure ASCII).
const ZERO_WIDTH = new Set([0x200b, 0x200c, 0x200d, 0xfeff, 0x00ad]);

/** Fold obfuscation before scanning: NFKC (fullwidth/unicode digits -> ASCII), drop zero-width chars,
 *  turn control chars into spaces, join spaced "@" so "jane @ example.com" reads as one token. */
function fold(text: string): string {
  const out: string[] = [];
  for (const ch of text.normalize('NFKC')) {
    const c = ch.codePointAt(0) ?? 0;
    if (ZERO_WIDTH.has(c)) continue;                  // drop zero-width / soft hyphen / BOM
    out.push(c <= 0x1f || c === 0x7f ? ' ' : ch);     // control -> space; otherwise keep
  }
  return out.join('').replace(/\s*@\s*/g, '@');       // join spaced "@"
}

// Plain email, and "jane at example dot com" / "jane [at] example [dot] com" (word-bounded at/dot).
const EMAIL_RE = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/i;
const OBFUSCATED_EMAIL_RE =
  /[A-Za-z0-9._%+-]+\s*[([{]?\s*\bat\b\s*[)\]}]?\s*[A-Za-z0-9.-]+\s*[([{]?\s*\bdot\b\s*[)\]}]?\s*[A-Za-z]{2,}/i;
// A phone candidate: optional "+", then 7-15 digits with the usual ASCII phone separators between them.
const PHONE_RE = /\+?\d(?:[\s.\-()\/]?\d){6,14}/g;

function phoneCandidate(text: string): boolean {
  const m = text.match(PHONE_RE);
  return m !== null && m.some((c) => {
    const d = c.replace(/\D/g, '');
    return d.length >= 7 && d.length <= 15;
  });
}

/** True if the value contains an email or phone number, after de-obfuscation. */
export function containsPii(value: unknown): boolean {
  const s = fold(typeof value === 'string' ? value : JSON.stringify(value ?? ''));
  return EMAIL_RE.test(s) || OBFUSCATED_EMAIL_RE.test(s) || phoneCandidate(s);
}

/** Redact email/phone-looking substrings from a single free-text field. */
export function stripContact(text: string | null | undefined): string {
  if (text == null) return '';
  let s = fold(String(text));
  s = s.replace(new RegExp(EMAIL_RE.source, 'gi'), '[removed]');
  s = s.replace(new RegExp(OBFUSCATED_EMAIL_RE.source, 'gi'), '[removed]');
  s = s.replace(PHONE_RE, (m) => {
    const d = m.replace(/\D/g, '');
    return d.length >= 7 && d.length <= 15 ? '[removed]' : m;
  });
  return s.replace(/[ \t]{2,}/g, ' ').trim();
}

/** Recursively scrub string values (audit_log detail blobs — never persist PII). */
export function scrubPii<T>(value: T): T {
  return JSON.parse(
    JSON.stringify(value, (_k, v) => (typeof v === 'string' ? stripContact(v) : v)),
  ) as T;
}

// 6 ServiceM8 job categories (UUIDs from make-scenario-1-main-build.md B3 / cockpit config).
const CATEGORY_BY_UUID: Record<string, string> = {
  'dde365f8-0ec9-4995-b813-243f9a427cdb': 'Resurfacing',
  '957eb098-e48e-4084-baef-243f9b153b4b': 'Regrouting',
  'e9f6c3eb-1c14-4766-850b-243f9c0d0f7b': 'Silicone & Sealing',
  '0e59fc33-75fe-4b93-b6da-243f911b50fb': 'Repairs',
  '189e430b-4e55-4e2e-815f-243f90f46bab': 'Specialist',
  'b3470e8f-b955-4fd4-9e0a-243f9c2d5eab': 'Combo',
};

// The contact-free shape we store + ever expose to a sub. No contact fields exist here, by type.
export interface JobMirrorRow {
  sm8_job_uuid: string;
  generated_job_id: string | null;
  customer_name: string | null;   // NAME ONLY
  job_address: string | null;
  job_category: string;
  scope: string;
  required_photos: unknown[];
  sm8_status: string | null;
  sm8_queue_uuid: string | null;
  last_synced_at: string;
}

type RawSm8Job = Record<string, unknown>;

/** STRING-ONLY coercion. Arrays/objects/booleans -> null, so PII can't ride in via an unexpected shape. */
function strictStr(v: unknown): string | null {
  if (typeof v === 'string') return v.trim() === '' ? null : v;
  if (typeof v === 'number' && Number.isFinite(v)) return String(v);
  return null;
}

function uuidOrNull(v: unknown): string | null {
  const s = strictStr(v);
  return s && STRICT_UUID.test(s) ? s.toLowerCase() : null;
}

/**
 * Build a contact-free job_mirror row from a raw ServiceM8 job. ALLOWLIST ONLY — every field read by
 * name; never `...raw`. Customer phone/email/mobile/jobcontact/company_* are never referenced.
 * Callers MUST run assertNoContact(result) before storing or returning it (fail-closed).
 */
export function sm8JobToMirror(raw: RawSm8Job, nowIso: string): JobMirrorRow {
  const description = strictStr(raw.job_description) ?? '';
  const nameLine = description.split('\n')[0] ?? ''; // Make writes the customer name on line 1 (no phone/email)
  const categoryUuid = uuidOrNull(raw.category_uuid);

  return {
    sm8_job_uuid: uuidOrNull(raw.uuid) ?? '',
    generated_job_id: stripContact(strictStr(raw.generated_job_id)) || null,
    customer_name: stripContact(nameLine) || null,
    job_address: stripContact(strictStr(raw.job_address)) || null,
    job_category: (categoryUuid && CATEGORY_BY_UUID[categoryUuid]) || 'Combo',
    // Phase 1: empty on purpose — the SM8 description carries an internal GHL link, never shown to subs.
    // Phase 2 sources the real (stripped) work-scope. Do NOT set this to the raw description.
    scope: '',
    required_photos: [],
    sm8_status: stripContact(strictStr(raw.status)) || null,
    sm8_queue_uuid: uuidOrNull(raw.queue_uuid),
    last_synced_at: nowIso,
  };
}

/** Fail-closed gate: throw if any human-readable field still carries contact after filtering.
 *  Excludes UUIDs/timestamps (their digit runs aren't contact). Run before any upsert/return. */
export function assertNoContact(mirror: JobMirrorRow): void {
  const human = [
    mirror.customer_name,
    mirror.job_address,
    mirror.generated_job_id,
    mirror.scope,
    mirror.sm8_status,
  ].filter((s): s is string => typeof s === 'string' && s.length > 0).join('\n');
  if (containsPii(human)) {
    throw new Error('contact-filter: PII survived filtering — refusing to expose');
  }
}
