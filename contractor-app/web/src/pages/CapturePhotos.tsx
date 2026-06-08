import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Camera as CameraIcon,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Lock,
} from 'lucide-react';
import { useAppStore } from '../lib/store';
import type {
  Assignment,
  CapturedPhoto,
  PhotoKind,
  PhotoRequirement,
} from '../types';

// ----------------------------------------------------------------------------
// Photo-gate helpers (shared with JobDetail). Single source of truth for the
// "Mark my part done" gate so the button and the capture screen agree.
// ----------------------------------------------------------------------------

const PHASES: PhotoKind[] = ['before', 'during', 'after'];

/** Requirements that belong to a given day. Single-day jobs (day undefined) all count for day 1. */
export function requirementsForDay(job: Assignment['job'], day: 1 | 2): PhotoRequirement[] {
  return job.required_photos.filter((r) => (r.day ?? 1) === day);
}

/** How many photos of a given sku+kind(+day) the sub has captured. */
function capturedCount(
  photos: CapturedPhoto[],
  sku: string,
  kind: PhotoKind,
  day: 1 | 2,
): number {
  return photos.filter((p) => p.sku === sku && p.kind === kind && (p.day ?? 1) === day).length;
}

/** Minimum required photos for a requirement+phase. */
function minFor(req: PhotoRequirement, kind: PhotoKind): number {
  return kind === 'before' ? req.before : kind === 'during' ? req.during : req.after;
}

/** True when every required slot for `day` has been captured. */
export function isDayComplete(
  job: Assignment['job'],
  photos: CapturedPhoto[],
  day: 1 | 2,
): boolean {
  const reqs = requirementsForDay(job, day);
  if (reqs.length === 0) return true;
  return reqs.every((req) =>
    PHASES.every((kind) => capturedCount(photos, req.sku, kind, day) >= minFor(req, kind)),
  );
}

/** Captured vs required totals for a day (for progress hints). */
export function dayProgress(
  job: Assignment['job'],
  photos: CapturedPhoto[],
  day: 1 | 2,
): { captured: number; required: number } {
  const reqs = requirementsForDay(job, day);
  let captured = 0;
  let required = 0;
  for (const req of reqs) {
    for (const kind of PHASES) {
      const need = minFor(req, kind);
      required += need;
      captured += Math.min(capturedCount(photos, req.sku, kind, day), need);
    }
  }
  return { captured, required };
}

// ----------------------------------------------------------------------------
// Page
// ----------------------------------------------------------------------------

const PHASE_LABEL: Record<PhotoKind, string> = {
  before: 'Before',
  during: 'During',
  after: 'After',
};

const MOCK_IMG = 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=200&h=200&fit=crop';

