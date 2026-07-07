// reconcile — durable retry for SM8 write-back. Drains sm8_write_outbox: the writes job-actions enqueued
// but couldn't immediately deliver (SM8 down / 5xx / 429). Without this, a failed complete-writeback would
// strand the SM8 job in Work Order forever (Cleo P0#2 — audit_log is not a retry surface).
// Auth = ADMIN_PROBE_TOKEN (Bearer), same posture as sm8-get-job; pg_cron passes the token.
// (Phase 5 also lands the webhook re-arm + stale-mirror poll here — TODO marked below.)
import { createClient, type SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';
import { json, fail } from '../_shared/respond.ts';
import { secureCompare } from '../_shared/secure.ts';
import { isValidUuid, updateJob, attachPhotoToJob } from '../_shared/sm8Client.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const ADMIN_TOKEN = Deno.env.get('ADMIN_PROBE_TOKEN') ?? '';

const MAX_ATTEMPTS = 8;
const BATCH = 50;
// 'queue_uuid' lands with the deferred accept-writeback.
const WRITABLE_KINDS = new Set(['status', 'photo_attach']);

const nowIso = () => new Date().toISOString();
const backoffMs = (attempts: number) => Math.min(60_000 * 2 ** attempts, 6 * 60 * 60_000); // 1m,2m,4m… cap ~6h

/** Drain one 'photo_attach' outbox row: load the photo row, pull the bytes from the private bucket,
 *  do the SM8 2-step attach, mark the photo attached. Throws on any failure (caller backs off). */
async function drainPhotoAttach(db: SupabaseClient, jobUuid: string, photoId: string): Promise<void> {
  if (!isValidUuid(photoId)) throw new Error('bad photo id');
  const { data: photo, error } = await db.from('photos')
    .select('id, slot, storage_path, content_type, sm8_attachment_uuid')
    .eq('id', photoId).maybeSingle();
  if (error || !photo) throw new Error('photo row missing');
  if (!photo.storage_path) throw new Error('photo has no storage_path');

  const { data: blob, error: dlErr } = await db.storage.from('job-photos').download(String(photo.storage_path));
  if (dlErr || !blob) throw new Error('storage download failed');
  const bytes = new Uint8Array(await blob.arrayBuffer());

  const attachmentUuid = await attachPhotoToJob(
    jobUuid,
    String(photo.slot ?? 'photo'),
    bytes,
    String(photo.content_type ?? 'image/jpeg'),
  );
  await db.from('photos')
    .update({ upload_status: 'attached', sm8_attachment_uuid: attachmentUuid })
    .eq('id', photoId);
}

Deno.serve(async (req) => {
  // Gate: ADMIN_PROBE_TOKEN as a Bearer (cron passes it). No CORS — internal only.
  const auth = req.headers.get('authorization') ?? '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!ADMIN_TOKEN || !secureCompare(token, ADMIN_TOKEN)) return fail(401, 'unauthorized');

  const db = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });

  const { data: due, error } = await db.from('sm8_write_outbox')
    .select('id, sm8_job_uuid, target_kind, target_value, attempts')
    .eq('status', 'pending')
    .lte('next_attempt_at', nowIso())
    .order('next_attempt_at', { ascending: true })
    .limit(BATCH);
  if (error) return fail(500, 'outbox_read_failed');

  let sent = 0, failed = 0, skipped = 0;
  for (const row of due ?? []) {
    const kind = String(row.target_kind);
    const jobUuid = String(row.sm8_job_uuid);
    // Defence in depth: only ever write a supported field to a valid job UUID.
    if (!WRITABLE_KINDS.has(kind) || !isValidUuid(jobUuid)) {
      await db.from('sm8_write_outbox').update({ status: 'failed', last_error: 'unsupported target' }).eq('id', row.id);
      skipped++; continue;
    }
    try {
      if (kind === 'photo_attach') await drainPhotoAttach(db, jobUuid, String(row.target_value));
      else await updateJob(jobUuid, { [kind]: String(row.target_value) });
      await db.from('sm8_write_outbox').update({ status: 'sent', sent_at: nowIso() }).eq('id', row.id);
      sent++;
    } catch (e) {
      const attempts = (Number(row.attempts) || 0) + 1;
      const giveUp = attempts >= MAX_ATTEMPTS;
      await db.from('sm8_write_outbox').update({
        attempts,
        status: giveUp ? 'failed' : 'pending',
        last_error: String((e as Error).message).slice(0, 200),
        next_attempt_at: new Date(Date.now() + backoffMs(attempts)).toISOString(),
      }).eq('id', row.id);
      failed++;
    }
  }

  // TODO Phase 5: re-arm a dead SM8 object-webhook subscription (72h auto-cancel) + poll stale job_mirror.
  return json({ ok: true, due: due?.length ?? 0, sent, failed, skipped });
});
