import { create } from 'zustand';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface SnackbarState {
  message: string | null;
  action?: { label: string, onClick: () => void };
  show: (message: string, action?: { label: string, onClick: () => void }, duration?: number) => void;
  hide: () => void;
}

// Track the pending auto-hide so an OLD toast's timer can never dismiss a NEWER one
// (an early dismissal here would silently shrink the 5s accept-Undo safety window).
let hideTimer: ReturnType<typeof setTimeout> | undefined;

export const useSnackbar = create<SnackbarState>((set) => ({
  message: null,
  show: (message, action, duration = 5000) => {
    if (hideTimer) clearTimeout(hideTimer);
    set({ message, action });
    hideTimer = setTimeout(() => {
      hideTimer = undefined;
      set({ message: null, action: undefined });
    }, duration);
  },
  hide: () => {
    if (hideTimer) clearTimeout(hideTimer);
    hideTimer = undefined;
    set({ message: null, action: undefined });
  }
}));

export function SnackbarContainer() {
  const { message, action, hide } = useSnackbar();
  
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-[100px] left-4 right-4 bg-[var(--color-success)] text-white px-4 py-3 rounded-xl shadow-2xl z-[60] flex items-center justify-between"
        >
          <span className="text-xs font-bold tracking-tight uppercase flex items-center gap-2">{message}</span>
          <div className="flex items-center space-x-2">
            {action && (
              <button
                onClick={() => { action.onClick(); hide(); }}
                className="text-sm font-black uppercase text-[var(--color-primary)] bg-white px-4 min-h-[44px] rounded-lg tracking-wider"
              >
                {action.label}
              </button>
            )}
            <button onClick={hide} aria-label="Dismiss" className="h-11 w-11 flex items-center justify-center text-white/80 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
