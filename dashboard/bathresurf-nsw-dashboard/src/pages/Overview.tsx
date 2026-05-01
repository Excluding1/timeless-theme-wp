import React, { useMemo } from 'react';
import { PeriodFilter, type Period } from '../components/PeriodFilter';
import { Skeleton } from '../components/LoadingSkeleton';
import { useData } from '../hooks/useData';
import { usePreferences } from '../contexts/PreferencesContext';
import { getPeriodDateRange, getPreviousPeriodRange } from '../lib/database';
import type { Finance, Goal, Subscription, Subcontractor, KpiSnapshot } from '../lib/database';
import { ArrowUpRight, ArrowDownRight, DollarSign, TrendingUp, Target, Users, CreditCard, BarChart3 } from 'lucide-react';
import { cn } from '../lib/utils';
import { isWithinInterval, parseISO, isValid, differenceInDays, format, addMonths, startOfMonth } from 'date-fns';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, AreaChart, Area,
} from 'recharts';

export function Overview() {
  const { preferences, updatePreferences } = usePreferences();
  const period = (preferences.default_overview_period as Period) || 'this_month';
  const setPeriod = (next: Period) => updatePreferences({ default_overview_period: next });
  const { data: finances, loading: finLoading } = useData('finances');
  const { data: goals, loading: goalsLoading } = useData('goals');
  const { data: subscriptions, loading: subsLoading } = useData('subscriptions');
  const { data: subcontractors, loading: subconLoading } = useData('subcontractors');
  const { data: kpis, loading: kpisLoading } = useData('kpi_snapshots');

  const loading = finLoading || goalsLoading || subsLoading || subconLoading || kpisLoading;

  const dateRange = getPeriodDateRange(period);
  const prevRange = getPreviousPeriodRange(period);

  const filterByDate = (items: Finance[], range: { start: Date; end: Date } | null) => {
    if (!range) return items;
    return items.filter(f => {
      const d = parseISO(f.date);
      return isWithinInterval(d, { start: range.start, end: range.end });
    });
  };

  const currentFinances = filterByDate(finances as Finance[], dateRange);
  const prevFinances = filterByDate(finances as Finance[], prevRange);

  const calcTotals = (items: Finance[]) => {
    const revenue = items.filter(f => f.type === 'revenue').reduce((sum, f) => sum + f.amount, 0);
    const expenses = items.filter(f => f.type === 'expense').reduce((sum, f) => sum + f.amount, 0);
    return { revenue, expenses, profit: revenue - expenses, margin: revenue > 0 ? ((revenue - expenses) / revenue) * 100 : 0 };
  };

  const current = calcTotals(currentFinances);
  const prev = calcTotals(prevFinances);

  const calcDelta = (curr: number, previous: number) => {
    if (previous === 0) return curr > 0 ? 100 : 0;
    return ((curr - previous) / previous) * 100;
  };

  const latestKpi = useMemo(() => {
    const sorted = [...(kpis as KpiSnapshot[])].sort((a, b) => b.week_ending.localeCompare(a.week_ending));
    return sorted[0] || null;
  }, [kpis]);

  const activeGoals = goals as Goal[];

  // Map goals by metric for KPI snapshot
  const goalMap = useMemo(() => {
    const map: Record<string, Goal> = {};
    (goals as Goal[]).forEach(g => { map[g.metric_name] = g; });
    return map;
  }, [goals]);

  // Build monthly revenue/expense trend data for charts.
  // NOTE: this is intentionally NOT period-filtered — it shows the full all-time trend
  // so users can see growth over months. The chart heading reflects this with an "all time" label.
  const monthlyTrend = useMemo(() => {
    const allFinances = finances as Finance[];
    const monthMap: Record<string, { revenue: number; expenses: number }> = {};
    allFinances.forEach(f => {
      if (!f.date) return;
      const d = parseISO(f.date);
      if (!isValid(d)) return;
      const monthKey = format(d, 'yyyy-MM');
      if (!monthMap[monthKey]) monthMap[monthKey] = { revenue: 0, expenses: 0 };
      if (f.type === 'revenue') monthMap[monthKey].revenue += f.amount;
      else monthMap[monthKey].expenses += f.amount;
    });
    return Object.entries(monthMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({
        month: format(parseISO(`${month}-01`), 'MMM yyyy'),
        monthKey: month,
        revenue: data.revenue,
        expenses: data.expenses,
        profit: data.revenue - data.expenses,
      }));
  }, [finances]);

  // Revenue projection: weighted linear regression on KPI weekly revenue
  // with confidence bands (upper/lower bounds based on residual std dev)
  const revenueProjection = useMemo(() => {
    const sorted = [...(kpis as KpiSnapshot[])].sort((a, b) => a.week_ending.localeCompare(b.week_ending));
    if (sorted.length < 3) return [];

    const actuals = sorted.map((k, i) => ({
      week: format(parseISO(k.week_ending), 'dd MMM'),
      weekIndex: i,
      revenue: k.revenue,
      type: 'actual' as const,
    }));

    const n = actuals.length;

    // Weighted linear regression — recent weeks count more (exponential weights)
    const alpha = 0.08; // decay factor
    const weights = actuals.map((_, i) => Math.exp(alpha * (i - n + 1)));
    const wSum = weights.reduce((s, w) => s + w, 0);
    const wSumX = actuals.reduce((s, d, i) => s + weights[i] * d.weekIndex, 0);
    const wSumY = actuals.reduce((s, d, i) => s + weights[i] * d.revenue, 0);
    const wSumXY = actuals.reduce((s, d, i) => s + weights[i] * d.weekIndex * d.revenue, 0);
    const wSumX2 = actuals.reduce((s, d, i) => s + weights[i] * d.weekIndex * d.weekIndex, 0);
    const m = (wSum * wSumXY - wSumX * wSumY) / (wSum * wSumX2 - wSumX * wSumX);
    const b = (wSumY - m * wSumX) / wSum;

    // Residual standard deviation for confidence bands
    const residuals = actuals.map(d => d.revenue - (m * d.weekIndex + b));
    const residStd = Math.sqrt(residuals.reduce((s, r) => s + r * r, 0) / (n - 2));

    // Exponential moving average (EMA) for smoothed actual line
    const emaAlpha = 0.3;
    let ema = actuals[0].revenue;
    const emaValues = actuals.map(d => {
      ema = emaAlpha * d.revenue + (1 - emaAlpha) * ema;
      return Math.round(ema);
    });

    const lastDate = parseISO(sorted[sorted.length - 1].week_ending);

    // Build actual data points with trend + EMA
    const withTrend = actuals.map((d, i) => ({
      ...d,
      trend: Math.max(0, Math.round(m * d.weekIndex + b)),
      ema: emaValues[i],
    }));

    // Bridge point: connects actuals to projections
    const lastActual = withTrend[withTrend.length - 1];
    const bridge = {
      week: lastActual.week,
      weekIndex: n - 1,
      revenue: lastActual.revenue,
      trend: lastActual.trend,
      ema: lastActual.ema,
      projected: lastActual.revenue,
      upperBound: lastActual.revenue,
      lowerBound: lastActual.revenue,
    };

    // Project 12 weeks forward with widening confidence bands
    const projections = [];
    for (let i = 1; i <= 12; i++) {
      const projDate = new Date(lastDate.getTime() + i * 7 * 24 * 60 * 60 * 1000);
      const idx = n - 1 + i;
      const projected = Math.max(0, Math.round(m * idx + b));
      // Confidence band widens with sqrt of distance (prediction uncertainty)
      const bandWidth = residStd * 1.5 * Math.sqrt(i);
      projections.push({
        week: format(projDate, 'dd MMM'),
        weekIndex: idx,
        projected,
        upperBound: Math.round(projected + bandWidth),
        lowerBound: Math.max(0, Math.round(projected - bandWidth)),
        type: 'projected' as const,
      });
    }

    return [
      ...withTrend.slice(0, -1).map(d => ({
        ...d,
        projected: undefined as number | undefined,
        upperBound: undefined as number | undefined,
        lowerBound: undefined as number | undefined,
      })),
      bridge,
      ...projections.map(d => ({
        ...d,
        revenue: undefined as number | undefined,
        trend: undefined as number | undefined,
        ema: undefined as number | undefined,
      })),
    ];
  }, [kpis]);

  const activeSubs = (subcontractors as Subcontractor[]).filter(s => s.status === 'active');
  const onHoldSubs = (subcontractors as Subcontractor[]).filter(s => s.status === 'on_hold');
  const prospectSubs = (subcontractors as Subcontractor[]).filter(s => s.status === 'prospect');
  const expiringInsurance = (subcontractors as Subcontractor[]).filter(s => {
    if (!s.pl_insurance_expiry || s.status !== 'active') return false;
    return differenceInDays(parseISO(s.pl_insurance_expiry), new Date()) <= 30;
  });

  const monthlySubCost = useMemo(() => {
    return (subscriptions as Subscription[])
      .filter(s => s.status === 'active')
      .reduce((sum, s) => {
        if (s.billing_cycle === 'monthly') return sum + s.cost;
        if (s.billing_cycle === 'quarterly') return sum + s.cost / 3;
        if (s.billing_cycle === 'annually') return sum + s.cost / 12;
        return sum;
      }, 0);
  }, [subscriptions]);

  const upcomingRenewals = useMemo(() => {
    const now = new Date();
    return (subscriptions as Subscription[])
      .filter(s => s.status === 'active' && s.next_renewal && differenceInDays(parseISO(s.next_renewal), now) <= 30 && differenceInDays(parseISO(s.next_renewal), now) >= 0)
      .sort((a, b) => (a.next_renewal || '').localeCompare(b.next_renewal || ''));
  }, [subscriptions]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-96" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-4 w-28" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Business Overview</h2>
            <p className="text-slate-500 text-sm mt-1">Shared business health and metrics</p>
          </div>
        </div>
        <PeriodFilter
          value={period}
          onChange={setPeriod}
          options={['this_month', 'this_quarter', 'this_year', 'all_time']}
        />
      </div>

      {/* Financial Summary */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard title="Total Revenue" value={fmtCurrency(current.revenue)} delta={calcDelta(current.revenue, prev.revenue)} isUp={current.revenue >= prev.revenue} icon={<DollarSign className="w-5 h-5 text-emerald-600" />} period={period} />
        <SummaryCard title="Total Expenses" value={fmtCurrency(current.expenses)} delta={calcDelta(current.expenses, prev.expenses)} isUp={current.expenses <= prev.expenses} icon={<TrendingUp className="w-5 h-5 text-rose-600" />} period={period} />
        <SummaryCard title="Net Profit" value={fmtCurrency(current.profit)} delta={calcDelta(current.profit, prev.profit)} isUp={current.profit >= prev.profit} icon={<DollarSign className="w-5 h-5 text-[#0D9488]" />} period={period} />
        <SummaryCard title="Profit Margin" value={`${current.margin.toFixed(1)}%`} delta={calcDelta(current.margin, prev.margin)} isUp={current.margin >= prev.margin} icon={<Target className="w-5 h-5 text-indigo-600" />} period={period} />
      </section>

      {/* Revenue & Expenses Trend Chart */}
      {monthlyTrend.length > 0 && (
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-baseline justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-800">Revenue vs Expenses</h3>
            <span className="text-xs text-slate-500 font-normal">All-time trend (not affected by period filter)</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrend} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16A34A" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#16A34A" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#DC2626" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#DC2626" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, '']} labelStyle={{ fontWeight: 600 }} />
                <Legend />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#16A34A" fill="url(#revGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#DC2626" fill="url(#expGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="profit" name="Profit" stroke="#0D9488" fill="none" strokeWidth={2} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}

      {/* Revenue Projection Chart */}
      {revenueProjection.length > 0 && (
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-800">Revenue Projection</h3>
              <p className="text-sm text-slate-500 mt-1">Weighted regression with confidence bands — 12-week forecast</p>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueProjection} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <defs>
                  <linearGradient id="confBand" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0D9488" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#0D9488" stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#94a3b8' }} interval={Math.max(1, Math.floor(revenueProjection.length / 8))} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  formatter={(value: number, name: string) => {
                    if (name === 'Confidence Band' || name === '_lowerBound') return [null, null];
                    return [`$${value.toLocaleString()}`, name];
                  }}
                  labelStyle={{ fontWeight: 600 }}
                />
                <Legend
                  content={() => (
                    <div className="flex items-center justify-center gap-5 mt-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-[#1B2A4A] inline-block" />Actual Revenue</span>
                      <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-[#6366F1] inline-block" />Moving Avg</span>
                      <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-[#0D9488] inline-block border-dashed" />Forecast</span>
                      <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-[#0D9488]/15 inline-block rounded-sm" />Confidence Band</span>
                    </div>
                  )}
                />
                {/* Confidence band background — hidden from default legend */}
                <Area type="monotone" dataKey="upperBound" name="Confidence Band" stroke="none" fill="url(#confBand)" connectNulls={false} legendType="none" />
                <Area type="monotone" dataKey="lowerBound" name="_lowerBound" stroke="none" fill="transparent" connectNulls={false} legendType="none" />
                {/* Actual revenue */}
                <Line type="monotone" dataKey="revenue" name="Actual Revenue" stroke="#1B2A4A" strokeWidth={2} dot={{ r: 2.5, fill: '#1B2A4A' }} connectNulls={false} legendType="none" />
                {/* EMA smoothed line */}
                <Line type="monotone" dataKey="ema" name="Moving Avg" stroke="#6366F1" strokeWidth={1.5} dot={false} connectNulls={false} legendType="none" />
                {/* Forecast projection */}
                <Line type="monotone" dataKey="projected" name="Forecast" stroke="#0D9488" strokeWidth={2.5} strokeDasharray="6 3" dot={{ r: 2.5, fill: '#0D9488' }} connectNulls={false} legendType="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Latest KPI Snapshot */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-slate-400" />
            <h3 className="text-lg font-semibold text-slate-800">Latest KPI Snapshot</h3>
          </div>
          {latestKpi ? (
            <div className="space-y-4">
              <KpiRow label="Leads Generated" value={String(latestKpi.leads_total)} target={goalMap['Weekly Leads'] ? String(goalMap['Weekly Leads'].target_value) : '50'} lowerIsBetter={false} />
              <KpiRow label="Cost Per Lead" value={`$${(latestKpi.cpl || 0).toFixed(2)}`} target={goalMap['Cost Per Lead (CPL)'] ? `$${goalMap['Cost Per Lead (CPL)'].target_value.toFixed(2)}` : '$50.00'} lowerIsBetter />
              <KpiRow label="Conversion Rate" value={`${(latestKpi.conversion_rate || 0).toFixed(1)}%`} target={goalMap['Conversion Rate'] ? `${goalMap['Conversion Rate'].target_value}%` : '30%'} lowerIsBetter={false} />
              <KpiRow label="Avg Profit / Job" value={`$${(latestKpi.avg_profit_per_job || 0).toFixed(0)}`} target={goalMap['Avg Profit/Job'] ? `$${goalMap['Avg Profit/Job'].target_value}` : '$350'} lowerIsBetter={false} />
              <p className="text-xs text-slate-400 pt-2">Week ending {new Date(latestKpi.week_ending).toLocaleDateString()}</p>
            </div>
          ) : (
            <p className="text-sm text-slate-500">No KPI snapshots yet.</p>
          )}
        </section>

        {/* Pipeline Summary */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Pipeline Summary</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
              <p className="text-sm font-medium text-slate-500 mb-1">Quotes Outstanding</p>
              <p className="text-3xl font-bold text-slate-900">{latestKpi ? latestKpi.quotes_sent - latestKpi.quotes_accepted : 0}</p>
            </div>
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
              <p className="text-sm font-medium text-slate-500 mb-1">Jobs Completed</p>
              <p className="text-3xl font-bold text-slate-900">{latestKpi?.jobs_completed || 0}</p>
              <p className="text-sm text-slate-500 mt-2">Latest week</p>
            </div>
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-100 col-span-2">
              <p className="text-sm font-medium text-slate-500 mb-1">Avg Job Value</p>
              <p className="text-3xl font-bold text-slate-900">{fmtCurrency(latestKpi?.avg_job_value || 0)}</p>
            </div>
          </div>
        </section>

        {/* Goal Progress */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Target className="w-5 h-5 text-slate-400" />
            <h3 className="text-lg font-semibold text-slate-800">Goal Progress</h3>
          </div>
          {activeGoals.length > 0 ? (
            <div className="space-y-4">
              {activeGoals.map(goal => {
                const pct = goal.lower_is_better
                  ? goal.current_value > 0 ? (goal.target_value / goal.current_value) * 100 : 0
                  : goal.target_value > 0 ? (goal.current_value / goal.target_value) * 100 : 0;
                let status = 'Behind';
                let statusColor = 'bg-rose-50 text-rose-700 border-rose-200';
                let barColor = 'bg-rose-500';
                if (pct >= 100) { status = 'Ahead'; statusColor = 'bg-emerald-50 text-emerald-700 border-emerald-200'; barColor = 'bg-emerald-500'; }
                else if (pct >= 80) { status = 'On Track'; statusColor = 'bg-amber-50 text-amber-700 border-amber-200'; barColor = 'bg-amber-500'; }
                return (
                  <div key={goal.id}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-slate-700">{goal.metric_name}</span>
                      <span className={cn("text-xs font-medium px-2 py-0.5 rounded border", statusColor)}>{status}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className={cn("h-full rounded-full transition-all", barColor)} style={{ width: `${Math.min(pct, 100)}%` }} />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-slate-500">{goal.unit === '$' ? fmtCurrency(goal.current_value) : `${goal.current_value}${goal.unit === '%' ? '%' : ''}`}</span>
                      <span className="text-xs text-slate-400">Target: {goal.unit === '$' ? fmtCurrency(goal.target_value) : `${goal.target_value}${goal.unit === '%' ? '%' : ''}`}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No goals set yet.</p>
          )}
        </section>

        {/* Sub Roster Summary */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Users className="w-5 h-5 text-slate-400" />
            <h3 className="text-lg font-semibold text-slate-800">Subcontractor Roster</h3>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-3 rounded-lg bg-emerald-50 border border-emerald-100">
              <p className="text-2xl font-bold text-emerald-700">{activeSubs.length}</p>
              <p className="text-xs font-medium text-emerald-600 uppercase">Active</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-amber-50 border border-amber-100">
              <p className="text-2xl font-bold text-amber-700">{onHoldSubs.length}</p>
              <p className="text-xs font-medium text-amber-600 uppercase">On Hold</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-blue-50 border border-blue-100">
              <p className="text-2xl font-bold text-blue-700">{prospectSubs.length}</p>
              <p className="text-xs font-medium text-blue-600 uppercase">Prospects</p>
            </div>
          </div>
          {expiringInsurance.length > 0 && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-100 flex items-start gap-3">
              <div className="w-2 h-2 mt-2 rounded-full bg-red-500 shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-900">Insurance expiring &lt; 30 days</p>
                <p className="text-xs text-red-700 mt-1">{expiringInsurance.map(s => `${s.name} (${differenceInDays(parseISO(s.pl_insurance_expiry!), new Date())} days)`).join(', ')}</p>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Subscription Burn */}
      <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-6">
          <CreditCard className="w-5 h-5 text-slate-400" />
          <h3 className="text-lg font-semibold text-slate-800">Subscription Burn</h3>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end gap-6">
          <div>
            <p className="text-4xl font-bold text-slate-900">{fmtCurrency(monthlySubCost)}</p>
            <p className="text-sm font-medium text-slate-500 mt-1">/ month (normalised)</p>
          </div>
          {upcomingRenewals.length > 0 && (
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-700 mb-3">Upcoming Renewals (30 days)</p>
              <div className="space-y-2">
                {upcomingRenewals.slice(0, 4).map(sub => (
                  <div key={sub.id} className="flex justify-between items-center p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{sub.name}</p>
                      <p className="text-xs text-slate-500">Renews in {differenceInDays(parseISO(sub.next_renewal!), new Date())} days</p>
                    </div>
                    <p className="text-sm font-semibold text-slate-700">{fmtCurrency(sub.cost)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function fmtCurrency(amount: number): string {
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(amount);
}

function SummaryCard({ title, value, delta, isUp, icon, period }: { title: string; value: string; delta: number; isUp: boolean; icon: React.ReactNode; period: Period }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
      </div>
      <p className="text-2xl font-bold text-slate-900 mb-2">{value}</p>
      {period !== 'all_time' && (
        <div className="flex items-center gap-1">
          {isUp ? <ArrowUpRight className="w-4 h-4 text-emerald-500" /> : <ArrowDownRight className="w-4 h-4 text-rose-500" />}
          <span className={cn("text-sm font-medium", isUp ? "text-emerald-600" : "text-rose-600")}>{delta > 0 ? '+' : ''}{delta.toFixed(1)}%</span>
          <span className="text-sm text-slate-400 ml-1">vs last period</span>
        </div>
      )}
    </div>
  );
}

function KpiRow({ label, value, target, lowerIsBetter = false }: { label: string; value: string; target: string; lowerIsBetter?: boolean }) {
  const valNum = parseFloat(value.replace(/[^0-9.]/g, ''));
  const targetNum = parseFloat(target.replace(/[^0-9.]/g, ''));
  const pct = (valNum === 0 || targetNum === 0) ? 0 : lowerIsBetter ? (targetNum / valNum) * 100 : (valNum / targetNum) * 100;
  let statusColor = "bg-emerald-500";
  if (pct < 80) statusColor = "bg-rose-500";
  else if (pct < 100) statusColor = "bg-amber-500";
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <div className="text-right">
          <span className="text-sm font-bold text-slate-900">{value}</span>
          <span className="text-xs text-slate-500 ml-2">Target: {target}</span>
        </div>
      </div>
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <div className={cn("h-full rounded-full transition-all", statusColor)} style={{ width: `${Math.min(pct, 100)}%` }} />
      </div>
    </div>
  );
}
