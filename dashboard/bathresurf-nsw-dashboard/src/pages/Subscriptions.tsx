import React, { useState, useMemo } from 'react';
import {
  Plus, Search, CreditCard, LayoutGrid, Table2, AlertTriangle,
  Calendar, ExternalLink, Pencil, Trash2, RefreshCw, Tag, TrendingUp, X, DollarSign,
} from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { format, differenceInDays, parseISO, isValid } from 'date-fns';
import { toast } from 'sonner';

import { SlideOver } from '../components/SlideOver';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { EmptyState } from '../components/EmptyState';
import { Skeleton, CardSkeleton } from '../components/LoadingSkeleton';
import { useData } from '../hooks/useData';
import { usePreferences } from '../contexts/PreferencesContext';
import { cn, sanitizeUrl } from '../lib/utils';
import type { Subscription, PriceChange } from '../lib/database';

// ─── Constants ───────────────────────────────────────────────────────────────

const CATEGORIES = [
  'CRM', 'Job Mgmt', 'Accounting', 'Payments', 'Communication',
  'Advertising', 'Hosting', 'Design', 'Analytics', 'Insurance', 'Legal', 'Other',
] as const;

const STATUSES = ['active', 'paused', 'cancelled', 'trial'] as const;
const BILLING_CYCLES = ['monthly', 'quarterly', 'annually', 'one-off'] as const;
const MANAGED_BY_OPTIONS = ['Allan', 'Marko', 'Both'] as const;

const STATUS_STYLES: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  active:    { label: 'Active',    bg: 'bg-emerald-50',  text: 'text-emerald-700', dot: 'bg-emerald-500' },
  paused:    { label: 'Paused',    bg: 'bg-amber-50',    text: 'text-amber-700',   dot: 'bg-amber-500' },
  cancelled: { label: 'Cancelled', bg: 'bg-red-50',      text: 'text-red-700',     dot: 'bg-red-500' },
  trial:     { label: 'Trial',     bg: 'bg-blue-50',     text: 'text-blue-700',    dot: 'bg-blue-500' },
};

// ─── Types ───────────────────────────────────────────────────────────────────

