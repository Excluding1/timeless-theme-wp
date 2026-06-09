// Write-back CI — updateJob() hardening (Cleo 2026-06-09 review of the SM8 WRITE path):
//   • allowlist body — customer contact can NEVER ride along on a write (P1#6 / D)
//   • URL reconstructed + host-pinned (not caller-supplied)
//   • manual-redirect: a 3xx is refused, never followed (P1#5 / E)
//   • SM8 app-level errorCode != 0 is treated as failure
// Dependency-free (inline asserts); runs offline (globalThis.fetch is stubbed — no network). Via test.sh.
import { updateJob } from '../_shared/sm8Client.ts';

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error('ASSERT FAILED: ' + msg);
}
function assertEquals<T>(a: T, b: T, msg: string) {
  if (a !== b) throw new Error(`ASSERT FAILED ${msg}: ${JSON.stringify(a)} !== ${JSON.stringify(b)}`);
}
async function assertThrows(fn: () => Promise<unknown>, msg: string) {
  let threw = false;
  try { await fn(); } catch { threw = true; }
  assert(threw, msg);
}

const UUID = '550e8400-e29b-41d4-a716-446655440000';
Deno.env.set('SM8_API_KEY', 'test-key'); // updateJob reads this for the X-API-Key header

type Captured = { url: string; init: RequestInit };
function stubFetch(resp: Response): { calls: Captured[]; restore: () => void } {
  const calls: Captured[] = [];
  const original = globalThis.fetch;
  globalThis.fetch = ((input: string | URL | Request, init?: RequestInit) => {
    calls.push({ url: String(input), init: init ?? {} });
    return Promise.resolve(resp.clone());
  }) as typeof fetch;
  return { calls, restore: () => { globalThis.fetch = original; } };
}

Deno.test('updateJob rejects an invalid job UUID (never fetches)', async () => {
  const s = stubFetch(new Response('{}', { status: 200 }));
  try {
    await assertThrows(() => updateJob('not-a-uuid', { status: 'Completed' }), 'bad uuid must throw');
    assertEquals(s.calls.length, 0, 'must not fetch on bad uuid');
  } finally { s.restore(); }
});

Deno.test('updateJob rejects a body with no writable fields (never fetches)', async () => {
  const s = stubFetch(new Response('{}', { status: 200 }));
  try {
    await assertThrows(() => updateJob(UUID, { foo: 'bar', job_description: 'x' }), 'no writable fields must throw');
    assertEquals(s.calls.length, 0, 'must not fetch when nothing is writable');
  } finally { s.restore(); }
});

Deno.test('updateJob writes ONLY allowlisted fields — contact cannot ride along', async () => {
  const s = stubFetch(new Response(JSON.stringify({ errorCode: 0, message: 'OK' }), {
    status: 200, headers: { 'content-type': 'application/json' },
  }));
  try {
    await updateJob(UUID, {
      status: 'Completed',
      // hostile extras that MUST be dropped:
      customer_phone: '0451 110 154', email: 'leak@example.com', job_description: 'call 0451110154',
    } as Record<string, unknown>);
    assertEquals(s.calls.length, 1, 'exactly one fetch');
    const c = s.calls[0];
    assertEquals(c.url, `https://api.servicem8.com/api_1.0/job/${UUID}.json`, 'reconstructed host-pinned URL');
    assertEquals(String(c.init.method), 'POST', 'POST');
    assertEquals(String(c.init.redirect), 'manual', 'manual redirect — no method/body/key forwarding');
    assertEquals(String(c.init.body), '{"status":"Completed"}', 'body is ONLY status — no contact, no extra keys');
  } finally { s.restore(); }
});

Deno.test('updateJob refuses a 3xx redirect (never follows it)', async () => {
  const s = stubFetch(new Response('', { status: 302, headers: { location: 'https://evil.example/x' } }));
  try {
    await assertThrows(() => updateJob(UUID, { status: 'Completed' }), '3xx must throw, not follow');
  } finally { s.restore(); }
});

Deno.test('updateJob throws on SM8 app-level errorCode != 0', async () => {
  const s = stubFetch(new Response(JSON.stringify({ errorCode: 5, message: 'bad' }), {
    status: 200, headers: { 'content-type': 'application/json' },
  }));
  try {
    await assertThrows(() => updateJob(UUID, { status: 'Completed' }), 'errorCode!=0 must throw');
  } finally { s.restore(); }
});
