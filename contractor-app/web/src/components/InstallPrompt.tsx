import { useEffect, useState } from 'react';
import { Download, Share, X } from 'lucide-react';

// Captures the Android/Chromium install event, and guides iPhone users through the
// Safari "Share -> Add to Home Screen" flow (iOS has no install event). Hidden once installed.
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  (window.navigator as unknown as { standalone?: boolean }).standalone === true;

const isIos = () => /iphone|ipad|ipod/i.test(window.navigator.userAgent);

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isStandalone() || localStorage.getItem('install-dismissed')) return;

    const onBip = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setShow(true);
    };
    window.addEventListener('beforeinstallprompt', onBip);

    // iOS Safari fires no install event — show the manual hint after a moment.
    let t: number | undefined;
    if (isIos()) t = window.setTimeout(() => setShow(true), 2500);

    return () => {
      window.removeEventListener('beforeinstallprompt', onBip);
      if (t) window.clearTimeout(t);
    };
  }, []);

  if (!show) return null;

  const dismiss = () => {
    localStorage.setItem('install-dismissed', '1');
    setShow(false);
  };

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    dismiss();
  };

  return (
    <div className="fixed bottom-24 left-4 right-4 z-40 max-w-md mx-auto">
      <div className="bg-[var(--color-primary)] text-white rounded-2xl p-4 shadow-xl flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-[var(--color-accent)] text-[var(--color-primary)] font-black flex items-center justify-center flex-shrink-0">
          T
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold mb-1">Add Timeless Jobs to your phone</p>
          {deferred ? (
            <p className="text-xs text-white/80 mb-3">Install it like an app so it's always one tap away.</p>
          ) : isIos() ? (
            <p className="text-xs text-white/80 mb-3 flex items-center gap-1 flex-wrap">
              Tap <Share className="w-3.5 h-3.5 inline-block" aria-label="Share" /> then "Add to Home Screen".
            </p>
          ) : (
            <p className="text-xs text-white/80 mb-3">Open your browser menu and choose "Install app".</p>
          )}
          {deferred && (
            <button
              onClick={install}
              className="bg-[var(--color-accent)] text-[var(--color-primary)] font-black text-xs uppercase tracking-wider px-4 min-h-[44px] rounded-lg inline-flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Install
            </button>
          )}
        </div>
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          className="h-11 w-11 flex items-center justify-center text-white/70 hover:text-white flex-shrink-0"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