type FormData = {
  name: string;
  category: string;
  status: string;
  cost: number;
  billing_cycle: string;
  start_date: string;
  next_renewal: string;
  auto_renew: boolean;
  managed_by: string;
  login_url: string;
  plan_name: string;
  notes: string;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function toMonthlyCost(cost: number | string, cycle: string): number {
  const c = Number(cost) || 0;
  switch (cycle) {
    case 'annually':  return c / 12;
    case 'quarterly': return c / 3;
    case 'monthly':   return c;
    default:          return 0; // one-off doesn't count
  }
}

function safeDateFormat(dateStr: string | undefined | null, fmt_str: string = 'dd MMM yyyy'): string {
  if (!dateStr) return '';
  try {
    const d = parseISO(dateStr);
    if (!isValid(d)) return '';
    return format(d, fmt_str);
  } catch { return ''; }
}

function fmtCurrency(v: number | string): string {
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(Number(v) || 0);
}

function fmtCycle(c: string): string {
  switch (c) {
    case 'monthly':   return '/mo';
    case 'quarterly': return '/qtr';
    case 'annually':  return '/yr';
    case 'one-off':   return ' one-off';
    default:          return '';
  }
}

function fmtCycleLabel(c: string): string {
  switch (c) {
    case 'monthly':   return 'Monthly';
    case 'quarterly': return 'Quarterly';
    case 'annually':  return 'Annually';
    case 'one-off':   return 'One-off';
    default:          return c;
  }
}

const EMPTY_FORM: FormData = {
  name: '', category: 'Other', status: 'active', cost: 0,
  billing_cycle: 'monthly', start_date: '', next_renewal: '', auto_renew: true,
  managed_by: '', login_url: '', plan_name: '', notes: '',
};

// ─── Component ───────────────────────────────────────────────────────────────

export function Subscriptions() {
  const { data: subscriptions, loading, create, update, remove } = useData('subscriptions');
  const { create: createFinance } = useData('finances');

  const [search, setSearch] = useState('');
  const { preferences, updatePreferences } = usePreferences();
  const viewMode = (preferences.default_subscription_view as 'cards' | 'table') || 'cards';
  const setViewMode = (next: 'cards' | 'table') => updatePreferences({ default_subscription_view: next });
  const [slideOpen, setSlideOpen] = useState(false);
  const [editing, setEditing] = useState<Subscription | null>(null);
  const [logToFinances, setLogToFinances] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Subscription | null>(null);
  const [logFinanceTarget, setLogFinanceTarget] = useState<Subscription | null>(null);
  const [priceChanges, setPriceChanges] = useState<PriceChange[]>([]);

  const {
    register, handleSubmit, reset, control, watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ defaultValues: EMPTY_FORM });

  const watchedStatus = watch('status');

  // ── Derived data ───────────────────────────────────────────────────────────

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    const list = subscriptions.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        (s.plan_name && s.plan_name.toLowerCase().includes(q))
    );
    return [...list].sort((a, b) => {
      // Empty string treated same as null — push to end (no renewal date)
      if (!a.next_renewal || a.next_renewal === '') return 1;
      if (!b.next_renewal || b.next_renewal === '') return -1;
      return a.next_renewal.localeCompare(b.next_renewal);
    });
  }, [subscriptions, search]);

  const renewingSoon = useMemo(() => {
    const now = new Date();
    return filtered.filter((s) => {
      if (s.status !== 'active' && s.status !== 'trial') return false;
      if (!s.next_renewal) return false;
      const d = parseISO(s.next_renewal);
      if (!isValid(d)) return false;
      const diff = differenceInDays(d, now);
      return diff >= 0 && diff < 14;
    });
  }, [filtered]);

  const summary = useMemo(() => {
    let totalMonthly = 0;
    let activeCount = 0;
    let trialCount = 0;
    subscriptions.forEach((s) => {
      if (s.status === 'active') {
        activeCount++;
        totalMonthly += toMonthlyCost(s.cost, s.billing_cycle);
      }
      if (s.status === 'trial') {
        trialCount++;
        totalMonthly += toMonthlyCost(s.cost, s.billing_cycle);
      }
    });
    return { totalMonthly, totalAnnual: totalMonthly * 12, activeCount, trialCount };
  }, [subscriptions]);

  // ── Actions ────────────────────────────────────────────────────────────────

  function openCreate() {
    setEditing(null);
    reset(EMPTY_FORM);
    setPriceChanges([]);
    setLogToFinances(true);
    setSlideOpen(true);
  }

  function openEdit(sub: Subscription) {
    setEditing(sub);
    reset({
      name: sub.name,
      category: sub.category,
      status: sub.status,
      cost: sub.cost,
      billing_cycle: sub.billing_cycle,
      start_date: sub.start_date || '',
      next_renewal: sub.next_renewal || '',
      auto_renew: sub.auto_renew,
      managed_by: sub.managed_by || '',
      login_url: sub.login_url || '',
      plan_name: sub.plan_name || '',
      notes: sub.notes || '',
    });
    setPriceChanges(sub.price_changes ? [...sub.price_changes] : []);
    setSlideOpen(true);
  }

  async function onSubmit(data: FormData) {
    try {
      const payload: Partial<Subscription> = {
        name: data.name,
        category: data.category,
        status: data.status as Subscription['status'],
        cost: Number(data.cost),
        billing_cycle: data.billing_cycle as Subscription['billing_cycle'],
        start_date: data.start_date || undefined,
        next_renewal: data.next_renewal || undefined,
        auto_renew: data.auto_renew,
        managed_by: data.managed_by || undefined,
        login_url: data.login_url || undefined,
        plan_name: data.plan_name || undefined,
        notes: data.notes || undefined,
        price_changes: priceChanges.length > 0 ? priceChanges : undefined,
      };

      if (editing) {
        await update(editing.id, payload);
        toast.success('Subscription updated');
      } else {
        await create(payload);
        // Also log to Finances if checkbox is checked
        if (logToFinances && Number(data.cost) > 0) {
          await createFinance({
            date: data.start_date || new Date().toISOString().split('T')[0],
            type: 'expense',
            category: 'Software & Subs',
            description: `${data.name}${data.plan_name ? ` (${data.plan_name})` : ''} — ${fmtCycleLabel(data.billing_cycle)}`,
            amount: Number(data.cost),
            payment_method: 'Credit Card',
            gst_included: false,
            receipt_photos: [],
            notes: `Auto-logged from Subscriptions`,
          } as any);
          toast.success('Subscription created + logged to Finances');
        } else {
          toast.success('Subscription created');
        }
      }
      setSlideOpen(false);
    } catch {
      toast.error('Something went wrong');
    }
  }

  async function onDelete() {
    if (!deleteTarget) return;
    try {
      await remove(deleteTarget.id);
      toast.success('Subscription deleted');
      setDeleteTarget(null);
    } catch {
      toast.error('Failed to delete subscription');
    }
  }

  async function onLogToFinances() {
    if (!logFinanceTarget) return;
    const sub = logFinanceTarget;
    const cost = Number(sub.cost) || 0;
    if (cost <= 0) {
      toast.error('Cannot log $0 subscription to Finances');
      setLogFinanceTarget(null);
      return;
    }
    try {
      await createFinance({
        date: new Date().toISOString().split('T')[0],
        type: 'expense',
        category: 'Software & Subs',
        description: `${sub.name}${sub.plan_name ? ` (${sub.plan_name})` : ''} — ${fmtCycleLabel(sub.billing_cycle)}`,
        amount: cost,
        payment_method: 'Credit Card',
        gst_included: false,
        receipt_photos: [],
        notes: 'Manually logged from Subscriptions',
      } as any);
      toast.success(`${sub.name} logged to Finances`);
      setLogFinanceTarget(null);
    } catch {
      toast.error('Failed to log to Finances');
    }
  }

  // ── Shared classes ─────────────────────────────────────────────────────────

  const labelCls = 'block text-sm font-medium text-slate-700 mb-1';
  const inputCls =
    'w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent';

  // ── Status badge helper ────────────────────────────────────────────────────

  function StatusBadge({ status }: { status: string }) {
    const cfg = STATUS_STYLES[status] ?? STATUS_STYLES.active;
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
          cfg.bg,
          cfg.text
        )}
      >
        <span className={cn('w-1.5 h-1.5 rounded-full', cfg.dot)} />
        {cfg.label}
      </span>
    );
  }

  // ── Renewal info helper ────────────────────────────────────────────────────

  function RenewalInfo({ renewal }: { renewal?: string }) {
    if (!renewal) return <span className="text-slate-400">No renewal date</span>;
    const d = parseISO(renewal);
    if (!isValid(d)) return <span className="text-slate-400">Invalid date</span>;
    const diff = differenceInDays(d, new Date());
    const isUrgent = diff >= 0 && diff < 14;
    return (
      <span className={cn('flex items-center gap-1', isUrgent ? 'text-amber-600 font-medium' : 'text-slate-500')}>
        <Calendar className="w-3.5 h-3.5" />
        {format(d, 'dd MMM yyyy')}
        {diff >= 0 && <span className="text-slate-400">({diff}d)</span>}
      </span>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  RENDER
  // ═══════════════════════════════════════════════════════════════════════════

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-7 w-28" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Subscriptions</h2>
          <p className="text-slate-500 text-sm mt-1">Track and manage all business subscriptions</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-[#1B2A4A] text-white rounded-lg font-medium hover:bg-[#1e335a] transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Subscription</span>
        </button>
      </div>

      {/* ── Renewal Alert Banner ────────────────────────────────────────────── */}
      {renewingSoon.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800">
              {renewingSoon.length} subscription{renewingSoon.length !== 1 ? 's' : ''} renewing in the next 14 days
            </p>
            <p className="text-xs text-amber-700 mt-1">
              {renewingSoon.map((s) => s.name).join(', ')}
            </p>
          </div>
        </div>
      )}

      {/* ── Summary Bar ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Monthly Cost</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{fmtCurrency(summary.totalMonthly)}</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Annual Cost</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{fmtCurrency(summary.totalAnnual)}</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Active</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{summary.activeCount}</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Trial</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{summary.trialCount}</p>
        </div>
      </div>

      {/* ── Search + View Toggle ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search subscriptions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent"
          />
        </div>
        <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
          <button
            onClick={() => setViewMode('cards')}
            className={cn(
              'p-2 rounded-md transition-colors',
              viewMode === 'cards' ? 'bg-[#1B2A4A] text-white' : 'text-slate-500 hover:text-slate-700'
            )}
            title="Card view"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={cn(
              'p-2 rounded-md transition-colors',
              viewMode === 'table' ? 'bg-[#1B2A4A] text-white' : 'text-slate-500 hover:text-slate-700'
            )}
            title="Table view"
          >
            <Table2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Empty State ─────────────────────────────────────────────────────── */}
      {filtered.length === 0 && (
        <EmptyState
          icon={CreditCard}
          title="No subscriptions found"
          description={
            search
              ? 'No subscriptions match your search. Try a different term.'
              : 'Add your first subscription to start tracking costs and renewals.'
          }
          actionLabel={search ? undefined : 'Add Subscription'}
          onAction={search ? undefined : openCreate}
        />
      )}

      {/* ── Card View ───────────────────────────────────────────────────────── */}
      {viewMode === 'cards' && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((sub) => {
            const renewDate = sub.next_renewal ? parseISO(sub.next_renewal) : null;
            const daysUntil =
              renewDate && isValid(renewDate) ? differenceInDays(renewDate, new Date()) : null;

            return (
              <div
                key={sub.id}
                onClick={() => openEdit(sub)}
                className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group relative"
              >
                {/* Card actions */}
                <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setLogFinanceTarget(sub);
                    }}
                    className="p-1.5 text-slate-400 hover:text-[#0D9488] rounded-lg hover:bg-teal-50"
                    title="Log to Finances"
                  >
                    <DollarSign className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteTarget(sub);
                    }}
                    className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Header */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                    <CreditCard className="w-5 h-5 text-slate-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-900 truncate">{sub.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-slate-500">{sub.category}</span>
                      {sub.plan_name && (
                        <>
                          <span className="text-slate-300">&middot;</span>
                          <span className="text-xs text-slate-500">{sub.plan_name}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Cost + Status */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xl font-bold text-slate-900">
                    {fmtCurrency(sub.cost)}
                    <span className="text-sm font-normal text-slate-500">{fmtCycle(sub.billing_cycle)}</span>
                  </span>
                  <StatusBadge status={sub.status} />
                </div>

                {/* Renewal + auto-renew */}
                <div className="flex items-center justify-between text-xs">
                  <RenewalInfo renewal={sub.next_renewal} />
                  {sub.auto_renew && (
                    <span className="flex items-center gap-1 text-slate-400">
                      <RefreshCw className="w-3 h-3" />
                      Auto
                    </span>
                  )}
                </div>

                {sub.price_changes && sub.price_changes.length > 0 && (
                  <div className="mt-3 p-2 rounded-lg bg-amber-50 border border-amber-100">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-amber-700">
                      <TrendingUp className="w-3 h-3" />
                      Price change scheduled
                    </div>
                    {sub.price_changes.map((pc, i) => (
                      <p key={i} className="text-xs text-amber-600 mt-0.5">
                        {fmtCurrency(Number(pc.new_cost) || 0)}{fmtCycle(sub.billing_cycle)}{safeDateFormat(pc.effective_date) ? ` from ${safeDateFormat(pc.effective_date)}` : ''}
                        {pc.note && <span className="text-amber-500"> — {pc.note}</span>}
                      </p>
                    ))}
                  </div>
                )}

                {sub.managed_by && (
                  <p className="text-xs text-slate-400 mt-2">Managed by {sub.managed_by}</p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Table View ──────────────────────────────────────────────────────── */}
      {viewMode === 'table' && filtered.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                  <th className="p-4">Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Cost</th>
                  <th className="p-4">Renewal</th>
                  <th className="p-4">Managed By</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filtered.map((sub) => (
                  <tr
                    key={sub.id}
                    onClick={() => openEdit(sub)}
                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <td className="p-4">
                      <p className="font-medium text-slate-900">{sub.name}</p>
                      {sub.plan_name && <p className="text-xs text-slate-500">{sub.plan_name}</p>}
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 text-slate-600">
                        <Tag className="w-3.5 h-3.5 text-slate-400" />
                        {sub.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <StatusBadge status={sub.status} />
                    </td>
                    <td className="p-4 text-right font-medium text-slate-900">
                      {fmtCurrency(sub.cost)}
                      <span className="text-xs font-normal text-slate-500 ml-1">
                        {fmtCycle(sub.billing_cycle)}
                      </span>
                    </td>
                    <td className="p-4">
                      <RenewalInfo renewal={sub.next_renewal} />
                    </td>
                    <td className="p-4 text-slate-600">
                      {sub.managed_by || <span className="text-slate-400">&mdash;</span>}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {sub.login_url && (
                          <a
                            href={sanitizeUrl(sub.login_url)}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-1.5 text-slate-400 hover:text-[#0D9488] rounded-lg hover:bg-teal-50 transition-colors"
                            title="Open login page"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openEdit(sub);
                          }}
                          className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setLogFinanceTarget(sub);
                          }}
                          className="p-1.5 text-slate-400 hover:text-[#0D9488] rounded-lg hover:bg-teal-50 transition-colors"
                          title="Log to Finances"
                        >
                          <DollarSign className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteTarget(sub);
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── SlideOver Form ──────────────────────────────────────────────────── */}
      <SlideOver
        open={slideOpen}
        onClose={() => setSlideOpen(false)}
        title={editing ? 'Edit Subscription' : 'Add Subscription'}
        width="md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name */}
          <div>
            <label className={labelCls}>Name *</label>
            <input
              {...register('name', { required: 'Name is required' })}
              className={cn(inputCls, errors.name && 'border-red-400 focus:ring-red-400')}
              placeholder="e.g. ServiceM8"
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
          </div>

          {/* Category */}
          <div>
            <label className={labelCls}>Category</label>
            <select {...register('category')} className={inputCls}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className={labelCls}>Status</label>
            <select {...register('status')} className={inputCls}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Cost + Billing Cycle */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Cost *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                <input
                  type="number"
                  step="0.01"
                  {...register('cost', {
                    required: 'Cost is required',
                    valueAsNumber: true,
                    min: { value: 0, message: 'Must be positive' },
                  })}
                  className={cn(inputCls, 'pl-7', errors.cost && 'border-red-400 focus:ring-red-400')}
                  placeholder="0.00"
                />
              </div>
              {errors.cost && <p className="text-xs text-red-500 mt-1">{errors.cost.message}</p>}
            </div>
            <div>
              <label className={labelCls}>Billing Cycle</label>
              <select {...register('billing_cycle')} className={inputCls}>
                {BILLING_CYCLES.map((c) => (
                  <option key={c} value={c}>
                    {fmtCycleLabel(c)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Start Date */}
          <div>
            <label className={labelCls}>Subscribed Date</label>
            <input
              type="date"
              {...register('start_date')}
              className={inputCls}
            />
          </div>

          {/* Next Renewal */}
          <div>
            <label className={labelCls}>
              Next Renewal{watchedStatus === 'active' || watchedStatus === 'trial' ? ' *' : ''}
            </label>
            <input
              type="date"
              {...register('next_renewal', {
                validate: (value) => {
                  if ((watchedStatus === 'active' || watchedStatus === 'trial') && !value) {
                    return 'Required for active/trial subscriptions';
                  }
                  return true;
                },
              })}
              className={cn(inputCls, errors.next_renewal && 'border-red-400 focus:ring-red-400')}
            />
            {errors.next_renewal && (
              <p className="text-xs text-red-500 mt-1">{errors.next_renewal.message}</p>
            )}
          </div>

          {/* Auto Renew */}
          <div className="flex items-center gap-3">
            <Controller
              name="auto_renew"
              control={control}
              render={({ field }) => (
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={field.onChange}
                  className="w-4 h-4 rounded border-slate-300 text-[#0D9488] focus:ring-[#0D9488]"
                />
              )}
            />
            <label className="text-sm text-slate-700">Auto-renew</label>
          </div>

          {/* Managed By */}
          <div>
            <label className={labelCls}>Managed By</label>
            <select {...register('managed_by')} className={inputCls}>
              <option value="">-- Select --</option>
              {MANAGED_BY_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>

          {/* Login URL */}
          <div>
            <label className={labelCls}>Login URL</label>
            <input
              type="url"
              {...register('login_url')}
              className={inputCls}
              placeholder="https://..."
            />
          </div>

          {/* Plan Name */}
          <div>
            <label className={labelCls}>Plan Name</label>
            <input
              {...register('plan_name')}
              className={inputCls}
              placeholder="e.g. Pro, Business, Enterprise"
            />
          </div>

          {/* Price Schedule */}
          <div>
            <label className={labelCls}>Scheduled Price Changes</label>
            <p className="text-xs text-slate-500 mb-2">Set future price changes (e.g. promo ending, plan upgrade)</p>
            {priceChanges.map((pc, i) => (
              <div key={i} className="flex items-center gap-2 mb-2">
                <input
                  type="date"
                  value={pc.effective_date}
                  onChange={(e) => {
                    const updated = [...priceChanges];
                    updated[i] = { ...updated[i], effective_date: e.target.value };
                    setPriceChanges(updated);
                  }}
                  className={cn(inputCls, 'flex-1')}
                />
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={pc.new_cost}
                    onChange={(e) => {
                      const updated = [...priceChanges];
                      updated[i] = { ...updated[i], new_cost: Number(e.target.value) };
                      setPriceChanges(updated);
                    }}
                    className={cn(inputCls, 'pl-7')}
                    placeholder="0.00"
                  />
                </div>
                <input
                  type="text"
                  value={pc.note || ''}
                  onChange={(e) => {
                    const updated = [...priceChanges];
                    updated[i] = { ...updated[i], note: e.target.value };
                    setPriceChanges(updated);
                  }}
                  className={cn(inputCls, 'flex-1')}
                  placeholder="Note"
                />
                <button
                  type="button"
                  onClick={() => setPriceChanges(priceChanges.filter((_, j) => j !== i))}
                  className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setPriceChanges([...priceChanges, { effective_date: '', new_cost: 0 }])}
              className="text-sm text-[#0D9488] hover:text-[#0a7c72] font-medium flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              Add price change
            </button>
          </div>

          {/* Notes */}
          <div>
            <label className={labelCls}>Notes</label>
            <textarea
              {...register('notes')}
              rows={3}
              className={cn(inputCls, 'resize-none')}
              placeholder="Additional notes..."
            />
          </div>

          {/* Log to Finances checkbox — only show for new subscriptions */}
          {!editing && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
              <input
                type="checkbox"
                id="logToFinances"
                checked={logToFinances}
                onChange={(e) => setLogToFinances(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-[#0D9488] focus:ring-[#0D9488]"
              />
              <label htmlFor="logToFinances" className="text-sm text-slate-700 cursor-pointer">
                Also log this payment to <span className="font-medium">Finances</span> as an expense
              </label>
            </div>
          )}

          {/* Form actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 bg-[#1B2A4A] text-white rounded-lg font-medium hover:bg-[#1e335a] transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : editing ? 'Update Subscription' : 'Add Subscription'}
            </button>
            <button
              type="button"
              onClick={() => setSlideOpen(false)}
              className="px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </SlideOver>

      {/* ── Confirm Delete Dialog ───────────────────────────────────────────── */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={onDelete}
        title="Delete Subscription"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
      />

      {/* Log to Finances confirm */}
      <ConfirmDialog
        open={!!logFinanceTarget}
        onClose={() => setLogFinanceTarget(null)}
        onConfirm={onLogToFinances}
        title="Log to Finances"
        description={`Log "${logFinanceTarget?.name}" as a ${fmtCurrency(Number(logFinanceTarget?.cost) || 0)} expense in Finances?`}
        confirmLabel="Log Payment"
      />
    </div>
  );
}
