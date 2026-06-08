// Mock implementation of ContractorApi (PRD §10). Replaced by a real Supabase
// client at backend phase. NO customer phone/email anywhere — by design.
import type { ContractorApi, ProblemPayload } from './api';
import type { Assignment, SubProfile } from '../types';

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
};
