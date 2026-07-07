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
  kind: PhotoKind | 'problem';
  day?: 1 | 2;
  blob: Blob;              // the real (compressed) image bytes — uploaded, never just referenced
  contentType: string;
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
  messageOffice(id: string, text: string): Promise<Ok>;   // non-urgent note to the office; never pauses (Fair-Work safe)
  getProfile(): Promise<SubProfile>;
}

// ---- Active implementation: the real backend when configured (VITE_SUPABASE_*), else mock data. ----
import { mockApi } from './mockApi';
import { supabaseApi } from './supabaseApi';
import { supabaseConfigured } from './supabase';
export const api: ContractorApi = supabaseConfigured ? supabaseApi : mockApi;
