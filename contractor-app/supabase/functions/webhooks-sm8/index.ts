// webhooks-sm8 — the centrepiece (PHASE-1-PLAN.md). ServiceM8 Object-Webhook receiver.
// Flow: (challenge echo) → verify shared secret → dedup → RETURN 200 IMMEDIATELY → (background)
// re-GET the job by UUID (SSRF-guarded) → contact-filter → upsert job_mirror → audit.
// NEVER returns 410 (410 unsubscribes us). Auth failure = 401. Any processing failure is logged to
// audit_log for the reconcile poll, but the HTTP response is always 200 so SM8 keeps the subscription.
import { createClient, type SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';
import { getJob } from '../_shared/sm8Client.ts';
import { sm8JobToMirror, scrubPii, assertNoContact } from '../_shared/contactFilter.ts';
import { isDuplicate } from '../_shared/dedup.ts';
import { secureCompare } from '../_shared/secure.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const WEBHOOK_SECRET = Deno.env.get('SM8_WEBHOOK_SECRET') ?? '';

function db(): SupabaseClient {
  return createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });
}

function secretOk(req: Request): boolean {
  // SM8 object-webhooks can't send a custom header, so the shared secret also rides in the callback URL (?s=).
  const got = req.headers.get('x-webhook-secret') ?? new URL(req.url).searchParams.get('s') ?? '';
  return WEBHOOK_SECRET.length > 0 && secureCompare(got, WEBHOOK_SECRET);
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
    // The GET'd job must be the one we asked for (Cleo P2 — guards against a swapped/odd response).
    if (!mirror.sm8_job_uuid || mirror.sm8_job_uuid !== uuid.toLowerCase()) {
      await audit(supabase, 'sm8_sync_skip_uuid_mismatch', uuid, {});
      return;
    }
    // Fail-closed: never store a row that still looks like it carries contact (Cleo P1 #3).
    try { assertNoContact(mirror); } catch {
      await audit(supabase, 'sm8_sync_contact_blocked', uuid, {});
      return;
    }
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

  // Subscription handshake — echo the challenge so SM8 activates the subscription (no secret required;
  // SM8 sends this on register). Guard: only when it is NOT a real job event (no uuid/entry/changed_fields).
  if (
    typeof body.challenge === 'string' &&
    !('uuid' in body) && !('entry' in body) && !('changed_fields' in body) && !('resource_url' in body)
  ) {
    return jsonResponse({ challenge: body.challenge });
  }

  // Real events MUST carry the shared secret. Bad secret = 401 (NOT 410).
  if (!secretOk(req)) return new Response('unauthorized', { status: 401 });

  // Real SM8 object-webhook payload = { object, entry: [{uuid}], changed_fields, resource_url }.
  // Collect each entry's uuid (fallback: a single top-level uuid).
  const uuids: string[] = [];
  if (Array.isArray(body.entry)) {
    for (const e of body.entry) {
      const u = (e as Record<string, unknown> | null)?.uuid;
      if (typeof u === 'string') uuids.push(u);
    }
  } else if (typeof body.uuid === 'string') {
    uuids.push(body.uuid);
  }

  // ACK 200 immediately; the SM8 round-trips run in the background. NEVER block, NEVER 410.
  for (const uuid of uuids) {
    if (!isDuplicate(uuid)) {
      // @ts-ignore — EdgeRuntime is injected by the Supabase Edge runtime, absent in local `deno test`.
      if (typeof EdgeRuntime !== 'undefined') EdgeRuntime.waitUntil(processJob(uuid));
      else void processJob(uuid);
    }
  }
  return jsonResponse({ ok: true });
});
