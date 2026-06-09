import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Camera as CameraIcon, AlertOctagon } from 'lucide-react';
import { useAppStore } from '../lib/store';
import { Button } from '../components/ui';
import { BottomSheet } from '../components/BottomSheet';
import { useSnackbar } from '../components/Snackbar';

const REASONS = [
  "Can't get access",
  'Asbestos / pre-1990 suspected',
  'Job bigger than quoted',
  'Substrate damage',
  'Something else',
] as const;

type Reason = (typeof REASONS)[number];

const ASBESTOS: Reason = 'Asbestos / pre-1990 suspected';
const MOCK_IMG = 'https://images.unsplash.com/photo-1584622789178-0195ad9c54e1?w=400&q=80';

export function ReportProblem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { reportProblem, isOffline } = useAppStore();
  const snackbar = useSnackbar();

  const [reason, setReason] = useState<Reason>(REASONS[0]);
  const [note, setNote] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [busy, setBusy] = useState(false);

  const isAsbestos = reason === ASBESTOS;
  const canSubmit = !!photo && !isOffline;

  const handleSubmit = async () => {
    if (busy || !photo || !id) return; // guard a fast double-tap
    setBusy(true);
    try {
      await reportProblem(id, { reason, note: note.trim() || undefined, photoLocalUri: photo });
      setShowConfirm(false);
      snackbar.show('Reported — the office will be in touch.');
      navigate(`/job/${id}`, { replace: true });
    } catch {
      snackbar.show('Could not report — please try again.');
    } finally {
      setBusy(false);
    }
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
        <span className="text-xs font-bold tracking-widest uppercase ml-1">Report a problem</span>
      </div>

      <div className="p-4 space-y-6 flex-1 pb-32">
        <p className="text-sm text-[var(--color-secondary)]">
          The office will be alerted and the job will be paused until it's resolved.
        </p>

        <div className="space-y-3">
          <span className="block text-xs font-bold tracking-widest text-[var(--color-secondary)] mb-2 uppercase">
            What's wrong?
          </span>
          <div className="space-y-2" role="radiogroup" aria-label="Problem reason">
            {REASONS.map((r) => {
              const selected = reason === r;
              return (
                <button
                  key={r}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setReason(r)}
                  className={`flex items-center w-full text-left p-4 rounded-xl border transition-colors min-h-[48px] ${
                    selected ? 'border-[var(--color-primary)] bg-white shadow-sm' : 'border-transparent bg-gray-100'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center shrink-0 ${
                      selected ? 'border-[var(--color-primary)]' : 'border-gray-400'
                    }`}
                  >
                    {selected && <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-primary)]" />}
                  </span>
                  <span
                    className={`text-sm font-bold ${selected ? 'text-[var(--color-primary)]' : 'text-[var(--color-secondary)]'}`}
                  >
                    {r}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Asbestos hard-STOP warning */}
        {isAsbestos && (
          <div className="bg-[var(--color-error)] text-white rounded-xl p-4 flex items-start gap-3">
            <AlertOctagon className="w-6 h-6 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-black uppercase tracking-wider">Stop work — do not proceed</p>
              <p className="text-xs mt-1 text-white/90">
                Leave the area as-is, take a photo, and submit now. Do not disturb the material. The
                office will arrange a licensed assessment.
              </p>
            </div>
          </div>
        )}

        {reason === 'Something else' && (
          <div>
            <label htmlFor="problem-note" className="block text-xs font-bold tracking-widest text-[var(--color-secondary)] mb-2 uppercase">
              Tell us more
            </label>
            <textarea
              id="problem-note"
              placeholder="Briefly describe the problem…"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl p-4 min-h-[100px] text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            />
          </div>
        )}

        <div>
          <span className="block text-xs font-bold tracking-widest text-[var(--color-error)] mb-2 uppercase">
            Photo (required)
          </span>
          {photo ? (
            <div className="relative w-full h-48 bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
              <img src={photo} alt="Problem evidence" className="w-full h-full object-cover" />
              <button
                onClick={() => setPhoto(null)}
                aria-label="Retake photo"
                className="absolute top-2 right-2 bg-black/50 text-white rounded-full px-3 h-11 min-w-[44px] flex items-center text-xs font-bold"
              >
                Retake
              </button>
            </div>
          ) : (
            <button
              onClick={() => setPhoto(MOCK_IMG)}
              aria-label="Add a photo of the problem"
              className="w-full h-48 bg-[var(--color-error)]/5 border-2 border-dashed border-[var(--color-error)]/20 rounded-xl flex flex-col items-center justify-center text-[var(--color-error)] hover:bg-[var(--color-error)]/10 transition-colors"
            >
              <CameraIcon className="w-8 h-8 mb-2" />
              <span className="text-xs font-bold tracking-wider">Tap to snap</span>
            </button>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-100 p-4 pb-safe z-30 max-w-md mx-auto w-full">
        <Button
          size="lg"
          variant="danger"
          onClick={() => setShowConfirm(true)}
          disabled={!canSubmit}
        >
          Report problem
        </Button>
        {!photo && (
          <p className="text-center text-xs text-[var(--color-secondary)] mt-2">Add a photo to report.</p>
        )}
        {isOffline && photo && (
          <p className="text-center text-xs text-[var(--color-secondary)] mt-2">Reconnect to report.</p>
        )}
      </div>

      {/* Confirm before submitting */}
      <BottomSheet isOpen={showConfirm} onClose={() => setShowConfirm(false)}>
        <h3 className="text-lg font-bold text-center mb-2">Report this problem?</h3>
        <p className="text-sm text-[var(--color-secondary)] text-center mb-2">
          We'll alert the office and pause the job until it's sorted.
        </p>
        <p className="text-sm font-bold text-[var(--color-primary)] text-center mb-8">{reason}</p>
        <div className="flex flex-col gap-3">
          <Button size="lg" variant="danger" onClick={handleSubmit} disabled={busy}>
            {busy ? 'Reporting…' : 'Report problem'}
          </Button>
          <Button size="lg" variant="ghost" onClick={() => setShowConfirm(false)} disabled={busy}>
            Cancel
          </Button>
        </div>
      </BottomSheet>
    </div>
  );
}
