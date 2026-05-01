import React, { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Target, TrendingUp, TrendingDown, Pencil, Trash2, Calendar, PartyPopper, Trophy, X } from 'lucide-react';
import { format, parseISO, differenceInDays, subDays, isValid } from 'date-fns';
import { toast } from 'sonner';
import { SlideOver } from '../components/SlideOver';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { EmptyState } from '../components/EmptyState';
import { CardSkeleton } from '../components/LoadingSkeleton';
import { useData } from '../hooks/useData';
import { cn } from '../lib/utils';
import type { Goal, GoalMilestone } from '../lib/database';

const UNIT_OPTIONS = ['$', '%', '#'] as const;
const PERIOD_OPTIONS = ['weekly', 'monthly', 'quarterly', 'annual', 'all_time'] as const;
const PERIOD_LABELS: Record<string, string> = {
  weekly: 'Weekly', monthly: 'Monthly', quarterly: 'Quarterly', annual: 'Annual',
  all_time: 'All Time',
};

type GoalForm = {
  metric_name: string;
  target_value: number;
  current_value: number;
  unit: '$' | '%' | '#';
  period: 'weekly' | 'monthly' | 'quarterly' | 'annual' | 'all_time';
  lower_is_better: boolean;
  deadline: string;
  notes: string;
};

