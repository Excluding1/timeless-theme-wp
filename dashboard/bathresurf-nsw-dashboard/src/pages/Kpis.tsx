import React, { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, TrendingUp, TrendingDown, Pencil, Trash2, BarChart3 } from 'lucide-react';
import { format, parseISO, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, startOfYear, endOfYear } from 'date-fns';
import { toast } from 'sonner';
import { SlideOver } from '../components/SlideOver';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { EmptyState } from '../components/EmptyState';
import { TableSkeleton } from '../components/LoadingSkeleton';
import { PeriodFilter as PeriodFilterComponent, type Period } from '../components/PeriodFilter';
import { useData } from '../hooks/useData';
import { cn } from '../lib/utils';
import type { KpiSnapshot, Goal } from '../lib/database';

// Map goal metric names to KPI snapshot fields
const GOAL_TO_KPI_FIELD: Record<string, keyof KpiSnapshot> = {
  'Weekly Leads': 'leads_total',
  'Monthly Revenue': 'revenue',
  'Avg Profit/Job': 'avg_profit_per_job',
  'Conversion Rate': 'conversion_rate',
  'Cost Per Lead (CPL)': 'cpl',
  'Monthly Jobs': 'jobs_completed',
};

type KpiForm = {
  week_ending: string;
  leads_total: number;
  leads_google: number;
  leads_meta: number;
  leads_organic: number;
  quotes_sent: number;
  quotes_accepted: number;
  jobs_completed: number;
  revenue: number;
  ad_spend_google: number;
  ad_spend_meta: number;
  ad_spend_total: number;
  avg_job_value: number | '';
  avg_profit_per_job: number | '';
  cpl: number | '';
  cpbj: number | '';
  conversion_rate: number | '';
  poas: number | '';
  notes: string;
};

