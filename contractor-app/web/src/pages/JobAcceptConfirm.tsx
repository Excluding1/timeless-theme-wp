import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, MapPin, CheckCircle2, Loader2, AlertTriangle } from 'lucide-react';
import { useAppStore } from '../lib/store';
import { Button, Badge } from '../components/ui';
import { useSnackbar } from '../components/Snackbar';
import { formatCurrency } from '../lib/utils';
import { isLiveOffer, type Assignment } from '../types';

export function JobAcceptConfirm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { detail, fetchJobDetail, acceptJob, undoAccept, isOffline } = useAppStore();
  const snackbar = useSnackbar();

  const [assignment, setAssignment] = useState<Assignment | null>(id ? detail[id] ?? null : null);
  const [loading, setLoading] = useState(!assignment);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!id) return;
    let active = true;
    setLoading(!detail[id]);
    void fetchJobDetail(id).then((res) => {
      if (!active) return;
      setAssignment(res);
      setLoading(false);
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
        <span className="ml-3 text-sm">Loading…</span>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
        <AlertTriangle className="w-10 h-10 text-[var(--color-error)] mb-4" />
        <p className="text-[var(--color-primary)] font-bold mb-4">We couldn't load this offer.</p>
        <Button size="md" onClick={() => navigate('/')}>
          Back to jobs
        </Button>
      </div>
    );
  }

  // If the offer is no longer live, don't let the sub confirm a dead offer.
  if (!isLiveOffer(assignment)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
        <AlertTriangle className="w-10 h-10 text-gray-400 mb-4" />
        <h2 className="text-lg font-bold text-[var(--color-primary)] mb-2">This job is no longer available</h2>
        <Button size="md" className="mt-2" onClick={() => navigate('/')}>
          Back to jobs
        </Button>
      </div>
    );
  }

  const job = assignment.job;

  const handleConfirm = async () => {
    if (busy) return; // guard a fast double-tap before the disabled state re-renders
    setBusy(true);
    try {
      await acceptJob(assignment.id);
      snackbar.show(
        'Accepted ✓',
        {
          label: 'Undo',
          onClick: () => {
            void undoAccept(assignment.id);
          },
        },
        5000,
      );
      navigate(`/job/${assignment.id}`, { replace: true, state: { justAccepted: true } });
    } catch {
      setBusy(false);
      snackbar.show('Could not accept — please try again.');
    }
  };

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
        <span className="text-xs font-bold tracking-widest uppercase ml-1">Accept job</span>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm mb-6">
          <div className="bg-[var(--color-primary)]/5 p-6 border-b border-gray-200 text-center">
            <h2 className="text-xl font-bold text-[var(--color-primary)] mb-2">Accept this job?</h2>
            <p className="text-sm text-[var(--color-secondary)]">You're agreeing to take this job on.</p>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <p className="text-xs uppercase font-bold text-[var(--color-secondary)] tracking-widest mb-1">Pay</p>
              {/* Navy, never gold on white (WCAG). */}
              <p className="text-2xl font-black text-[var(--color-primary)]">
                {formatCurrency(assignment.sub_pay.amount)}
              </p>
            </div>

            <div className="h-px bg-gray-100" />

            <div>
              <p className="text-xs uppercase font-bold text-[var(--color-secondary)] tracking-widest mb-1">Location</p>
              <div className="flex items-start gap-2 text-sm text-[var(--color-primary)] font-bold">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-[var(--color-secondary)]" />
                <p>{job.job_address}</p>
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            <div>
              <p className="text-xs uppercase font-bold text-[var(--color-secondary)] tracking-widest mb-2">Category</p>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="default">{job.job_category}</Badge>
                {assignment.part_label && <Badge variant="warning">{assignment.part_label}</Badge>}
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            <div>
              <p className="text-xs uppercase font-bold text-[var(--color-secondary)] tracking-widest mb-2">Scope of work</p>
              <p className="text-sm leading-relaxed text-[var(--color-primary)] p-4 bg-gray-50 rounded-xl border border-gray-100">
                {job.scope}
              </p>
            </div>
          </div>
        </div>

        <p className="text-xs text-center text-[var(--color-secondary)] px-4">
          Changed your mind later? You can hand it back from the job.
        </p>
      </div>

      <div className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-100 p-4 pb-safe z-30 max-w-md mx-auto w-full shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col gap-3">
          <Button size="lg" className="gap-2" onClick={handleConfirm} disabled={isOffline || busy}>
            <CheckCircle2 className="w-5 h-5" />
            <span>{busy ? 'Accepting…' : 'Accept'}</span>
          </Button>
          <Button size="lg" variant="ghost" onClick={() => navigate(-1)} disabled={busy}>
            Not now
          </Button>
        </div>
      </div>
    </div>
  );
}
