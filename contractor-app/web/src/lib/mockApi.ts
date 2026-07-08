// Mock implementation of ContractorApi (PRD §10). Replaced by a real Supabase
// client at backend phase. NO customer phone/email anywhere — by design.
import type { ContractorApi, ProblemPayload, Thread } from './api';
import { ChatError } from './api';
import type { Assignment, JobMessage, SubProfile } from '../types';

const MOCK_DELAY = 600;
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const PROFILE: SubProfile = {
  full_name: 'John Doe',
  abn: '12 345 678 901',
  pl_insurance_verified: true,
  pl_insurance_expiry: '2027-01-01',
};

// Seed: job_mirror joined to this sub's job_assignments. (Pay/part/status/availability live on the assignment.)
// Customer names are FIRST-NAME ONLY, and there is deliberately NO phone/email field anywhere — the
// no-contact rule is enforced by the data shape itself. Cards show job + suburb + pay only.
// The three headline states the demo exercises: (1) offered, (2) accepted+booked, (5) in-progress ready to complete.
const assignments: Assignment[] = [
  {
    id: 'assign-1',
    status: 'offered', // (1) NEW JOB AVAILABLE — Bath resurface, Penrith, before photos, pay shown
    sub_pay: { amount: 350, currency: 'AUD' },
    part_label: null,
    job: {
      sm8_job_uuid: 'job-1',
      generated_job_id: 'JOB-1042',
      customer_name: 'Jordan',
      job_address: '42 Jamison Rd, Penrith NSW 2750',
      suburb: 'Penrith',
      job_category: 'Resurfacing',
      scope: 'Resurface bathtub in gloss white, repair minor chips around the drain.',
      reference_photos: [
        'https://images.unsplash.com/photo-1584622789178-0195ad9c54e1?w=600&q=80',
        'https://images.unsplash.com/photo-1595514535311-667798ceb1a9?w=600&q=80',
      ],
      required_photos: [{ sku: 'BTH-01', label: 'Bath', before: 3, during: 2, after: 4 }],
      work_days: 1,
      chat_enabled: true,
    },
  },
  {
    id: 'assign-2',
    status: 'offered', // a second live offer, so the Available list + new-job alert have something to show
    sub_pay: { amount: 220, currency: 'AUD' },
    part_label: 'Floor only',
    job: {
      sm8_job_uuid: 'job-2',
      generated_job_id: 'JOB-1043',
      customer_name: 'Dave',
      job_address: '15 High St, Parramatta NSW 2150',
      suburb: 'Parramatta',
      job_category: 'Regrouting',
      scope: 'Full bathroom floor regrout.',
      reference_photos: ['https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&q=80'],
      required_photos: [{ sku: 'RSC-02', label: 'Floor regrout', before: 3, during: 2, after: 4 }],
      work_days: 1,
      chat_enabled: true,
    },
  },
  {
    id: 'assign-3',
    status: 'accepted', // (2) ACCEPTED + BOOKED with a date/time -> "Booked"
    sub_pay: { amount: 650, currency: 'AUD' },
    part_label: null,
    availability: { dates: ['2026-07-09'], window: 'morning' },
    scheduled_at: '2026-07-09T09:00:00', // office booked -> "Booked" (local time for a clean demo display)
    current_day: 1,
    job: {
      sm8_job_uuid: 'job-3',
      generated_job_id: 'JOB-1010',
      customer_name: 'Alice',
      job_address: '99 Ocean Dr, Bondi NSW 2026',
      suburb: 'Bondi',
      job_category: 'Combo',
      scope: 'Full bathroom: shower regrout (Day 1) + bath resurface (Day 2).',
      reference_photos: ['https://images.unsplash.com/photo-1620626011761-996317b8d101?w=600&q=80'],
      required_photos: [
        { sku: 'RSC-02', label: 'Shower regrout', before: 2, during: 1, after: 2, day: 1 },
        { sku: 'BTH-01', label: 'Bath resurface', before: 3, during: 2, after: 4, day: 2 },
      ],
      work_days: 2,
      chat_enabled: true,
    },
  },
  {
    id: 'assign-4',
    status: 'accepted', // accepted but office hasn't booked a time yet -> "Awaiting time" (availability flow)
    sub_pay: { amount: 180, currency: 'AUD' },
    part_label: null,
    availability: { dates: ['2026-07-11'], window: 'afternoon' },
    scheduled_at: null,
    job: {
      sm8_job_uuid: 'job-4',
      generated_job_id: 'JOB-1051',
      customer_name: 'Priya',
      job_address: '7 Smith St, Marrickville NSW 2204',
      suburb: 'Marrickville',
      job_category: 'Silicone & Sealing',
      scope: 'Re-silicone shower screen + bath edge.',
      reference_photos: [],
      required_photos: [{ sku: 'SIL-01', label: 'Silicone', before: 2, during: 1, after: 3 }],
      work_days: 1,
      chat_enabled: true,
    },
  },
  {
    id: 'assign-5',
    status: 'in_progress', // (3) IN PROGRESS, single-day, booked -> ready for completion (small photo gate)
    sub_pay: { amount: 480, currency: 'AUD' },
    part_label: null,
    availability: { dates: ['2026-07-08'], window: 'morning' },
    scheduled_at: '2026-07-08T08:00:00',
    current_day: 1,
    job: {
      sm8_job_uuid: 'job-5',
      generated_job_id: 'JOB-1066',
      customer_name: 'Tom',
      job_address: '3 Park Ave, Chatswood NSW 2067',
      suburb: 'Chatswood',
      job_category: 'Resurfacing',
      scope: 'Resurface bathtub in gloss white — job underway, ready to finish once photos are in.',
      reference_photos: ['https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=600&q=80'],
      // Small gate (1 before / 1 during / 1 after) so completion is quick to demo.
      required_photos: [{ sku: 'BTH-01', label: 'Bath', before: 1, during: 1, after: 1 }],
      work_days: 1,
      chat_enabled: true,
    },
  },
];

