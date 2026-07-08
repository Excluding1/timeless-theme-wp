// lib/push.ts — Phase-5 subscribe flow. The VAPID public key comes from the backend (`push` fn),
// so nothing push-related is baked into the frontend build. Everything here degrades silently:
// push is an enhancement — SMS fallback covers every offer regardless.
import { supabase, supabaseConfigured, FUNCTIONS_URL, ANON_KEY } from './supabase';
import { isDemo } from './demo';

async function authHeaders(): Promise<Record<string, string> | null> {
  const { data } = await supabase.auth.getSession();
  if (!data.session?.access_token) return null;
  return {
    'Content-Type': 'application/json',
    'apikey': ANON_KEY,
    'Authorization': `Bearer ${data.session.access_token}`,
  };
}

function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  const raw = atob(padded.replace(/-/g, '+').replace(/_/g, '/'));
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

export function pushSupported(): boolean {
  // Demo mode has no backend/VAPID: the permission UI still shows, but subscription is a no-op.
  if (isDemo()) return false;
  return supabaseConfigured && 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
}

/** Subscribe this device (permission must already be granted) + register with the backend.
 *  Safe to call repeatedly — re-registers the existing subscription (keeps sub_id fresh). */
export async function ensurePushSubscription(): Promise<boolean> {
  try {
    if (!pushSupported() || Notification.permission !== 'granted') return false;
    const headers = await authHeaders();
    if (!headers) return false;

    const reg = await navigator.serviceWorker.ready;
    let sub = await reg.pushManager.getSubscription();
    if (!sub) {
      const keyRes = await fetch(`${FUNCTIONS_URL}/push`, {
        method: 'POST', headers, body: JSON.stringify({ action: 'vapid-key' }),
      });
      if (!keyRes.ok) return false; // backend push not configured yet — SMS still covers offers
      const { key } = await keyRes.json();
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(String(key)).buffer as ArrayBuffer,
      });
    }

    const res = await fetch(`${FUNCTIONS_URL}/push`, {
      method: 'POST', headers, body: JSON.stringify({ action: 'subscribe', subscription: sub.toJSON() }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/** Best-effort revoke on sign-out (needs the session, so call BEFORE supabase.auth.signOut()). */
export async function unsubscribePush(): Promise<void> {
  try {
    if (!pushSupported()) return;
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    if (!sub) return;
    const headers = await authHeaders();
    if (headers) {
      await fetch(`${FUNCTIONS_URL}/push`, {
        method: 'POST', headers, body: JSON.stringify({ action: 'unsubscribe', endpoint: sub.endpoint }),
      }).catch(() => {});
    }
    await sub.unsubscribe().catch(() => {});
  } catch { /* best-effort */ }
}
