// job-actions — accept / decline / availability / hand-back / complete / undo / problem.
// verify_jwt=true (gateway). The JWT identifies the sub; we (1) prove they OWN the assignment, then
// (2) apply the transition ATOMICALLY via a compare-and-set update (status IN allowedFrom) so two
// concurrent requests can't both transition (Cleo P0#3).
// COMPLETE goes through the complete_assignment() RPC, which CAS-completes + (only if it was the LAST
// live part) enqueues the SM8 write in ONE txn (P0#1 last-assignment-only + P0#2 durable outbox); we
// then best-effort POST status=Completed to SM8 in the background (durably retried by `reconcile`).
import { createClient, type SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';
import { json, fail } from '../_shared/respond.ts';
import { preflight } from '../_shared/cors.ts';
import { updateJob } from '../_shared/sm8Client.ts';
import { UUID_RE, parseAvailability, cleanReason } from '../_shared/validate.ts';
import { rateLimited } from '../_shared/rateLimit.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const ANON = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

type Row = Record<string, unknown>;
const nowIso = () => new Date().toISOString();

/** Best-effort: push status=Completed to SM8 NOW; on failure leave the outbox row pending for reconcile.
 *  The completion is ALREADY durable (assignment=completed + outbox row committed in the RPC txn) — this
 *  is just the fast path, run AFTER we ACK the sub, so it never blocks them (Fair-Work: no app gating). */
async function sendCompletedNow(svc: SupabaseClient, jobUuid: string): Promise<void> {
  try {
    await updateJob(jobUuid, { status: 'Completed' });
    await svc.from('sm8_write_outbox')
      .update({ status: 'sent', sent_at: nowIso() })
      .eq('sm8_job_uuid', jobUuid).eq('target_kind', 'status').eq('target_value', 'Completed')
      .neq('status', 'sent');
  } catch (e) {
    // Stays pending -> reconcile retries with backoff. Soft-delay next attempt; don't touch attempts.
    await svc.from('sm8_write_outbox')
      .update({
        last_error: String((e as Error).message).slice(0, 200),
        next_attempt_at: new Date(Date.now() + 60_000).toISOString(),
      })
      .eq('sm8_job_uuid', jobUuid).eq('target_kind', 'status').eq('target_value', 'Completed')
      .eq('status', 'pending');
  }
}

Deno.serve(async (req) => {
  const pre = preflight(req);
  if (pre) return pre;
  const origin = req.headers.get('origin');
  if (req.method !== 'POST') return fail(405, 'method_not_allowed', origin);

  const authz = req.headers.get('Authorization') ?? '';
  if (!authz.startsWith('Bearer ')) return fail(401, 'unauthorized', origin);

  let body: Row = {};
  try { body = await req.json(); } catch { return fail(400, 'bad_body', origin); }
  const action = String(body.action ?? '');
  const id = String(body.id ?? '');
  const payload = (body.payload ?? {}) as Row;
  if (!UUID_RE.test(id)) return fail(400, 'missing_id', origin); // non-uuid was an opaque DB error

  // Who is the sub? (user-JWT client -> RLS returns only their own subs row)
  const userClient = createClient(SUPABASE_URL, ANON, {
    global: { headers: { Authorization: authz } },
    auth: { persistSession: false },
  });
  const { data: sub } = await userClient.from('subs').select('id').limit(1).maybeSingle();
  if (!sub?.id) return fail(403, 'no_sub', origin);
  const subId = sub.id as string;

  // Per-sub brake (best-effort, per-instance): no legitimate tradie fires 60 job actions a minute.
  if (rateLimited(`ja:${subId}`, 60)) return fail(429, 'rate_limited', origin);

  // Service-role for the write — but only after we prove ownership + a legal transition.
  const svc = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });

  // Ownership gate (404 hides the existence of others' assignments). NOT the transition guard — the
  // atomic CAS (below) / the RPC's WHERE clause is the real guard.
  const { data: asg } = await svc.from('job_assignments').select('id, sub_id').eq('id', id).maybeSingle();
  if (!asg || asg.sub_id !== subId) return fail(404, 'not_found', origin);

  // ── COMPLETE: atomic CAS + last-part enqueue in one txn, then best-effort background SM8 push. ──
  if (action === 'complete') {
    const { data: res, error } = await svc.rpc('complete_assignment', { p_assignment_id: id, p_sub_id: subId });
    if (error) return fail(500, 'update_failed', origin);
    const r = (res ?? {}) as Row;
    if (r.ok !== true) return fail(409, 'not_completable', origin);
    if (r.last_completion === true && typeof r.sm8_job_uuid === 'string') {
      const jobUuid = r.sm8_job_uuid;
      // ACK the sub now; sync SM8 after (the outbox guarantees eventual delivery even if this fails).
      // @ts-ignore — EdgeRuntime is injected by the Supabase Edge runtime, absent in local `deno test`.
      if (typeof EdgeRuntime !== 'undefined') EdgeRuntime.waitUntil(sendCompletedNow(svc, jobUuid));
      else await sendCompletedNow(svc, jobUuid);
    }
    return json({ ok: true, status: 'completed' }, 200, origin);
  }

  // ── All other actions: build (patch, allowedFrom) then a single compare-and-set update. ──
  const patch: Row = {};
  let allowedFrom: string[];

  switch (action) {
    case 'accept':
      patch.status = 'accepted'; patch.accepted_at = nowIso();
      allowedFrom = ['offered'];
      break;
    case 'decline':
      patch.status = 'declined'; patch.declined_at = nowIso();
      patch.decline_reason = cleanReason(payload.reason);
      allowedFrom = ['offered'];
      break;
    case 'availability': {
      // STRICT shape only — the jsonb column must never become an unbounded blob store.
      const window = parseAvailability(payload.window ?? payload);
      if (!window) return fail(400, 'bad_availability', origin);
      patch.sub_availability = window;
      allowedFrom = ['accepted'];
      break;
    }
    case 'handback':
      patch.status = 'reoffered';
      patch.decline_reason = cleanReason(payload.reason);
      allowedFrom = ['accepted', 'in_progress'];
      break;
    case 'undo': // the 5s undo window after accept
      patch.status = 'offered'; patch.accepted_at = null;
      patch.sub_availability = null; // don't carry stale availability into a future re-accept
      allowedFrom = ['accepted'];
      break;
    case 'problem': {
      patch.problem_open = true;
      // Keep the free-text note ("Something else" reports are useless without it).
      const reason = cleanReason(payload.reason, 200) ?? '';
      const note = cleanReason(payload.note, 500);
      patch.problem_reason = (reason + (note ? ` — ${note}` : '')) || null;
      allowedFrom = ['accepted', 'in_progress'];
      break;
    }
    default:
      return fail(400, 'unknown_action', origin);
  }

  // Compare-and-set: transition ONLY if still in an allowed source state (atomic; a concurrent dup or a
  // stale retry matches 0 rows -> 409, never a double-transition).
  const { data: updated, error } = await svc
    .from('job_assignments')
    .update(patch)
    .eq('id', id)
    .eq('sub_id', subId)
    .in('status', allowedFrom)
    .select('status');
  if (error) return fail(500, 'update_failed', origin);
  if (!updated || updated.length === 0) return fail(409, 'invalid_transition', origin);

  return json({ ok: true, status: updated[0].status ?? null }, 200, origin);
});
