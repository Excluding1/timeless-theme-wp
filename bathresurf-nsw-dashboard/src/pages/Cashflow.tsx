import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wallet, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight,
  AlertTriangle, Calculator, Clock, Landmark, DollarSign, Rocket,
  ShieldCheck, Lock
} from 'lucide-react';
import {
  ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis,
  CartesianGrid, Tooltip,
} from 'recharts';
import { parseISO, isWithinInterval, format, differenceInDays, isValid, subMonths } from 'date-fns';
import { PeriodFilter, type Period } from '../components/PeriodFilter';
import { Skeleton } from '../components/LoadingSkeleton';
import { EmptyState } from '../components/EmptyState';
import { useData } from '../hooks/useData';
import { useBusinessSettings } from '../hooks/useBusinessSettings';
import { getPeriodDateRange } from '../lib/database';
import { cn } from '../lib/utils';
import type { Finance, Subscription } from '../lib/database';

// ── Constants ───────────────────────────────────────────────────────────────

const BUFFER_FLOOR = 20000; // Minimum buffer regardless of costs
const BUFFER_MULTIPLIER = 2.5; // Buffer = monthly costs × this
const GST_THRESHOLD = 75000;

// ── Helpers ─────────────────────────────────────────────────────────────────

function fmtCurrency(amount: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency', currency: 'AUD',
    minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(amount);
}

function toMonthlyCost(cost: number, cycle: string): number {
  switch (cycle) {
    case 'annually': return cost / 12;
    case 'quarterly': return cost / 3;
    case 'monthly': return cost;
    default: return 0;
  }
}

function filterByDate(items: Finance[], range: { start: Date; end: Date } | null): Finance[] {
  if (!range) return items;
  return items.filter(f => {
    const d = parseISO(f.date);
    return isValid(d) && isWithinInterval(d, { start: range.start, end: range.end });
  });
}

// ── Phase Detection ─────────────────────────────────────────────────────────

type BusinessPhase = {
  phase: 'Pre-Revenue' | 'Bootstrap' | 'Growth' | 'Sustainable';
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  icon: React.ElementType;
};

function detectPhase(finances: Finance[], bufferBalance: number, bufferTarget: number): BusinessPhase {
  const hasRevenue = finances.some(f => f.type === 'revenue' && f.category !== 'Other');

  if (!hasRevenue) return {
    phase: 'Pre-Revenue', color: 'text-slate-600', bgColor: 'bg-slate-50',
    borderColor: 'border-slate-200', description: 'No revenue yet — focus on setup and finding subs.',
    icon: Rocket,
  };

  if (bufferBalance < bufferTarget) return {
    phase: 'Bootstrap', color: 'text-amber-700', bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    description: `100% reinvest until ${fmtCurrency(bufferTarget)} buffer is reached. No partner drawings.`,
    icon: TrendingUp,
  };

  // Check if buffer has been stable for 2+ months
  const monthlyBalances: Record<string, number> = {};
  let running = 0;
  const sorted = [...finances].sort((a, b) => a.date.localeCompare(b.date));
  sorted.forEach(f => {
    const key = f.date.slice(0, 7);
    running += f.type === 'revenue' ? f.amount : -f.amount;
    monthlyBalances[key] = running;
  });
  const monthsAbove = Object.values(monthlyBalances).filter(b => b >= bufferTarget).length;

  if (monthsAbove >= 2) return {
    phase: 'Sustainable', color: 'text-emerald-700', bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200', description: 'Buffer stable — partner drawings available.',
    icon: ShieldCheck,
  };

  return {
    phase: 'Growth', color: 'text-teal-700', bgColor: 'bg-teal-50',
    borderColor: 'border-teal-200', description: 'Buffer hit — scale ads based on POAS. Drawings unlocked.',
    icon: TrendingUp,
  };
}

// ── Expense Category Grouping ───────────────────────────────────────────────

