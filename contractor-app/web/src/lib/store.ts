import { create } from 'zustand';
import type { Assignment, AvailabilityWindow, CapturedPhoto, SubProfile } from '../types';
import { api } from './api';
import type { ProblemPayload } from './api';

// Single source of truth: the store calls `api` and caches the result.
// No optimistic dual-array. Lists/detail are caches; mutations re-fetch from `api`.

const PHOTOS_KEY = 'tj_captured_photos';
const loadPhotos = (): CapturedPhoto[] => {
  try { return JSON.parse(localStorage.getItem(PHOTOS_KEY) || '[]'); } catch { return []; }
};
const savePhotos = (p: CapturedPhoto[]) => { try { localStorage.setItem(PHOTOS_KEY, JSON.stringify(p)); } catch { /* quota */ } };

interface AppState {
  isAuthenticated: boolean;
  isOffline: boolean;

  available: Assignment[];
  booked: Assignment[];
  detail: Record<string, Assignment>;
  profile: SubProfile | null;
  capturedPhotos: CapturedPhoto[];

  loading: boolean;
  error: string | null;

  setAuth: (v: boolean) => void;
  setOffline: (v: boolean) => void;

  fetchJobs: () => Promise<void>;
  fetchJobDetail: (id: string) => Promise<Assignment | null>;
  fetchProfile: () => Promise<void>;

  acceptJob: (id: string) => Promise<void>;
  undoAccept: (id: string) => Promise<void>;
  declineJob: (id: string, reason?: string) => Promise<void>;
  submitAvailability: (id: string, window: AvailabilityWindow) => Promise<void>;
  handBack: (id: string, reason?: string) => Promise<void>;
  completeJob: (id: string) => Promise<void>;
  reportProblem: (id: string, problem: ProblemPayload) => Promise<void>;
  messageOffice: (id: string, text: string) => Promise<void>;

  capturePhoto: (assignmentId: string, photo: CapturedPhoto) => Promise<void>;
  addPhoto: (photo: CapturedPhoto) => void;
  updatePhotoStatus: (photoId: string, status: CapturedPhoto['upload_status']) => void;
  photosForJob: (jobUuid: string) => CapturedPhoto[];
}

export const useAppStore = create<AppState>((set, get) => ({
  isAuthenticated: localStorage.getItem('tj_auth') === '1',
  isOffline: !navigator.onLine,

  available: [],
  booked: [],
  detail: {},
  profile: null,
  capturedPhotos: loadPhotos(),

  loading: false,
  error: null,

  setAuth: (v) => { localStorage.setItem('tj_auth', v ? '1' : '0'); set({ isAuthenticated: v }); },
  setOffline: (v) => set({ isOffline: v }),

  fetchJobs: async () => {
    set({ loading: true, error: null });
    try {
      const [available, booked] = await Promise.all([api.getAvailableJobs(), api.getBookedJobs()]);
      set({ available, booked, loading: false });
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'Something went wrong', loading: false });
    }
  },

  fetchJobDetail: async (id) => {
    try {
      const a = await api.getJobDetail(id);
      set((s) => ({ detail: { ...s.detail, [id]: a } }));
      return a;
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : 'not_found' });
      return null;
    }
  },

  fetchProfile: async () => {
    try { set({ profile: await api.getProfile() }); } catch { /* ignore */ }
  },

  acceptJob: async (id) => { await api.acceptJob(id); await get().fetchJobs(); await get().fetchJobDetail(id); },
  undoAccept: async (id) => { await api.undoAcceptJob(id); await get().fetchJobs(); await get().fetchJobDetail(id); },
  declineJob: async (id, reason) => { await api.declineJob(id, reason); await get().fetchJobs(); },
  submitAvailability: async (id, window) => { await api.submitAvailability(id, window); await get().fetchJobs(); await get().fetchJobDetail(id); },
  handBack: async (id, reason) => { await api.handBack(id, reason); await get().fetchJobs(); },
  completeJob: async (id) => { await api.completeJob(id); await get().fetchJobs(); await get().fetchJobDetail(id); },
  reportProblem: async (id, problem) => { await api.reportProblem(id, problem); await get().fetchJobs(); await get().fetchJobDetail(id); },
  messageOffice: async (id, text) => { await api.messageOffice(id, text); },

  capturePhoto: async (assignmentId, photo) => {
    get().addPhoto(photo);                          // save to device first (offline-resilient)
    get().updatePhotoStatus(photo.id, 'uploading');
    try {
      await api.registerPhoto(assignmentId, {
        client_idem_key: photo.client_idem_key,
        slot: photo.slot,
        sku: photo.sku,
        kind: photo.kind,
        day: photo.day,
        localUri: photo.localUri,
      });
      get().updatePhotoStatus(photo.id, 'uploaded');
    } catch {
      get().updatePhotoStatus(photo.id, 'failed');  // stays on the device; retried later
    }
  },
  addPhoto: (photo) => set((s) => { const next = [...s.capturedPhotos, photo]; savePhotos(next); return { capturedPhotos: next }; }),
  updatePhotoStatus: (photoId, status) => set((s) => {
    const next = s.capturedPhotos.map((p) => (p.id === photoId ? { ...p, upload_status: status } : p));
    savePhotos(next);
    return { capturedPhotos: next };
  }),
  photosForJob: (jobUuid) => get().capturedPhotos.filter((p) => p.sm8_job_uuid === jobUuid),
}));

if (typeof window !== 'undefined') {
  window.addEventListener('online', () => { useAppStore.getState().setOffline(false); void useAppStore.getState().fetchJobs(); });
  window.addEventListener('offline', () => useAppStore.getState().setOffline(true));
}
