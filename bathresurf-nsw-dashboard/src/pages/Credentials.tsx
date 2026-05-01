import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import {
  Plus, Search, KeyRound, Copy, Check, Eye, EyeOff,
  ExternalLink, Pencil, Trash2, ShieldCheck,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { SlideOver } from '../components/SlideOver';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { EmptyState } from '../components/EmptyState';
import { Skeleton } from '../components/LoadingSkeleton';
import { useData } from '../hooks/useData';
import { cn, sanitizeUrl } from '../lib/utils';
import type { Credential } from '../lib/database';

// ─── Constants ───────────────────────────────────────────────────────────────

const CATEGORIES = [
  'CRM', 'Job Mgmt', 'Accounting', 'Payments', 'Communication',
  'Advertising', 'Hosting', 'Design', 'Analytics', 'Insurance', 'Legal', 'Other',
] as const;

const TWO_FA_METHODS = ['None', 'Authenticator', 'SMS', 'Email'] as const;

const COPY_CLEAR_MS = 30_000;

// ─── Types ───────────────────────────────────────────────────────────────────

type FormData = {
  service_name: string;
  category: string;
  login_url: string;
  username: string;
  password: string;
  two_fa_method: string;
  two_fa_notes: string;
  notes: string;
};

const EMPTY_FORM: FormData = {
  service_name: '', category: 'Other', login_url: '',
  username: '', password: '', two_fa_method: 'None',
  two_fa_notes: '', notes: '',
};

// ─── Component ───────────────────────────────────────────────────────────────

const VAULT_PASSCODE = '1179';

export function Credentials() {
  const { data: credentials, loading, create, update, remove } = useData('credentials');

  const [search, setSearch] = useState('');
  const [slideOpen, setSlideOpen] = useState(false);
  const [editing, setEditing] = useState<Credential | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Credential | null>(null);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showFormPassword, setShowFormPassword] = useState(false);
  const [vaultUnlocked, setVaultUnlocked] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState('');

  // Timer ref for auto-clearing copied state
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const vaultTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Re-lock vault on page leave + cleanup timers
  useEffect(() => {
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
      if (vaultTimerRef.current) clearTimeout(vaultTimerRef.current);
      // Re-lock when navigating away
    };
  }, []);

  // Auto-lock after 90 seconds
  useEffect(() => {
    if (!vaultUnlocked) return;
    if (vaultTimerRef.current) clearTimeout(vaultTimerRef.current);
    vaultTimerRef.current = setTimeout(() => {
      setVaultUnlocked(false);
      setShowPasswords({});
      toast.info('Vault auto-locked', { duration: 2000 });
    }, 90_000); // 90 seconds
    return () => {
      if (vaultTimerRef.current) clearTimeout(vaultTimerRef.current);
    };
  }, [vaultUnlocked]);

  const {
    register, handleSubmit, reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ defaultValues: EMPTY_FORM });

  // ── Derived data ───────────────────────────────────────────────────────────

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return credentials.filter(
      (c) =>
        c.service_name.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.username.toLowerCase().includes(q)
    );
  }, [credentials, search]);

  // ── Actions ────────────────────────────────────────────────────────────────

  function handlePasscodeSubmit() {
    if (passcodeInput === VAULT_PASSCODE) {
      setVaultUnlocked(true);
    } else {
      toast.error('Wrong passcode');
      setPasscodeInput('');
    }
  }

  const togglePassword = useCallback((id: string) => {
    setShowPasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const copyToClipboard = useCallback((id: string, text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      toast.success('Password copied — clipboard clears in 30s', { duration: 3000 });
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
      copyTimerRef.current = setTimeout(() => {
        setCopiedId(null);
        navigator.clipboard.writeText('').catch(() => {});
        toast.info('Clipboard cleared', { duration: 2000 });
      }, COPY_CLEAR_MS);
    });
  }, []);

  function openCreate() {
    setEditing(null);
    setShowFormPassword(false);
    reset(EMPTY_FORM);
    setSlideOpen(true);
  }

  function openEdit(cred: Credential) {
    setEditing(cred);
    setShowFormPassword(false);
    reset({
      service_name: cred.service_name,
      category: cred.category,
      login_url: cred.login_url || '',
      username: cred.username,
      password: cred.password,
      two_fa_method: cred.two_fa_method || 'None',
      two_fa_notes: cred.two_fa_notes || '',
      notes: cred.notes || '',
    });
    setSlideOpen(true);
  }

  async function onSubmit(data: FormData) {
    try {
      const payload: Partial<Credential> = {
        service_name: data.service_name,
        category: data.category,
        login_url: data.login_url || undefined,
        username: data.username,
        password: data.password,
        two_fa_method: data.two_fa_method === 'None' ? undefined : data.two_fa_method,
        two_fa_notes: data.two_fa_notes || undefined,
        notes: data.notes || undefined,
      };

      if (editing) {
        await update(editing.id, payload);
        toast.success('Credential updated');
      } else {
        await create(payload);
        toast.success('Credential created');
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
      toast.success('Credential deleted');
      setDeleteTarget(null);
    } catch {
      toast.error('Failed to delete credential');
    }
  }

  // ── Shared classes ─────────────────────────────────────────────────────────

  const labelCls = 'block text-sm font-medium text-slate-700 mb-1';
  const inputCls =
    'w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent';

  // ═══════════════════════════════════════════════════════════════════════════
  //  RENDER
  // ═══════════════════════════════════════════════════════════════════════════

  // ── Passcode Gate — blocks entire page until unlocked ─────────────────────
  if (!vaultUnlocked) {
    return (
      <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 w-full max-w-xs p-8 text-center">
          <div className="w-14 h-14 rounded-xl bg-[#1B2A4A]/10 flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-7 h-7 text-[#1B2A4A]" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900 mb-1">Credentials Vault</h2>
          <p className="text-sm text-slate-500 mb-6">Enter passcode to access</p>
          <form onSubmit={(e) => { e.preventDefault(); handlePasscodeSubmit(); }}>
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              autoFocus
              value={passcodeInput}
              onChange={(e) => setPasscodeInput(e.target.value.replace(/\D/g, ''))}
              placeholder="••••"
              className="w-full px-4 py-3 text-center text-2xl font-mono tracking-[0.5em] border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent"
            />
            <button
              type="submit"
              disabled={passcodeInput.length < 4}
              className="w-full mt-4 px-4 py-2.5 bg-[#1B2A4A] text-white rounded-lg font-medium hover:bg-[#1e335a] transition-colors disabled:opacity-40"
            >
              Unlock
            </button>
          </form>
          <p className="text-xs text-slate-400 mt-4">Auto-locks after 90 seconds</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-72" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200">
            <Skeleton className="h-9 w-72" />
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {[1, 2, 3, 4, 5].map((i) => (
                  <th key={i} className="p-4">
                    <Skeleton className="h-3 w-20" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="border-b border-slate-100">
                  {[1, 2, 3, 4, 5].map((j) => (
                    <td key={j} className="p-4">
                      <Skeleton className="h-4 w-24" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Credentials Vault</h2>
          <p className="text-slate-500 text-sm mt-1">Securely store and manage business logins</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-[#1B2A4A] text-white rounded-lg font-medium hover:bg-[#1e335a] transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Credential</span>
        </button>
      </div>

      {/* ── Empty State ─────────────────────────────────────────────────────── */}
      {filtered.length === 0 && !search && (
        <EmptyState
          icon={KeyRound}
          title="No credentials yet"
          description="Add your first credential to securely store business login details."
          actionLabel="Add Credential"
          onAction={openCreate}
        />
      )}

      {/* ── Table ───────────────────────────────────────────────────────────── */}
      {(filtered.length > 0 || search) && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Search bar */}
          <div className="p-4 border-b border-slate-200 flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search services..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent"
              />
            </div>
            <div className="text-xs text-slate-400">
              {filtered.length} credential{filtered.length !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Empty search result */}
          {filtered.length === 0 && search && (
            <div className="py-12 text-center">
              <p className="text-sm text-slate-500">No credentials match your search.</p>
            </div>
          )}

          {/* Data table */}
          {filtered.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                    <th className="p-4">Service</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Username</th>
                    <th className="p-4">Password</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filtered.map((cred) => {
                    const isVisible = showPasswords[cred.id];
                    const isCopied = copiedId === cred.id;

                    return (
                      <tr
                        key={cred.id}
                        onClick={() => openEdit(cred)}
                        className="hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        {/* Service */}
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                              <KeyRound className="w-4 h-4 text-slate-500" />
                            </div>
                            <div>
                              <span className="font-medium text-slate-900">{cred.service_name}</span>
                              {cred.two_fa_method && cred.two_fa_method !== 'None' && (
                                <span className="ml-2 inline-flex items-center gap-1 text-xs text-[#0D9488]">
                                  <ShieldCheck className="w-3 h-3" />
                                  2FA
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="p-4 text-slate-600">{cred.category}</td>

                        {/* Username */}
                        <td className="p-4 text-slate-900 font-mono text-xs">{cred.username}</td>

                        {/* Password */}
                        <td className="p-4" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm text-slate-700 bg-slate-100 px-2.5 py-1 rounded min-w-[100px]">
                              {isVisible ? cred.password : '\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022'}
                            </span>
                            <button
                              onClick={() => togglePassword(cred.id)}
                              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
                              title={isVisible ? 'Hide password' : 'Show password'}
                            >
                              {isVisible ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => copyToClipboard(cred.id, cred.password)}
                              className={cn(
                                'p-1.5 rounded-md transition-colors',
                                isCopied
                                  ? 'text-emerald-500 bg-emerald-50'
                                  : 'text-slate-400 hover:text-[#0D9488] hover:bg-teal-50'
                              )}
                              title="Copy password"
                            >
                              {isCopied ? (
                                <Check className="w-4 h-4" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1">
                            {cred.login_url && (
                              <a
                                href={sanitizeUrl(cred.login_url)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 text-slate-400 hover:text-[#0D9488] rounded-lg hover:bg-teal-50 transition-colors"
                                title="Open login page"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            )}
                            <button
                              onClick={() => openEdit(cred)}
                              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(cred)}
                              className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                              title="Delete"
                            >
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
          )}
        </div>
      )}

      {/* ── SlideOver Form ──────────────────────────────────────────────────── */}
      <SlideOver
        open={slideOpen}
        onClose={() => setSlideOpen(false)}
        title={editing ? 'Edit Credential' : 'Add Credential'}
        width="md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Service Name */}
          <div>
            <label className={labelCls}>Service Name *</label>
            <input
              {...register('service_name', { required: 'Service name is required' })}
              className={cn(inputCls, errors.service_name && 'border-red-400 focus:ring-red-400')}
              placeholder="e.g. GoHighLevel"
            />
            {errors.service_name && (
              <p className="text-xs text-red-500 mt-1">{errors.service_name.message}</p>
            )}
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

          {/* Username */}
          <div>
            <label className={labelCls}>Username *</label>
            <input
              {...register('username', { required: 'Username is required' })}
              className={cn(inputCls, errors.username && 'border-red-400 focus:ring-red-400')}
              placeholder="admin@example.com"
            />
            {errors.username && (
              <p className="text-xs text-red-500 mt-1">{errors.username.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className={labelCls}>Password *</label>
            <div className="relative">
              <input
                type={showFormPassword ? 'text' : 'password'}
                {...register('password', { required: 'Password is required' })}
                className={cn(inputCls, 'pr-10', errors.password && 'border-red-400 focus:ring-red-400')}
                placeholder="Enter password"
              />
              <button
                type="button"
                onClick={() => setShowFormPassword(!showFormPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showFormPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* 2FA Method */}
          <div>
            <label className={labelCls}>Two-Factor Authentication</label>
            <select {...register('two_fa_method')} className={inputCls}>
              {TWO_FA_METHODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* 2FA Notes / Backup Codes */}
          <div>
            <label className={labelCls}>2FA Notes / Backup Codes</label>
            <textarea
              {...register('two_fa_notes')}
              rows={3}
              className={cn(inputCls, 'resize-none font-mono text-xs')}
              placeholder="Backup codes, recovery keys, etc."
            />
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

          {/* Form actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 bg-[#1B2A4A] text-white rounded-lg font-medium hover:bg-[#1e335a] transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : editing ? 'Update Credential' : 'Add Credential'}
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
        title="Delete Credential"
        description={`Are you sure you want to delete the credential for "${deleteTarget?.service_name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
      />

    </div>
  );
}
