import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import {
  ChevronLeft,
  MapPin,
  Navigation,
  Camera,
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
  WifiOff,
  Loader2,
  ImageOff,
  Lock,
} from 'lucide-react';
import { useAppStore } from '../lib/store';
import { api } from '../lib/api';
import { Button, Badge } from '../components/ui';
import { BottomSheet } from '../components/BottomSheet';
import { useSnackbar } from '../components/Snackbar';
import { formatCurrency } from '../lib/utils';
import {
  jobUiLabel,
  isLiveOffer,
  isNoLongerAvailable,
  requiredPhotoCount,
  etaArrival,
  type Assignment,
  type AvailabilityWindow,
} from '../types';
import { isDayComplete, dayProgress, requirementsForDay } from './CapturePhotos';

type TimeWindow = AvailabilityWindow['window'];
const WINDOWS: TimeWindow[] = ['morning', 'afternoon', 'anytime'];

export function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    detail,
    fetchJobDetail,
    declineJob,
    submitAvailability,
    completeJob,
    photosForJob,
    isOffline,
    error,
  } = useAppStore();
  const snackbar = useSnackbar();

  const [assignment, setAssignment] = useState<Assignment | null>(id ? detail[id] ?? null : null);
  const [loading, setLoading] = useState(!assignment);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [showDeclineSheet, setShowDeclineSheet] = useState(false);
  const [showAvailabilitySheet, setShowAvailabilitySheet] = useState(false);
  const [showCompleteSheet, setShowCompleteSheet] = useState(false);
  const [unread, setUnread] = useState(0);

  const [busy, setBusy] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  const [availDate, setAvailDate] = useState('');
  const [availWindow, setAvailWindow] = useState<TimeWindow>('morning');

  // Load / refresh detail.
  useEffect(() => {
    if (!id) return;
    let active = true;
    setLoading(!detail[id]);
    void fetchJobDetail(id).then((res) => {
      if (!active) return;
      if (res) {
        setAssignment(res);
      } else {
        setLoadError("We couldn't find this job.");
      }
      setLoading(false);
    });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `detail` is written by fetchJobDetail; including it loops.
  }, [id, fetchJobDetail]);

  // Unread chat badge — quiet fetch; chat only exists once the job is held.
  useEffect(() => {
    if (!id || !assignment) return;
    if (assignment.status !== 'accepted' && assignment.status !== 'in_progress') return;
    let active = true;
    void api.listMessages(id)
      .then((t) => { if (active) setUnread(t.unread); })
      .catch(() => { /* badge is best-effort */ });
    return () => { active = false; };
  }, [id, assignment]);

  // Just accepted (from the confirm screen) -> open the availability picker once,
  // unless the sub is mid-Undo.
  useEffect(() => {
    const state = location.state as { justAccepted?: boolean } | null;
    if (state?.justAccepted) {
      navigate(location.pathname, { replace: true, state: {} });
      window.setTimeout(() => {
        if (!useSnackbar.getState().action) setShowAvailabilitySheet(true);
      }, 600);
    }
  }, [location.state, location.pathname, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[var(--color-secondary)]">
        <Loader2 className="w-6 h-6 animate-spin" aria-hidden />
        <span className="ml-3 text-sm">Loading job…</span>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
        <AlertTriangle className="w-10 h-10 text-[var(--color-error)] mb-4" />
        <p className="text-[var(--color-primary)] font-bold mb-2">
          {loadError ?? error ?? "We couldn't load this job."}
        </p>
        <Button size="md" className="mt-4" onClick={() => navigate('/')}>
          Back to jobs
        </Button>
      </div>
    );
  }

  const job = assignment.job;
  const label = jobUiLabel(assignment);
  const offered = isLiveOffer(assignment);
  const dead = isNoLongerAvailable(assignment);
  const awaitingTime = assignment.status === 'accepted' && !assignment.scheduled_at;
  const booked = (assignment.status === 'accepted' || assignment.status === 'in_progress') && !!assignment.scheduled_at;
  const paused = assignment.problem?.status === 'open';

  const photos = photosForJob(job.sm8_job_uuid);
  const day: 1 | 2 = assignment.current_day ?? 1;
  const isMultiDay = job.work_days === 2;

  // Multi-day gating: Day 2 actions locked until Day 1 photos are complete.
  const day1Complete = isDayComplete(job, photos, 1);
  const dayLockedForMultiDay = isMultiDay && day === 2 && !day1Complete;
  const todayComplete = isDayComplete(job, photos, day);
  const progress = dayProgress(job, photos, day);

  const canCapture = booked && !paused && !dayLockedForMultiDay;
  // Whole-job completion is only possible on the FINAL day — you can't finish a 2-day job on Day 1.
  const isFinalDay = !isMultiDay || day === job.work_days;
  const canMarkDone = booked && !paused && !dayLockedForMultiDay && todayComplete && isFinalDay;

  const completeHint = paused
    ? 'This job is paused.'
    : dayLockedForMultiDay
      ? 'Complete Day 1 photos to unlock Day 2.'
      : !todayComplete
        ? `Add all required photos first (${progress.captured}/${progress.required}).`
        : !isFinalDay
          ? 'Day 1 photos done. Day 2 unlocks when you return for it.'
          : '';

  const handleDecline = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await declineJob(assignment.id, declineReason.trim() || undefined);
      setShowDeclineSheet(false);
      navigate('/');
    } catch {
      snackbar.show('Could not decline — please try again.');
    } finally {
      setBusy(false);
    }
  };

  const handleAvailability = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await submitAvailability(assignment.id, { dates: [availDate], window: availWindow });
      setShowAvailabilitySheet(false);
      const fresh = await fetchJobDetail(assignment.id);
      if (fresh) setAssignment(fresh);
      snackbar.show("Sent — we'll confirm your time.");
    } catch {
      snackbar.show('Could not send — please try again.');
    } finally {
      setBusy(false);
    }
  };

  const handleComplete = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await completeJob(assignment.id);
      setShowCompleteSheet(false);
      snackbar.show('Marked done ✓');
      navigate('/');
    } catch {
      snackbar.show('Could not mark done — please try again.');
    } finally {
      setBusy(false);
    }
  };

  const arrival = etaArrival(assignment);

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-surface)] pb-28">
      {/* Header */}
      <div className="bg-[var(--color-primary)] text-white px-2 py-2 flex items-center sticky top-0 z-20">
        <button
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="h-11 w-11 flex items-center justify-center rounded-full hover:bg-white/10 text-white"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-xs font-mono tracking-widest uppercase ml-1">{job.generated_job_id}</span>
        {booked && assignment.scheduled_at && (
          <span className="ml-auto mr-2 text-xs font-bold text-[var(--color-accent)]">
            {format(new Date(assignment.scheduled_at), 'd MMM • h:mm a')}
          </span>
        )}
      </div>

      {/* Offline banner */}
      {isOffline && (
        <div className="bg-amber-100 text-amber-800 text-sm font-medium px-4 py-2 flex items-center gap-2">
          <WifiOff className="w-4 h-4" />
          You're offline. You can view this job; reconnect to respond.
        </div>
      )}

      {/* Paused banner */}
      {paused && (
        <div className="bg-[var(--color-error)]/10 text-[var(--color-error)] px-4 py-3">
          <p className="text-sm font-bold">Paused — office notified</p>
          <p className="text-xs mt-0.5">
            We've flagged your problem. Photos and completion are locked until the office sorts it out.
          </p>
        </div>
      )}

      {/* No longer available */}
      {dead ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-lg font-bold text-[var(--color-primary)] mb-2">This job is no longer available</h2>
          <p className="text-sm text-[var(--color-secondary)] mb-6">
            It may have been taken or rescheduled. Check your available jobs for new offers.
          </p>
          <Button size="md" onClick={() => navigate('/')}>
            Back to jobs
          </Button>
        </div>
      ) : (
        <>
          {/* Photo gallery */}
          <div className="flex-1 overflow-y-auto">
            {job.reference_photos.length > 0 ? (
              <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar">
                {job.reference_photos.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt={`Job photo ${idx + 1}`}
                    className="w-full h-64 object-cover snap-center flex-shrink-0"
                  />
                ))}
              </div>
            ) : (
              <div className="w-full h-40 bg-[var(--color-primary)]/5 flex items-center justify-center">
                <ImageOff className="w-10 h-10 text-[var(--color-primary)]/30" />
              </div>
            )}

            <div className="p-4 pb-96">
              {/* Title row */}
              <div className="flex justify-between items-start mb-4 gap-3">
                <div>
                  <h2 className="text-lg font-bold text-[var(--color-primary)] mb-1">
                    {offered ? job.suburb : job.customer_name}
                  </h2>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="default">{job.job_category}</Badge>
                    {!offered && (
                      <Badge variant={label === 'Paused' ? 'error' : 'success'}>{label}</Badge>
                    )}
                    {assignment.part_label && <Badge variant="warning">{assignment.part_label}</Badge>}
                  </div>
                </div>
                {/* Pay = navy (WCAG: gold on white fails). */}
                <span className="text-lg font-bold text-[var(--color-primary)] shrink-0">
                  {formatCurrency(assignment.sub_pay.amount)}
                </span>
              </div>

              {/* On-my-way status chip (set from the chat's ETA flow) */}
              {arrival && booked && (
                <div className="mb-4 inline-flex items-center gap-2 px-3 py-2 rounded-full bg-[var(--color-accent)]/25 text-[var(--color-primary)] text-xs font-bold">
                  <Navigation className="w-3.5 h-3.5" />
                  On the way — arriving ~{format(arrival, 'h:mm a')}
                </div>
              )}

              {/* Multi-day indicator */}
              {isMultiDay && booked && (
                <div className="mb-4 flex items-center gap-2 text-sm font-bold text-[var(--color-primary)]">
                  <span className="px-2 py-1 rounded bg-[var(--color-accent)] text-[var(--color-primary)] text-xs">
                    Day {day} of 2
                  </span>
                  {dayLockedForMultiDay && (
                    <span className="inline-flex items-center text-xs font-medium text-[var(--color-secondary)]">
                      <Lock className="w-3 h-3 mr-1" /> Locked until Day 1 photos are done
                    </span>
                  )}
                </div>
              )}

              {/* Address */}
              <div className="flex items-start gap-2 text-sm text-[var(--color-secondary)] mb-6">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <p>{job.job_address}</p>
              </div>

              {/* Scope */}
              <div className="mb-6">
                <p className="text-xs font-bold text-[var(--color-secondary)] tracking-widest mb-2 uppercase">
                  Scope of work
                </p>
                <p className="text-sm leading-relaxed text-[var(--color-primary)]">{job.scope}</p>
              </div>

              {/* Per-SKU photo checklist */}
              <div className="mb-6">
                <p className="text-xs font-bold text-[var(--color-secondary)] tracking-widest mb-1 uppercase">
                  Photos you'll need
                </p>
                <p className="text-[11px] text-[var(--color-secondary)] mb-3">
                  "During" = quick progress shots while you work.
                </p>
                <div className="space-y-2">
                  {job.required_photos.map((req) => {
                    const done = booked && isDayComplete(job, photos, (req.day ?? 1) as 1 | 2)
                      ? requiredPhotoCount(req)
                      : photos.filter((p) => p.sku === req.sku && (p.day ?? 1) === (req.day ?? 1)).length;
                    return (
                      <div
                        key={req.sku}
                        className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-3"
                      >
                        <div>
                          <p className="text-sm font-bold text-[var(--color-primary)]">
                            {req.label}
                            {isMultiDay && req.day ? (
                              <span className="text-[var(--color-secondary)] font-medium"> · Day {req.day}</span>
                            ) : null}
                          </p>
                          <p className="text-xs text-[var(--color-secondary)]">
                            {req.before} before · {req.during} during · {req.after} after
                          </p>
                        </div>
                        {booked && (
                          <span className="text-xs font-bold text-[var(--color-secondary)]">
                            {done}/{requiredPhotoCount(req)}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Footer actions */}
          <div className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-100 p-4 pb-safe z-30 max-w-md mx-auto w-full shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
            {offered && (
              <div className="flex flex-col space-y-3">
                <Button
                  size="lg"
                  onClick={() => navigate(`/job/${assignment.id}/confirm-accept`)}
                  disabled={isOffline}
                >
                  Accept
                </Button>
                <Button variant="ghost" size="md" onClick={() => setShowDeclineSheet(true)} disabled={isOffline}>
                  Decline
                </Button>
                {isOffline && (
                  <p className="text-center text-xs text-[var(--color-secondary)]">Reconnect to respond.</p>
                )}
              </div>
            )}

            {awaitingTime && (
              <div className="flex flex-col space-y-3">
                <Button size="lg" onClick={() => setShowAvailabilitySheet(true)} disabled={isOffline}>
                  {assignment.availability ? 'Update availability' : 'Submit availability'}
                </Button>
                <Button
                  variant="ghost"
                  size="md"
                  className="gap-2 relative"
                  onClick={() => navigate(`/job/${assignment.id}/chat`)}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Messages</span>
                  {unread > 0 && (
                    <span
                      aria-label={`${unread} unread messages`}
                      className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-[var(--color-error)] text-white text-[10px] font-black flex items-center justify-center"
                    >
                      {unread}
                    </span>
                  )}
                </Button>
              </div>
            )}

            {booked && (
              <div className="flex flex-col space-y-3">
                <Button
                  size="lg"
                  variant="secondary"
                  className="gap-2"
                  onClick={() =>
                    window.open(`https://maps.google.com/?q=${encodeURIComponent(job.job_address)}`, '_blank')
                  }
                >
                  <Navigation className="w-5 h-5" />
                  <span>Navigate</span>
                </Button>

                <div className="flex gap-3">
                  <Button
                    size="md"
                    variant="primary"
                    className="flex-1 gap-2"
                    onClick={() => navigate(`/job/${assignment.id}/photos`)}
                    disabled={!canCapture}
                  >
                    <Camera className="w-4 h-4" />
                    <span>Add photos</span>
                  </Button>
                  <Button
                    size="md"
                    variant="outline"
                    className="flex-1 gap-2"
                    onClick={() => setShowCompleteSheet(true)}
                    disabled={!canMarkDone}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Mark done</span>
                  </Button>
                </div>

                {!!completeHint && (
                  <p className="text-center text-xs text-[var(--color-secondary)]">{completeHint}</p>
                )}

                <Button
                  variant="danger"
                  size="md"
                  onClick={() => navigate(`/job/${assignment.id}/problem`)}
                  disabled={paused}
                >
                  I have a problem
                </Button>

                {/* Soft actions — neither pauses the job nor changes its state. */}
                <div className="flex gap-3">
                  <Button
                    variant="ghost"
                    size="md"
                    className="flex-1 gap-2 relative"
                    onClick={() => navigate(`/job/${assignment.id}/chat`)}
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Messages</span>
                    {unread > 0 && (
                      <span
                        aria-label={`${unread} unread messages`}
                        className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-[var(--color-error)] text-white text-[10px] font-black flex items-center justify-center"
                      >
                        {unread}
                      </span>
                    )}
                  </Button>
                  {/* Hand back — distinct from Decline; for an accepted job (Fair-Work A6). */}
                  <Button
                    variant="ghost"
                    size="md"
                    className="flex-1"
                    onClick={() => navigate(`/job/${assignment.id}/handback`)}
                  >
                    Hand back
                  </Button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Decline sheet (offers only) */}
      <BottomSheet isOpen={showDeclineSheet} onClose={() => setShowDeclineSheet(false)}>
        <h3 className="text-lg font-bold text-center mb-2">Decline this job?</h3>
        <p className="text-sm text-[var(--color-secondary)] mb-6 text-center">
          No problem — we'll offer it to someone else. There's no penalty.
        </p>
        <label htmlFor="decline-reason" className="block text-xs font-bold tracking-widest text-[var(--color-secondary)] mb-2 uppercase">
          Reason (optional)
        </label>
        <textarea
          id="decline-reason"
          value={declineReason}
          onChange={(e) => setDeclineReason(e.target.value)}
          placeholder="Add a reason if you'd like — or just skip it."
          className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] min-h-[100px] text-base"
        />
        <div className="flex flex-col gap-3">
          <Button size="lg" variant="danger" onClick={handleDecline} disabled={busy}>
            {busy ? 'Declining…' : 'Decline'}
          </Button>
          <Button size="lg" variant="ghost" onClick={() => setShowDeclineSheet(false)} disabled={busy}>
            Cancel
          </Button>
        </div>
      </BottomSheet>

      {/* Availability sheet */}
      <BottomSheet isOpen={showAvailabilitySheet} onClose={() => setShowAvailabilitySheet(false)}>
        <h3 className="text-lg font-bold text-center mb-2">When can you do this job?</h3>
        <p className="text-sm text-[var(--color-secondary)] mb-6 text-center">
          We'll confirm the exact time with you.
        </p>
        <div className="space-y-5 mb-8">
          <div>
            <label htmlFor="avail-date" className="block text-xs font-bold tracking-widest text-[var(--color-secondary)] mb-2 uppercase">
              Preferred date
            </label>
            <input
              id="avail-date"
              type="date"
              value={availDate}
              onChange={(e) => setAvailDate(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-base"
            />
          </div>
          <div>
            <span className="block text-xs font-bold tracking-widest text-[var(--color-secondary)] mb-2 uppercase">
              Time window
            </span>
            <div className="grid grid-cols-3 gap-2">
              {WINDOWS.map((w) => (
                <button
                  key={w}
                  onClick={() => setAvailWindow(w)}
                  className={`py-3 rounded-xl border text-xs font-bold capitalize ${
                    availWindow === w
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
                      : 'border-gray-200 text-[var(--color-secondary)] bg-white hover:bg-gray-50'
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>
        </div>
        <Button size="lg" onClick={handleAvailability} disabled={!availDate || busy}>
          {busy ? 'Sending…' : 'Submit availability'}
        </Button>
      </BottomSheet>

      {/* Complete sheet */}
      <BottomSheet isOpen={showCompleteSheet} onClose={() => setShowCompleteSheet(false)}>
        <h3 className="text-lg font-bold text-center mb-2">Mark your part as done?</h3>
        <p className="text-sm text-[var(--color-secondary)] text-center mb-8">
          Make sure all your photos are uploaded first.
        </p>
        <div className="flex flex-col gap-3">
          <Button size="lg" onClick={handleComplete} disabled={busy}>
            {busy ? 'Saving…' : 'Mark done'}
          </Button>
          <Button size="lg" variant="ghost" onClick={() => setShowCompleteSheet(false)} disabled={busy}>
            Cancel
          </Button>
        </div>
      </BottomSheet>

    </div>
  );
}
