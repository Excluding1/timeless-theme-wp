// push — Phase 5: push-subscription management for the PWA.
// verify_jwt=true (gateway): every call is an authenticated sub. Actions:
//   vapid-key   -> the base64url applicationServerKey the browser needs to subscribe
//   subscribe   -> store/refresh this device's PushSubscription (upsert on endpoint)
//   unsubscribe -> revoke this device's subscription (sign-out / toggle off)
// Endpoints are validated (https, sane length) but otherwise opaque — we never fetch them here;
// only _shared/webpush.ts POSTs to them, with a VAPID-signed, encrypted payload.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';
import { json, fail } from '../_shared/respond.ts';
import { preflight } from '../_shared/cors.ts';
import { vapidPublicKey } from '../_shared/webpush.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const ANON = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

const B64URL_RE = /^[A-Za-z0-9_-]+$/;

function validEndpoint(v: unknown): v is string {
  if (typeof v !== 'string' || v.length < 20 || v.length > 1500) return false;
  try { return new URL(v).protocol === 'https:'; } catch { return false; }
}

function validKey(v: unknown, max: number): v is string {
  return typeof v === 'string' && v.length > 0 && v.length <= max && B64URL_RE.test(v);
}

Deno.serve(async (req) => {
  const pre = preflight(req);
  if (pre) return pre;
  const origin = req.headers.get('origin');
  if (req.method !== 'POST') return fail(405, 'method_not_allowed', origin);

  const authz = req.headers.get('Authorization') ?? '';
  if (!authz.startsWith('Bearer ')) return fail(401, 'unauthorized', origin);

  let body: Record<string, unknown> = {};
  try { body = await req.json(); } catch { return fail(400, 'bad_body', origin); }
  const action = String(body.action ?? '');

  if (action === 'vapid-key') {
    const key = await vapidPublicKey();
    if (!key) return fail(503, 'push_not_configured', origin);
    return json({ ok: true, key }, 200, origin);
  }

  // Who is the sub? (user-JWT client -> RLS returns only their own subs row)
  const userClient = createClient(SUPABASE_URL, ANON, {
    global: { headers: { Authorization: authz } },
    auth: { persistSession: false },
  });
  const { data: sub } = await userClient.from('subs').select('id').limit(1).maybeSingle();
  if (!sub?.id) return fail(403, 'no_sub', origin);
  const subId = sub.id as string;

  const svc = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });

  if (action === 'subscribe') {
    const s = (body.subscription ?? {}) as Record<string, unknown>;
    const keys = (s.keys ?? {}) as Record<string, unknown>;
    if (!validEndpoint(s.endpoint)) return fail(400, 'bad_endpoint', origin);
    if (!validKey(keys.p256dh, 256) || !validKey(keys.auth, 64)) return fail(400, 'bad_keys', origin);

    const { error } = await svc.from('push_subscriptions').upsert({
      sub_id: subId,           // endpoint moved to a new login? it follows the current sub
      endpoint: s.endpoint,
      p256dh: keys.p256dh,
      auth: keys.auth,
      user_agent: (req.headers.get('user-agent') ?? '').slice(0, 300),
      last_used_at: new Date().toISOString(),
      revoked_at: null,
    }, { onConflict: 'endpoint' });
    if (error) return fail(500, 'subscribe_failed', origin);
    return json({ ok: true }, 200, origin);
  }

  if (action === 'unsubscribe') {
    if (!validEndpoint(body.endpoint)) return fail(400, 'bad_endpoint', origin);
    const { error } = await svc.from('push_subscriptions')
      .update({ revoked_at: new Date().toISOString() })
      .eq('endpoint', body.endpoint)
      .eq('sub_id', subId); // you can only revoke your own device
    if (error) return fail(500, 'unsubscribe_failed', origin);
    return json({ ok: true }, 200, origin);
  }

  return fail(400, 'unknown_action', origin);
});
