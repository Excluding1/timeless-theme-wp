// messages-inbound — the Make relay's write path for CUSTOMER -> sub chat.
// Contract (README "Chat relay — Make wiring contract"):
//   POST /functions/v1/messages-inbound   header x-relay-secret: <RELAY_WEBHOOK_SECRET>  (or ?s=)
//   body { "job_id": "<sm8 job uuid>", "body": "<customer text>" }
//   -> 200 {ok:true, message_id}  · 401 bad secret · 404 unknown job · 422 body still carried
//      contact after stripping (alert the office; do NOT retry) · 400 malformed
// The body is stripContact'd BEFORE insert, and the DB trigger re-checks — a leaked phone number can
// never be STORED, let alone shown. verify_jwt=false (Make can't send a Supabase JWT).
import { createClient, type SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';
import { json, fail } from '../_shared/respond.ts';
import { secureCompare } from '../_shared/secure.ts';
import { stripContact } from '../_shared/contactFilter.ts';
import { suburbFrom } from '../_shared/address.ts';
import { sendPush, type PushRow } from '../_shared/webpush.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const RELAY_SECRET = Deno.env.get('RELAY_WEBHOOK_SECRET') ?? '';

const UUID_RE = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

function secretOk(req: Request): boolean {
  const got = req.headers.get('x-relay-secret') ?? new URL(req.url).searchParams.get('s') ?? '';
  return RELAY_SECRET.length > 0 && secureCompare(got, RELAY_SECRET);
}

/** Push "new message" to every sub holding this job — generic payload, no message content
 *  (a lock screen is not a trusted surface) and certainly no customer identifiers. */
async function notifySubs(svc: SupabaseClient, jobUuid: string, suburb: string): Promise<void> {
  try {
    const { data: holders } = await svc.from('job_assignments')
      .select('sub_id')
      .eq('sm8_job_uuid', jobUuid)
      .in('status', ['accepted', 'in_progress']);
    const subIds = [...new Set((holders ?? []).map((h) => String(h.sub_id)))];
    if (subIds.length === 0) return;
    const { data: subs } = await svc.from('push_subscriptions')
      .select('id, endpoint, p256dh, auth')
      .in('sub_id', subIds)
      .is('revoked_at', null);
    const rows = (subs ?? []) as unknown as PushRow[];
    const { gone } = await sendPush(rows, {
      title: 'New message',
      body: suburb ? `About your ${suburb} job — open the app to read it.` : 'Open the app to read it.',
      url: '/',
      tag: `msg-${jobUuid}`,
    });
    if (gone.length > 0) {
      await svc.from('push_subscriptions')
        .update({ revoked_at: new Date().toISOString() })
        .in('id', gone);
    }
  } catch { /* push is best-effort; the unread badge still shows it */ }
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return fail(405, 'method_not_allowed');
  if (!secretOk(req)) return fail(401, 'unauthorized');

  let body: Record<string, unknown> = {};
  try { body = await req.json(); } catch { return fail(400, 'bad_body'); }

  const jobId = String(body.job_id ?? '');
  const raw = typeof body.body === 'string' ? body.body : '';
  if (!UUID_RE.test(jobId)) return fail(400, 'bad_job_id');
  if (raw.trim().length === 0 || raw.length > 2000) return fail(400, 'bad_message');

  // Strip contact BEFORE storage — the relay must never persist a leaked number in either direction.
  const cleaned = stripContact(raw);
  const text = cleaned.trim().length > 0 ? cleaned.trim() : '[message removed — it only contained contact details]';

  const svc = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });

  const { data: mirror } = await svc.from('job_mirror')
    .select('sm8_job_uuid, job_address').eq('sm8_job_uuid', jobId.toLowerCase()).maybeSingle();
  if (!mirror) return fail(404, 'unknown_job');

  const { data: inserted, error } = await svc.from('job_messages')
    .insert({ sm8_job_uuid: jobId.toLowerCase(), sender: 'customer', kind: 'chat', body: text })
    .select('id');
  if (error) {
    // The DB trigger re-checked and still found contact -> tell Make loudly; never store it.
    if ((error.message ?? '').includes('contact_blocked')) return fail(422, 'contact_blocked');
    return fail(500, 'insert_failed');
  }

  await notifySubs(svc, jobId.toLowerCase(), suburbFrom((mirror.job_address as string) ?? null));

  return json({ ok: true, message_id: inserted?.[0]?.id ?? null });
});