const EXPENSE_GROUPS: { label: string; categories: string[]; color: string }[] = [
  { label: 'Sub Payments', categories: ['Sub Payment'], color: 'bg-[#1B2A4A]' },
  { label: 'Ad Spend', categories: ['Google Ads', 'Meta Ads', 'Other Ad'], color: 'bg-[#0D9488]' },
  { label: 'Tools & Subs', categories: ['Software & Subs'], color: 'bg-indigo-500' },
  { label: 'Fees', categories: ['Stripe Fees', 'pay.com.au Fees', 'Bank Fees'], color: 'bg-amber-500' },
  { label: 'Insurance', categories: ['Insurance'], color: 'bg-rose-500' },
  { label: 'Other', categories: ['Legal & Accounting', 'Materials', 'Travel', 'Phone & Internet', 'Training', 'Other'], color: 'bg-slate-400' },
];

// ── Main Component ──────────────────────────────────────────────────────────

export function Cashflow() {
  const navigate = useNavigate();
  const { settings: biz, updateSetting } = useBusinessSettings();
  const { data: rawFinances, loading: finLoading } = useData('finances');
  const { data: rawSubs, loading: subsLoading } = useData('subscriptions');
  const finances = rawFinances as unknown as Finance[];
  const subscriptions = rawSubs as unknown as Subscription[];
  const loading = finLoading || subsLoading;

  const [period, setPeriod] = useState<Period>('this_month');

  // Shared business settings
  const taxReserve = biz.cashflow_tax_reserve as number;
  const growthReserve = biz.cashflow_growth_reserve as number;

  const setTaxReserve = (val: number) => updateSetting('cashflow_tax_reserve', val);
  const setGrowthReserve = (val: number) => updateSetting('cashflow_growth_reserve', val);

  // ── Period-filtered data ────────────────────────────────────────────────
  const dateRange = getPeriodDateRange(period);
  const periodFinances = useMemo(() => filterByDate(finances, dateRange), [finances, dateRange]);

  // ── Cash Position ───────────────────────────────────────────────────────
  const cashIn = useMemo(() =>
    periodFinances.filter(f => f.type === 'revenue').reduce((s, f) => s + f.amount, 0),
    [periodFinances]
  );
  const cashOut = useMemo(() =>
    periodFinances.filter(f => f.type === 'expense').reduce((s, f) => s + f.amount, 0),
    [periodFinances]
  );
  const netCashflow = cashIn - cashOut;

  // Buffer = all-time net
  const bufferBalance = useMemo(() => {
    const allRev = finances.filter(f => f.type === 'revenue').reduce((s, f) => s + f.amount, 0);
    const allExp = finances.filter(f => f.type === 'expense').reduce((s, f) => s + f.amount, 0);
    return allRev - allExp;
  }, [finances]);

  // ── Auto-scaling Buffer Target ────────────────────────────────────────
  const monthlyCosts = useMemo(() => {
    // Subscription costs
    const subBurn = subscriptions
      .filter(s => s.status === 'active' || s.status === 'trial')
      .reduce((s, sub) => s + toMonthlyCost(sub.cost, sub.billing_cycle), 0);

    // Average monthly expenses from last 3 months of Finances data
    const threeMonthsAgo = subMonths(new Date(), 3);
    const recentExpenses = finances.filter(f =>
      f.type === 'expense' &&
      isValid(parseISO(f.date)) &&
      parseISO(f.date) >= threeMonthsAgo
    );
    const avgMonthlyExpenses = recentExpenses.length > 0
      ? recentExpenses.reduce((s, f) => s + f.amount, 0) / 3
      : 0;

    // Use the higher of: subscription total or actual average spending
    return Math.max(subBurn, avgMonthlyExpenses);
  }, [finances, subscriptions]);

  const bufferTarget = Math.max(BUFFER_FLOOR, Math.round(monthlyCosts * BUFFER_MULTIPLIER / 500) * 500);
  const bufferHit = bufferBalance >= bufferTarget;

  // ── Business Phase ──────────────────────────────────────────────────────
  const phase = useMemo(() => detectPhase(finances, bufferBalance, bufferTarget), [finances, bufferBalance, bufferTarget]);
  const bufferPct = Math.min(Math.max((bufferBalance / bufferTarget) * 100, 0), 100);

  // ── Monthly Trend (last 6 months) ───────────────────────────────────────
  const monthlyData = useMemo(() => {
    const monthMap: Record<string, { revenue: number; expenses: number }> = {};
    finances.forEach(f => {
      const key = f.date.slice(0, 7);
      if (!monthMap[key]) monthMap[key] = { revenue: 0, expenses: 0 };
      if (f.type === 'revenue') monthMap[key].revenue += f.amount;
      else monthMap[key].expenses += f.amount;
    });
    return Object.entries(monthMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([month, d]) => ({
        month: format(parseISO(`${month}-01`), 'MMM'),
        revenue: d.revenue,
        expenses: d.expenses,
        net: d.revenue - d.expenses,
      }));
  }, [finances]);

  // ── GST Tracker ─────────────────────────────────────────────────────────
  const gst = useMemo(() => {
    const now = new Date();
    const fyStartYear = now.getMonth() >= 6 ? now.getFullYear() : now.getFullYear() - 1;
    const fyStart = new Date(fyStartYear, 6, 1);
    const fyEnd = new Date(fyStartYear + 1, 5, 30);
    const fyRevenue = finances
      .filter(f => f.type === 'revenue' && isWithinInterval(parseISO(f.date), { start: fyStart, end: fyEnd }))
      .reduce((s, f) => s + f.amount, 0);
    const pct = (fyRevenue / GST_THRESHOLD) * 100;
    const status: 'green' | 'amber' | 'red' = fyRevenue < 60000 ? 'green' : fyRevenue < 73000 ? 'amber' : 'red';
    const fyLabel = `FY${fyStartYear}/${String(fyStartYear + 1).slice(-2)}`;
    return { fyRevenue, pct, status, fyLabel };
  }, [finances]);

  // ── Upcoming Outflows ───────────────────────────────────────────────────
  const upcomingOutflows = useMemo(() => {
    const now = new Date();
    return subscriptions
      .filter(s => (s.status === 'active' || s.status === 'trial') && s.next_renewal
        && differenceInDays(parseISO(s.next_renewal), now) >= 0
        && differenceInDays(parseISO(s.next_renewal), now) <= 14)
      .sort((a, b) => (a.next_renewal || '').localeCompare(b.next_renewal || ''));
  }, [subscriptions]);
  const totalUpcoming = upcomingOutflows.reduce((s, sub) => s + sub.cost, 0);

  // Monthly subscription burn
  const monthlySubBurn = useMemo(() =>
    subscriptions
      .filter(s => s.status === 'active' || s.status === 'trial')
      .reduce((s, sub) => s + toMonthlyCost(sub.cost, sub.billing_cycle), 0),
    [subscriptions]
  );

  // ── Two-Phase Drawings Calculator ─────────────────────────────────────
  const drawings = useMemo(() => {
    const grossProfit = netCashflow;

    if (!bufferHit) {
      // Phase 1: Buffer not reached — reinvest everything
      const taxAmount = Math.max(0, grossProfit) * (taxReserve / 100);
      const reinvested = Math.max(0, grossProfit - taxAmount);
      return {
        grossProfit,
        taxAmount,
        growthAmount: 0,
        reinvested,
        available: 0,
        perPartner: 0,
        isBufferPhase: true,
        drawingsUnlocked: false,
      };
    }

    // Phase 2: Buffer reached — split into tax/growth/drawings
    const taxAmount = Math.max(0, grossProfit) * (taxReserve / 100);
    const growthAmount = Math.max(0, grossProfit) * (growthReserve / 100);
    const available = Math.max(0, grossProfit - taxAmount - growthAmount);
    const perPartner = available / 2;

    return {
      grossProfit,
      taxAmount,
      growthAmount,
      reinvested: 0,
      available,
      perPartner,
      isBufferPhase: false,
      drawingsUnlocked: true,
    };
  }, [netCashflow, taxReserve, growthReserve, bufferHit]);

  // ── Expense Breakdown ───────────────────────────────────────────────────
  const expenseBreakdown = useMemo(() => {
    const periodExpenses = periodFinances.filter(f => f.type === 'expense');
    const totalExp = periodExpenses.reduce((s, f) => s + f.amount, 0);
    return EXPENSE_GROUPS.map(g => {
      const amount = periodExpenses
        .filter(f => g.categories.includes(f.category))
        .reduce((s, f) => s + f.amount, 0);
      return { ...g, amount, pct: totalExp > 0 ? (amount / totalExp) * 100 : 0 };
    }).filter(g => g.amount > 0);
  }, [periodFinances]);

  // ── Loading ─────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-7 w-36" />
          <Skeleton className="h-10 w-48" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
        <Skeleton className="h-80 rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  // ── Empty State ─────────────────────────────────────────────────────────
  if (finances.length === 0) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Cashflow</h2>
          <p className="text-slate-500 text-sm mt-1">Monitor your business cash position</p>
        </div>
        <EmptyState
          icon={Wallet}
          title="No financial data yet"
          description="Add your first finance entry to start tracking cashflow."
          actionLabel="Go to Finances"
          onAction={() => navigate('/finances')}
        />
      </div>
    );
  }

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Cashflow</h2>
          <p className="text-slate-500 text-sm mt-1">Monitor your business cash position and runway</p>
        </div>
        <PeriodFilter value={period} onChange={setPeriod} />
      </div>

      {/* Section 1: Cash Position Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          label="Cash In"
          value={fmtCurrency(cashIn)}
          icon={ArrowUpRight}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
        <SummaryCard
          label="Cash Out"
          value={fmtCurrency(cashOut)}
          icon={ArrowDownRight}
          iconColor="text-red-600"
          iconBg="bg-red-50"
        />
        <SummaryCard
          label="Net Cashflow"
          value={fmtCurrency(netCashflow)}
          icon={netCashflow >= 0 ? TrendingUp : TrendingDown}
          iconColor={netCashflow >= 0 ? 'text-emerald-600' : 'text-red-600'}
          iconBg={netCashflow >= 0 ? 'bg-emerald-50' : 'bg-red-50'}
          valueColor={netCashflow >= 0 ? 'text-emerald-700' : 'text-red-600'}
        />
        <SummaryCard
          label="Buffer Balance"
          value={fmtCurrency(bufferBalance)}
          icon={Landmark}
          iconColor="text-[#0D9488]"
          iconBg="bg-teal-50"
          subtitle={`Monthly burn: ${fmtCurrency(monthlySubBurn)}`}
        />
      </div>

      {/* Section 2: Phase + Buffer Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Business Phase */}
        <div className={cn("rounded-xl border p-6", phase.bgColor, phase.borderColor)}>
          <div className="flex items-center gap-3 mb-2">
            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", phase.bgColor)}>
              <phase.icon className={cn("w-5 h-5", phase.color)} />
            </div>
            <div>
              <h3 className={cn("text-lg font-bold", phase.color)}>{phase.phase}</h3>
              <p className="text-sm text-slate-600">{phase.description}</p>
            </div>
          </div>
        </div>

        {/* Buffer Progress — auto-scaling */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-700">Buffer Progress</h3>
            <span className={cn(
              "text-sm font-medium",
              bufferHit ? 'text-emerald-600' : 'text-slate-600'
            )}>
              {bufferHit ? '✓ Target reached' : `${Math.round(bufferPct)}%`}
            </span>
          </div>
          <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden mb-2">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                bufferPct < 30 ? 'bg-red-500' : bufferPct < 70 ? 'bg-amber-500' : 'bg-emerald-500'
              )}
              style={{ width: `${bufferPct}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>{fmtCurrency(Math.max(0, bufferBalance))}</span>
            <span>Target: {fmtCurrency(bufferTarget)}</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-2">
            Auto-calculated: monthly costs ({fmtCurrency(monthlyCosts)}) × {BUFFER_MULTIPLIER}, floor {fmtCurrency(BUFFER_FLOOR)}
          </p>
        </div>
      </div>

      {/* Section 3: How Money Flows — visual explainer */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">How Your Money Flows</h3>
        {!bufferHit ? (
          // Phase 1: Buffer not hit
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-[#1B2A4A] text-white flex items-center justify-center text-xs font-bold shrink-0">1</div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-800">Revenue comes in</p>
              </div>
              <span className="text-sm font-semibold text-slate-700">{fmtCurrency(cashIn)}</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold shrink-0">2</div>
              <div className="flex-1">
                <p className="text-sm font-medium text-amber-800">Tax reserve ({taxReserve}%)</p>
                <p className="text-xs text-amber-600">Set aside — don't touch until BAS</p>
              </div>
              <span className="text-sm font-semibold text-amber-700">{fmtCurrency(drawings.taxAmount)}</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-[#0D9488]/5 rounded-lg border border-[#0D9488]/20">
              <div className="w-8 h-8 rounded-full bg-[#0D9488] text-white flex items-center justify-center text-xs font-bold shrink-0">3</div>
              <div className="flex-1">
                <p className="text-sm font-medium text-teal-800">Everything else → builds buffer</p>
                <p className="text-xs text-teal-600">100% reinvested until {fmtCurrency(bufferTarget)} reached</p>
              </div>
              <span className="text-sm font-semibold text-[#0D9488]">{fmtCurrency(drawings.reinvested)}</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-100 rounded-lg opacity-50">
              <div className="w-8 h-8 rounded-full bg-slate-300 text-white flex items-center justify-center shrink-0">
                <Lock className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-500">Drawings — locked</p>
                <p className="text-xs text-slate-400">{fmtCurrency(bufferTarget - Math.max(0, bufferBalance))} more to unlock for Allan & Marko</p>
              </div>
              <span className="text-sm font-semibold text-slate-400">$0</span>
            </div>
          </div>
        ) : (
          // Phase 2: Buffer hit — split into tax/growth/drawings
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-[#1B2A4A] text-white flex items-center justify-center text-xs font-bold shrink-0">1</div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-800">Revenue comes in</p>
              </div>
              <span className="text-sm font-semibold text-slate-700">{fmtCurrency(cashIn)}</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold shrink-0">2</div>
              <div className="flex-1">
                <p className="text-sm font-medium text-amber-800">Tax reserve ({taxReserve}%)</p>
              </div>
              <span className="text-sm font-semibold text-amber-700">{fmtCurrency(drawings.taxAmount)}</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-[#0D9488]/5 rounded-lg border border-[#0D9488]/20">
              <div className="w-8 h-8 rounded-full bg-[#0D9488] text-white flex items-center justify-center text-xs font-bold shrink-0">3</div>
              <div className="flex-1">
                <p className="text-sm font-medium text-teal-800">Growth reserve ({growthReserve}%)</p>
                <p className="text-xs text-teal-600">Scale ads, recruit subs</p>
              </div>
              <span className="text-sm font-semibold text-[#0D9488]">{fmtCurrency(drawings.growthAmount)}</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shrink-0">4</div>
              <div className="flex-1">
                <p className="text-sm font-medium text-emerald-800">Drawings ({100 - taxReserve - growthReserve}%)</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-xs text-emerald-600">Allan</p>
                    <p className="text-base font-bold text-emerald-700">{fmtCurrency(drawings.perPartner)}</p>
                  </div>
                  <div className="w-px h-8 bg-emerald-200" />
                  <div className="text-right">
                    <p className="text-xs text-emerald-600">Marko</p>
                    <p className="text-base font-bold text-emerald-700">{fmtCurrency(drawings.perPartner)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Section 4: Settings — Tax & Growth */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Calculator className="w-5 h-5 text-slate-400" />
          Split Settings
          <span className="text-xs font-normal text-slate-400 ml-2">(shared — both founders see the same values)</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Tax Reserve %</label>
            <input
              type="number" min={0} max={50} step={5} value={taxReserve}
              onChange={e => setTaxReserve(Math.min(50, Math.max(0, Number(e.target.value))))}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
            />
            <p className="text-[10px] text-slate-400 mt-1">Set aside for ATO</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Growth Reserve %
              {!bufferHit && <span className="text-amber-500 ml-1">(inactive until buffer hit)</span>}
            </label>
            <input
              type="number" min={0} max={75} step={5} value={growthReserve}
              disabled={!bufferHit}
              onChange={e => setGrowthReserve(Math.min(75, Math.max(0, Number(e.target.value))))}
              className={cn(
                "w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]",
                !bufferHit && "opacity-50 cursor-not-allowed"
              )}
            />
            <p className="text-[10px] text-slate-400 mt-1">Scale ads & recruit subs</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Drawings % (Allan & Marko)</label>
            <div className="w-full px-3 py-2 text-sm border border-slate-200 bg-slate-50 rounded-lg text-slate-600">
              {bufferHit ? `${100 - taxReserve - growthReserve}% (${((100 - taxReserve - growthReserve) / 2).toFixed(0)}% each)` : '0% (buffer building)'}
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Auto-calculated from remainder, split equally</p>
          </div>
        </div>
      </div>

      {/* Section 5: Monthly Cashflow Chart */}
      {monthlyData.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-slate-400" />
            Monthly Cashflow
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fontSize: 12, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(value: number, name: string) => [fmtCurrency(value), name === 'revenue' ? 'Revenue' : name === 'expenses' ? 'Expenses' : 'Net']}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px' }}
              />
              <Bar dataKey="revenue" fill="#0D9488" radius={[4, 4, 0, 0]} barSize={28} name="revenue" />
              <Bar dataKey="expenses" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={28} name="expenses" />
              <Line type="monotone" dataKey="net" stroke="#1B2A4A" strokeWidth={2} dot={{ fill: '#1B2A4A', r: 4 }} name="net" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Section 6: GST Threshold Tracker */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <AlertTriangle className={cn("w-5 h-5", gst.status === 'green' ? 'text-slate-400' : gst.status === 'amber' ? 'text-amber-500' : 'text-red-500')} />
            GST Threshold Tracker
          </h3>
          <span className="text-xs font-medium px-2 py-1 rounded-md bg-slate-100 text-slate-600">{gst.fyLabel}</span>
        </div>
        <div className="flex items-end gap-2 mb-3">
          <span className="text-2xl font-bold text-slate-900">{fmtCurrency(gst.fyRevenue)}</span>
          <span className="text-sm text-slate-500 mb-1">/ {fmtCurrency(GST_THRESHOLD)}</span>
        </div>
        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden mb-2">
          <div
            className={cn(
              "h-full rounded-full transition-all",
              gst.status === 'green' ? 'bg-emerald-500' : gst.status === 'amber' ? 'bg-amber-500' : 'bg-red-500'
            )}
            style={{ width: `${Math.min(gst.pct, 100)}%` }}
          />
        </div>
        <p className="text-xs text-slate-500">{Math.round(gst.pct)}% of GST registration threshold</p>
        {gst.status === 'amber' && (
          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
            <strong>Heads up:</strong> You're approaching the $75,000 GST threshold. Start planning for GST registration with your accountant.
          </div>
        )}
        {gst.status === 'red' && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
            <strong>Action required:</strong> Register for GST before crossing $75,000. Contact your accountant immediately.
          </div>
        )}
      </div>

      {/* Section 7 & 8: Outflows + Expense Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Outflows */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-slate-400" />
            Upcoming Outflows
            <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 ml-auto">Next 14 days</span>
          </h3>
          {upcomingOutflows.length === 0 ? (
            <p className="text-sm text-slate-500 py-4 text-center">No renewals in the next 14 days.</p>
          ) : (
            <div className="space-y-3">
              {upcomingOutflows.map(sub => {
                const days = differenceInDays(parseISO(sub.next_renewal!), new Date());
                return (
                  <div key={sub.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-slate-800">{sub.name}</p>
                      <p className="text-xs text-slate-500">{days === 0 ? 'Today' : `${days} day${days > 1 ? 's' : ''}`}</p>
                    </div>
                    <span className="text-sm font-semibold text-slate-700">{fmtCurrency(sub.cost)}</span>
                  </div>
                );
              })}
              <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <span className="text-sm font-semibold text-slate-700">Total</span>
                <span className="text-sm font-bold text-slate-900">{fmtCurrency(totalUpcoming)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Expense Breakdown */}
        {expenseBreakdown.length > 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-slate-400" />
              Expense Breakdown
            </h3>
            <div className="space-y-3">
              {expenseBreakdown.map(g => (
                <div key={g.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-slate-700">{g.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">{Math.round(g.pct)}%</span>
                      <span className="text-sm font-semibold text-slate-800">{fmtCurrency(g.amount)}</span>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full transition-all", g.color)} style={{ width: `${g.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-slate-400" />
              Expense Breakdown
            </h3>
            <p className="text-sm text-slate-500 py-4 text-center">No expenses logged for this period.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Summary Card Sub-component ──────────────────────────────────────────────

function SummaryCard({
  label, value, icon: Icon, iconColor, iconBg, valueColor, subtitle,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  valueColor?: string;
  subtitle?: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", iconBg)}>
          <Icon className={cn("w-4.5 h-4.5", iconColor)} />
        </div>
        <span className="text-sm font-medium text-slate-600">{label}</span>
      </div>
      <p className={cn("text-2xl font-bold", valueColor || 'text-slate-900')}>{value}</p>
      {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
    </div>
  );
}
