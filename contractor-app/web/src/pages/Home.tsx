import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { MapPin, WifiOff, AlertTriangle, ImageOff, Navigation } from 'lucide-react';
import { useAppStore } from '../lib/store';
import { Card, Badge } from '../components/ui';
import { Button } from '../components/ui';
import { formatCurrency } from '../lib/utils';
import { jobUiLabel, etaArrival, type Assignment, type JobUiLabel } from '../types';

type Tab = 'available' | 'booked';

const STATUS_BADGE: Record<JobUiLabel, 'default' | 'success' | 'warning' | 'error'> = {
  Offered: 'default',
  'Awaiting time': 'warning',
  Booked: 'success',
  'In progress': 'default',
  Paused: 'error',
  Completed: 'success',
  'No longer available': 'error',
};

function JobThumb({ url }: { url?: string }) {
  if (url) {
    return <img src={url} alt="" className="w-full h-full object-cover" />;
  }
  return (
    <div className="w-full h-full bg-[var(--color-primary)]/10 flex items-center justify-center">
      <ImageOff className="w-8 h-8 text-[var(--color-primary)]/30" />
    </div>
  );
}

function JobCard({ assignment, tab }: { assignment: Assignment; tab: Tab }) {
  const navigate = useNavigate();
  const job = assignment.job;
  const label = jobUiLabel(assignment);

  return (
    <Card
      className="p-0 cursor-pointer hover:shadow-md transition-shadow focus-within:ring-2 focus-within:ring-[var(--color-accent)] active:scale-[0.99]"
      onClick={() => navigate(`/job/${assignment.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          navigate(`/job/${assignment.id}`);
        }
      }}
    >
      <div className="h-32 bg-gray-200 relative overflow-hidden">
        <JobThumb url={job.reference_photos[0]} />
        <div className="absolute top-2 left-2 flex gap-2">
          {tab === 'available' ? (
            <Badge variant="default">New</Badge>
          ) : (
            <Badge variant={STATUS_BADGE[label]}>{label}</Badge>
          )}
        </div>
      </div>

      <div className="p-3">
        <div className="flex justify-between items-start mb-1 gap-3">
          <h3 className="text-sm font-bold text-[var(--color-primary)] leading-snug">{job.suburb}</h3>
          {/* Pay = navy, never gold on white (WCAG). */}
          <div className="text-base font-bold text-[var(--color-primary)] shrink-0">
            {formatCurrency(assignment.sub_pay.amount)}
          </div>
        </div>

        <p className="text-xs text-[var(--color-secondary)] line-clamp-1 mb-3">
          <span className="font-bold text-[var(--color-primary)] mr-1">{job.job_category}</span>
          {job.scope}
        </p>

        {tab === 'booked' && (
          <div className="mb-3 text-xs font-medium text-[var(--color-primary)] flex items-center gap-2 flex-wrap">
            <span>
              {assignment.scheduled_at
                ? format(new Date(assignment.scheduled_at), "EEE d MMM • h:mm a")
                : 'Awaiting time'}
            </span>
            {(() => {
              const arrival = etaArrival(assignment);
              return arrival ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--color-accent)]/25 text-[var(--color-primary)] text-[10px] font-bold">
                  <Navigation className="w-3 h-3" />
                  On the way · ~{format(arrival, 'h:mm a')}
                </span>
              ) : null;
            })()}
          </div>
        )}

        <Button size="md" className="w-full text-xs py-3 rounded-xl tracking-widest">
          {tab === 'booked' ? 'View job' : 'View offer'}
        </Button>
      </div>
    </Card>
  );
}

function Skeletons() {
  return (
    <div className="space-y-4" aria-hidden>
      {[0, 1].map((i) => (
        <div key={i} className="animate-pulse bg-gray-200 h-56 rounded-2xl" />
      ))}
    </div>
  );
}

export function Home() {
  const { available, booked, loading, error, isOffline, fetchJobs } = useAppStore();
  const [tab, setTab] = useState<Tab>('available');
  const navigate = useNavigate();

  useEffect(() => {
    void fetchJobs();
  }, [fetchJobs]);

  const jobs = useMemo(() => (tab === 'available' ? available : booked), [tab, available, booked]);
  const hasAny = jobs.length > 0;
  const showSkeletons = loading && !hasAny;

  return (
    <div className="flex flex-col h-full bg-[var(--color-surface)]">
      <div className="bg-[var(--color-surface)] px-4 pt-8 pb-2 border-b border-gray-100 sticky top-0 z-20">
        <h1 className="text-lg font-bold text-[var(--color-primary)] mb-4">Jobs</h1>
        <div className="flex bg-gray-200 rounded-lg p-1 mb-2" role="tablist" aria-label="Jobs">
          <button
            role="tab"
            aria-selected={tab === 'available'}
            onClick={() => setTab('available')}
            className={`flex-1 py-3 text-xs font-bold uppercase rounded-md transition-colors ${
              tab === 'available' ? 'bg-white shadow-sm text-[var(--color-primary)]' : 'text-[var(--color-secondary)]'
            }`}
          >
            Available {available.length > 0 && `(${available.length})`}
          </button>
          <button
            role="tab"
            aria-selected={tab === 'booked'}
            onClick={() => setTab('booked')}
            className={`flex-1 py-3 text-xs font-bold uppercase rounded-md transition-colors ${
              tab === 'booked' ? 'bg-white shadow-sm text-[var(--color-primary)]' : 'text-[var(--color-secondary)]'
            }`}
          >
            My jobs {booked.length > 0 && `(${booked.length})`}
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {showSkeletons && <Skeletons />}

        {/* Error — only when nothing cached to show */}
        {!showSkeletons && error && !hasAny && (
          <div className="text-center py-12 px-4">
            <div className="w-16 h-16 bg-[var(--color-error)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-[var(--color-error)]" />
            </div>
            <h3 className="text-lg font-bold text-[var(--color-primary)] mb-2">Couldn't load your jobs</h3>
            <p className="text-[var(--color-secondary)] text-sm mb-6">{error}</p>
            <Button size="md" onClick={() => void fetchJobs()}>
              Try again
            </Button>
          </div>
        )}

        {/* Empty — distinguish offline from "no work available" */}
        {!showSkeletons && !error && !hasAny && (
          isOffline ? (
            <div className="text-center py-12 px-4">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <WifiOff className="w-8 h-8 text-amber-700" />
              </div>
              <h3 className="text-lg font-bold text-[var(--color-primary)] mb-2">You're offline</h3>
              <p className="text-[var(--color-secondary)] text-sm">
                We'll refresh your jobs as soon as you're back online.
              </p>
            </div>
          ) : (
            <div className="text-center py-12 px-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-[var(--color-primary)] mb-2">
                {tab === 'available' ? 'No jobs available right now' : 'No jobs yet'}
              </h3>
              <p className="text-[var(--color-secondary)] text-sm">
                {tab === 'available'
                  ? "We'll notify you the moment a new job is available."
                  : 'Check the Available tab for new offers.'}
              </p>
            </div>
          )
        )}

        {hasAny && jobs.map((assignment) => (
          <React.Fragment key={assignment.id}>
            <JobCard assignment={assignment} tab={tab} />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
