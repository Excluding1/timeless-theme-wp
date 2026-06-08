import React, { useEffect } from 'react';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';
import { useAppStore } from '../lib/store';
import { Button, Badge } from '../components/ui';

function formatExpiry(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : format(d, 'dd/MM/yyyy');
}

export function Profile() {
  const { profile, fetchProfile, setAuth } = useAppStore();

  useEffect(() => {
    if (!profile) void fetchProfile();
  }, [profile, fetchProfile]);

  return (
    <div className="flex flex-col h-full bg-[var(--color-surface)]">
      <div className="bg-[var(--color-primary)] text-white px-4 py-3 flex items-center sticky top-0 z-20">
        <span className="text-xs font-bold tracking-widest uppercase">Profile</span>
      </div>

      {!profile ? (
        <div className="flex-1 flex items-center justify-center text-[var(--color-secondary)] py-16">
          <Loader2 className="w-6 h-6 animate-spin" aria-hidden />
          <span className="ml-3 text-sm">Loading profile…</span>
        </div>
      ) : (
        <div className="p-4 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-[var(--color-accent)] text-[var(--color-primary)] rounded-full flex items-center justify-center text-xl font-black">
                {profile.full_name.charAt(0)}
              </div>
              <div>
                <h2 className="text-base font-bold text-[var(--color-primary)]">{profile.full_name}</h2>
                <p className="text-xs text-[var(--color-secondary)] font-medium">ABN: {profile.abn}</p>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <h3 className="text-xs font-bold text-[var(--color-secondary)] tracking-widest mb-3 uppercase">
                Insurance
              </h3>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-[var(--color-primary)]">Public liability</span>
                {profile.pl_insurance_verified ? (
                  <Badge variant="success">Verified</Badge>
                ) : (
                  <Badge variant="error">Action needed</Badge>
                )}
              </div>
              <p className="text-xs font-medium text-[var(--color-secondary)] mt-2">
                Expires {formatExpiry(profile.pl_insurance_expiry)}
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="lg"
            onClick={() => setAuth(false)}
            className="w-full text-[var(--color-error)]"
          >
            Sign out
          </Button>
        </div>
      )}
    </div>
  );
}