const find = (id: string) => assignments.find((a) => a.id === id);

export const mockApi: ContractorApi = {
  async getAvailableJobs() {
    await delay(MOCK_DELAY);
    return assignments.filter((a) => a.status === 'offered');
  },
  async getBookedJobs() {
    await delay(MOCK_DELAY);
    return assignments.filter((a) => a.status === 'accepted' || a.status === 'in_progress');
  },
  async getJobDetail(id) {
    await delay(MOCK_DELAY);
    const a = find(id);
    if (!a) throw new Error('not_found');
    return a;
  },
  async acceptJob(id) {
    await delay(MOCK_DELAY);
    const a = find(id);
    if (a) a.status = 'accepted';
    return { ok: true, undo_window_seconds: 5 };
  },
  async undoAcceptJob(id) {
    await delay(MOCK_DELAY);
    const a = find(id);
    if (a) a.status = 'offered';
    return { ok: true };
  },
  async declineJob(id, reason) {
    await delay(MOCK_DELAY);
    const a = find(id);
    if (a) { a.status = 'declined'; a.decline_reason = reason ?? null; }
    return { ok: true };
  },
  async submitAvailability(id, window) {
    await delay(MOCK_DELAY);
    const a = find(id);
    // Stays 'accepted' with scheduled_at = null -> "Awaiting time" until the office books it.
    if (a) a.availability = window;
    return { ok: true };
  },
  async handBack(id, reason) {
    await delay(MOCK_DELAY);
    const a = find(id);
    if (a) { a.status = 'reoffered'; a.decline_reason = reason ?? null; } // re-routed to office, penalty-free
    return { ok: true };
  },
  async registerPhoto() {
    await delay(250);
    return { ok: true, photo_id: Math.random().toString(36).slice(2) };
  },
  async completeJob(id) {
    await delay(MOCK_DELAY);
    const a = find(id);
    if (a) a.status = 'completed';
    return { ok: true };
  },
  async reportProblem(id, problem: ProblemPayload) {
    await delay(MOCK_DELAY);
    const a = find(id);
    if (a) a.problem = { reason: problem.reason, note: problem.note, status: 'open' }; // -> Paused
    return { ok: true };
  },
  async getProfile() {
    await delay(MOCK_DELAY);
    return PROFILE;
  },

  // ── Job chat (mock thread; mirrors the backend guards so the UX is honest in demo mode) ──
  async listMessages(id): Promise<Thread> {
    await delay(250);
    const msgs = threads.get(id) ?? seedThread(id);
    return { messages: [...msgs], unread: msgs.filter((m) => m.sender === 'customer' && !m.read_at).length };
  },
  async sendMessage(id, body) {
    await delay(MOCK_DELAY);
    if (MOCK_CONTACT_RE.test(body)) throw new ChatError('contact_blocked'); // guard: numbers/emails blocked
    const msgs = threads.get(id) ?? seedThread(id);
    const recent = msgs.filter((m) => m.sender === 'sub' && Date.now() - new Date(m.created_at).getTime() < 3600_000);
    if (recent.length >= 10) throw new ChatError('rate_limited'); // kill-switch demoable via chat_enabled=false
    msgs.push({ id: crypto.randomUUID(), sender: 'sub', kind: 'chat', body, created_at: new Date().toISOString() });
    scheduleCustomerReply(id, 'chat'); // mock the office relaying a customer reply back (two-sided thread)
    return { ok: true };
  },
  async sendEta(id, minutes) {
    await delay(MOCK_DELAY);
    const a = find(id);
    if (a) { a.eta_minutes = minutes; a.eta_sent_at = new Date().toISOString(); }
    const msgs = threads.get(id) ?? seedThread(id);
    msgs.push({
      id: crypto.randomUUID(), sender: 'sub', kind: 'eta',
      body: `On my way — arriving in about ${minutes} minutes.`, created_at: new Date().toISOString(),
    });
    scheduleCustomerReply(id, 'eta');
    return { ok: true };
  },
  async markMessagesRead(id) {
    const msgs = threads.get(id);
    if (msgs) for (const m of msgs) if (m.sender === 'customer' && !m.read_at) m.read_at = new Date().toISOString();
    return { ok: true };
  },
};

