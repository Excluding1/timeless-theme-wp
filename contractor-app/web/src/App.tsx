import React, { useEffect, useState } from 'react';
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
import { BottomSheet } from './components/BottomSheet';
import { Button } from './components/ui';
import { Bell } from 'lucide-react';

function AppRoutes() {
  const { isAuthenticated } = useAppStore();
  const [showPushPrompt, setShowPushPrompt] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      // Mock showing push prompt on first auth
      const hasPrompted = localStorage.getItem('push-prompted');
      if (!hasPrompted) {
        setTimeout(() => setShowPushPrompt(true), 1000);
      }
    }
  }, [isAuthenticated]);

  const handlePushDecision = () => {
    localStorage.setItem('push-prompted', 'true');
    setShowPushPrompt(false);
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>

      <BottomSheet isOpen={showPushPrompt} onClose={handlePushDecision} title="Never miss a job">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-[var(--color-primary)]/5 rounded-full flex items-center justify-center mb-4">
            <Bell className="w-8 h-8 text-[var(--color-primary)]" />
          </div>
          <p className="text-[var(--color-secondary)]">Get notified the moment a new job is available in your area so you can accept it first.</p>
        </div>
        <div className="flex flex-col space-y-3">
          <Button size="lg" onClick={handlePushDecision}>Turn on notifications</Button>
          <Button size="lg" variant="ghost" onClick={handlePushDecision}>Not now</Button>
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
