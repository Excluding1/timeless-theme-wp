import React, { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import {
  Plus, Search, LayoutGrid, Table as TableIcon, AlertTriangle, Phone, Shield,
  Briefcase, Star, Pencil, Trash2, Users
} from 'lucide-react';
import { format, differenceInDays, parseISO } from 'date-fns';
import { toast } from 'sonner';
import { SlideOver } from '../components/SlideOver';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { EmptyState } from '../components/EmptyState';
import { CardSkeleton, TableSkeleton } from '../components/LoadingSkeleton';
import { useData } from '../hooks/useData';
import { cn } from '../lib/utils';
import type { Subcontractor } from '../lib/database';

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; border: string }> = {
  active: { label: 'Active', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  on_hold: { label: 'On Hold', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  removed: { label: 'Removed', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  prospect: { label: 'Prospect', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
};

const PROSPECT_STAGE_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  new: { label: 'New', bg: 'bg-slate-100', text: 'text-slate-600' },
  contacted: { label: 'Contacted', bg: 'bg-sky-100', text: 'text-sky-700' },
  interested: { label: 'Interested', bg: 'bg-emerald-100', text: 'text-emerald-700' },
  considering: { label: 'Considering', bg: 'bg-violet-100', text: 'text-violet-700' },
  not_interested: { label: 'Not Interested', bg: 'bg-red-100', text: 'text-red-700' },
};

const PROSPECT_STAGE_OPTIONS = ['new', 'contacted', 'interested', 'considering', 'not_interested'] as const;
const SOURCE_OPTIONS = ['Gumtree', 'Referral', 'Word of Mouth', 'Facebook', 'Google', 'Trade Show', 'Other'] as const;

const TYPE_OPTIONS = ['Regrout', 'Resurface', 'Dual', 'Specialist'] as const;
const TIER_OPTIONS = ['Tier 1', 'Tier 2', 'Tier 3'] as const;
const STATUS_OPTIONS = ['active', 'on_hold', 'removed', 'prospect'] as const;
const SKILLS_OPTIONS = [
  'Shower Regrout', 'Bath Resurface', 'Silicone', 'Epoxy',
  'Full Bathroom', 'Chip Repair', 'Cabinet Respray', 'Stone Fleck',
] as const;

type SubForm = {
  name: string;
  business_name: string;
  abn: string;
  phone: string;
  email: string;
  type: string;
  tier: string;
  status: string;
  coverage_suburbs: string;
  skills: string[];
  pl_insurance_expiry: string;
  agreement_signed: boolean;
  agreement_date: string;
  trial_job_status: string;
  trial_job_score: number | '';
  avg_nps: number | '';
  jobs_completed: number | '';
  callback_rate: number | '';
  last_job_date: string;
  prospect_stage: string;
  last_contacted: string;
  source: string;
  rejection_reason: string;
  notes: string;
  documents_url: string;
};

function daysUntilExpiry(dateStr?: string): number | null {
  if (!dateStr) return null;
  try {
    return differenceInDays(parseISO(dateStr), new Date());
  } catch {
    return null;
  }
}

function formatAbn(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 2)} ${digits.slice(2)}`;
  if (digits.length <= 8) return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;
  return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
}

export function SubsTracker() {
  const { data: rawData, loading, create, update, remove } = useData('subcontractors');
  const data = rawData as unknown as Subcontractor[];
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [slideOpen, setSlideOpen] = useState(false);
  const [editing, setEditing] = useState<Subcontractor | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Subcontractor | null>(null);

  const { register, handleSubmit, reset, setValue, watch, formState: { isSubmitting } } = useForm<SubForm>();
  const watchedSkills = watch('skills') || [];
  const watchedStatus = watch('status');
  const watchedProspectStage = watch('prospect_stage');

  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.business_name?.toLowerCase().includes(q) ||
      s.phone.includes(q) ||
      s.email?.toLowerCase().includes(q) ||
      s.type.toLowerCase().includes(q)
    );
  }, [data, search]);

  const grouped = useMemo(() => {
    const groups: Record<string, Subcontractor[]> = { active: [], on_hold: [], prospect: [], removed: [] };
    filtered.forEach(s => {
      if (groups[s.status]) groups[s.status].push(s);
    });
    return groups;
  }, [filtered]);

  const expiringInsurance = useMemo(() => {
    return data.filter(s => {
      if (s.status !== 'active') return false;
      const days = daysUntilExpiry(s.pl_insurance_expiry);
      return days !== null && days < 30;
    });
  }, [data]);

  function openNew() {
    setEditing(null);
    reset({
      name: '', business_name: '', abn: '', phone: '', email: '',
      type: 'regrout', tier: 'tier_1', status: 'prospect', coverage_suburbs: '',
      skills: [], pl_insurance_expiry: '', agreement_signed: false, agreement_date: '',
      trial_job_status: '', trial_job_score: '', avg_nps: '', jobs_completed: '',
      callback_rate: '', last_job_date: '', prospect_stage: 'new', last_contacted: '',
      source: '', rejection_reason: '', notes: '', documents_url: '',
    });
    setSlideOpen(true);
  }

  function openEdit(sub: Subcontractor) {
    setEditing(sub);
    reset({
      name: sub.name,
      business_name: sub.business_name || '',
      abn: sub.abn || '',
      phone: sub.phone,
      email: sub.email || '',
      type: sub.type,
      tier: sub.tier,
      status: sub.status,
      coverage_suburbs: sub.coverage_suburbs || '',
      skills: sub.skills || [],
      pl_insurance_expiry: sub.pl_insurance_expiry || '',
      agreement_signed: sub.agreement_signed,
      agreement_date: sub.agreement_date || '',
      trial_job_status: sub.trial_job_status || '',
      trial_job_score: sub.trial_job_score ?? '',
      avg_nps: sub.avg_nps ?? '',
      jobs_completed: sub.jobs_completed ?? '',
      callback_rate: sub.callback_rate ?? '',
      last_job_date: sub.last_job_date || '',
      prospect_stage: sub.prospect_stage || 'new',
      last_contacted: sub.last_contacted || '',
      source: sub.source || '',
      rejection_reason: sub.rejection_reason || '',
      notes: sub.notes || '',
      documents_url: sub.documents_url || '',
    });
    setSlideOpen(true);
  }

  async function onSubmit(form: SubForm) {
    const payload: any = {
      ...form,
      trial_job_score: form.trial_job_score === '' ? null : Number(form.trial_job_score),
      avg_nps: form.avg_nps === '' ? null : Number(form.avg_nps),
      jobs_completed: form.jobs_completed === '' ? 0 : Number(form.jobs_completed),
      callback_rate: form.callback_rate === '' ? null : Number(form.callback_rate),
      prospect_stage: form.status === 'prospect' ? form.prospect_stage : undefined,
      last_contacted: form.last_contacted || undefined,
      source: form.source || undefined,
      rejection_reason: form.prospect_stage === 'not_interested' ? form.rejection_reason : undefined,
    };
    try {
      if (editing) {
        await update(editing.id, payload);
        toast.success('Subcontractor updated');
      } else {
        await create(payload);
        toast.success('Subcontractor added');
      }
      setSlideOpen(false);
    } catch {
      toast.error('Failed to save subcontractor');
    }
  }

  async function onDelete() {
    if (!deleteTarget) return;
    try {
      await remove(deleteTarget.id);
      toast.success('Subcontractor deleted');
      setDeleteTarget(null);
    } catch {
      toast.error('Failed to delete');
    }
  }

  function toggleSkill(skill: string) {
    const current = watchedSkills || [];
    if (current.includes(skill)) {
      setValue('skills', current.filter((s: string) => s !== skill));
    } else {
      setValue('skills', [...current, skill]);
    }
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => <CardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  const renderStatusBadge = (status: string) => {
    const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.prospect;
    return (
      <span className={cn('inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border', cfg.bg, cfg.text, cfg.border)}>
        {cfg.label}
      </span>
    );
  };

  const renderProspectStageBadge = (stage?: string) => {
    if (!stage) return null;
    const cfg = PROSPECT_STAGE_CONFIG[stage];
    if (!cfg) return null;
    return (
      <span className={cn('inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium', cfg.bg, cfg.text)}>
        {cfg.label}
      </span>
    );
  };

  const renderCard = (sub: Subcontractor) => {
    const days = daysUntilExpiry(sub.pl_insurance_expiry);
    const insuranceWarning = days !== null && days < 30;
    const isRejected = sub.status === 'prospect' && sub.prospect_stage === 'not_interested';

    return (
      <div
        key={sub.id}
        className={cn(
          "bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-shadow cursor-pointer group",
          isRejected && "opacity-50"
        )}
        onClick={() => openEdit(sub)}
      >
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className={cn("font-semibold", isRejected ? "text-slate-500 line-through" : "text-slate-900")}>{sub.name}</h3>
            {sub.business_name && <p className="text-sm text-slate-500">{sub.business_name}</p>}
          </div>
          <div className="flex items-center gap-2">
            {sub.status === 'prospect' && sub.prospect_stage ? renderProspectStageBadge(sub.prospect_stage) : renderStatusBadge(sub.status)}
            <button
              onClick={(e) => { e.stopPropagation(); setDeleteTarget(sub); }}
              className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-600 transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          {sub.source && (
            <span className="text-xs text-slate-400">Source: {sub.source}</span>
          )}

          <div className="flex items-center justify-between">
            <span className="text-slate-500 capitalize">{sub.type} &middot; {sub.tier.replace('_', ' ')}</span>
          </div>

          <a
            href={`tel:${sub.phone}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2 text-[#0D9488] hover:underline"
          >
            <Phone className="w-3.5 h-3.5" />
            {sub.phone}
          </a>

          {sub.pl_insurance_expiry && (
            <div className={cn('flex items-center gap-2', insuranceWarning ? 'text-red-600 font-medium' : 'text-slate-500')}>
              <Shield className="w-3.5 h-3.5" />
              PL Exp: {format(parseISO(sub.pl_insurance_expiry), 'dd MMM yyyy')}
              {insuranceWarning && days !== null && (
                <span className="text-xs">({days <= 0 ? 'EXPIRED' : `${days}d`})</span>
              )}
            </div>
          )}

          {sub.last_contacted && (
            <span className="text-xs text-slate-400">Last contacted: {format(parseISO(sub.last_contacted), 'dd MMM yyyy')}</span>
          )}

          {isRejected && sub.rejection_reason && (
            <p className="text-xs text-red-500 italic">Reason: {sub.rejection_reason}</p>
          )}

          <div className="flex items-center gap-4 pt-1">
            <span className="flex items-center gap-1 text-slate-500">
              <Briefcase className="w-3.5 h-3.5" />
              {sub.jobs_completed} jobs
            </span>
            {sub.last_job_date && (
              <span className="text-slate-400 text-xs">
                Last: {format(parseISO(sub.last_job_date), 'dd MMM')}
              </span>
            )}
            {sub.avg_nps != null && (
              <span className="flex items-center gap-1 text-slate-500">
                <Star className="w-3.5 h-3.5" />
                {sub.avg_nps}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Subcontractors</h2>
          <p className="text-slate-500 text-sm mt-1">Manage your subcontractor network</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2 bg-[#1B2A4A] text-white rounded-lg font-medium hover:bg-[#1e335a] transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Sub</span>
        </button>
      </div>

      {/* Insurance Alert Banner */}
      {expiringInsurance.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-800">Insurance Expiring Soon</p>
            <p className="text-sm text-red-700 mt-0.5">
              {expiringInsurance.map(s => {
                const d = daysUntilExpiry(s.pl_insurance_expiry);
                return `${s.name} (${d !== null && d <= 0 ? 'EXPIRED' : `${d}d`})`;
              }).join(', ')}
            </p>
          </div>
        </div>
      )}

      {/* Search + View Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search subcontractors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1">
          <button
            onClick={() => setViewMode('cards')}
            className={cn('p-2 rounded-md transition-colors', viewMode === 'cards' ? 'bg-[#1B2A4A] text-white' : 'text-slate-500 hover:bg-slate-100')}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={cn('p-2 rounded-md transition-colors', viewMode === 'table' ? 'bg-[#1B2A4A] text-white' : 'text-slate-500 hover:bg-slate-100')}
          >
            <TableIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No subcontractors found"
          description={search ? 'Try adjusting your search terms' : 'Add your first subcontractor to get started'}
          actionLabel={search ? undefined : 'Add Sub'}
          onAction={search ? undefined : openNew}
        />
      ) : viewMode === 'cards' ? (
        <div className="space-y-8">
          {(Object.entries(grouped) as [string, Subcontractor[]][]).map(([status, subs]) =>
            subs.length > 0 ? (
              <div key={status}>
                <div className="flex items-center gap-2 mb-3">
                  {renderStatusBadge(status)}
                  <span className="text-sm text-slate-400">({subs.length})</span>
                </div>
                {/* Prospect pipeline summary */}
                {status === 'prospect' && subs.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {PROSPECT_STAGE_OPTIONS.map(stage => {
                      const count = subs.filter(s => (s.prospect_stage || 'new') === stage).length;
                      if (count === 0) return null;
                      const cfg = PROSPECT_STAGE_CONFIG[stage];
                      return (
                        <span key={stage} className={cn('inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium', cfg.bg, cfg.text)}>
                          {cfg.label} <span className="font-bold">{count}</span>
                        </span>
                      );
                    })}
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {subs.map(renderCard)}
                </div>
              </div>
            ) : null
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                  <th className="p-4">Name</th>
                  <th className="p-4">Type / Tier</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">PL Expiry</th>
                  <th className="p-4 text-right">Jobs</th>
                  <th className="p-4">Last Job</th>
                  <th className="p-4 w-20"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filtered.map(sub => {
                  const days = daysUntilExpiry(sub.pl_insurance_expiry);
                  const insuranceWarning = days !== null && days < 30;
                  return (
                    <tr key={sub.id} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => openEdit(sub)}>
                      <td className="p-4">
                        <div className="font-medium text-slate-900">{sub.name}</div>
                        {sub.business_name && <div className="text-xs text-slate-500">{sub.business_name}</div>}
                      </td>
                      <td className="p-4 capitalize text-slate-600">{sub.type} / {sub.tier.replace('_', ' ')}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5">
                          {renderStatusBadge(sub.status)}
                          {sub.status === 'prospect' && sub.prospect_stage && renderProspectStageBadge(sub.prospect_stage)}
                        </div>
                      </td>
                      <td className="p-4">
                        <a href={`tel:${sub.phone}`} onClick={(e) => e.stopPropagation()} className="text-[#0D9488] hover:underline">
                          {sub.phone}
                        </a>
                      </td>
                      <td className={cn('p-4', insuranceWarning ? 'text-red-600 font-medium' : 'text-slate-600')}>
                        {sub.pl_insurance_expiry ? format(parseISO(sub.pl_insurance_expiry), 'dd MMM yyyy') : '-'}
                        {insuranceWarning && days !== null && <span className="text-xs ml-1">({days <= 0 ? 'EXPIRED' : `${days}d`})</span>}
                      </td>
                      <td className="p-4 text-right text-slate-600">{sub.jobs_completed}</td>
                      <td className="p-4 text-slate-500">{sub.last_job_date ? format(parseISO(sub.last_job_date), 'dd MMM') : '-'}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <button onClick={(e) => { e.stopPropagation(); openEdit(sub); }} className="p-1 text-slate-400 hover:text-slate-700">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); setDeleteTarget(sub); }} className="p-1 text-slate-400 hover:text-red-600">
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
      <SlideOver open={slideOpen} onClose={() => setSlideOpen(false)} title={editing ? 'Edit Subcontractor' : 'Add Subcontractor'} width="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Name *</label>
              <input {...register('name', { required: true })} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Business Name</label>
              <input {...register('business_name')} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">ABN</label>
            <input
              {...register('abn')}
              placeholder="XX XXX XXX XXX"
              onChange={(e) => setValue('abn', formatAbn(e.target.value))}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone *</label>
              <input {...register('phone', { required: true })} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input type="email" {...register('email')} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
              <select {...register('type')} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]">
                {TYPE_OPTIONS.map(t => <option key={t} value={t.toLowerCase()}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tier</label>
              <select {...register('tier')} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]">
                {TIER_OPTIONS.map(t => <option key={t} value={t.toLowerCase().replace(' ', '_')}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <select {...register('status')} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]">
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>)}
              </select>
            </div>
          </div>

          {/* Prospect Pipeline Fields */}
          {watchedStatus === 'prospect' && (
            <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4 space-y-4">
              <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Prospect Details</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Stage</label>
                  <select {...register('prospect_stage')} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]">
                    {PROSPECT_STAGE_OPTIONS.map(s => <option key={s} value={s}>{PROSPECT_STAGE_CONFIG[s].label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Source</label>
                  <select {...register('source')} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]">
                    <option value="">Select...</option>
                    {SOURCE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Last Contacted</label>
                <input type="date" {...register('last_contacted')} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]" />
              </div>
              {watchedProspectStage === 'not_interested' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Reason (so you don't ask again)</label>
                  <input {...register('rejection_reason')} placeholder="e.g. Too far, not available, bad reviews" className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]" />
                </div>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Coverage Suburbs</label>
            <input {...register('coverage_suburbs')} placeholder="e.g. Sydney CBD, Inner West" className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Skills</label>
            <div className="grid grid-cols-2 gap-2">
              {SKILLS_OPTIONS.map(skill => (
                <label key={skill} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={watchedSkills?.includes(skill)}
                    onChange={() => toggleSkill(skill)}
                    className="rounded border-slate-300 text-[#0D9488] focus:ring-[#0D9488]"
                  />
                  {skill}
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">PL Insurance Expiry</label>
              <input type="date" {...register('pl_insurance_expiry')} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Agreement Date</label>
              <input type="date" {...register('agreement_date')} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]" />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
            <input type="checkbox" {...register('agreement_signed')} className="rounded border-slate-300 text-[#0D9488] focus:ring-[#0D9488]" />
            Agreement Signed
          </label>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Trial Job Status</label>
              <input {...register('trial_job_status')} placeholder="e.g. Passed, Pending" className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Trial Job Score (0-100)</label>
              <input type="number" min={0} max={100} {...register('trial_job_score')} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Avg NPS</label>
              <input type="number" step="0.1" {...register('avg_nps')} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Jobs Completed</label>
              <input type="number" min={0} {...register('jobs_completed')} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Callback Rate %</label>
              <input type="number" step="0.1" {...register('callback_rate')} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Last Job Date</label>
            <input type="date" {...register('last_job_date')} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Documents URL</label>
            <input type="url" {...register('documents_url')} placeholder="https://..." className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]" />
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
              {isSubmitting ? 'Saving...' : editing ? 'Update' : 'Add'} {isSubmitting ? '' : 'Subcontractor'}
            </button>
          </div>
        </form>
      </SlideOver>

      {/* Confirm Delete */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={onDelete}
        title="Delete Subcontractor"
        description={`Are you sure you want to delete ${deleteTarget?.name}? This action cannot be undone.`}
      />
    </div>
  );
}
