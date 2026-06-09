// job-actions — Phase 3 core: accept / decline / availability / hand-back / complete.
// verify_jwt=true (gateway). The JWT identifies the sub; we validate they OWN the assignment and
// that the status transition is legal, then write with service-role. (SM8 write-back — move queue/
// badge on accept, flip SM8 Completed on complete — is the documented fast-follow; this does the
// assignment state machine first so the app is functional.)
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';
import { json, fail } from '../_shared/respond.ts';
import { preflight } from '../_shared/cors.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const ANON = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

type Row = Record<string, unknown>;
const nowIso = () => new Date().toISOString();

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
  if (!id) return fail(400, 'missing_id', origin);

  // Who is the sub? (user-JWT client -> RLS returns only their own subs row)
  const userClient = createClient(SUPABASE_URL, ANON, {
    global: { headers: { Authorization: authz } },
    auth: { persistSession: false },
  });
  const { data: sub } = await userClient.from('subs').select('id').limit(1).maybeSingle();
  if (!sub?.id) return fail(403, 'no_sub', origin);
  const subId = sub.id as string;

  // Service-role for the write — but only after we prove ownership + a legal transition.
  const svc = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });
  const { data: asg } = await svc.from('job_assignments').select('*').eq('id', id).maybeSingle();
  if (!asg || asg.sub_id !== subId) return fail(404, 'not_found', origin);

  const status = String(asg.status);
  const patch: Row = {};

  switch (action) {
    case 'accept':
      if (status !== 'offered') return fail(409, 'not_offered', origin);
      patch.status = 'accepted'; patch.accepted_at = nowIso();
      break;
    case 'decline':
      if (status !== 'offered') return fail(409, 'not_offered', origin);
      patch.status = 'declined'; patch.declined_at = nowIso();
      patch.decline_reason = typeof payload.reason === 'string' ? payload.reason : null;
      break;
    case 'availability':
      if (status !== 'accepted') return fail(409, 'not_accepted', origin);
      patch.sub_availability = payload.window ?? payload ?? null;
      break;
    case 'handback':
      if (status !== 'accepted' && status !== 'in_progress') return fail(409, 'not_accepted', origin);
      patch.status = 'reoffered';
      patch.decline_reason = typeof payload.reason === 'string' ? payload.reason : null;
      break;
    case 'complete':
      if (status !== 'accepted' && status !== 'in_progress') return fail(409, 'not_accepted', origin);
      patch.status = 'completed'; patch.completed_at = nowIso();
      // TODO Phase 3.5: when this job's live-assignment count hits 0, flip the SM8 job to Completed
      // (the existing Make back-sync then fires GHL Stage 15). SM8 write-back via the service-role key.
      break;
    default:
      return fail(400, 'unknown_action', origin);
  }

  const { error } = await svc.from('job_assignments').update(patch).eq('id', id);
  if (error) return fail(500, 'update_failed', origin);
  return json({ ok: true, status: patch.status ?? status }, 200, origin);
});
