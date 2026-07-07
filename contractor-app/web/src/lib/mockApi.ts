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
const assignments: Assignment[] = [
  {
    id: 'assign-1',
    status: 'offered',
    sub_pay: { amount: 350, currency: 'AUD' },
    part_label: null,
    job: {
      sm8_job_uuid: 'job-1',
      generated_job_id: 'JOB-1042',
      customer_name: 'Jane Smith',
      job_address: '42 Wallaby Way, Surry Hills NSW 2010',
      suburb: 'Surry Hills',
      job_category: 'Resurfacing',
      scope: 'Resurface bathtub, repair minor chips.',
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
    status: 'offered',
    sub_pay: { amount: 220, currency: 'AUD' },
    part_label: 'Floor only',
    job: {
      sm8_job_uuid: 'job-2',
      generated_job_id: 'JOB-1043',
      customer_name: 'Dave Jones',
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
    status: 'accepted',
    sub_pay: { amount: 650, currency: 'AUD' },
    part_label: null,
    availability: { dates: ['2026-06-10'], window: 'morning' },
    scheduled_at: '2026-06-10T09:00:00Z', // office booked -> "Booked"
    current_day: 1,
    job: {
      sm8_job_uuid: 'job-3',
      generated_job_id: 'JOB-1010',
      customer_name: 'Alice Cooper',
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
    status: 'accepted',
    sub_pay: { amount: 180, currency: 'AUD' },
    part_label: null,
    availability: { dates: ['2026-06-12'], window: 'afternoon' },
    scheduled_at: null, // office not booked yet -> "Awaiting time"
    job: {
      sm8_job_uuid: 'job-4',
      generated_job_id: 'JOB-1051',
      customer_name: 'Priya Patel',
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
    status: 'in_progress',
    sub_pay: { amount: 720, currency: 'AUD' },
    part_label: null,
    availability: { dates: ['2026-06-09'], window: 'morning' },
    scheduled_at: '2026-06-09T08:00:00Z',
    current_day: 2, // Day 2 — locked until Day 1 photos are uploaded (demos the multi-day gate)
    job: {
      sm8_job_uuid: 'job-5',
      generated_job_id: 'JOB-1066',
      customer_name: 'Tom Reed',
      job_address: '3 Park Ave, Chatswood NSW 2067',
      suburb: 'Chatswood',
      job_category: 'Combo',
      scope: 'Full bathroom: shower regrout (Day 1) + bath resurface (Day 2).',
      reference_photos: ['https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=600&q=80'],
      required_photos: [
        { sku: 'RSC-02', label: 'Shower regrout', before: 2, during: 1, after: 2, day: 1 },
        { sku: 'BTH-01', label: 'Bath resurface', before: 3, during: 2, after: 4, day: 2 },
      ],
      work_days: 2,
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
    if (MOCK_CONTACT_RE.test(body)) throw new ChatError('contact_blocked');
    const msgs = threads.get(id) ?? seedThread(id);
    const recent = msgs.filter((m) => m.sender === 'sub' && Date.now() - new Date(m.created_at).getTime() < 3600_000);
    if (recent.length >= 10) throw new ChatError('rate_limited');
    msgs.push({ id: crypto.randomUUID(), sender: 'sub', kind: 'chat', body, created_at: new Date().toISOString() });
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
function seedThread(id: string): JobMessage[] {
  const msgs: JobMessage[] = id === 'assign-3'
    ? [{
        id: crypto.randomUUID(), sender: 'customer', kind: 'chat',
        body: 'Hi — just checking you can still make it tomorrow morning?',
        created_at: new Date(Date.now() - 40 * 60_000).toISOString(), read_at: null,
      }]
    : [];
  threads.set(id, msgs);
  return msgs;
}
