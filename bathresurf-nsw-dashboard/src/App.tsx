import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { PreferencesProvider } from './contexts/PreferencesContext';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Overview } from './pages/Overview';
import { Finances } from './pages/Finances';
import { Kpis } from './pages/Kpis';
import { Subscriptions } from './pages/Subscriptions';
import { Credentials } from './pages/Credentials';
import { Tasks } from './pages/Tasks';
import { Calendar } from './pages/Calendar';
import { SubsTracker } from './pages/SubsTracker';
import { Contacts } from './pages/Contacts';
import { Goals } from './pages/Goals';
import { WeeklyReview } from './pages/WeeklyReview';
import { Notes } from './pages/Notes';
import { Links } from './pages/Links';
import { Settings } from './pages/Settings';
import { Notifications } from './pages/Notifications';
import { Messages } from './pages/Messages';
import { Cashflow } from './pages/Cashflow';
import { Toaster } from 'sonner';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0D9488]"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <PreferencesProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="overview" element={<Overview />} />
              <Route path="finances" element={<Finances />} />
              <Route path="cashflow" element={<Cashflow />} />
              <Route path="kpis" element={<Kpis />} />
              <Route path="subscriptions" element={<Subscriptions />} />
              <Route path="credentials" element={<Credentials />} />
              <Route path="tasks" element={<Tasks />} />
              <Route path="calendar" element={<Calendar />} />
              <Route path="subs" element={<SubsTracker />} />
              <Route path="contacts" element={<Contacts />} />
              <Route path="goals" element={<Goals />} />
              <Route path="weekly-review" element={<WeeklyReview />} />
              <Route path="notes" element={<Notes />} />
              <Route path="links" element={<Links />} />
              <Route path="messages" element={<Messages />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <Toaster position="bottom-right" richColors />
      </PreferencesProvider>
    </AuthProvider>
  );
}
