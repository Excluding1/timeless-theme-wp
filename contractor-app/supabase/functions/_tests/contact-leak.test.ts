// Contact-leak CI — Layer A (unit). PHASE-1-PLAN.md §"Contact-leak CI". Build-blocking.
// Feeds sm8JobToMirror() deliberately POISONED jobs and asserts the output carries no email/phone,
// no internal GHL link, and no forbidden keys — while name/address/category survive.
// Dependency-free (inline asserts) so it runs offline + fast. Run: `deno test` in supabase/functions/.
import { sm8JobToMirror, stripContact, containsPii } from '../_shared/contactFilter.ts';

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error('ASSERT FAILED: ' + msg);
}
function assertEquals<T>(a: T, b: T, msg: string) {
  if (a !== b) throw new Error(`ASSERT FAILED ${msg}: ${JSON.stringify(a)} !== ${JSON.stringify(b)}`);
}

const NOW = '2026-06-09T00:00:00.000Z';

// A deliberately POISONED raw SM8 job: phone + email smuggled into the name line, the description,
// the address, AND present as the forbidden top-level keys the filter must never read.
const poisoned: Record<string, unknown> = {
  uuid: 'job-uuid-1',
  generated_job_id: 'JOB-1042',
  status: 'Work Order',
  queue_uuid: '7bbcd459-ccb6-46e0-abe3-243e55bbe33b',
  category_uuid: 'dde365f8-0ec9-4995-b813-243f9a427cdb', // Resurfacing
  job_address: '42 Wallaby Way, Surry Hills NSW 2010 — call 0451 110 154',
  job_description:
    'Jane Smith jane.smith@example.com\n— Category: Resurfacing\n— Call: 0451 110 154 | GHL opp: abc123 | https://app.gohighlevel.com/v2/location/Uz8/contacts/detail/xyz',
  // Forbidden keys — must NEVER be read by the allowlist:
  email: 'jane.smith@example.com',
  phone: '+61451110154',
  mobile: '0451110154',
  customer_email: 'jane.smith@example.com',
  customer_phone: '0451110154',
  jobcontact: { mobile: '0451110154', email: 'jane.smith@example.com' },
  company_uuid: 'company-xyz',
};

Deno.test('mirror output carries NO email or phone (the core guarantee)', () => {
  const mirror = sm8JobToMirror(poisoned, NOW);
  assert(!containsPii(mirror), 'serialized mirror must contain no email/phone: ' + JSON.stringify(mirror));
});

Deno.test('name survives; contact does not', () => {
  const mirror = sm8JobToMirror(poisoned, NOW);
  assert((mirror.customer_name ?? '').startsWith('Jane Smith'), 'customer name kept');
  assert(!(mirror.customer_name ?? '').includes('@'), 'no email in name');
  assert(!/\d{4,}/.test(mirror.customer_name ?? ''), 'no long digit run in name');
});

Deno.test('address survives but any phone in it is stripped', () => {
  const mirror = sm8JobToMirror(poisoned, NOW);
  assert((mirror.job_address ?? '').includes('Wallaby Way'), 'address kept');
  assert(!containsPii(mirror.job_address ?? ''), 'no phone left in address');
});

Deno.test('category mapped from uuid → name', () => {
  assertEquals(sm8JobToMirror(poisoned, NOW).job_category, 'Resurfacing', 'category uuid → name');
});

Deno.test('scope leaks neither the internal GHL link nor contact', () => {
  const mirror = sm8JobToMirror(poisoned, NOW);
  assert(!mirror.scope.includes('gohighlevel'), 'no internal GHL link in sub-facing scope');
  assert(!mirror.scope.includes('@'), 'no email in scope');
  assert(!containsPii(mirror.scope), 'no phone in scope');
});

Deno.test('the mirror object has NO contact keys at all', () => {
  const mirror = sm8JobToMirror(poisoned, NOW) as unknown as Record<string, unknown>;
  for (const k of [
    'email', 'phone', 'mobile', 'customer_phone', 'customer_email',
    'jobcontact', 'company_uuid', 'contacts', 'billing_email',
  ]) {
    assert(!(k in mirror), `mirror must not have key "${k}"`);
  }
});

Deno.test('stripContact + containsPii — known PII vs safe strings', () => {
  assert(containsPii('reach me at jane@example.com'), 'detects email');
  assert(containsPii('0451 110 154'), 'detects spaced mobile');
  assert(containsPii('+61451110154'), 'detects +61 mobile');
  assert(containsPii('(02) 9098 0347'), 'detects landline');
  assert(!containsPii('42 Wallaby Way, Surry Hills NSW 2010'), 'address w/ postcode is NOT pii');
  assert(!containsPii('Bath resurface, repair minor chips'), 'plain scope is not pii');
  assertEquals(stripContact('call 0451 110 154 now'), 'call [removed] now', 'phone stripped');
  assert(!stripContact('email jane@x.com please').includes('@'), 'email stripped');
});
