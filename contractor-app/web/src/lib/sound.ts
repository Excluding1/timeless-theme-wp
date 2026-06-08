// lib/sound.ts — short attention chimes for new-job alerts (Web Audio API, no asset files).
// Allan's "BlueEye" idea: a distinct sound the moment a new job lands, so subs actually notice.

export type SoundId = 'chime' | 'bell' | 'ping';

let ctx: AudioContext | null = null;
function audio(): AudioContext | null {
  try {
    if (!ctx) {
      const Ctor = window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      ctx = new Ctor();
    }
    return ctx;
  } catch {
    return null;
  }
}

type Note = { f: number; t: number; d: number }; // frequency Hz, start offset s, duration s

const SOUNDS: Record<SoundId, Note[]> = {
  chime: [{ f: 660, t: 0, d: 0.18 }, { f: 880, t: 0.16, d: 0.34 }],                       // 2-note rise
  bell: [{ f: 784, t: 0, d: 0.2 }, { f: 1047, t: 0.14, d: 0.2 }, { f: 1319, t: 0.28, d: 0.45 }], // bright arpeggio
  ping: [{ f: 1175, t: 0, d: 0.12 }, { f: 1175, t: 0.17, d: 0.2 }],                        // double ping
};

export const SOUND_OPTIONS: { id: SoundId; label: string }[] = [
  { id: 'chime', label: 'Chime' },
  { id: 'bell', label: 'Bell' },
  { id: 'ping', label: 'Ping' },
];

/** Play a new-job alert sound. Safe no-op if Web Audio is unavailable or blocked. */
export function playSound(id: SoundId = 'chime'): void {
  const ac = audio();
  if (!ac) return;
  if (ac.state === 'suspended') void ac.resume(); // unlock after a user gesture
  const now = ac.currentTime;
  for (const n of SOUNDS[id] ?? SOUNDS.chime) {
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = 'sine';
    osc.frequency.value = n.f;
    gain.gain.setValueAtTime(0, now + n.t);
    gain.gain.linearRampToValueAtTime(0.25, now + n.t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + n.d);
    osc.connect(gain).connect(ac.destination);
    osc.start(now + n.t);
    osc.stop(now + n.t + n.d + 0.03);
  }
}