function getGoalStatus(goal: Goal): { label: string; color: string; bgColor: string; borderColor: string } {
  const pct = goal.target_value === 0 ? 0 : (goal.current_value / goal.target_value) * 100;

  if (goal.lower_is_better) {
    // Lower current = better. If current < target, that's "Ahead"
    if (pct <= 80) return { label: 'Ahead', color: 'text-[#16A34A]', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200' };
    if (pct <= 100) return { label: 'On Track', color: 'text-amber-600', bgColor: 'bg-amber-50', borderColor: 'border-amber-200' };
    return { label: 'Behind', color: 'text-[#DC2626]', bgColor: 'bg-red-50', borderColor: 'border-red-200' };
  } else {
    if (pct > 100) return { label: 'Ahead', color: 'text-[#16A34A]', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200' };
    if (pct >= 80) return { label: 'On Track', color: 'text-amber-600', bgColor: 'bg-amber-50', borderColor: 'border-amber-200' };
    return { label: 'Behind', color: 'text-[#DC2626]', bgColor: 'bg-red-50', borderColor: 'border-red-200' };
  }
}

function formatValue(value: number, unit: string): string {
  if (unit === '$') return `$${value.toLocaleString()}`;
  if (unit === '%') return `${value}%`;
  return value.toLocaleString();
}

// A goal is "achieved" when the metric has crossed its target line.
// For higher-is-better (revenue, NPS): current >= target.
// For lower-is-better (CPL, callback rate): current <= target AND current > 0
//   (a 0 value is usually no-data-yet, not "we crushed it down to zero").
function isAchieved(goal: Goal): boolean {
  if (goal.target_value === 0) return false;
  if (goal.lower_is_better) {
    return goal.current_value > 0 && goal.current_value <= goal.target_value;
  }
  return goal.current_value >= goal.target_value;
}

// Milestone ladder — psychologically clean "round number" tiers à la
// YouTube subscribers: 5k → 10k → 20k → 50k → 100k → 200k → 300k.
// Uses the 1-2-3-5 series so each step feels like a meaningful jump.
const MILESTONE_LADDER = [
  1, 2, 3, 5,
  10, 20, 30, 50,
  100, 200, 300, 500,
  1_000, 2_000, 3_000, 5_000,
  10_000, 20_000, 30_000, 50_000,
  100_000, 200_000, 300_000, 500_000,
  1_000_000, 2_000_000, 3_000_000, 5_000_000,
  10_000_000, 20_000_000, 30_000_000, 50_000_000, 100_000_000,
];

// Find the next ladder rung. For higher-is-better: smallest tier > current target.
// For lower-is-better: largest tier < current target. Falls back to ×1.5/×0.7 if
// off the ladder (rare — would mean target_value > 100M).
function suggestNextTarget(goal: Goal): number {
  if (goal.lower_is_better) {
    const next = [...MILESTONE_LADDER].reverse().find(v => v < goal.target_value);
    return next ?? Math.max(Math.floor(goal.target_value * 0.7), 1);
  }
  return MILESTONE_LADDER.find(v => v > goal.target_value) ?? Math.ceil(goal.target_value * 1.5);
}

export function Goals() {
  const { data: rawData, loading, create, update, remove } = useData('goals');
  const { data: rawMilestones, create: createMilestone } = useData('goal_milestones');
  const data = rawData as unknown as Goal[];
  const milestones = rawMilestones as unknown as GoalMilestone[];
  const [slideOpen, setSlideOpen] = useState(false);
  const [editing, setEditing] = useState<Goal | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Goal | null>(null);

  // Achievement modal state — when Allan clicks "Set next target" on an achieved goal.
  const [nextTargetGoal, setNextTargetGoal] = useState<Goal | null>(null);
  const [nextTargetValue, setNextTargetValue] = useState<number>(0);
  const [savingMilestone, setSavingMilestone] = useState(false);

  // Session-only dismiss: clicking "Stay here" hides the banner until reload, doesn't persist.
  // The natural flow is "Set next target" — dismiss is a relief valve, not a primary action.
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<GoalForm>();

  // Recent Wins strip: last 5 milestones from the past 30 days, sorted newest-first.
  const recentWins = useMemo(() => {
    if (!milestones || milestones.length === 0) return [];
    const cutoff = subDays(new Date(), 30);
    return [...milestones]
      .filter(m => {
        if (!m.achieved_at) return false;
        const d = parseISO(m.achieved_at);
        return isValid(d) && d >= cutoff;
      })
      .sort((a, b) => b.achieved_at.localeCompare(a.achieved_at))
      .slice(0, 5);
  }, [milestones]);

  function openNextTargetModal(goal: Goal) {
    setNextTargetGoal(goal);
    setNextTargetValue(suggestNextTarget(goal));
  }

  async function saveNextTarget() {
    if (!nextTargetGoal || nextTargetValue <= 0) return;
    setSavingMilestone(true);
    try {
      // Compute how many days this milestone took: from the previous milestone if any,
      // otherwise from the goal's creation date. Lets the wins history show velocity.
      const previousMilestonesForGoal = milestones
        .filter(m => m.goal_id === nextTargetGoal.id)
        .sort((a, b) => b.achieved_at.localeCompare(a.achieved_at));
      const startDateRaw = previousMilestonesForGoal.length > 0
        ? previousMilestonesForGoal[0].achieved_at
        : nextTargetGoal.created_at;
      let daysToAchieve: number | undefined;
      if (startDateRaw) {
        const startDate = parseISO(startDateRaw);
        if (isValid(startDate)) {
          daysToAchieve = Math.max(0, differenceInDays(new Date(), startDate));
        }
      }

      // Log the milestone (preserves history even if the goal is later deleted).
      await createMilestone({
        goal_id: nextTargetGoal.id,
        metric_name: nextTargetGoal.metric_name,
        target_value: nextTargetGoal.target_value,
        achieved_value: nextTargetGoal.current_value,
        unit: nextTargetGoal.unit,
        period: nextTargetGoal.period,
        days_to_achieve: daysToAchieve,
      } as any);
      // Advance the goal: new target. For periodic goals (monthly/weekly/etc) reset
      // current_value to 0 — new period starts fresh. For lifetime/all-time goals
      // KEEP the current value (e.g. lifetime revenue $50k stays $50k after we
      // raise the next target to $100k — we haven't lost the cumulative total).
      const shouldReset = nextTargetGoal.period !== 'all_time';
      await update(nextTargetGoal.id, {
        target_value: Number(nextTargetValue),
        current_value: shouldReset ? 0 : nextTargetGoal.current_value,
      } as any);
      toast.success(
        `🏆 ${nextTargetGoal.metric_name} milestone saved! New target: ${formatValue(nextTargetValue, nextTargetGoal.unit)}`,
      );
      setNextTargetGoal(null);
    } catch {
      toast.error('Failed to save milestone');
    } finally {
      setSavingMilestone(false);
    }
  }

  function openNew() {
    setEditing(null);
    reset({
      metric_name: '', target_value: 0, current_value: 0,
      unit: '#', period: 'monthly', lower_is_better: false, deadline: '', notes: '',
    });
    setSlideOpen(true);
  }

  function openEdit(goal: Goal) {
    setEditing(goal);
    reset({
      metric_name: goal.metric_name,
      target_value: goal.target_value,
      current_value: goal.current_value,
      unit: goal.unit,
      period: goal.period,
      lower_is_better: goal.lower_is_better,
      deadline: goal.deadline || '',
      notes: goal.notes || '',
    });
    setSlideOpen(true);
  }

  async function onSubmit(form: GoalForm) {
    const payload = {
      ...form,
      target_value: Number(form.target_value),
      current_value: Number(form.current_value),
      deadline: form.deadline || undefined,
    };
    try {
      if (editing) {
        await update(editing.id, payload);
        toast.success('Goal updated');
      } else {
        await create(payload);
        toast.success('Goal added');
      }
      setSlideOpen(false);
    } catch {
      toast.error('Failed to save goal');
    }
  }

  async function onDelete() {
    if (!deleteTarget) return;
    try {
      await remove(deleteTarget.id);
      toast.success('Goal deleted');
      setDeleteTarget(null);
    } catch {
      toast.error('Failed to delete');
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-7 w-32 bg-slate-200 rounded animate-pulse" />
            <div className="h-4 w-48 bg-slate-200 rounded animate-pulse" />
          </div>
          <div className="h-10 w-32 bg-slate-200 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => <CardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Goals</h2>
          <p className="text-slate-500 text-sm mt-1">Track key business metrics against targets</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2 bg-[#1B2A4A] text-white rounded-lg font-medium hover:bg-[#1e335a] transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Goal</span>
        </button>
      </div>

      {/* Recent Wins strip — visible motivation, only shows if there are recent milestones */}
      {recentWins.length > 0 && (
        <section className="bg-gradient-to-r from-amber-50 to-emerald-50 border border-amber-200 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-600" aria-hidden="true" />
            Recent Wins ({recentWins.length})
          </h3>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
            {recentWins.map(m => (
              <div
                key={m.id}
                className="bg-white rounded-lg px-3 py-2 border border-amber-200 shrink-0 min-w-[140px]"
              >
                <div className="text-xs text-slate-500 truncate">{m.metric_name}</div>
                <div className="text-sm font-semibold text-slate-900">
                  {formatValue(m.achieved_value, m.unit)}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Hit {formatValue(m.target_value, m.unit)}
                  {m.days_to_achieve != null && ` · ${m.days_to_achieve}d`}
                  {' · '}
                  {format(parseISO(m.achieved_at), 'MMM d')}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Cards */}
      {data.length === 0 ? (
        <EmptyState
          icon={Target}
          title="No goals set"
          description="Define your key business metrics and targets to track progress"
          actionLabel="Add Goal"
          onAction={openNew}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map(goal => {
            const status = getGoalStatus(goal);
            const pct = goal.target_value === 0 ? 0 : Math.min((goal.current_value / goal.target_value) * 100, 150);
            const barPct = Math.min(pct, 100);

            const achieved = isAchieved(goal) && !dismissedIds.has(goal.id);

            return (
              <div
                key={goal.id}
                className={cn(
                  'bg-white rounded-xl shadow-sm border p-5 hover:shadow-md transition-shadow cursor-pointer group',
                  achieved ? 'border-emerald-300 ring-2 ring-emerald-100' : 'border-slate-200',
                )}
                onClick={() => openEdit(goal)}
              >
                {/* 🎉 Achievement banner — auto-shown when goal hits target.
                    Two actions: 'Set next target' (the natural progression) or 'Stay here' (dismiss for session). */}
                {achieved && (
                  <div
                    className="-m-5 mb-4 px-4 py-3 rounded-t-xl bg-gradient-to-r from-emerald-50 to-emerald-100 border-b border-emerald-200"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-emerald-700 flex items-center gap-1.5">
                          <PartyPopper className="w-4 h-4" aria-hidden="true" />
                          Goal hit!
                        </div>
                        <div className="text-xs text-emerald-600 mt-0.5">
                          You reached {formatValue(goal.target_value, goal.unit)}{goal.lower_is_better && ' or lower'} — what's the next mark?
                        </div>
                      </div>
                      <button
                        onClick={() => setDismissedIds(prev => new Set([...prev, goal.id]))}
                        className="p-1 text-emerald-500 hover:text-emerald-700 hover:bg-white rounded-md shrink-0"
                        aria-label="Dismiss celebration"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex gap-2 mt-2.5">
                      <button
                        onClick={() => openNextTargetModal(goal)}
                        className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
                      >
                        Set next target →
                      </button>
                      <button
                        onClick={() => setDismissedIds(prev => new Set([...prev, goal.id]))}
                        className="px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-white/60 rounded-md transition-colors"
                      >
                        Stay here
                      </button>
                    </div>
                  </div>
                )}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-slate-900">{goal.metric_name}</h3>
                    <span className="text-xs text-slate-400">{PERIOD_LABELS[goal.period]}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border', status.bgColor, status.color, status.borderColor)}>
                      {status.label}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); setDeleteTarget(goal); }}
                      className="md:opacity-0 md:group-hover:opacity-100 p-1 text-slate-400 hover:text-red-600 transition-all"
                      aria-label={`Delete goal: ${goal.metric_name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-end gap-2 mb-3">
                  <span className="text-2xl font-bold text-slate-900">{formatValue(goal.current_value, goal.unit)}</span>
                  <span className="text-sm text-slate-400 mb-0.5">/ {formatValue(goal.target_value, goal.unit)}</span>
                </div>

                {/* Progress bar */}
                <div
                  className="w-full bg-slate-100 rounded-full h-2 mb-2"
                  role="progressbar"
                  aria-valuenow={Math.round(pct)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${goal.metric_name}: ${status.label}, ${Math.round(pct)}%`}
                >
                  <div
                    className={cn('h-2 rounded-full transition-all', status.label === 'Behind' ? 'bg-[#DC2626]' : status.label === 'On Track' ? 'bg-amber-500' : 'bg-[#16A34A]')}
                    style={{ width: `${barPct}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className={cn('font-medium', status.color)}>
                    {Math.round(pct)}%
                  </span>
                  <span className="text-slate-400 flex items-center gap-1">
                    {goal.lower_is_better ? (
                      <TrendingDown className="w-3 h-3" />
                    ) : (
                      <TrendingUp className="w-3 h-3" />
                    )}
                    {goal.lower_is_better ? 'Lower is better' : 'Higher is better'}
                  </span>
                </div>

                {goal.deadline && (
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-500">
                    <Calendar className="w-3 h-3" />
                    <span>Target by {format(parseISO(goal.deadline), 'dd MMM yyyy')}</span>
                    {(() => {
                      const daysLeft = differenceInDays(parseISO(goal.deadline), new Date());
                      if (daysLeft < 0) return <span className="ml-auto text-red-500 font-medium">Overdue</span>;
                      if (daysLeft <= 30) return <span className="ml-auto text-amber-600 font-medium">{daysLeft}d left</span>;
                      return <span className="ml-auto text-slate-400">{daysLeft}d left</span>;
                    })()}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* SlideOver Form */}
      <SlideOver open={slideOpen} onClose={() => setSlideOpen(false)} title={editing ? 'Edit Goal' : 'Add Goal'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Metric Name *</label>
            <input {...register('metric_name', { required: true })} placeholder="e.g. Monthly Revenue" className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Target Value *</label>
              <input type="number" step="any" min="0.01" {...register('target_value', { required: true, valueAsNumber: true, min: { value: 0.01, message: 'Must be positive' } })} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Current Value *</label>
              <input type="number" step="any" min="0" {...register('current_value', { required: true, valueAsNumber: true })} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Unit</label>
              <select {...register('unit')} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]">
                {UNIT_OPTIONS.map(u => <option key={u} value={u}>{u === '$' ? '$ Dollar' : u === '%' ? '% Percent' : '# Count'}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Period</label>
              <select {...register('period')} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]">
                {PERIOD_OPTIONS.map(p => <option key={p} value={p}>{PERIOD_LABELS[p]}</option>)}
              </select>
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
            <input type="checkbox" {...register('lower_is_better')} className="rounded border-slate-300 text-[#0D9488] focus:ring-[#0D9488]" />
            Lower is better (e.g. Cost Per Lead)
          </label>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Deadline</label>
            <input type="date" {...register('deadline')} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
            <textarea {...register('notes')} rows={3} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]" />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button type="button" onClick={() => setSlideOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-white bg-[#1B2A4A] rounded-lg hover:bg-[#1e335a] transition-colors disabled:opacity-50">
              {isSubmitting ? 'Saving...' : editing ? 'Update' : 'Add'} {isSubmitting ? '' : 'Goal'}
            </button>
          </div>
        </form>
      </SlideOver>

      {/* Confirm Delete */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={onDelete}
        title="Delete Goal"
        description={`Are you sure you want to delete "${deleteTarget?.metric_name}"? This action cannot be undone.`}
      />

      {/* Next Target modal — fires when user clicks 'Set next target' on an achieved goal.
          Pre-fills with a sensible suggestion (×1.5 higher-is-better, ×0.7 lower); user can override. */}
      {nextTargetGoal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60"
          onClick={() => !savingMilestone && setNextTargetGoal(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="next-target-title"
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3 mb-1">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                <Trophy className="w-5 h-5 text-amber-600" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <h3 id="next-target-title" className="text-lg font-semibold text-slate-900">
                  Next target — {nextTargetGoal.metric_name}
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  You hit {formatValue(nextTargetGoal.target_value, nextTargetGoal.unit)}.
                  {' '}
                  {nextTargetGoal.lower_is_better
                    ? 'Suggested: tighten by 30%.'
                    : 'Suggested: stretch by 50%.'}
                  {' '}
                  Override if you want a different mark.
                </p>
              </div>
            </div>
            <div className="mt-5">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                New target ({nextTargetGoal.unit})
              </label>
              <input
                type="number"
                step="any"
                min="0"
                value={nextTargetValue}
                onChange={(e) => setNextTargetValue(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
                autoFocus
              />
              <p className="text-xs text-slate-400 mt-1">
                {nextTargetGoal.period === 'all_time'
                  ? 'Saving raises the bar but keeps your cumulative total — lifetime metrics only ever climb.'
                  : 'Saving will reset progress to 0 and log this milestone to your wins history.'}
              </p>
            </div>
            <div className="flex justify-end gap-3 pt-5 mt-5 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setNextTargetGoal(null)}
                disabled={savingMilestone}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveNextTarget}
                disabled={savingMilestone || nextTargetValue <= 0}
                className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 disabled:opacity-50"
              >
                {savingMilestone ? 'Saving…' : 'Save & celebrate 🏆'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
