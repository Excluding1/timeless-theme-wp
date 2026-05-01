import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Target, TrendingUp, TrendingDown, Pencil, Trash2, Calendar } from 'lucide-react';
import { format, parseISO, differenceInDays } from 'date-fns';
import { toast } from 'sonner';
import { SlideOver } from '../components/SlideOver';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { EmptyState } from '../components/EmptyState';
import { CardSkeleton } from '../components/LoadingSkeleton';
import { useData } from '../hooks/useData';
import { cn } from '../lib/utils';
import type { Goal } from '../lib/database';

const UNIT_OPTIONS = ['$', '%', '#'] as const;
const PERIOD_OPTIONS = ['weekly', 'monthly', 'quarterly', 'annual'] as const;
const PERIOD_LABELS: Record<string, string> = {
  weekly: 'Weekly', monthly: 'Monthly', quarterly: 'Quarterly', annual: 'Annual',
};

type GoalForm = {
  metric_name: string;
  target_value: number;
  current_value: number;
  unit: '$' | '%' | '#';
  period: 'weekly' | 'monthly' | 'quarterly' | 'annual';
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

export function Goals() {
  const { data: rawData, loading, create, update, remove } = useData('goals');
  const data = rawData as unknown as Goal[];
  const [slideOpen, setSlideOpen] = useState(false);
  const [editing, setEditing] = useState<Goal | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Goal | null>(null);

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<GoalForm>();

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

            return (
              <div
                key={goal.id}
                className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-shadow cursor-pointer group"
                onClick={() => openEdit(goal)}
              >
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
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-600 transition-all"
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
                <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
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
    </div>
  );
}
