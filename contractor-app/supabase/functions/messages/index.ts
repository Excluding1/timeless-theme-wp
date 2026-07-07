// messages — the sub side of the masked chat relay (booking-coordination plan Phase 2).
// verify_jwt=true (gateway). Actions (POST {action, assignment_id, ...}):
//   list -> the thread + unread count      send -> insert a sender='sub' row (RLS + DB trigger enforce)
//   read -> mark customer rows read        eta  -> set eta on the assignment + insert the 'eta' message
// The DB trigger is the real guard (contact-leak / rate limit / kill switch); we just translate its
// errors into stable codes the app can phrase kindly. Sub messages are relayed to the customer by
// Make via GHL, FROM THE BUSINESS NUMBER — neither side ever sees the other's contact details.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';
import { json, fail } from '../_shared/respond.ts';
import { preflight } from '../_shared/cors.ts';
import { rateLimited } from '../_shared/rateLimit.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const ANON = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

const UUID_RE = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
const ETA_CHOICES = new Set([15, 30, 45, 60]);
const nowIso = () => new Date().toISOString();

/** Map a DB-trigger RAISE into the stable code the app phrases for the sub. */
function guardError(message: string): { status: number; code: string } | null {
  if (message.includes('contact_blocked')) return { status: 422, code: 'contact_blocked' };
  if (message.includes('rate_limited')) return { status: 429, code: 'rate_limited' };
  if (message.includes('chat_disabled')) return { status: 403, code: 'chat_disabled' };
  return null;
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
  const assignmentId = String(body.assignment_id ?? '');
  if (!UUID_RE.test(assignmentId)) return fail(404, 'not_found', origin);

  // Who is the sub? (user-JWT client -> RLS scopes everything to them)
  const userClient = createClient(SUPABASE_URL, ANON, {
    global: { headers: { Authorization: authz } },
    auth: { persistSession: false },
  });
  const { data: sub } = await userClient.from('subs').select('id').limit(1).maybeSingle();
  if (!sub?.id) return fail(403, 'no_sub', origin);
  const subId = sub.id as string;

  // Per-sub brake (the HARD send limits are the DB trigger: 10/hr + 30/day per job).
  if (rateLimited(`msg:${subId}`, 60)) return fail(429, 'rate_limited', origin);

  const svc = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });

  // Ownership gate: the assignment must be THIS sub's (404 hides others' assignments).
  const { data: asg } = await svc.from('job_assignments')
    .select('id, sub_id, status, sm8_job_uuid')
    .eq('id', assignmentId).maybeSingle();
  if (!asg || asg.sub_id !== subId) return fail(404, 'not_found', origin);
  const jobUuid = String(asg.sm8_job_uuid);
  const live = ['accepted', 'in_progress'].includes(String(asg.status));

  if (action === 'list') {
    // Read AS the sub — RLS is the second lock on the thread.
    const { data, error } = await userClient.from('job_messages')
      .select('id, sender, kind, body, created_at, read_at')
      .eq('sm8_job_uuid', jobUuid)
      .order('created_at', { ascending: true })
      .limit(200);
    if (error) return fail(500, 'query_failed', origin);
    const messages = data ?? [];
    const unread = messages.filter((m) => m.sender === 'customer' && !m.read_at).length;
    return json({ ok: true, messages, unread, chat_enabled: true }, 200, origin);
  }

  if (action === 'send') {
    if (!live) return fail(409, 'not_active', origin);
    const text = typeof body.body === 'string' ? body.body.trim() : '';
    if (text.length === 0 || text.length > 2000) return fail(400, 'bad_message', origin);
    // Insert AS the sub: RLS pins sender/sub_id/job; the DB trigger enforces the guards.
    const { error } = await userClient.from('job_messages').insert({
      sm8_job_uuid: jobUuid, sub_id: subId, sender: 'sub', kind: 'chat', body: text,
    });
    if (error) {
      const g = guardError(error.message ?? '');
      if (g) return fail(g.status, g.code, origin);
      return fail(500, 'send_failed', origin);
    }
    return json({ ok: true }, 200, origin);
  }

  if (action === 'eta') {
    if (!live) return fail(409, 'not_active', origin);
    const minutes = Number(body.minutes);
    if (!ETA_CHOICES.has(minutes)) return fail(400, 'bad_eta', origin);
    // The message is the customer-facing artefact — insert it FIRST (trigger may refuse), then
    // record the ETA on the assignment. Make relays kind='eta' rows immediately.
    const { error: msgErr } = await userClient.from('job_messages').insert({
      sm8_job_uuid: jobUuid, sub_id: subId, sender: 'sub', kind: 'eta',
      body: `On my way — arriving in about ${minutes} minutes.`,
    });
    if (msgErr) {
      const g = guardError(msgErr.message ?? '');
      if (g) return fail(g.status, g.code, origin);
      return fail(500, 'send_failed', origin);
    }
    const { error: etaErr } = await svc.from('job_assignments')
      .update({ eta_minutes: minutes, eta_sent_at: nowIso() })
      .eq('id', assignmentId).eq('sub_id', subId)
      .in('status', ['accepted', 'in_progress']);
    if (etaErr) return fail(500, 'eta_failed', origin);
    return json({ ok: true, eta_minutes: minutes, eta_sent_at: nowIso() }, 200, origin);
  }

  if (action === 'read') {
    const { error } = await svc.from('job_messages')
      .update({ read_at: nowIso() })
      .eq('sm8_job_uuid', jobUuid)
      .eq('sender', 'customer')
      .is('read_at', null);
    if (error) return fail(500, 'read_failed', origin);
    return json({ ok: true }, 200, origin);
  }

  return fail(400, 'unknown_action', origin);
});
