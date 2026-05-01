import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import {
  ClipboardCheck, ChevronLeft, ChevronRight, Plus, Pencil, Eye, EyeOff,
  CheckCircle2, Circle, ChevronDown
} from 'lucide-react';
import { format, startOfWeek, addWeeks, subWeeks } from 'date-fns';
import { toast } from 'sonner';
import { SlideOver } from '../components/SlideOver';
import { EmptyState } from '../components/EmptyState';
import { useData } from '../hooks/useData';
import { cn } from '../lib/utils';
import type { WeeklyReviewItem, WeeklyReviewCheck } from '../lib/database';

type ItemForm = {
  text: string;
};

export function WeeklyReview() {
  const { data: items, loading: itemsLoading, create: createItem, update: updateItem } = useData('weekly_review_items');
  const { data: checks, loading: checksLoading, create: createCheck, update: updateCheck } = useData('weekly_review_checks');

  const [currentWeek, setCurrentWeek] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [slideOpen, setSlideOpen] = useState(false);
  const [editing, setEditing] = useState<WeeklyReviewItem | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const autoInsertedRef = useRef<Set<string>>(new Set());

  const { register, handleSubmit, reset } = useForm<ItemForm>();

  const weekKey = format(currentWeek, 'yyyy-MM-dd');

  const activeItems = useMemo(() => {
    return items.filter(item => item.is_active).sort((a, b) => a.sort_order - b.sort_order);
  }, [items]);

  // Auto-insert checks for current week if none exist
  useEffect(() => {
    if (itemsLoading || checksLoading) return;
    if (autoInsertedRef.current.has(weekKey)) return;

    const weekChecks = checks.filter(c => c.week_of === weekKey);
    if (weekChecks.length === 0 && activeItems.length > 0) {
      autoInsertedRef.current.add(weekKey);
      activeItems.forEach(item => {
        createCheck({
          item_id: item.id,
          week_of: weekKey,
          checked: false,
        });
      });
    }
  }, [itemsLoading, checksLoading, weekKey, activeItems, checks, createCheck]);

  // Get checks for current week
  const weekChecks = useMemo(() => {
    const map: Record<string, WeeklyReviewCheck> = {};
    checks.filter(c => c.week_of === weekKey).forEach(c => {
      map[c.item_id] = c;
    });
    return map;
  }, [checks, weekKey]);

  const completedCount = useMemo(() => {
    return activeItems.filter(item => weekChecks[item.id]?.checked).length;
  }, [activeItems, weekChecks]);

  const totalCount = activeItems.length;
  const pct = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  async function toggleCheck(itemId: string) {
    const existing = weekChecks[itemId];
    if (existing) {
      try {
        await updateCheck(existing.id, {
          checked: !existing.checked,
          checked_at: new Date().toISOString(),
        });
      } catch {
        toast.error('Failed to update check');
      }
    } else {
      try {
        await createCheck({
          item_id: itemId,
          week_of: weekKey,
          checked: true,
          checked_at: new Date().toISOString(),
        });
      } catch {
        toast.error('Failed to create check');
      }
    }
  }

  function openNew() {
    setEditing(null);
    reset({ text: '' });
    setSlideOpen(true);
  }

  function openEdit(item: WeeklyReviewItem) {
    setEditing(item);
    reset({ text: item.text });
    setSlideOpen(true);
  }

  async function onSubmit(form: ItemForm) {
    try {
      if (editing) {
        await updateItem(editing.id, { text: form.text });
        toast.success('Item updated');
      } else {
        await createItem({
          text: form.text,
          sort_order: items.length,
          is_active: true,
        });
        toast.success('Item added');
      }
      setSlideOpen(false);
    } catch {
      toast.error('Failed to save item');
    }
  }

  async function toggleActive(item: WeeklyReviewItem) {
    try {
      await updateItem(item.id, { is_active: !item.is_active });
      toast.success(item.is_active ? 'Item deactivated' : 'Item reactivated');
    } catch {
      toast.error('Failed to update item');
    }
  }

  const loading = itemsLoading || checksLoading;

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-7 w-48 bg-slate-200 rounded animate-pulse" />
            <div className="h-4 w-64 bg-slate-200 rounded animate-pulse" />
          </div>
          <div className="h-10 w-32 bg-slate-200 rounded animate-pulse" />
        </div>
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-slate-200 rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-slate-200 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Weekly Review</h2>
          <p className="text-slate-500 text-sm mt-1">Complete your weekly checklist items</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2 bg-[#1B2A4A] text-white rounded-lg font-medium hover:bg-[#1e335a] transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Item</span>
        </button>
      </div>

      {/* Week Selector */}
      <div className="flex items-center justify-between bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <button
          onClick={() => setCurrentWeek(prev => subWeeks(prev, 1))}
          className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <p className="font-semibold text-slate-900">Week of {format(currentWeek, 'MMMM d, yyyy')}</p>
          <p className="text-xs text-slate-500 mt-0.5">Monday start</p>
        </div>
        <button
          onClick={() => setCurrentWeek(prev => addWeeks(prev, 1))}
          className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* History Dropdown */}
      <div className="relative">
        <button
          onClick={() => setHistoryOpen(!historyOpen)}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
        >
          <ChevronDown className={cn('w-4 h-4 transition-transform', historyOpen && 'rotate-180')} />
          View past weeks
        </button>
        {historyOpen && (
          <div className="absolute top-8 left-0 bg-white border border-slate-200 rounded-lg shadow-lg z-10 py-1 min-w-[220px]">
            {[-3, -2, -1, 0].map(offset => {
              const week = addWeeks(startOfWeek(new Date(), { weekStartsOn: 1 }), offset);
              const wk = format(week, 'yyyy-MM-dd');
              const isSelected = wk === weekKey;
              const weekCheckCount = checks.filter(c => c.week_of === wk && c.checked).length;
              return (
                <button
                  key={wk}
                  onClick={() => { setCurrentWeek(week); setHistoryOpen(false); }}
                  className={cn(
                    'w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors flex items-center justify-between',
                    isSelected ? 'bg-slate-50 font-medium text-[#1B2A4A]' : 'text-slate-600'
                  )}
                >
                  <span>
                    Week of {format(week, 'MMM d, yyyy')}
                    {offset === 0 && <span className="text-xs text-slate-400 ml-2">(current)</span>}
                  </span>
                  {weekCheckCount > 0 && (
                    <span className="text-xs text-[#16A34A] font-medium">{weekCheckCount} done</span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-700">Progress</span>
          <span className="text-sm text-slate-500">{completedCount} of {totalCount} completed ({pct}%)</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-3">
          <div
            className={cn(
              'h-3 rounded-full transition-all duration-500',
              pct === 100 ? 'bg-[#16A34A]' : pct >= 50 ? 'bg-[#0D9488]' : 'bg-amber-500'
            )}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Checklist */}
      {activeItems.length === 0 ? (
        <EmptyState
          icon={ClipboardCheck}
          title="No checklist items"
          description="Add items to your weekly review checklist to track recurring tasks"
          actionLabel="Add Item"
          onAction={openNew}
        />
      ) : (
        <div className="space-y-2">
          {activeItems.map(item => {
            const isChecked = weekChecks[item.id]?.checked || false;
            return (
              <div
                key={item.id}
                className={cn(
                  'bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex items-center gap-3 group transition-colors',
                  isChecked && 'bg-slate-50 border-slate-100'
                )}
              >
                <button
                  onClick={() => toggleCheck(item.id)}
                  className="shrink-0"
                >
                  {isChecked ? (
                    <CheckCircle2 className="w-5 h-5 text-[#16A34A]" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-300 hover:text-[#0D9488]" />
                  )}
                </button>
                <span className={cn('flex-1 text-sm', isChecked ? 'text-slate-400 line-through' : 'text-slate-700')}>
                  {item.text}
                </span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEdit(item)}
                    className="p-1 text-slate-400 hover:text-slate-700 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleActive(item)}
                    className="p-1 text-slate-400 hover:text-amber-600 transition-colors"
                    title="Deactivate item"
                  >
                    <EyeOff className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Inactive Items */}
      {items.filter(i => !i.is_active).length > 0 && (
        <div className="pt-4 border-t border-slate-200">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Deactivated Items</p>
          <div className="space-y-2">
            {items.filter(i => !i.is_active).map(item => (
              <div key={item.id} className="bg-slate-50 rounded-lg border border-slate-100 p-3 flex items-center gap-3 text-sm text-slate-400">
                <span className="flex-1 line-through">{item.text}</span>
                <button
                  onClick={() => toggleActive(item)}
                  className="p-1 text-slate-400 hover:text-[#16A34A] transition-colors"
                  title="Reactivate item"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SlideOver Form */}
      <SlideOver open={slideOpen} onClose={() => setSlideOpen(false)} title={editing ? 'Edit Item' : 'Add Item'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Item Text *</label>
            <input
              {...register('text', { required: true })}
              placeholder="e.g. Review Google Ads performance"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button type="button" onClick={() => setSlideOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-[#1B2A4A] rounded-lg hover:bg-[#1e335a] transition-colors">
              {editing ? 'Update' : 'Add'} Item
            </button>
          </div>
        </form>
      </SlideOver>
    </div>
  );
}
