// photos — Phase 4 completion: the REAL photo upload path (the app previously stubbed this).
// Flow: the PWA captures + compresses on-device (IndexedDB queue, survives offline/reload) and POSTs
// base64 here. We (1) prove the sub OWNS a live assignment, (2) store the bytes in the PRIVATE
// `job-photos` bucket (service-role only — no storage policies), (3) upsert the photos row on the
// client idempotency key (retakes/retries collapse), (4) enqueue a durable 'photo_attach' outbox row,
// then (5) best-effort attach to SM8 NOW in the background (reconcile drains any failure).
// Contact-safety: nothing in this path renders customer data; attachment_name = our slot label only.
import { createClient, type SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';
import { json, fail } from '../_shared/respond.ts';
import { preflight } from '../_shared/cors.ts';
import { attachPhotoToJob } from '../_shared/sm8Client.ts';
import { rateLimited } from '../_shared/rateLimit.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const ANON = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

const BUCKET = 'job-photos';
const MAX_BASE64_CHARS = 8_500_000; // ~6.3MB binary — far above a compressed field photo (~300-500KB)
const UUID_RE = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
const SLOT_RE = /^[\w-]{1,60}$/;               // e.g. "BTH-01-before-1" / "PROBLEM-1"
const KINDS = new Set(['before', 'during', 'after', 'problem']);
const CONTENT_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

const nowIso = () => new Date().toISOString();

function b64ToBytes(b64: string): Uint8Array | null {
  try {
    const bin = atob(b64);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  } catch {
    return null;
  }
}

/** Best-effort: attach to SM8 NOW; on failure the outbox row stays pending for reconcile. */
async function attachNow(
  svc: SupabaseClient,
  photoId: string,
  jobUuid: string,
  slot: string,
  bytes: Uint8Array,
  contentType: string,
): Promise<void> {
  try {
    const attachmentUuid = await attachPhotoToJob(jobUuid, slot, bytes, contentType);
    await svc.from('photos')
      .update({ upload_status: 'attached', sm8_attachment_uuid: attachmentUuid })
      .eq('id', photoId);
    await svc.from('sm8_write_outbox')
      .update({ status: 'sent', sent_at: nowIso() })
      .eq('sm8_job_uuid', jobUuid).eq('target_kind', 'photo_attach').eq('target_value', photoId)
      .neq('status', 'sent');
  } catch (e) {
    await svc.from('sm8_write_outbox')
      .update({
        last_error: String((e as Error).message).slice(0, 200),
        next_attempt_at: new Date(Date.now() + 60_000).toISOString(),
      })
      .eq('sm8_job_uuid', jobUuid).eq('target_kind', 'photo_attach').eq('target_value', photoId)
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

  let body: Record<string, unknown> = {};
  try { body = await req.json(); } catch { return fail(400, 'bad_body', origin); }

  // ── Strict input validation (every field, before any DB/storage touch) ──
  const assignmentId = String(body.assignment_id ?? '');
  const slot = String(body.slot ?? '');
  const sku = String(body.sku ?? '');
  const kind = String(body.kind ?? '');
  // (day is client-side gate state; the slot label already encodes everything SM8 needs)
  const idemKey = String(body.client_idem_key ?? '');
  const contentType = String(body.content_type ?? 'image/jpeg');
  const data = typeof body.data === 'string' ? body.data : '';

  if (!UUID_RE.test(assignmentId)) return fail(400, 'bad_assignment', origin);
  if (!SLOT_RE.test(slot) || !SLOT_RE.test(sku)) return fail(400, 'bad_slot', origin);
  if (!KINDS.has(kind)) return fail(400, 'bad_kind', origin);
  if (idemKey.length < 8 || idemKey.length > 160) return fail(400, 'bad_idem_key', origin);
  if (!CONTENT_TYPES.has(contentType)) return fail(400, 'bad_content_type', origin);
  if (data.length === 0 || data.length > MAX_BASE64_CHARS) return fail(413, 'bad_photo_size', origin);
  const bytes = b64ToBytes(data);
  if (!bytes || bytes.byteLength === 0) return fail(400, 'bad_photo_data', origin);

  // ── Who is the sub? (user-JWT client -> RLS returns only their own subs row) ──
  const userClient = createClient(SUPABASE_URL, ANON, {
    global: { headers: { Authorization: authz } },
    auth: { persistSession: false },
  });
  const { data: sub } = await userClient.from('subs').select('id').limit(1).maybeSingle();
  if (!sub?.id) return fail(403, 'no_sub', origin);
  const subId = sub.id as string;

  // Per-sub brake: a burst above ~30 uploads/min is a runaway retry loop, not a bathroom.
  if (rateLimited(`ph:${subId}`, 30)) return fail(429, 'rate_limited', origin);

  const svc = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });

  // ── Ownership + state gate: photos only make sense on a job the sub actually holds. ──
  const { data: asg } = await svc.from('job_assignments')
    .select('id, sub_id, status, sm8_job_uuid')
    .eq('id', assignmentId).maybeSingle();
  if (!asg || asg.sub_id !== subId) return fail(404, 'not_found', origin);
  if (!['accepted', 'in_progress'].includes(String(asg.status))) return fail(409, 'not_photographable', origin);
  const jobUuid = String(asg.sm8_job_uuid);

  // ── Store the bytes (private bucket; deterministic path so a retake overwrites). ──
  const ext = contentType === 'image/png' ? 'png' : contentType === 'image/webp' ? 'webp' : 'jpg';
  const storagePath = `${jobUuid}/${subId}/${slot}.${ext}`;
  const { error: upErr } = await svc.storage.from(BUCKET)
    .upload(storagePath, bytes, { contentType, upsert: true });
  if (upErr) return fail(500, 'storage_failed', origin);

  // ── Upsert the photos row on the client idempotency key (double-tap / retry / retake = ONE row). ──
  const { data: photoRows, error: rowErr } = await svc.from('photos')
    .upsert({
      sm8_job_uuid: jobUuid,
      sub_id: subId,
      assignment_id: assignmentId,
      kind,
      slot,
      storage_path: storagePath,
      content_type: contentType,
      upload_status: 'uploaded',
      client_idem_key: idemKey,
    }, { onConflict: 'client_idem_key' })
    .select('id');
  if (rowErr || !photoRows?.[0]?.id) return fail(500, 'photo_row_failed', origin);
  const photoId = String(photoRows[0].id);

  // ── Durable retry surface FIRST (a retake re-arms a previously-sent row), then best-effort now. ──
  const { error: obErr } = await svc.from('sm8_write_outbox')
    .upsert({
      sm8_job_uuid: jobUuid,
      target_kind: 'photo_attach',
      target_value: photoId,
      status: 'pending',
      attempts: 0,
      next_attempt_at: nowIso(),
    }, { onConflict: 'sm8_job_uuid,target_kind,target_value' });
  if (obErr) return fail(500, 'outbox_failed', origin);

  // ACK the sub now; sync SM8 after (the outbox guarantees eventual delivery even if this fails).
  // @ts-ignore — EdgeRuntime is injected by the Supabase Edge runtime, absent in local `deno test`.
  if (typeof EdgeRuntime !== 'undefined') EdgeRuntime.waitUntil(attachNow(svc, photoId, jobUuid, slot, bytes, contentType));
  else await attachNow(svc, photoId, jobUuid, slot, bytes, contentType);

  return json({ ok: true, photo_id: photoId }, 200, origin);
});
