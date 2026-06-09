import { create } from 'zustand';
import type { Assignment, AvailabilityWindow, CapturedPhoto, SubProfile } from '../types';
import { api } from './api';
import type { ProblemPayload } from './api';
import { playSound, type SoundId } from './sound';

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
  soundEnabled: boolean;
  soundId: SoundId;
  hasLoadedJobs: boolean;

  available: Assignment[];
  booked: Assignment[];
  detail: Record<string, Assignment>;
  profile: SubProfile | null;
  capturedPhotos: CapturedPhoto[];

  loading: boolean;
  error: string | null;

  setAuth: (v: boolean) => void;
  setOffline: (v: boolean) => void;
  setSoundEnabled: (v: boolean) => void;
  setSoundId: (id: SoundId) => void;

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
  soundEnabled: localStorage.getItem('tj_sound_enabled') !== '0',
  soundId: ((localStorage.getItem('tj_sound_id') as SoundId) || 'chime'),
  hasLoadedJobs: false,

  available: [],
  booked: [],
  detail: {},
  profile: null,
  capturedPhotos: loadPhotos(),

  loading: false,
  error: null,

  setAuth: (v) => { localStorage.setItem('tj_auth', v ? '1' : '0'); set({ isAuthenticated: v }); },
  setOffline: (v) => set({ isOffline: v }),
  setSoundEnabled: (v) => { localStorage.setItem('tj_sound_enabled', v ? '1' : '0'); set({ soundEnabled: v }); },
  setSoundId: (id) => { localStorage.setItem('tj_sound_id', id); set({ soundId: id }); },

  fetchJobs: async () => {
    set({ loading: true, error: null });
    try {
      const prevIds = new Set(get().available.map((a) => a.id));
      const firstLoad = !get().hasLoadedJobs;
      const [available, booked] = await Promise.all([api.getAvailableJobs(), api.getBookedJobs()]);
      set({ available, booked, loading: false, hasLoadedJobs: true });
      // New-job alert: a NEW offer appeared (not on first load) -> chime + buzz (Allan's BlueEye idea).
      const fresh = available.filter((a) => !prevIds.has(a.id));
      if (!firstLoad && fresh.length > 0 && get().soundEnabled) {
        playSound(get().soundId);
        try { if (typeof navigator.vibrate === 'function') navigator.vibrate([120, 60, 120]); } catch { /* unsupported */ }
      }
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
  addPhoto: (photo) => set((s) => {
    // Dedup by (job, slot): a slot holds at most one photo — guards a rapid double-tap on the same slot.
    const next = [...s.capturedPhotos.filter((p) => !(p.sm8_job_uuid === photo.sm8_job_uuid && p.slot === photo.slot)), photo];
    savePhotos(next);
    return { capturedPhotos: next };
  }),
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
