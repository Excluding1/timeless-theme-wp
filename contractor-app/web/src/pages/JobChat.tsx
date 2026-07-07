import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ChevronLeft, Send, Loader2, ShieldCheck, Navigation2, AlertTriangle } from 'lucide-react';
import { useAppStore } from '../lib/store';
import { api, ChatError } from '../lib/api';
import { Button } from '../components/ui';
import { BottomSheet } from '../components/BottomSheet';
import { useSnackbar } from '../components/Snackbar';
import type { Assignment, JobMessage } from '../types';

// Masked relay: everything below goes through the office (GHL sends from the business number).
// The sub never sees the customer's number; the customer never sees the sub's.

// PRESET-FIRST messaging — one tap sends. Edit this list to change the chips.
// 'On my way' is special: it opens the ETA picker (the message carries the minutes).
export const CHAT_PRESETS = [
  'On my way',
  'Running about 15 minutes late',
  'Running about 30 minutes late',
  "I've arrived",
  'Job complete, cleaning up now',
  'Could we start earlier if that suits?',
  'Please confirm someone will be home',
] as const;

const ETA_CHOICES = [15, 30, 45, 60] as const;

// Mirrors the DB guard (email, or an 8+ digit run with common separators) so the sub gets the
// friendly message BEFORE a round-trip. The database trigger is the real enforcement.
const CONTACT_RE = /([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})|(\d([\s.()/-]?\d){7,})/;
const CONTACT_MSG = "Numbers and emails can't be sent in chat — the office handles contact details.";

const POLL_MS = 12_000;

function chatErrorCopy(e: unknown): string {
  if (e instanceof ChatError) {
    if (e.code === 'contact_blocked') return CONTACT_MSG;
    if (e.code === 'rate_limited') return "You've sent quite a few messages — give the office a moment to catch up.";
    if (e.code === 'chat_disabled') return 'Chat is closed for this job — tap "I have a problem" or call the office.';
  }
  return 'Could not send — please try again.';
}

