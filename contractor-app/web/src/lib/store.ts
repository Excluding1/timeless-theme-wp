import { create } from 'zustand';
import type { Assignment, AvailabilityWindow, CapturedPhoto, SubProfile } from '../types';
import { api } from './api';
import type { ProblemPayload } from './api';
import { playSound, type SoundId } from './sound';
import { supabase, supabaseConfigured } from './supabase';
import { putPhoto, getAllPhotos, getPhoto, updatePhotoStatusDb } from './photoDb';
import { unsubscribePush } from './push';

// Single source of truth: the store calls `api` and caches the result.
// No optimistic dual-array. Lists/detail are caches; mutations re-fetch from `api`.
// Photos: blobs persist in IndexedDB from the moment of capture (photoDb.ts); the in-memory list
// mirrors it with session object URLs for display. The drain loop retries queued/failed uploads
// whenever the app comes online or regains focus — "a photo is never lost".

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

  capturePhoto: (photo: Omit<CapturedPhoto, 'localUri' | 'upload_status'>, blob: Blob, contentType: string) => Promise<void>;
  addPhoto: (photo: CapturedPhoto) => void;
  updatePhotoStatus: (photoId: string, status: CapturedPhoto['upload_status']) => void;
  photosForJob: (jobUuid: string) => CapturedPhoto[];
  drainPhotoQueue: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  isAuthenticated: supabaseConfigured ? false : localStorage.getItem('tj_auth') === '1',
  isOffline: !navigator.onLine,
  soundEnabled: localStorage.getItem('tj_sound_enabled') !== '0',
  soundId: ((localStorage.getItem('tj_sound_id') as SoundId) || 'chime'),
  hasLoadedJobs: false,

  available: [],
  booked: [],
  detail: {},
  profile: null,
  capturedPhotos: [], // hydrated async from IndexedDB below

  loading: false,
  error: null,

  setAuth: (v) => {
    if (supabaseConfigured) {
      // Revoke this device's push subscription BEFORE the session dies (it needs the JWT).
      if (!v) void unsubscribePush().finally(() => void supabase.auth.signOut());
    } else { localStorage.setItem('tj_auth', v ? '1' : '0'); }
    set({ isAuthenticated: v });
  },
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

  capturePhoto: async (meta, blob, contentType) => {
    // 1) Persist to the DEVICE first (IndexedDB) — offline capture must survive a reload/crash.
    const photo: CapturedPhoto = { ...meta, localUri: URL.createObjectURL(blob), upload_status: 'queued' };
    await putPhoto({ ...meta, blob, upload_status: 'queued', created_at: Date.now() });
    get().addPhoto(photo);

    // 2) Then try the upload; failure just leaves it queued for the drain loop.
    await uploadOne(photo, blob, contentType, get());
  },
  addPhoto: (photo) => set((s) => {
    // Dedup by idempotency key (job+slot): a retake replaces; a double-tap collapses.
    const next = [...s.capturedPhotos.filter((p) => p.client_idem_key !== photo.client_idem_key), photo];
    return { capturedPhotos: next };
  }),
  updatePhotoStatus: (photoId, status) => set((s) => {
    const target = s.capturedPhotos.find((p) => p.id === photoId);
    if (target) void updatePhotoStatusDb(target.client_idem_key, status);
    const next = s.capturedPhotos.map((p) => (p.id === photoId ? { ...p, upload_status: status } : p));
    return { capturedPhotos: next };
  }),
  photosForJob: (jobUuid) => get().capturedPhotos.filter((p) => p.sm8_job_uuid === jobUuid),

  drainPhotoQueue: async () => {
    if (draining) return; // one drain at a time
    draining = true;
    try {
      const pending = get().capturedPhotos.filter((p) => p.upload_status === 'queued' || p.upload_status === 'failed');
      for (const p of pending) {
        const stored = await getPhoto(p.client_idem_key);
        if (!stored) continue; // blob unavailable (private mode) — nothing to retry
        await uploadOne(p, stored.blob, stored.blob.type || 'image/jpeg', get());
      }
    } finally {
      draining = false;
    }
  },
}));

let draining = false;

/** Upload one photo through the api seam; flips uploading -> uploaded/failed in state + IndexedDB. */
async function uploadOne(
  photo: CapturedPhoto,
  blob: Blob,
  contentType: string,
  s: Pick<AppState, 'updatePhotoStatus'>,
): Promise<void> {
  s.updatePhotoStatus(photo.id, 'uploading');
  try {
    await api.registerPhoto(photo.assignment_id, {
      client_idem_key: photo.client_idem_key,
      slot: photo.slot,
      sku: photo.sku,
      kind: photo.kind,
      day: photo.day,
      blob,
      contentType,
    });
    s.updatePhotoStatus(photo.id, 'uploaded');
  } catch {
    s.updatePhotoStatus(photo.id, 'failed'); // stays on the device; retried by the drain loop
  }
}

// Hydrate captured photos from IndexedDB (blobs -> session object URLs), then retry any stragglers.
if (typeof window !== 'undefined') {
  void getAllPhotos().then((stored) => {
    if (stored.length === 0) return;
    const photos: CapturedPhoto[] = stored.map(({ blob, created_at: _t, ...meta }) => ({
      ...meta,
      localUri: URL.createObjectURL(blob),
      // anything that was mid-upload when the app closed goes back to queued
      upload_status: meta.upload_status === 'uploading' ? 'queued' : meta.upload_status,
    }));
    useAppStore.setState((s) => ({
      capturedPhotos: [
        ...photos,
        ...s.capturedPhotos.filter((p) => !photos.some((q) => q.client_idem_key === p.client_idem_key)),
      ],
    }));
    if (navigator.onLine) void useAppStore.getState().drainPhotoQueue();
  });
}

if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    useAppStore.getState().setOffline(false);
    void useAppStore.getState().fetchJobs();
    void useAppStore.getState().drainPhotoQueue(); // reception is back — push waiting photos up
  });
  window.addEventListener('offline', () => useAppStore.getState().setOffline(true));
  // iOS PWAs get no Background Sync — drain whenever the sub brings the app back to the foreground.
  window.addEventListener('focus', () => { if (navigator.onLine) void useAppStore.getState().drainPhotoQueue(); });
  // Real mode: the Supabase session is the source of truth for auth.
  if (supabaseConfigured) {
    void supabase.auth.getSession().then(({ data }) => useAppStore.setState({ isAuthenticated: !!data.session }));
    supabase.auth.onAuthStateChange((_e, session) => useAppStore.setState({ isAuthenticated: !!session }));
  }
}
