import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Undo2, Loader2, AlertTriangle } from 'lucide-react';
import { useAppStore } from '../lib/store';
import { Button, Badge } from '../components/ui';
import { useSnackbar } from '../components/Snackbar';
import { jobUiLabel, type Assignment } from '../types';

// Fair-Work A6 — a real, visible route to hand back an ACCEPTED job.
// Distinct from Decline (which is for offers you haven't taken on). Penalty-free.
export function HandBack() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { detail, fetchJobDetail, handBack, isOffline } = useAppStore();
  const snackbar = useSnackbar();

  const [assignment, setAssignment] = useState<Assignment | null>(id ? detail[id] ?? null : null);
  const [loading, setLoading] = useState(!assignment);
  const [reason, setReason] = useState('');
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
        <p className="text-[var(--color-primary)] font-bold mb-4">We couldn't load this job.</p>
        <Button size="md" onClick={() => navigate('/')}>
          Back to jobs
        </Button>
      </div>
    );
  }

  const job = assignment.job;

  const handleConfirm = async () => {
    setBusy(true);
    try {
      await handBack(assignment.id, reason.trim() || undefined);
      snackbar.show('Handed back — the office will re-arrange it.');
      navigate('/');
    } catch {
      setBusy(false);
      snackbar.show('Could not hand back — please try again.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-surface)] pb-28">
      <div className="bg-[var(--color-primary)] text-white px-2 py-2 flex items-center sticky top-0 z-20">
        <button
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="h-11 w-11 flex items-center justify-center rounded-full hover:bg-white/10 text-white"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-xs font-bold tracking-widest uppercase ml-1">Hand back</span>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-full bg-[var(--color-accent)]/30 flex items-center justify-center mb-4">
            <Undo2 className="w-7 h-7 text-[var(--color-primary)]" />
          </div>
          <h2 className="text-xl font-bold text-[var(--color-primary)] mb-2">Hand this job back?</h2>
          <p className="text-sm text-[var(--color-secondary)]">
            Need to hand this job back? The office will re-arrange it. There's no penalty.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-mono tracking-widest text-[var(--color-secondary)] uppercase">
              {job.generated_job_id}
            </span>
            <Badge variant={jobUiLabel(assignment) === 'Paused' ? 'error' : 'success'}>
              {jobUiLabel(assignment)}
            </Badge>
          </div>
          <p className="text-sm font-bold text-[var(--color-primary)]">{job.customer_name}</p>
          <p className="text-xs text-[var(--color-secondary)]">{job.job_address}</p>
        </div>

        <label htmlFor="handback-reason" className="block text-xs font-bold tracking-widest text-[var(--color-secondary)] mb-2 uppercase">
          Reason (optional)
        </label>
        <textarea
          id="handback-reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Let the office know why, if you'd like — or just skip it."
          className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 min-h-[120px] text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        />
      </div>

      <div className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-100 p-4 pb-safe z-30 max-w-md mx-auto w-full shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col gap-3">
          <Button size="lg" variant="secondary" onClick={handleConfirm} disabled={isOffline || busy}>
            {busy ? 'Handing back…' : 'Hand back'}
          </Button>
          <Button size="lg" variant="ghost" onClick={() => navigate(-1)} disabled={busy}>
            Cancel
          </Button>
          {isOffline && (
            <p className="text-center text-xs text-[var(--color-secondary)]">Reconnect to hand back.</p>
          )}
        </div>
      </div>
    </div>
  );
}
