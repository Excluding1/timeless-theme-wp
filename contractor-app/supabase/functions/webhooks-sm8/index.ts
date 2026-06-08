// webhooks-sm8 — the centrepiece (PHASE-1-PLAN.md). ServiceM8 Object-Webhook receiver.
// Flow: (challenge echo) → verify shared secret → dedup → RETURN 200 IMMEDIATELY → (background)
// re-GET the job by UUID (SSRF-guarded) → contact-filter → upsert job_mirror → audit.
// NEVER returns 410 (410 unsubscribes us). Auth failure = 401. Any processing failure is logged to
// audit_log for the reconcile poll, but the HTTP response is always 200 so SM8 keeps the subscription.
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { getJob } from '../_shared/sm8Client.ts';
import { sm8JobToMirror, scrubPii } from '../_shared/contactFilter.ts';
import { isDuplicate } from '../_shared/dedup.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const WEBHOOK_SECRET = Deno.env.get('SM8_WEBHOOK_SECRET') ?? '';

function db(): SupabaseClient {
  return createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });
}

// Length-safe constant-time-ish compare so we don't leak the secret via early-exit timing.
function secretOk(req: Request): boolean {
  const got = req.headers.get('x-webhook-secret') ?? '';
  if (!WEBHOOK_SECRET || got.length !== WEBHOOK_SECRET.length) return false;
  let diff = 0;
  for (let i = 0; i < got.length; i++) diff |= got.charCodeAt(i) ^ WEBHOOK_SECRET.charCodeAt(i);
  return diff === 0;
}

async function audit(supabase: SupabaseClient, action: string, uuid: string | null, detail: unknown) {
  try {
    await supabase.from('audit_log').insert({
      actor_type: 'system',
      action,
      sm8_job_uuid: uuid,
      detail: scrubPii(detail),
    });
  } catch { /* the audit path must never throw */ }
}

async function processJob(uuid: string): Promise<void> {
  const supabase = db();
  try {
    const raw = await getJob(uuid); // SSRF-guarded re-GET by validated UUID (never the webhook URL)
    const mirror = sm8JobToMirror(raw, new Date().toISOString());
    if (!mirror.sm8_job_uuid) { await audit(supabase, 'sm8_sync_skip_no_uuid', uuid, {}); return; }
    const { error } = await supabase.from('job_mirror').upsert(mirror, { onConflict: 'sm8_job_uuid' });
    if (error) { await audit(supabase, 'sm8_sync_upsert_error', uuid, { message: error.message }); return; }
    await audit(supabase, 'sm8_sync_ok', uuid, { status: mirror.sm8_status });
  } catch (e) {
    await audit(supabase, 'sm8_sync_error', uuid, { message: (e as Error).message });
  }
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return new Response('ok', { status: 200 }); // never 410

  let body: Record<string, unknown> = {};
  try { body = await req.json(); } catch { /* tolerate empty/garbage; still 200 below */ }

  // Subscription handshake — harmless echo, no secret required (SM8 may not send our header here).
  if (typeof body.challenge === 'string') return jsonResponse({ challenge: body.challenge });

  // Real events MUST carry the shared secret. Bad secret = 401 (NOT 410).
  if (!secretOk(req)) return new Response('unauthorized', { status: 401 });

  const obj = body.object as Record<string, unknown> | undefined;
  const uuid = typeof body.uuid === 'string' ? body.uuid
    : typeof obj?.uuid === 'string' ? String(obj.uuid) : '';

  // Validate + ACK 200 immediately; the SM8 round-trip runs in the background. NEVER block, NEVER 410.
  if (uuid && !isDuplicate(uuid)) {
    // EdgeRuntime.waitUntil keeps the async work alive after we respond (Supabase Edge runtime).
    // @ts-ignore — EdgeRuntime is injected by the Supabase Edge runtime, absent in local `deno test`.
    if (typeof EdgeRuntime !== 'undefined') EdgeRuntime.waitUntil(processJob(uuid));
    else void processJob(uuid);
  }
  return jsonResponse({ ok: true });
});
