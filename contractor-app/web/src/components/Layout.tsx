import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../lib/store';
import { WifiOff, User, HardHat, Camera } from 'lucide-react';
import { SnackbarContainer } from './Snackbar';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export function Layout() {
  const { isOffline, isAuthenticated, capturedPhotos } = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === '/';
  const isProfile = location.pathname === '/profile';
  
  const pendingPhotos = capturedPhotos.filter(p => ['queued', 'failed'].includes(p.upload_status)).length;

  if (!isAuthenticated) {
    return <Outlet />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-surface)] pb-20">
      <AnimatePresence>
        {isOffline && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-amber-100 text-amber-800 text-[10px] uppercase tracking-widest font-bold px-4 py-3 flex items-center justify-center space-x-2"
          >
            <WifiOff className="w-4 h-4" />
            <span>You're offline. App is working from cache.</span>
          </motion.div>
        )}
        
        {pendingPhotos > 0 && !isOffline && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="absolute top-4 left-4 right-4 z-50"
          >
            <div className="bg-[var(--color-primary)] text-white p-3 rounded-lg shadow-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[var(--color-accent)] rounded-full animate-ping"></div>
                <span className="text-[10px] font-medium uppercase tracking-tight">{pendingPhotos} photo{pendingPhotos !== 1 ? 's' : ''} waiting to upload</span>
              </div>
              <span className="text-[9px] underline opacity-70 uppercase tracking-widest">Keep Open</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 max-w-md mx-auto w-full">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-100 px-6 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] flex justify-around items-center z-30 max-w-md mx-auto w-full shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <button 
          onClick={() => navigate('/')} 
          className={cn("flex flex-col items-center justify-center space-y-1 w-16", isHome ? "text-[var(--color-primary)]" : "text-gray-400 hover:text-gray-600")}
        >
          <HardHat className="w-6 h-6" />
          <span className="text-[10px] font-medium">Jobs</span>
        </button>
        <button 
          onClick={() => navigate('/profile')} 
          className={cn("flex flex-col items-center justify-center space-y-1 w-16", isProfile ? "text-[var(--color-primary)]" : "text-gray-400 hover:text-gray-600")}
        >
          <User className="w-6 h-6" />
          <span className="text-[10px] font-medium">Profile</span>
        </button>
      </nav>

      <SnackbarContainer />
    </div>
  );
}
