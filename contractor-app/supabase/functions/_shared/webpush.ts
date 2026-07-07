// _shared/webpush.ts — VAPID Web Push sender (RFC 8291/8292 via jsr:@negrel/webpush).
// Keys live ONLY in Edge secrets: VAPID_KEYS_JWK = the JSON produced by scripts/generate-vapid-keys.mjs
// (an ExportedVapidKeys JWK pair), VAPID_SUBJECT = mailto: contact. If the secrets are absent every
// helper degrades to a no-op — push is an enhancement, never a gate (SMS fallback covers offers).
// CONTACT RULE: callers must never put customer name/address/phone/email in a payload — a lock screen
// is not a trusted surface. Suburb + category + pay only.
import {
  ApplicationServer,
  importVapidKeys,
  exportApplicationServerKey,
  PushMessageError,
  type PushSubscription,
} from 'jsr:@negrel/webpush@0.5.0';

let cached: { server: ApplicationServer; publicKey: string } | null | undefined;

async function init(): Promise<{ server: ApplicationServer; publicKey: string } | null> {
  if (cached !== undefined) return cached;
  try {
    const jwkJson = Deno.env.get('VAPID_KEYS_JWK');
    const subject = Deno.env.get('VAPID_SUBJECT') ?? 'mailto:admin@timelessresurfacing.com.au';
    if (!jwkJson) { cached = null; return null; }
    const vapidKeys = await importVapidKeys(JSON.parse(jwkJson), { extractable: false });
    const server = await ApplicationServer.new({ contactInformation: subject, vapidKeys });
    const publicKey = await exportApplicationServerKey(vapidKeys);
    cached = { server, publicKey };
  } catch {
    cached = null; // malformed secret -> degrade, never crash the function
  }
  return cached;
}

/** The base64url applicationServerKey the browser needs for PushManager.subscribe. Null = not configured. */
export async function vapidPublicKey(): Promise<string | null> {
  return (await init())?.publicKey ?? null;
}

export type PushRow = { id: string; endpoint: string; p256dh: string; auth: string };
export type PushPayload = { title: string; body: string; url?: string; tag?: string };

/**
 * Send one payload to many stored subscriptions. Returns ids of subscriptions the push service says
 * are GONE (404/410) so the caller can revoke them. Any other failure is swallowed (best-effort).
 */
export async function sendPush(rows: PushRow[], payload: PushPayload): Promise<{ sent: number; gone: string[] }> {
  const ctx = await init();
  if (!ctx || rows.length === 0) return { sent: 0, gone: [] };

  const message = JSON.stringify(payload);
  let sent = 0;
  const gone: string[] = [];

  for (const row of rows) {
    try {
      const subscription: PushSubscription = {
        endpoint: row.endpoint,
        keys: { p256dh: row.p256dh, auth: row.auth },
      };
      await ctx.server.subscribe(subscription).pushTextMessage(message, {});
      sent++;
    } catch (e) {
      if (e instanceof PushMessageError && (e.isGone() || e.response.status === 404)) gone.push(row.id);
      // everything else: transient push-service noise — the next sweep retries naturally
    }
  }
  return { sent, gone };
}