// Same shape as the DB guard: email, or an 8+ digit run with common separators.
const MOCK_CONTACT_RE = /([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})|(\d([\s.()/-]?\d){7,})/;

const threads = new Map<string, JobMessage[]>();

const minsAgo = (m: number) => new Date(Date.now() - m * 60_000).toISOString();

// Seed 1–2 inbound (customer/office) messages on the held jobs so the relay looks two-sided
// from the first open. Offers have no thread until the job is accepted.
const SEED_THREADS: Record<string, JobMessage[]> = {
  'assign-3': [
    { id: 'seed-3a', sender: 'office', kind: 'chat', body: "You're booked for tomorrow morning. We'll relay any messages here.", created_at: minsAgo(180), read_at: minsAgo(180) },
    { id: 'seed-3b', sender: 'customer', kind: 'chat', body: 'Hi — just checking you can still make it tomorrow morning?', created_at: minsAgo(40), read_at: null },
  ],
  'assign-4': [
    { id: 'seed-4a', sender: 'customer', kind: 'chat', body: 'Whenever suits you this week is fine by me, thanks!', created_at: minsAgo(90), read_at: null },
  ],
  'assign-5': [
    { id: 'seed-5a', sender: 'customer', kind: 'chat', body: 'Morning! The side gate is unlocked for you.', created_at: minsAgo(25), read_at: null },
  ],
};

function seedThread(id: string): JobMessage[] {
  const msgs: JobMessage[] = (SEED_THREADS[id] ?? []).map((m) => ({ ...m }));
  threads.set(id, msgs);
  return msgs;
}

// Canned customer replies (never contain contact details) cycled per send, so the sub sees the
// office relaying the customer's answer back — demonstrating the two-way masked relay.
const CHAT_REPLIES = [
  'Great, thanks for letting me know!',
  'No problem — someone will be home.',
  'Perfect, see you then.',
  'Thanks so much!',
];
let replyIx = 0;

function scheduleCustomerReply(id: string, kind: 'chat' | 'eta'): void {
  if (typeof window === 'undefined') return;
  window.setTimeout(() => {
    const msgs = threads.get(id);
    if (!msgs) return;
    const body = kind === 'eta' ? 'Thanks for the heads up — see you soon!' : CHAT_REPLIES[replyIx++ % CHAT_REPLIES.length];
    msgs.push({ id: crypto.randomUUID(), sender: 'customer', kind: 'chat', body, created_at: new Date().toISOString(), read_at: null });
  }, 3500);
}
