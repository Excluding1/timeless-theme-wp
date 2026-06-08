import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function BottomSheet({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title?: React.ReactNode, children: React.ReactNode }) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-40 touch-none"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed bottom-0 inset-x-0 bg-white rounded-t-[32px] z-50 p-6 pb-safe max-w-md mx-auto w-full max-h-[90vh] overflow-y-auto flex flex-col shadow-[0_-20px_50px_-12px_rgba(4,21,52,0.3)]"
          >
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" />
            {title && (
              <div className="flex items-center justify-between mb-4">
                <div className="text-xl font-bold text-[var(--color-primary)]">{title}</div>
              </div>
            )}
            <div className="flex-1">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
