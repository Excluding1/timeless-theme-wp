// The single data-access seam (PRD §10). `mockApi` implements this now; a real
// Supabase client implements the SAME interface later -> "wire Supabase" = one new
// file (supabaseApi.ts) + flip the export at the bottom. Pages/stores import `api`, never a concrete impl.
import type {
  Assignment, AvailabilityWindow, SubProfile, PhotoKind,
} from '../types';

export type AcceptResult = { ok: boolean; undo_window_seconds: number };
export type Ok = { ok: boolean };

export type ProblemPayload = {
  reason: string;
  note?: string;
  photoLocalUri: string; // required photo
};

export type PhotoPayload = {
  client_idem_key: string;
  slot: string;
  sku: string;
  kind: PhotoKind;
  day?: 1 | 2;
  localUri: string;
};

export interface ContractorApi {
  getAvailableJobs(): Promise<Assignment[]>;
  getBookedJobs(): Promise<Assignment[]>;
  getJobDetail(id: string): Promise<Assignment>;
  acceptJob(id: string): Promise<AcceptResult>;
  undoAcceptJob(id: string): Promise<Ok>;
  declineJob(id: string, reason?: string): Promise<Ok>;
  submitAvailability(id: string, window: AvailabilityWindow): Promise<Ok>;
  handBack(id: string, reason?: string): Promise<Ok>;          // Fair-Work A6
  registerPhoto(id: string, photo: PhotoPayload): Promise<{ ok: boolean; photo_id: string }>;
  completeJob(id: string): Promise<Ok>;
  reportProblem(id: string, problem: ProblemPayload): Promise<Ok>;
  getProfile(): Promise<SubProfile>;
}

// ---- Active implementation. Swap here when the Supabase backend is ready. ----
import { mockApi } from './mockApi';
export const api: ContractorApi = mockApi;
