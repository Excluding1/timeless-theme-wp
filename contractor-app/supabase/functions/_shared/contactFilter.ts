// _shared/contactFilter.ts — THE security core (PHASE-1-PLAN.md §2, non-negotiable #2).
// The ONLY code that turns a raw ServiceM8 job into a job_mirror row. Three layered guarantees:
//   1. ALLOWLIST — fields are read by name below; never `...raw`, never a denylist. Customer
//      phone/email/mobile/jobcontact/company_* are NEVER referenced here.
//   2. NO CONTACT COLUMNS — the job_mirror table (migration 0001) physically has no phone/email
//      column, so a leak can't even be stored.
//   3. stripContact() — defence in depth: scrub email/phone-looking text from free fields, so we
//      stay leak-proof even if an upstream (the Make strip-contact change) ever regresses.
//
// SM8 job shape grounded in docs/specs/make-scenario-1-main-build.md (B4): the post-strip
// job_description = "<customer name>\n— Category: <cat>\n— GHL opp: <id> | <internal GHL link>".
// It carries NO work-scope, and DOES carry an internal GHL deep-link → we take the name from line 1,
// the category from category_uuid, and deliberately DO NOT pass the description into the sub-facing
// `scope` (that would leak the internal link). Real scope-of-work source = Phase-2 wiring decision.

export const EMAIL_RE = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
// AU phone: +61… or 0…, ~9–10 digits, tolerant of spaces / dots / hyphens / parens.
export const AU_PHONE_RE = /(?:\+?61|0)[\s.\-()]*(?:\d[\s.\-()]*){8,9}\d/g;

/** True if the serialized value contains an email or AU phone number. (CI assertion + runtime guard.) */
export function containsPii(value: unknown): boolean {
  const s = typeof value === 'string' ? value : JSON.stringify(value ?? '');
  // Fresh RegExp each call — the /g flag is stateful (lastIndex) and would desync across calls.
  return new RegExp(EMAIL_RE.source, 'g').test(s) || new RegExp(AU_PHONE_RE.source, 'g').test(s);
}

/** Redact email/phone-looking substrings from free text. */
export function stripContact(text: string | null | undefined): string {
  if (text == null) return '';
  return String(text)
    .replace(new RegExp(EMAIL_RE.source, 'g'), '[removed]')
    .replace(new RegExp(AU_PHONE_RE.source, 'g'), '[removed]')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

/** Recursively scrub string values (for audit_log detail blobs — never persist PII). */
export function scrubPii<T>(value: T): T {
  return JSON.parse(
    JSON.stringify(value, (_k, v) => (typeof v === 'string' ? stripContact(v) : v)),
  ) as T;
}

// The 6 ServiceM8 job categories (UUIDs from make-scenario-1-main-build.md B3 / cockpit servicem8 config).
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
  scope: string;                  // Phase 1: '' (see note above). stripContact'd when populated.
  required_photos: unknown[];     // [] in Phase 1 (derived from job recipes later)
  sm8_status: string | null;
  sm8_queue_uuid: string | null;
  last_synced_at: string;         // ISO
}

type RawSm8Job = Record<string, unknown>;
const str = (v: unknown): string | null =>
  v === null || v === undefined || v === '' ? null : String(v);

/**
 * Build a contact-free job_mirror row from a raw ServiceM8 job.
 * ALLOWLIST ONLY — every field is read by name. To add a field, add it here on purpose; never
 * spread `...raw`. Customer phone/email/mobile/jobcontact/company_* are deliberately never referenced.
 */
export function sm8JobToMirror(raw: RawSm8Job, nowIso: string): JobMirrorRow {
  const description = str(raw.job_description) ?? '';
  const nameLine = description.split('\n')[0] ?? ''; // Make writes the customer name on line 1 (no phone/email)
  const categoryUuid = str(raw.category_uuid);

  return {
    sm8_job_uuid: String(raw.uuid ?? ''),
    generated_job_id: str(raw.generated_job_id),
    customer_name: stripContact(nameLine) || null,
    job_address: stripContact(str(raw.job_address)) || null,
    job_category: (categoryUuid && CATEGORY_BY_UUID[categoryUuid]) || 'Combo',
    // Phase 1: empty on purpose — the SM8 description carries an internal GHL link, never shown to
    // subs. Phase 2 sources the real (stripped) work-scope. Do NOT set this to the raw description.
    scope: '',
    required_photos: [],
    sm8_status: str(raw.status),
    sm8_queue_uuid: str(raw.queue_uuid),
    last_synced_at: nowIso,
  };
}