export function JobChat() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { detail, fetchJobDetail, fetchJobs, isOffline } = useAppStore();
  const snackbar = useSnackbar();

  const [assignment, setAssignment] = useState<Assignment | null>(id ? detail[id] ?? null : null);
  const [messages, setMessages] = useState<JobMessage[] | null>(null);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [showEta, setShowEta] = useState(false);
  const [inputError, setInputError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async (markRead: boolean) => {
    if (!id) return;
    try {
      const t = await api.listMessages(id);
      setMessages(t.messages);
      if (markRead && t.unread > 0) void api.markMessagesRead(id);
    } catch { /* keep whatever we have; the poll retries */ }
  }, [id]);

  useEffect(() => {
    if (!id) return;
    let active = true;
    if (!detail[id]) {
      void fetchJobDetail(id).then((res) => { if (active && res) setAssignment(res); });
    }
    void load(true);
    const t = window.setInterval(() => { if (!document.hidden) void load(true); }, POLL_MS);
    return () => { active = false; window.clearInterval(t); };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `detail` is written by fetchJobDetail; including it loops.
  }, [id, fetchJobDetail, load]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages?.length]);

  const send = async (body: string) => {
    if (!id || busy) return;
    const trimmed = body.trim();
    if (!trimmed) return;
    if (CONTACT_RE.test(trimmed)) { setInputError(CONTACT_MSG); return; }
    setBusy(true);
    setInputError(null);
    try {
      await api.sendMessage(id, trimmed);
      setText('');
      await load(false);
    } catch (e) {
      setInputError(chatErrorCopy(e));
    } finally {
      setBusy(false);
    }
  };

  const sendEta = async (minutes: number) => {
    if (!id || busy) return;
    setBusy(true);
    try {
      await api.sendEta(id, minutes);
      setShowEta(false);
      snackbar.show('Sent — the customer knows you’re coming.');
      await load(false);
      await fetchJobs();               // refresh the ETA chip on the job card
      await fetchJobDetail(id);
    } catch (e) {
      snackbar.show(chatErrorCopy(e));
    } finally {
      setBusy(false);
    }
  };

  const handlePreset = (preset: string) => {
    if (preset === 'On my way') setShowEta(true);
    else void send(preset);
  };

  const chatOff = assignment ? !assignment.job.chat_enabled : false;
  const jobLabel = assignment?.job.generated_job_id ?? '';

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-surface)]">
      {/* Header */}
      <div className="bg-[var(--color-primary)] text-white px-2 py-2 flex items-center sticky top-0 z-20">
        <button
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="h-11 w-11 flex items-center justify-center rounded-full hover:bg-white/10 text-white"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="ml-1">
          <p className="text-xs font-bold tracking-widest uppercase leading-tight">Messages</p>
          {jobLabel && <p className="text-[10px] font-mono tracking-widest text-white/60 leading-tight">{jobLabel}</p>}
        </div>
      </div>

      {/* Relay notice — the Fair-Work/no-contact framing, always visible */}
      <div className="bg-[var(--color-primary)]/5 px-4 py-2 flex items-start gap-2">
        <ShieldCheck className="w-4 h-4 text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
        <p className="text-[11px] text-[var(--color-secondary)]">
          Messages are relayed through the Timeless office. The customer never sees your number, and
          you never see theirs.
        </p>
      </div>

      {chatOff && (
        <div className="bg-[var(--color-error)]/10 text-[var(--color-error)] text-sm font-medium px-4 py-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          Chat is closed for this job — call the office if you need anything.
        </div>
      )}

      {/* Thread */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-56">
        {messages === null ? (
          <div className="flex items-center justify-center py-16 text-[var(--color-secondary)]">
            <Loader2 className="w-5 h-5 animate-spin" aria-hidden />
            <span className="ml-2 text-sm">Loading messages…</span>
          </div>
        ) : messages.length === 0 ? (
          <p className="text-center text-sm text-[var(--color-secondary)] py-16">
            No messages yet. Use a quick message below — the office relays it to the customer.
          </p>
        ) : (
          messages.map((m) => {
            const mine = m.sender === 'sub';
            const office = m.sender === 'office';
            return (
              <div key={m.id} className={office ? 'flex justify-center' : mine ? 'flex justify-end' : 'flex justify-start'}>
                <div
                  className={
                    office
                      ? 'bg-gray-200 text-[var(--color-secondary)] text-xs rounded-full px-4 py-2 max-w-[85%]'
                      : mine
                        ? `text-white rounded-2xl rounded-br-md px-4 py-3 max-w-[80%] ${m.kind === 'eta' ? 'bg-[var(--color-primary)]/80 border border-[var(--color-accent)]' : 'bg-[var(--color-primary)]'}`
                        : 'bg-white border border-gray-200 text-[var(--color-primary)] rounded-2xl rounded-bl-md px-4 py-3 max-w-[80%]'
                  }
                >
                  {!office && !mine && (
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-secondary)] mb-1">Customer</p>
                  )}
                  {m.kind === 'eta' && mine && (
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-accent)] mb-1 flex items-center gap-1">
                      <Navigation2 className="w-3 h-3" /> ETA sent
                    </p>
                  )}
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.body}</p>
                  <p className={`text-[10px] mt-1 ${mine ? 'text-white/60' : 'text-[var(--color-secondary)]'}`}>
                    {format(new Date(m.created_at), 'd MMM • h:mm a')}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Composer — presets first, free text secondary */}
      <div className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-100 p-3 pb-safe z-30 max-w-md mx-auto w-full shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2" aria-label="Quick messages">
          {CHAT_PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => handlePreset(p)}
              disabled={busy || isOffline || chatOff}
              className={`whitespace-nowrap px-4 min-h-[44px] rounded-full border text-xs font-bold disabled:opacity-40 ${
                p === 'On my way'
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
                  : 'border-gray-200 bg-white text-[var(--color-secondary)] hover:bg-gray-50'
              }`}
            >
              {p === 'On my way' ? '🧭 On my way' : p}
            </button>
          ))}
        </div>
        {inputError && (
          <p role="alert" className="text-xs font-medium text-[var(--color-error)] px-1 pb-2">{inputError}</p>
        )}
        <div className="flex items-end gap-2">
          <textarea
            value={text}
            onChange={(e) => { setText(e.target.value); if (inputError) setInputError(null); }}
            placeholder={chatOff ? 'Chat is closed for this job' : 'Or type a message…'}
            aria-label="Message to the customer, relayed via the office"
            rows={1}
            disabled={chatOff}
            className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none min-h-[48px] max-h-32 disabled:opacity-50"
          />
          <button
            type="button"
            onClick={() => void send(text)}
            disabled={busy || isOffline || chatOff || !text.trim()}
            aria-label="Send message"
            className="h-12 w-12 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center disabled:opacity-40 flex-shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        {isOffline && <p className="text-center text-xs text-[var(--color-secondary)] mt-2">Reconnect to send messages.</p>}
      </div>

      {/* ETA picker — "On my way" */}
      <BottomSheet isOpen={showEta} onClose={() => setShowEta(false)} title="On my way">
        <p className="text-sm text-[var(--color-secondary)] mb-6">
          How far away are you? We'll text the customer straight away.
        </p>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {ETA_CHOICES.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => void sendEta(m)}
              disabled={busy}
              className="min-h-[56px] rounded-2xl border border-gray-200 bg-white text-[var(--color-primary)] text-base font-bold hover:bg-[var(--color-primary)] hover:text-white transition-colors disabled:opacity-40"
            >
              ~{m} min
            </button>
          ))}
        </div>
        <Button size="lg" variant="ghost" onClick={() => setShowEta(false)} disabled={busy}>
          Cancel
        </Button>
      </BottomSheet>
    </div>
  );
}
