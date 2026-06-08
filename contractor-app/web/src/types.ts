// Domain types — schema-aligned to contractor-app/supabase/migrations/0001 + PRD v1.2 §9.
// job_mirror = the job; job_assignments = THIS sub's relationship to it.
// HARD RULE: no customer_phone / customer_email — ever (no-contact rule).

export type JobCategory =
  | 'Resurfacing' | 'Regrouting' | 'Silicone & Sealing' | 'Repairs' | 'Specialist' | 'Combo';

export type AssignmentStatus =
  | 'offered' | 'accepted' | 'declined' | 'in_progress'
  | 'completed' | 'expired' | 'reoffered' | 'cancelled';

export type PhotoKind = 'before' | 'during' | 'after';

// 'uploading' is UI-only; backend lifecycle = queued -> uploaded -> attaching -> attached (or failed)
export type PhotoUploadStatus =
  | 'queued' | 'uploading' | 'uploaded' | 'attaching' | 'attached' | 'failed';

export type Money = { amount: number; currency: 'AUD' };

export type PhotoRequirement = {
  sku: string;     // "BTH-01"
  label: string;   // "Bath"
  before: number;
  during: number;  // progress shots (primer/coats evidence) — recipes require these
  after: number;
  day?: 1 | 2;     // which day this gate belongs to (multi-day)
};

export type Job = {                 // <- job_mirror
  sm8_job_uuid: string;
  generated_job_id: string;         // "JOB-1042"
  customer_name: string;            // NAME ONLY (secondary in UI; address is primary). Never phone/email.
  job_address: string;
  suburb: string;
  job_category: JobCategory;
  scope: string;
  reference_photos: string[];       // job photos from the quote
  required_photos: PhotoRequirement[]; // PER-SKU + per-day
  work_days: 1 | 2;                 // multi-day (full-bathroom = 2)
};

export type AvailabilityWindow = {
  dates: string[];                  // ISO dates
  window: 'morning' | 'afternoon' | 'anytime';
};

export type AssignmentProblem = {
  reason: string;
  note?: string;
  status: 'open' | 'resolved';
};

export type Assignment = {          // <- job_assignments
  id: string;
  job: Job;
  sub_pay: Money;                   // THIS sub's pay for THIS part
  part_label?: string | null;      // multi-sub: "Floor 1 sinks 1-10" | null = whole job
  status: AssignmentStatus;
  availability?: AvailabilityWindow | null;
  scheduled_at?: string | null;     // ISO; set when office books -> UI "Booked"
  current_day?: 1 | 2;              // multi-day progress
  problem?: AssignmentProblem | null; // present + open => "Paused"
  decline_reason?: string | null;   // optional, never required
};

export type CapturedPhoto = {       // <- photos
  id: string;
  sm8_job_uuid: string;
  slot: string;                     // "BTH-01-before-1"
  sku: string;
  kind: PhotoKind;
  day?: 1 | 2;
  localUri: string;
  client_idem_key: string;          // idempotent upload (schema: photos.client_idem_key UNIQUE)
  upload_status: PhotoUploadStatus;
};

export type SubProfile = {          // <- subs (read-only)
  full_name: string;
  abn: string;
  pl_insurance_verified: boolean;
  pl_insurance_expiry: string;      // ISO date (display only)
};

// ---- Derived UI labels (compute, never store; the schema has no 'booked' status) ----
export type JobUiLabel =
  | 'Offered' | 'Awaiting time' | 'Booked' | 'In progress' | 'Paused' | 'Completed' | 'No longer available';

export function jobUiLabel(a: Assignment): JobUiLabel {
  if (a.problem?.status === 'open') return 'Paused';
  switch (a.status) {
    case 'offered': return 'Offered';
    case 'accepted': return a.scheduled_at ? 'Booked' : 'Awaiting time';
    case 'in_progress': return 'In progress';
    case 'completed': return 'Completed';
    case 'expired':
    case 'reoffered':
    case 'cancelled': return 'No longer available';
    default: return 'Offered';
  }
}

export const isLiveOffer = (a: Assignment): boolean => a.status === 'offered';
export const isNoLongerAvailable = (a: Assignment): boolean =>
  a.status === 'expired' || a.status === 'reoffered' || a.status === 'cancelled' || a.status === 'declined';

// Total required photos for a SKU gate (before + during + after).
export const requiredPhotoCount = (r: PhotoRequirement): number => r.before + r.during + r.after;
