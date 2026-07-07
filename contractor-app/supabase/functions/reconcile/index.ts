// reconcile — durable retry for SM8 write-back. Drains sm8_write_outbox: the writes job-actions enqueued
// but couldn't immediately deliver (SM8 down / 5xx / 429). Without this, a failed complete-writeback would
// strand the SM8 job in Work Order forever (Cleo P0#2 — audit_log is not a retry surface).
// Auth = ADMIN_PROBE_TOKEN (Bearer), same posture as sm8-get-job; pg_cron passes the token.
// (Phase 5 also lands the webhook re-arm + stale-mirror poll here — TODO marked below.)
import { createClient, type SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';
import { json, fail } from '../_shared/respond.ts';
import { secureCompare } from '../_shared/secure.ts';
import { isValidUuid, updateJob, attachPhotoToJob } from '../_shared/sm8Client.ts';
import { suburbFrom } from '../_shared/address.ts';
import { sendPush, type PushPayload, type PushRow } from '../_shared/webpush.ts';

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

  // ── Phase 5: push-notification sweep (no-op unless VAPID secrets are configured). ──
  const pushed = await notifySweep(db);

  // TODO: re-arm a dead SM8 object-webhook subscription (72h auto-cancel) + poll stale job_mirror.
  return json({ ok: true, due: due?.length ?? 0, sent, failed, skipped, pushed });
});

// ─────────────────────────────────────────────────────────────────────────────
// Push sweep. Runs on every reconcile tick (pg_cron ~1/min): notify each sub of
//   (a) NEW OFFERS  — status 'offered', offer_notified_at null
//   (b) BOOKINGS    — status 'accepted', scheduled_at set, booking_notified_at null
// Marked BEFORE sending (at-most-once: a broken push service must never spam a phone on every tick).
// CONTACT RULE: payloads carry suburb + category only — never customer name/address/phone/email.
// ─────────────────────────────────────────────────────────────────────────────
type NotifyRow = {
  id: string;
  sub_id: string;
  scheduled_at?: string | null;
  job: { job_address: string | null; job_category: string | null } | null;
};

async function subscriptionsFor(db: SupabaseClient, subIds: string[]): Promise<Map<string, PushRow[]>> {
  const map = new Map<string, PushRow[]>();
  if (subIds.length === 0) return map;
  const { data } = await db.from('push_subscriptions')
    .select('id, sub_id, endpoint, p256dh, auth')
    .in('sub_id', subIds)
    .is('revoked_at', null);
  for (const r of data ?? []) {
    const key = String(r.sub_id);
    const list = map.get(key) ?? [];
    list.push({ id: String(r.id), endpoint: String(r.endpoint), p256dh: String(r.p256dh), auth: String(r.auth) });
    map.set(key, list);
  }
  return map;
}

async function revokeGone(db: SupabaseClient, gone: string[]): Promise<void> {
  if (gone.length === 0) return;
  await db.from('push_subscriptions')
    .update({ revoked_at: nowIso() })
    .in('id', gone);
}

async function notifySweep(db: SupabaseClient): Promise<number> {
  let pushed = 0;
  try {
    // (a) new offers
    const { data: offers } = await db.from('job_assignments')
      .select('id, sub_id, job:job_mirror(job_address, job_category)')
      .eq('status', 'offered')
      .is('offer_notified_at', null)
      .limit(50);
    // (b) confirmed bookings
    const { data: bookings } = await db.from('job_assignments')
      .select('id, sub_id, scheduled_at, job:job_mirror(job_address, job_category)')
      .eq('status', 'accepted')
      .not('scheduled_at', 'is', null)
      .is('booking_notified_at', null)
      .limit(50);

    const offerRows = (offers ?? []) as unknown as NotifyRow[];
    const bookingRows = (bookings ?? []) as unknown as NotifyRow[];
    if (offerRows.length === 0 && bookingRows.length === 0) return 0;

    // Mark FIRST (at-most-once), then send.
    if (offerRows.length > 0) {
      await db.from('job_assignments').update({ offer_notified_at: nowIso() })
        .in('id', offerRows.map((r) => r.id));
    }
    if (bookingRows.length > 0) {
      await db.from('job_assignments').update({ booking_notified_at: nowIso() })
        .in('id', bookingRows.map((r) => r.id));
    }

    const subsMap = await subscriptionsFor(db, [
      ...new Set([...offerRows, ...bookingRows].map((r) => r.sub_id)),
    ]);
    const allGone: string[] = [];

    for (const r of offerRows) {
      const where = suburbFrom(r.job?.job_address ?? null);
      const payload: PushPayload = {
        title: 'New job available',
        body: [where, r.job?.job_category].filter(Boolean).join(' · ') || 'Open the app to see it',
        url: '/',
        tag: `offer-${r.id}`,
      };
      const { sent: n, gone } = await sendPush(subsMap.get(r.sub_id) ?? [], payload);
      pushed += n; allGone.push(...gone);
    }

    for (const r of bookingRows) {
      const where = suburbFrom(r.job?.job_address ?? null);
      const when = r.scheduled_at
        ? new Date(r.scheduled_at).toLocaleString('en-AU', {
            timeZone: 'Australia/Sydney', weekday: 'short', day: 'numeric', month: 'short',
            hour: 'numeric', minute: '2-digit',
          })
        : '';
      const payload: PushPayload = {
        title: 'Job time confirmed',
        body: [where, when].filter(Boolean).join(' — ') || 'Open the app for details',
        url: `/job/${r.id}`,
        tag: `booking-${r.id}`,
      };
      const { sent: n, gone } = await sendPush(subsMap.get(r.sub_id) ?? [], payload);
      pushed += n; allGone.push(...gone);
    }

    await revokeGone(db, [...new Set(allGone)]);
  } catch { /* sweep is best-effort; the next tick retries anything unmarked */ }
  return pushed;
}
