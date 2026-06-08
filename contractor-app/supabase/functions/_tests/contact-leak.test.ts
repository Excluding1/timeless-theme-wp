// Contact-leak CI — Layer A (unit). PHASE-1-PLAN.md. Build-blocking.
// Hardened 2026-06-09 (Cleo review): obfuscated / unicode / international contact + array-shape
// smuggling + a fail-closed gate. Dependency-free (inline asserts), runs offline. Via test.sh.
import { sm8JobToMirror, stripContact, containsPii, assertNoContact } from '../_shared/contactFilter.ts';

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error('ASSERT FAILED: ' + msg);
}
function assertEquals<T>(a: T, b: T, msg: string) {
  if (a !== b) throw new Error(`ASSERT FAILED ${msg}: ${JSON.stringify(a)} !== ${JSON.stringify(b)}`);
}

const NOW = '2026-06-09T00:00:00.000Z';
const UUID = '550e8400-e29b-41d4-a716-446655440000';

// POISONED job: phone + email in the name line, description, address, and as forbidden top-level keys.
const poisoned: Record<string, unknown> = {
  uuid: UUID,
  generated_job_id: 'JOB-1042',
  status: 'Work Order',
  queue_uuid: '7bbcd459-ccb6-46e0-abe3-243e55bbe33b',
  category_uuid: 'dde365f8-0ec9-4995-b813-243f9a427cdb', // Resurfacing
  job_address: '42 Wallaby Way, Surry Hills NSW 2010, call 0451 110 154',
  job_description:
    'Jane Smith jane.smith@example.com\n- Category: Resurfacing\n- Call: 0451 110 154 | GHL opp: abc123 | https://app.gohighlevel.com/v2/location/Uz8/contacts/detail/xyz',
  email: 'jane.smith@example.com',
  phone: '+61451110154',
  mobile: '0451110154',
  customer_email: 'jane.smith@example.com',
  customer_phone: '0451110154',
  jobcontact: { mobile: '0451110154', email: 'jane.smith@example.com' },
  company_uuid: 'company-xyz',
};

Deno.test('mirror passes the fail-closed gate (no contact in any human field)', () => {
  assertNoContact(sm8JobToMirror(poisoned, NOW)); // throws if any contact survives
});

Deno.test('name survives; contact does not', () => {
  const m = sm8JobToMirror(poisoned, NOW);
  assert((m.customer_name ?? '').startsWith('Jane Smith'), 'name kept');
  assert(!(m.customer_name ?? '').includes('@'), 'no email in name');
  assert(!containsPii(m.customer_name ?? ''), 'no contact in name');
});

Deno.test('address survives but its phone is stripped', () => {
  const m = sm8JobToMirror(poisoned, NOW);
  assert((m.job_address ?? '').includes('Wallaby Way'), 'address kept');
  assert(!containsPii(m.job_address ?? ''), 'no phone left in address');
});

Deno.test('category mapped from uuid; bad uuid -> Combo', () => {
  assertEquals(sm8JobToMirror(poisoned, NOW).job_category, 'Resurfacing', 'uuid -> name');
  assertEquals(sm8JobToMirror({ ...poisoned, category_uuid: 'nope' }, NOW).job_category, 'Combo', 'invalid -> Combo');
});

Deno.test('scope leaks neither the internal GHL link nor contact', () => {
  const m = sm8JobToMirror(poisoned, NOW);
  assert(!m.scope.includes('gohighlevel'), 'no internal GHL link in scope');
  assert(!containsPii(m.scope), 'no contact in scope');
});

Deno.test('the mirror object has NO contact keys at all', () => {
  const m = sm8JobToMirror(poisoned, NOW) as unknown as Record<string, unknown>;
  for (const k of ['email', 'phone', 'mobile', 'customer_phone', 'customer_email', 'jobcontact', 'company_uuid', 'contacts', 'billing_email']) {
    assert(!(k in m), `mirror must not have key "${k}"`);
  }
});

Deno.test('detects obfuscated / unicode / international contact (Cleo cases)', () => {
  assert(containsPii('０４５１ １１０ １５４'), 'fullwidth-digit phone'); // NFKC -> 0451 110 154
  assert(containsPii('jane​@example.com'), 'zero-width inside email');
  assert(containsPii('jane @ example.com'), 'spaced @ email');
  assert(containsPii('jane at example dot com'), 'at/dot email');
  assert(containsPii('jane [at] example [dot] com'), 'bracketed at/dot email');
  assert(containsPii('+1 415 555 1212'), 'US phone');
  assert(containsPii('+64 21 123 4567'), 'NZ phone');
  assert(!containsPii('John Smith'), 'plain name is not contact');
  assert(!containsPii('42 Wallaby Way, Surry Hills NSW 2010'), 'address + postcode is not contact');
  assert(!containsPii('Bath resurface, repair minor chips'), 'plain scope is not contact');
});

Deno.test('rejects PII smuggled via array / object shapes', () => {
  const shapes: Record<string, unknown> = {
    uuid: UUID,
    generated_job_id: ['jane@example.com'],    // array -> null
    status: ['0451 110 154'],                  // array -> null
    job_address: { line1: 'call 0451110154' }, // object -> null
    category_uuid: 'dde365f8-0ec9-4995-b813-243f9a427cdb',
    job_description: 'Jane Smith\n- Category: Resurfacing',
  };
  const m = sm8JobToMirror(shapes, NOW);
  assertNoContact(m); // must not throw
  assertEquals(m.generated_job_id, null, 'array generated_job_id -> null');
  assertEquals(m.sm8_status, null, 'array status -> null');
  assertEquals(m.job_address, null, 'object address -> null');
});

Deno.test('assertNoContact is fail-closed (throws if contact survives)', () => {
  const bad = sm8JobToMirror({ uuid: UUID, job_description: 'Jane Smith' }, NOW);
  (bad as { job_address: string }).job_address = 'reach me on 0451 110 154'; // simulate a filter miss
  let threw = false;
  try { assertNoContact(bad); } catch { threw = true; }
  assert(threw, 'assertNoContact must throw on surviving contact');
});

Deno.test('stripContact redacts contact, leaves safe text', () => {
  assertEquals(stripContact('call 0451 110 154 now'), 'call [removed] now', 'phone stripped');
  assert(!stripContact('email jane@x.com please').includes('@'), 'email stripped');
  assertEquals(stripContact('Bath resurface, repair chips'), 'Bath resurface, repair chips', 'safe text untouched');
});
