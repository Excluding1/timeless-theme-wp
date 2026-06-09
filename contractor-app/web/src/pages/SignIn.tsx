import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui';
import { useAppStore } from '../lib/store';
import { supabase, supabaseConfigured } from '../lib/supabase';

// Mock auth rule (PRD §6.1): empty fields or a fail@ address = bad credentials; anything else succeeds.
function isBadCredentials(email: string, password: string): boolean {
  if (!email.trim() || !password.trim()) return true;
  if (email.trim().toLowerCase().startsWith('fail@')) return true;
  return false;
}

export function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setAuth, isOffline } = useAppStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isOffline) {
      setError("You're offline — connect to sign in.");
      return;
    }

    setLoading(true);

    // Real backend: authenticate against Supabase. The store's auth listener flips isAuthenticated.
    if (supabaseConfigured) {
      const { error: authErr } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      setLoading(false);
      if (authErr) {
        setError("That email or password doesn't look right. Please try again.");
        return;
      }
      setAuth(true);
      navigate('/');
      return;
    }

    // Mock fallback (no backend configured).
    window.setTimeout(() => {
      if (isBadCredentials(email, password)) {
        setLoading(false);
        setError("That email or password doesn't look right. Please try again.");
        return;
      }
      setAuth(true);
      navigate('/');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[var(--color-primary)] flex flex-col items-center justify-center p-6 text-white text-center">
      <div className="w-16 h-16 bg-[var(--color-accent)] rounded-2xl flex items-center justify-center text-[var(--color-primary)] font-black text-3xl mb-6 shadow-lg">
        T
      </div>
      <h1 className="text-xl font-bold tracking-[0.2em] uppercase mb-2">Timeless Jobs</h1>
      <p className="text-[11px] uppercase font-bold tracking-widest text-[var(--color-accent)] mb-12">
        Contractor app
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-5 text-left" noValidate>
        <div>
          <label htmlFor="signin-email" className="block text-xs font-bold tracking-wider text-white/80 mb-2">
            Email address
          </label>
          <input
            id="signin-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={error ? true : undefined}
            className="w-full h-12 bg-white rounded-xl px-4 text-base text-[var(--color-primary)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          />
        </div>

        <div>
          <label htmlFor="signin-password" className="block text-xs font-bold tracking-wider text-white/80 mb-2">
            Password
          </label>
          <input
            id="signin-password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={error ? true : undefined}
            className="w-full h-12 bg-white rounded-xl px-4 text-base text-[var(--color-primary)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          />
        </div>

        {error && (
          <p
            role="alert"
            className="text-sm font-medium text-white bg-[var(--color-error)] px-4 py-3 rounded-xl"
          >
            {error}
          </p>
        )}

        <Button
          type="submit"
          variant="secondary"
          size="lg"
          className="mt-4 w-full"
          disabled={loading || isOffline}
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>

      {isOffline && (
        <p className="mt-8 text-sm font-medium text-white bg-white/10 px-4 py-3 rounded-xl max-w-sm">
          You're offline — connect to sign in.
        </p>
      )}
    </div>
  );
}