export function CapturePhotos() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    detail,
    fetchJobDetail,
    capturePhoto,
    photosForJob,
    error,
  } = useAppStore();

  const [assignment, setAssignment] = useState<Assignment | null>(id ? detail[id] ?? null : null);
  const [loading, setLoading] = useState(!assignment);

  useEffect(() => {
    if (!id) return;
    let active = true;
    setLoading(!detail[id]);
    void fetchJobDetail(id).then((res) => {
      if (active && res) {
        setAssignment(res);
        setLoading(false);
      } else if (active) {
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `detail` is written by fetchJobDetail; including it loops.
  }, [id, fetchJobDetail]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[var(--color-secondary)]">
        <Loader2 className="w-6 h-6 animate-spin" aria-hidden />
        <span className="ml-3 text-sm">Loading photos…</span>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
        <p className="text-[var(--color-error)] font-bold mb-4">{error ?? "We couldn't find this job."}</p>
        <button
          onClick={() => navigate('/')}
          className="text-sm font-bold text-[var(--color-primary)] underline min-h-[44px]"
        >
          Back to jobs
        </button>
      </div>
    );
  }

  const job = assignment.job;
  const day: 1 | 2 = assignment.current_day ?? 1;
  const reqsToday = requirementsForDay(job, day);
  const photos = id ? photosForJob(job.sm8_job_uuid) : [];
  const paused = assignment.problem?.status === 'open';

  const handleCapture = (req: PhotoRequirement, kind: PhotoKind, index: number) => {
    if (!id) return;
    const photo: CapturedPhoto = {
      id: crypto.randomUUID(),
      sm8_job_uuid: job.sm8_job_uuid,
      slot: `${req.sku}-${kind}-${index + 1}`,
      sku: req.sku,
      kind,
      day,
      localUri: MOCK_IMG,
      client_idem_key: crypto.randomUUID(),
      upload_status: 'queued',
    };
    // Saves to the device immediately (offline-resilient), then registers through the api seam.
    void capturePhoto(id, photo);
  };

  const renderSlot = (req: PhotoRequirement, kind: PhotoKind, index: number) => {
    const slot = `${req.sku}-${kind}-${index + 1}`;
    const photo = photos.find((p) => p.slot === slot);
    const slotLabel = `${req.label} — ${PHASE_LABEL[kind]} ${index + 1}`;

    return (
      <div key={slot} className="relative flex flex-col space-y-2">
        <span className="text-[11px] font-bold tracking-wide text-[var(--color-secondary)]">
          {PHASE_LABEL[kind]} {index + 1}
        </span>
        {photo ? (
          <div className="relative w-full aspect-square bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
            <img src={photo.localUri} alt={slotLabel} className="w-full h-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2">
              {photo.upload_status === 'queued' && (
                <span className="flex items-center text-xs text-white">
                  <UploadCloud className="w-3 h-3 mr-1" /> Queued
                </span>
              )}
              {photo.upload_status === 'uploading' && (
                <span className="flex items-center text-xs text-amber-300">
                  <UploadCloud className="w-3 h-3 mr-1 animate-pulse" /> Uploading
                </span>
              )}
              {(photo.upload_status === 'uploaded' ||
                photo.upload_status === 'attaching' ||
                photo.upload_status === 'attached') && (
                <span className="flex items-center text-xs text-emerald-400">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Uploaded
                </span>
              )}
              {photo.upload_status === 'failed' && (
                <span className="flex items-center text-xs text-red-400">
                  <AlertCircle className="w-3 h-3 mr-1" /> Failed
                </span>
              )}
            </div>
          </div>
        ) : (
          <button
            onClick={() => handleCapture(req, kind, index)}
            disabled={paused}
            aria-label={`Add photo: ${slotLabel}`}
            className="w-full aspect-square bg-[var(--color-primary)]/5 border-2 border-dashed border-[var(--color-primary)]/20 rounded-xl flex flex-col items-center justify-center text-[var(--color-primary)]/60 hover:bg-[var(--color-primary)]/10 hover:border-[var(--color-primary)]/40 transition-colors disabled:opacity-40 disabled:pointer-events-none"
          >
            <CameraIcon className="w-8 h-8 mb-2" />
            <span className="text-xs font-bold tracking-wider">Tap to snap</span>
          </button>
        )}
      </div>
    );
  };

  const renderPhase = (req: PhotoRequirement, kind: PhotoKind) => {
    const count = minFor(req, kind);
    if (count === 0) return null;
    return (
      <div key={`${req.sku}-${kind}`}>
        <h3 className="text-xs font-bold text-[var(--color-secondary)] tracking-widest mb-3">
          {req.label} — {PHASE_LABEL[kind]}
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: count }, (_, i) => renderSlot(req, kind, i))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-surface)]">
      <div className="bg-[var(--color-primary)] text-white px-2 py-2 flex items-center sticky top-0 z-20">
        <button
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="h-11 w-11 flex items-center justify-center rounded-full hover:bg-white/10 text-white"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-xs font-bold tracking-widest uppercase ml-1">Job photos</span>
        {job.work_days === 2 && (
          <span className="ml-auto mr-2 text-xs font-bold text-[var(--color-accent)]">
            Day {day} of 2
          </span>
        )}
      </div>

      {paused && (
        <div className="bg-[var(--color-error)]/10 text-[var(--color-error)] text-sm font-medium px-4 py-3">
          This job is paused — the office has been notified. Photos are locked until it's resolved.
        </div>
      )}

      <div className="p-6 space-y-8 pb-24 flex-1">
        <p className="text-sm text-[var(--color-secondary)]">
          Take the photos below. They save to your phone straight away and upload when you have
          signal — they won't be lost.
        </p>

        {reqsToday.length === 0 ? (
          <div className="flex flex-col items-center text-center py-12 text-[var(--color-secondary)]">
            <Lock className="w-8 h-8 mb-3 text-gray-400" />
            <p className="text-sm">No photos needed for this day.</p>
          </div>
        ) : (
          reqsToday.map((req) => (
            <div key={req.sku} className="space-y-6 pt-4 border-t border-gray-200 first:border-t-0 first:pt-0">
              {PHASES.map((kind) => renderPhase(req, kind))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