function formatCurrency(val: number): string {
  return `$${val.toLocaleString('en-AU', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function formatPct(val?: number | null): string {
  if (val == null) return '-';
  return `${val.toFixed(1)}%`;
}

export function Kpis() {
  const { data: rawData, loading, create, update, remove } = useData('kpi_snapshots');
  const { data: goalsRaw } = useData('goals');
  const goals = goalsRaw as unknown as Goal[];
  const data = rawData as unknown as KpiSnapshot[];
  const [period, setPeriod] = useState<Period>('all_time');

  // Build a map from KPI field name to goal for quick lookup
  const goalByField = useMemo(() => {
    const map: Partial<Record<keyof KpiSnapshot, Goal>> = {};
    goals.forEach(g => {
      const field = GOAL_TO_KPI_FIELD[g.metric_name];
      if (field) map[field] = g;
    });
    return map;
  }, [goals]);
  const [slideOpen, setSlideOpen] = useState(false);
  const [editing, setEditing] = useState<KpiSnapshot | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<KpiSnapshot | null>(null);

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<KpiForm>();

  const filtered = useMemo(() => {
    let result = [...data];
    const now = new Date();

    if (period === 'this_month') {
      const start = startOfMonth(now);
      const end = endOfMonth(now);
      result = result.filter(k => {
        const d = parseISO(k.week_ending);
        return d >= start && d <= end;
      });
    } else if (period === 'this_quarter') {
      const start = startOfQuarter(now);
      const end = endOfQuarter(now);
      result = result.filter(k => {
        const d = parseISO(k.week_ending);
        return d >= start && d <= end;
      });
    } else if (period === 'this_year') {
      const start = startOfYear(now);
      const end = endOfYear(now);
      result = result.filter(k => {
        const d = parseISO(k.week_ending);
        return d >= start && d <= end;
      });
    }

    // Sort newest first
    result.sort((a, b) => new Date(b.week_ending).getTime() - new Date(a.week_ending).getTime());
    return result;
  }, [data, period]);

  // Build delta map: for each row, compute delta from previous week
  const deltaMap = useMemo(() => {
    const map: Record<string, Partial<Record<keyof KpiSnapshot, number>>> = {};
    // sorted newest first
    for (let i = 0; i < filtered.length; i++) {
      const curr = filtered[i];
      const prev = filtered[i + 1];
      if (prev) {
        map[curr.id] = {
          leads_total: curr.leads_total - prev.leads_total,
          quotes_sent: curr.quotes_sent - prev.quotes_sent,
          quotes_accepted: curr.quotes_accepted - prev.quotes_accepted,
          jobs_completed: curr.jobs_completed - prev.jobs_completed,
          revenue: curr.revenue - prev.revenue,
          ad_spend_total: curr.ad_spend_total - prev.ad_spend_total,
        };
        if (curr.conversion_rate != null && prev.conversion_rate != null) {
          map[curr.id].conversion_rate = curr.conversion_rate - prev.conversion_rate;
        }
        if (curr.cpl != null && prev.cpl != null) {
          (map[curr.id] as any).cpl = curr.cpl - prev.cpl;
        }
      }
    }
    return map;
  }, [filtered]);

  function openNew() {
    setEditing(null);
    reset({
      week_ending: format(new Date(), 'yyyy-MM-dd'),
      leads_total: 0, leads_google: 0, leads_meta: 0, leads_organic: 0,
      quotes_sent: 0, quotes_accepted: 0, jobs_completed: 0, revenue: 0,
      ad_spend_google: 0, ad_spend_meta: 0, ad_spend_total: 0,
      avg_job_value: '', avg_profit_per_job: '', cpl: '', cpbj: '',
      conversion_rate: '', poas: '', notes: '',
    });
    setSlideOpen(true);
  }

  function openEdit(kpi: KpiSnapshot) {
    setEditing(kpi);
    reset({
      week_ending: kpi.week_ending,
      leads_total: kpi.leads_total,
      leads_google: kpi.leads_google,
      leads_meta: kpi.leads_meta,
      leads_organic: kpi.leads_organic,
      quotes_sent: kpi.quotes_sent,
      quotes_accepted: kpi.quotes_accepted,
      jobs_completed: kpi.jobs_completed,
      revenue: kpi.revenue,
      ad_spend_google: kpi.ad_spend_google,
      ad_spend_meta: kpi.ad_spend_meta,
      ad_spend_total: kpi.ad_spend_total,
      avg_job_value: kpi.avg_job_value ?? '',
      avg_profit_per_job: kpi.avg_profit_per_job ?? '',
      cpl: kpi.cpl ?? '',
      cpbj: kpi.cpbj ?? '',
      conversion_rate: kpi.conversion_rate ?? '',
      poas: kpi.poas ?? '',
      notes: kpi.notes || '',
    });
    setSlideOpen(true);
  }

  async function onSubmit(form: KpiForm) {
    const payload: any = {
      ...form,
      leads_total: Number(form.leads_total),
      leads_google: Number(form.leads_google),
      leads_meta: Number(form.leads_meta),
      leads_organic: Number(form.leads_organic),
      quotes_sent: Number(form.quotes_sent),
      quotes_accepted: Number(form.quotes_accepted),
      jobs_completed: Number(form.jobs_completed),
      revenue: Number(form.revenue),
      ad_spend_google: Number(form.ad_spend_google),
      ad_spend_meta: Number(form.ad_spend_meta),
      ad_spend_total: Number(form.ad_spend_total),
      avg_job_value: form.avg_job_value === '' ? null : Number(form.avg_job_value),
      avg_profit_per_job: form.avg_profit_per_job === '' ? null : Number(form.avg_profit_per_job),
      cpl: form.cpl === '' ? null : Number(form.cpl),
      cpbj: form.cpbj === '' ? null : Number(form.cpbj),
      conversion_rate: form.conversion_rate === '' ? null : Number(form.conversion_rate),
      poas: form.poas === '' ? null : Number(form.poas),
    };
    try {
      if (editing) {
        await update(editing.id, payload);
        toast.success('Snapshot updated');
      } else {
        await create(payload);
        toast.success('Snapshot logged');
      }
      setSlideOpen(false);
    } catch {
      toast.error('Failed to save snapshot');
    }
  }

  async function onDelete() {
    if (!deleteTarget) return;
    try {
      await remove(deleteTarget.id);
      toast.success('Snapshot deleted');
      setDeleteTarget(null);
    } catch {
      toast.error('Failed to delete');
    }
  }

  function renderGoalBadge(field: keyof KpiSnapshot, currentValue: number | null | undefined) {
    const goal = goalByField[field];
    if (!goal || currentValue == null) return null;
    const pct = goal.target_value === 0 ? 0 : (currentValue / goal.target_value) * 100;
    const isGood = goal.lower_is_better ? pct <= 100 : pct >= 100;
    const isClose = goal.lower_is_better ? pct <= 120 : pct >= 80;
    const color = isGood ? 'text-[#16A34A] bg-emerald-50' : isClose ? 'text-amber-600 bg-amber-50' : 'text-[#DC2626] bg-red-50';
    return (
      <span className={cn('inline-block text-[10px] font-medium px-1.5 py-0.5 rounded-full mt-0.5', color)}>
        {Math.round(pct)}% of target
      </span>
    );
  }

  function renderDelta(val?: number, invert = false) {
    if (val == null || val === 0) return null;
    const isPositive = val > 0;
    // For metrics where lower is better (like ad spend, CPL), invert the color
    const isGood = invert ? !isPositive : isPositive;
    return (
      <span className={cn('inline-flex items-center gap-0.5 text-xs font-medium', isGood ? 'text-[#16A34A]' : 'text-[#DC2626]')}>
        {isPositive ? (
          <TrendingUp className="w-3 h-3" />
        ) : (
          <TrendingDown className="w-3 h-3" />
        )}
        {isPositive ? '+' : ''}{typeof val === 'number' && Math.abs(val) >= 1 ? Math.round(val).toLocaleString() : val?.toFixed(1)}
      </span>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-7 w-48 bg-slate-200 rounded animate-pulse" />
            <div className="h-4 w-64 bg-slate-200 rounded animate-pulse" />
          </div>
          <div className="h-10 w-32 bg-slate-200 rounded animate-pulse" />
        </div>
        <TableSkeleton rows={5} cols={9} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">KPI Snapshots</h2>
            <p className="text-slate-500 text-sm mt-1">Weekly performance tracking and trends</p>
          </div>
          <button
            onClick={openNew}
            className="flex items-center gap-2 px-4 py-2 bg-[#1B2A4A] text-white rounded-lg font-medium hover:bg-[#1e335a] transition-colors shadow-sm whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Log Snapshot</span>
          </button>
        </div>
        <PeriodFilterComponent
          value={period}
          onChange={setPeriod}
          options={['this_month', 'this_quarter', 'this_year', 'all_time']}
        />
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={BarChart3}
          title="No KPI snapshots"
          description={period !== 'all_time' ? 'No data for the selected period. Try a different range.' : 'Log your first weekly snapshot to start tracking KPIs'}
          actionLabel={period === 'all_time' ? 'Log Snapshot' : undefined}
          onAction={period === 'all_time' ? openNew : undefined}
        />
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                  <th className="p-4">Week Ending</th>
                  <th className="p-4 text-right">Leads</th>
                  <th className="p-4 text-right">Quotes Sent</th>
                  <th className="p-4 text-right">Accepted</th>
                  <th className="p-4 text-right">Conv. Rate</th>
                  <th className="p-4 text-right">Jobs Done</th>
                  <th className="p-4 text-right">Revenue</th>
                  <th className="p-4 text-right">Ad Spend</th>
                  <th className="p-4 text-right">CPL</th>
                  <th className="p-4 w-20"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filtered.map(kpi => {
                  const delta = deltaMap[kpi.id] || {};
                  return (
                    <tr key={kpi.id} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => openEdit(kpi)}>
                      <td className="p-4 font-medium text-slate-900 whitespace-nowrap">
                        {format(parseISO(kpi.week_ending), 'dd MMM yyyy')}
                      </td>
                      <td className="p-4 text-right text-slate-700">
                        <div>{kpi.leads_total}</div>
                        {renderDelta(delta.leads_total as number)}
                        {renderGoalBadge('leads_total', kpi.leads_total)}
                      </td>
                      <td className="p-4 text-right text-slate-700">
                        <div>{kpi.quotes_sent}</div>
                        {renderDelta(delta.quotes_sent as number)}
                      </td>
                      <td className="p-4 text-right text-slate-700">
                        <div>{kpi.quotes_accepted}</div>
                        {renderDelta(delta.quotes_accepted as number)}
                      </td>
                      <td className="p-4 text-right text-slate-700">
                        <div>{formatPct(kpi.conversion_rate)}</div>
                        {renderDelta(delta.conversion_rate as number)}
                        {renderGoalBadge('conversion_rate', kpi.conversion_rate)}
                      </td>
                      <td className="p-4 text-right text-slate-700">
                        <div>{kpi.jobs_completed}</div>
                        {renderDelta(delta.jobs_completed as number)}
                        {renderGoalBadge('jobs_completed', kpi.jobs_completed)}
                      </td>
                      <td className="p-4 text-right text-slate-700">
                        <div>{formatCurrency(kpi.revenue)}</div>
                        {renderDelta(delta.revenue as number)}
                        {renderGoalBadge('revenue', kpi.revenue)}
                      </td>
                      <td className="p-4 text-right text-slate-700">
                        <div>{formatCurrency(kpi.ad_spend_total)}</div>
                        {renderDelta(delta.ad_spend_total as number, true)}
                      </td>
                      <td className="p-4 text-right text-slate-700">
                        {kpi.cpl != null ? `$${kpi.cpl.toFixed(1)}` : '-'}
                        {(delta as any).cpl != null && (
                          <div>{renderDelta((delta as any).cpl, true)}</div>
                        )}
                        {renderGoalBadge('cpl', kpi.cpl)}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <button onClick={(e) => { e.stopPropagation(); openEdit(kpi); }} className="p-1 text-slate-400 hover:text-slate-700">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); setDeleteTarget(kpi); }} className="p-1 text-slate-400 hover:text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SlideOver Form */}
      <SlideOver open={slideOpen} onClose={() => setSlideOpen(false)} title={editing ? 'Edit Snapshot' : 'Log Snapshot'} width="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Week Ending *</label>
            <input type="date" {...register('week_ending', { required: true })} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]" />
          </div>

          <div className="border-t border-slate-200 pt-4">
            <p className="text-sm font-semibold text-slate-800 mb-3">Leads</p>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Total</label>
                <input type="number" {...register('leads_total')} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Google</label>
                <input type="number" {...register('leads_google')} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Meta</label>
                <input type="number" {...register('leads_meta')} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Organic</label>
                <input type="number" {...register('leads_organic')} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]" />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-4">
            <p className="text-sm font-semibold text-slate-800 mb-3">Quotes & Jobs</p>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Quotes Sent</label>
                <input type="number" {...register('quotes_sent')} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Quotes Accepted</label>
                <input type="number" {...register('quotes_accepted')} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Jobs Completed</label>
                <input type="number" {...register('jobs_completed')} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]" />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-4">
            <p className="text-sm font-semibold text-slate-800 mb-3">Revenue & Spend</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Revenue ($)</label>
                <input type="number" step="0.01" {...register('revenue')} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Ad Spend Total ($)</label>
                <input type="number" step="0.01" {...register('ad_spend_total')} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Google Ads ($)</label>
                <input type="number" step="0.01" {...register('ad_spend_google')} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Meta Ads ($)</label>
                <input type="number" step="0.01" {...register('ad_spend_meta')} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]" />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-4">
            <p className="text-sm font-semibold text-slate-800 mb-3">Calculated Metrics</p>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Avg Job Value ($)</label>
                <input type="number" step="0.01" {...register('avg_job_value')} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Avg Profit/Job ($)</label>
                <input type="number" step="0.01" {...register('avg_profit_per_job')} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Conversion Rate (%)</label>
                <input type="number" step="0.1" {...register('conversion_rate')} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">CPL ($)</label>
                <input type="number" step="0.01" {...register('cpl')} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">CPBJ ($)</label>
                <input type="number" step="0.01" {...register('cpbj')} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">POAS</label>
                <input type="number" step="0.1" {...register('poas')} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]" />
              </div>
            </div>
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
              {isSubmitting ? 'Saving...' : editing ? 'Update' : 'Log'} {isSubmitting ? '' : 'Snapshot'}
            </button>
          </div>
        </form>
      </SlideOver>

      {/* Confirm Delete */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={onDelete}
        title="Delete Snapshot"
        description={`Are you sure you want to delete the snapshot for ${deleteTarget ? format(parseISO(deleteTarget.week_ending), 'dd MMM yyyy') : ''}? This action cannot be undone.`}
      />
    </div>
  );
}
