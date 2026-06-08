import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from './lib/store';
import { Layout } from './components/Layout';
import { SignIn } from './pages/SignIn';
import { Home } from './pages/Home';
import { JobDetail } from './pages/JobDetail';
import { JobAcceptConfirm } from './pages/JobAcceptConfirm';
import { CapturePhotos } from './pages/CapturePhotos';
import { ReportProblem } from './pages/ReportProblem';
import { HandBack } from './pages/HandBack';
import { Profile } from './pages/Profile';
import { HowWeWork } from './pages/HowWeWork';
import { BottomSheet } from './components/BottomSheet';
import { Button } from './components/ui';
import { InstallPrompt } from './components/InstallPrompt';
import { Bell, MessageSquare } from 'lucide-react';

function AppRoutes() {
  const { isAuthenticated } = useAppStore();
  const [showPushPrompt, setShowPushPrompt] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !localStorage.getItem('push-prompted')) {
      const t = setTimeout(() => setShowPushPrompt(true), 1200);
      return () => clearTimeout(t);
    }
  }, [isAuthenticated]);

  const dismissPush = () => {
    localStorage.setItem('push-prompted', 'true');
    setShowPushPrompt(false);
  };

  // Real OS permission request. Actual push *delivery* (PushManager + VAPID + a backend
  // sender) is wired in the backend phase; until then SMS covers every job, so the copy says so.
  const enableNotifications = async () => {
    try {
      if ('Notification' in window && Notification.permission === 'default') {
        await Notification.requestPermission();
      }
    } catch {
      /* permission API unavailable — SMS still reaches them */
    }
    dismissPush();
  };

  return (
    <>
      <Routes>
        <Route path="/signin" element={!isAuthenticated ? <SignIn /> : <Navigate to="/" replace />} />

        <Route element={isAuthenticated ? <Layout /> : <Navigate to="/signin" replace />}>
          <Route path="/" element={<Home />} />
          <Route path="/job/:id" element={<JobDetail />} />
          <Route path="/job/:id/confirm-accept" element={<JobAcceptConfirm />} />
          <Route path="/job/:id/photos" element={<CapturePhotos />} />
          <Route path="/job/:id/problem" element={<ReportProblem />} />
          <Route path="/job/:id/handback" element={<HandBack />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/how-we-work" element={<HowWeWork />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>

      {isAuthenticated && <InstallPrompt />}

      <BottomSheet isOpen={showPushPrompt} onClose={dismissPush} title="Never miss a job">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 bg-[var(--color-primary)]/5 rounded-full flex items-center justify-center mb-4">
            <Bell className="w-8 h-8 text-[var(--color-primary)]" />
          </div>
          <p className="text-[var(--color-secondary)]">
            Get notified the moment a new job is available, so you can accept it first.
          </p>
        </div>
        <div className="flex items-start gap-3 bg-[var(--color-surface)] rounded-xl p-3 mb-6">
          <MessageSquare className="w-5 h-5 text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
          <p className="text-xs text-[var(--color-secondary)]">
            We'll also send you a text for every new job, so you won't miss one either way.
          </p>
        </div>
        <div className="flex flex-col space-y-3">
          <Button size="lg" onClick={enableNotifications}>Turn on notifications</Button>
          <Button size="lg" variant="ghost" onClick={dismissPush}>Not now</Button>
        </div>
      </BottomSheet>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
