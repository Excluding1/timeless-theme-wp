// supabaseApi — the real ContractorApi: reads via the `my-jobs` Edge Function, writes via `job-actions`,
// both carrying the sub's JWT so the database RLS scopes everything to them. Swap-in for mockApi.
import type { ContractorApi, AcceptResult, Ok, ProblemPayload, PhotoPayload, Thread, ChatErrorCode } from './api';
import { ChatError } from './api';
import type { Assignment, AvailabilityWindow, SubProfile, JobMessage } from '../types';
import { supabase, FUNCTIONS_URL, ANON_KEY } from './supabase';
import { blobToBase64 } from './image';

async function headers(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession();
  return {
    'Content-Type': 'application/json',
    'apikey': ANON_KEY,
    'Authorization': `Bearer ${data.session?.access_token ?? ANON_KEY}`,
  };
}

async function getView(view: string): Promise<Assignment[]> {
  const res = await fetch(`${FUNCTIONS_URL}/my-jobs?view=${view}`, { headers: await headers() });
  if (!res.ok) throw new Error(`my-jobs ${res.status}`);
  const j = await res.json();
  return (j.assignments ?? []) as Assignment[];
}

async function act(action: string, id: string, payload?: unknown): Promise<Ok> {
  const res = await fetch(`${FUNCTIONS_URL}/job-actions`, {
    method: 'POST',
    headers: await headers(),
    body: JSON.stringify({ action, id, payload }),
  });
  if (!res.ok) throw new Error(`${action} ${res.status}`);
  return { ok: true };
}

export const supabaseApi: ContractorApi = {
  getAvailableJobs: () => getView('available'),
  getBookedJobs: () => getView('booked'),

  async getJobDetail(id: string): Promise<Assignment> {
    const res = await fetch(`${FUNCTIONS_URL}/my-jobs?view=detail&id=${encodeURIComponent(id)}`, {
      headers: await headers(),
    });
    if (!res.ok) throw new Error('not_found');
    const j = await res.json();
    if (!j.assignment) throw new Error('not_found');
    return j.assignment as Assignment;
  },

  async acceptJob(id: string): Promise<AcceptResult> {
    await act('accept', id);
    return { ok: true, undo_window_seconds: 5 };
  },
  undoAcceptJob: (id) => act('undo', id),
  declineJob: (id, reason) => act('decline', id, { reason }),
  submitAvailability: (id, window: AvailabilityWindow) => act('availability', id, { window }),
  handBack: (id, reason) => act('handback', id, { reason }),
  completeJob: (id) => act('complete', id),
  reportProblem: (id, problem: ProblemPayload) => act('problem', id, { reason: problem.reason, note: problem.note }),

  // Phase 4 (real): upload the bytes to the `photos` Edge Function -> private Storage bucket ->
  // photos row -> durable SM8 2-step attach. The blob also stays in IndexedDB, so a failure here
  // is retried by the store's drain loop — a photo is never lost.
  async registerPhoto(id: string, photo: PhotoPayload): Promise<{ ok: boolean; photo_id: string }> {
    const data = await blobToBase64(photo.blob);
    const res = await fetch(`${FUNCTIONS_URL}/photos`, {
      method: 'POST',
      headers: await headers(),
      body: JSON.stringify({
        assignment_id: id,
        slot: photo.slot,
        sku: photo.sku,
        kind: photo.kind,
        day: photo.day ?? 1,
        client_idem_key: photo.client_idem_key,
        content_type: photo.contentType,
        data,
      }),
    });
    if (!res.ok) throw new Error(`photo_upload ${res.status}`);
    const j = await res.json();
    return { ok: true, photo_id: String(j.photo_id ?? '') };
  },

  async getProfile(): Promise<SubProfile> {
    const res = await fetch(`${FUNCTIONS_URL}/my-jobs?view=profile`, { headers: await headers() });
    if (!res.ok) throw new Error('profile_failed');
    const j = await res.json();
    return j.profile as SubProfile;
  },

  // ── Job chat (the `messages` Edge Function; guard refusals surface as ChatError codes) ──
  async listMessages(id: string): Promise<Thread> {
    const res = await chatAct('list', id);
    const j = await res.json();
    if (!res.ok) throw new Error('messages_failed');
    return { messages: (j.messages ?? []) as JobMessage[], unread: Number(j.unread ?? 0) };
  },
  async sendMessage(id: string, body: string): Promise<Ok> {
    const res = await chatAct('send', id, { body });
    if (!res.ok) throw new ChatError(await chatErrorCode(res));
    return { ok: true };
  },
  async sendEta(id: string, minutes: number): Promise<Ok> {
    const res = await chatAct('eta', id, { minutes });
    if (!res.ok) throw new ChatError(await chatErrorCode(res));
    return { ok: true };
  },
  async markMessagesRead(id: string): Promise<Ok> {
    await chatAct('read', id).catch(() => null);
    return { ok: true }; // best-effort — an unread badge is never worth an error banner
  },
};

async function chatAct(action: string, assignmentId: string, extra?: Record<string, unknown>): Promise<Response> {
  return await fetch(`${FUNCTIONS_URL}/messages`, {
    method: 'POST',
    headers: await headers(),
    body: JSON.stringify({ action, assignment_id: assignmentId, ...extra }),
  });
}

async function chatErrorCode(res: Response): Promise<ChatErrorCode> {
  try {
    const j = await res.json();
    const code = String(j.error ?? '');
    if (code === 'contact_blocked' || code === 'rate_limited' || code === 'chat_disabled') return code;
  } catch { /* fall through */ }
  return 'send_failed';
}
