import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format, parseISO, isWithinInterval, isValid } from 'date-fns';
import { useDropzone } from 'react-dropzone';
import imageCompression from 'browser-image-compression';
import { toast } from 'sonner';
import { uploadToCloudinary, isCloudinaryConfigured } from '../lib/cloudinary';
import {
  Plus,
  Search,
  Receipt,
  Image as ImageIcon,
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  X,
  Upload,
  Trash2,
  FileText,
} from 'lucide-react';

import { SlideOver } from '../components/SlideOver';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { EmptyState } from '../components/EmptyState';
import { TableSkeleton } from '../components/LoadingSkeleton';
import { PeriodFilter, type Period } from '../components/PeriodFilter';
import { useData } from '../hooks/useData';
import { usePreferences } from '../contexts/PreferencesContext';
import { getPeriodDateRange } from '../lib/database';
import { cn } from '../lib/utils';
import type { Finance, Subscription } from '../lib/database';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const REVENUE_CATEGORIES = [
  'Customer Payment',
  'Booking Deposit',
  'Referral Credit',
  'Other',
] as const;

const EXPENSE_CATEGORIES = [
  'Sub Payment',
  'Google Ads',
  'Meta Ads',
  'Other Ad',
  'Software & Subs',
  'Insurance',
  'Legal & Accounting',
  'Materials',
  'Travel',
  'Phone & Internet',
  'Stripe Fees',
  'pay.com.au Fees',
  'Bank Fees',
  'Training',
  'Other',
] as const;

const ALL_CATEGORIES = [...new Set([...REVENUE_CATEGORIES, ...EXPENSE_CATEGORIES])];

const PAYMENT_METHODS = [
  'Cash',
  'Bank Transfer',
  'Stripe',
  'Credit Card',
  'pay.com.au',
  'Other',
] as const;

const PAGE_SIZE = 25;


// ---------------------------------------------------------------------------
// Zod Schema
// ---------------------------------------------------------------------------

const financeSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  type: z.enum(['revenue', 'expense'], { error: 'Type is required' }),
  category: z.string().min(1, 'Category is required'),
  description: z.string().min(1, 'Description is required'),
  amount: z
    .number({ error: 'Enter a valid number' })
    .positive('Amount must be positive'),
  payment_method: z.string().optional(),
  gst_included: z.boolean(),
  receipt_photos: z.array(z.string()),
  linked_job: z.string().optional(),
  notes: z.string().optional(),
});

type FinanceFormData = z.infer<typeof financeSchema>;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatAUD(value: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 2,
  }).format(value);
}

function todayISO(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

// ---------------------------------------------------------------------------
// Receipt Upload Sub-component
// ---------------------------------------------------------------------------

function ReceiptUploader({
  photos,
  onChange,
}: {
  photos: string[];
  onChange: (photos: string[]) => void;
}) {
  // Track blob URLs we created so we can revoke them on unmount and prevent leaks.
  const blobUrlsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    return () => {
      blobUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
      blobUrlsRef.current.clear();
    };
  }, []);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (photos.length + acceptedFiles.length > 5) {
        toast.error('Maximum 5 receipt images allowed');
        return;
      }

      const newUrls: string[] = [];
      for (const file of acceptedFiles) {
        try {
          const compressed = await imageCompression(file, {
            maxSizeMB: 1,
            maxWidthOrHeight: 1200,
            useWebWorker: true,
          });
          const url = await uploadToCloudinary(compressed);
          newUrls.push(url);
          if (url.startsWith('blob:')) blobUrlsRef.current.add(url);
        } catch (err) {
          console.error('Upload failed, using local blob:', err);
          const url = URL.createObjectURL(file);
          blobUrlsRef.current.add(url);
          newUrls.push(url);
        }
      }
      if (!isCloudinaryConfigured && newUrls.length > 0) {
        toast.info('Photos stored locally only — configure Cloudinary for persistent storage');
      }
      onChange([...photos, ...newUrls].slice(0, 5));
    },
    [photos, onChange],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    maxFiles: 5 - photos.length,
    disabled: photos.length >= 5,
  });

  const removePhoto = (index: number) => {
    const url = photos[index];
    if (url && url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
      blobUrlsRef.current.delete(url);
    }
    const updated = [...photos];
    updated.splice(index, 1);
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      {photos.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {photos.map((url, i) => (
            <div key={i} className="relative group w-20 h-20 rounded-lg overflow-hidden border border-slate-200">
              <img src={url} alt={`Receipt ${i + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removePhoto(i)}
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}
      {photos.length < 5 && (
        <div
          {...getRootProps()}
          className={cn(
            'border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors',
            isDragActive
              ? 'border-[#0D9488] bg-teal-50'
              : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50',
          )}
        >
          <input {...getInputProps()} />
          <Upload className="w-5 h-5 mx-auto text-slate-400 mb-1" />
          <p className="text-sm text-slate-500">
            {isDragActive ? 'Drop images here...' : 'Drag & drop or click to upload'}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {photos.length}/5 images (PNG, JPG, WebP)
          </p>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Lightbox Sub-component
// ---------------------------------------------------------------------------

function ReceiptLightbox({
  photos,
  initialIndex,
  onClose,
}: {
  photos: string[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(initialIndex);

  if (photos.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />
      <div className="relative max-w-3xl w-full mx-4">
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white/70 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        <img
          src={photos[idx]}
          alt={`Receipt ${idx + 1}`}
          className="w-full max-h-[80vh] object-contain rounded-lg"
        />
        {photos.length > 1 && (
          <div className="flex items-center justify-center gap-4 mt-4">
            <button
              onClick={() => setIdx((prev) => (prev - 1 + photos.length) % photos.length)}
              className="p-2 text-white/70 hover:text-white bg-white/10 rounded-full transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-white/70 text-sm">
              {idx + 1} / {photos.length}
            </span>
            <button
              onClick={() => setIdx((prev) => (prev + 1) % photos.length)}
              className="p-2 text-white/70 hover:text-white bg-white/10 rounded-full transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Finance Form Sub-component
// ---------------------------------------------------------------------------

function FinanceForm({
  defaultValues,
  onSubmit,
  onCancel,
  isEdit,
}: {
  defaultValues: FinanceFormData;
  onSubmit: (data: FinanceFormData) => void;
  onCancel: () => void;
  isEdit: boolean;
}) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FinanceFormData>({
    resolver: zodResolver(financeSchema),
    defaultValues,
  });

  const selectedType = watch('type');
  const categories = selectedType === 'revenue' ? REVENUE_CATEGORIES : EXPENSE_CATEGORIES;

  const labelClasses = 'block text-sm font-medium text-slate-700 mb-1';
  const inputClasses =
    'w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent transition-shadow';
  const errorClasses = 'text-xs text-red-600 mt-1';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Date */}
      <div>
        <label className={labelClasses}>Date *</label>
        <input type="date" {...register('date')} className={inputClasses} />
        {errors.date && <p className={errorClasses}>{errors.date.message}</p>}
      </div>

      {/* Type */}
      <div>
        <label className={labelClasses}>Type *</label>
        <select {...register('type')} className={inputClasses}>
          <option value="">Select type...</option>
          <option value="revenue">Revenue</option>
          <option value="expense">Expense</option>
        </select>
        {errors.type && <p className={errorClasses}>{errors.type.message}</p>}
      </div>

      {/* Category */}
      <div>
        <label className={labelClasses}>Category *</label>
        <select {...register('category')} className={inputClasses}>
          <option value="">Select category...</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        {errors.category && <p className={errorClasses}>{errors.category.message}</p>}
      </div>

      {/* Description */}
      <div>
        <label className={labelClasses}>Description *</label>
        <input
          type="text"
          {...register('description')}
          placeholder="e.g. Final payment - Smith Bathroom"
          className={inputClasses}
        />
        {errors.description && <p className={errorClasses}>{errors.description.message}</p>}
      </div>

      {/* Amount */}
      <div>
        <label className={labelClasses}>Amount (AUD) *</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
          <input
            type="number"
            step="0.01"
            min="0.01"
            {...register('amount', { valueAsNumber: true })}
            placeholder="0.00"
            className={cn(inputClasses, 'pl-7')}
          />
        </div>
        {errors.amount && <p className={errorClasses}>{errors.amount.message}</p>}
      </div>

      {/* Payment Method */}
      <div>
        <label className={labelClasses}>Payment Method</label>
        <select {...register('payment_method')} className={inputClasses}>
          <option value="">Select method...</option>
          {PAYMENT_METHODS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      {/* GST Included */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="gst_included"
          {...register('gst_included')}
          className="w-4 h-4 rounded border-slate-300 text-[#0D9488] focus:ring-[#0D9488]"
        />
        <label htmlFor="gst_included" className="text-sm text-slate-700">
          GST included
        </label>
      </div>

      {/* Receipt Photos */}
      <div>
        <label className={labelClasses}>Receipt Photos</label>
        <Controller
          name="receipt_photos"
          control={control}
          render={({ field }) => (
            <ReceiptUploader photos={field.value} onChange={field.onChange} />
          )}
        />
      </div>

      {/* Linked Job */}
      <div>
        <label className={labelClasses}>Linked Job</label>
        <input
          type="text"
          {...register('linked_job')}
          placeholder="e.g. JOB-1042"
          className={inputClasses}
        />
      </div>

      {/* Notes */}
      <div>
        <label className={labelClasses}>Notes</label>
        <textarea
          {...register('notes')}
          rows={3}
          placeholder="Additional notes..."
          className={inputClasses}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-4 py-2.5 bg-[#1B2A4A] text-white rounded-lg font-medium hover:bg-[#1e335a] transition-colors shadow-sm disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : isEdit ? 'Update Entry' : 'Add Entry'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

function toMonthlyCost(cost: number, cycle: string): number {
  switch (cycle) {
    case 'annually':  return cost / 12;
    case 'quarterly': return cost / 3;
    case 'monthly':   return cost;
    default:          return 0;
  }
}

export function Finances() {
  const { data: finances, loading, create, update, remove } = useData('finances');
  const { data: subscriptionsRaw } = useData('subscriptions');
  const { preferences, updatePreferences } = usePreferences();

  // Period — sourced from preferences so the user's last selection persists across sessions.
  const period = (preferences.default_finance_period as Period) || 'this_month';
  const setPeriod = (next: Period) => updatePreferences({ default_finance_period: next });
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  // Search & filters
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'revenue' | 'expense'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Pagination
  const [page, setPage] = useState(1);

  // Slide-over
  const [slideOpen, setSlideOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<Finance | null>(null);

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<Finance | null>(null);

  // Lightbox
  const [lightboxPhotos, setLightboxPhotos] = useState<string[] | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // -----------------------------------------------------------------------
  // Derived data
  // -----------------------------------------------------------------------

  const periodRange = useMemo(() => {
    if (period === 'custom') {
      if (customStart && customEnd) {
        return { start: parseISO(customStart), end: parseISO(customEnd) };
      }
      return null;
    }
    return getPeriodDateRange(period);
  }, [period, customStart, customEnd]);

  const filteredByPeriod = useMemo(() => {
    if (!periodRange) return finances;
    return finances.filter((f) => {
      if (!f.date) return false;
      const d = parseISO(f.date);
      if (!isValid(d)) return false;
      return isWithinInterval(d, { start: periodRange.start, end: periodRange.end });
    });
  }, [finances, periodRange]);

  // Summary calculations
  const summary = useMemo(() => {
    const totalRevenue = filteredByPeriod
      .filter((f) => f.type === 'revenue')
      .reduce((sum, f) => sum + f.amount, 0);
    const totalExpenses = filteredByPeriod
      .filter((f) => f.type === 'expense')
      .reduce((sum, f) => sum + f.amount, 0);
    return {
      totalRevenue,
      totalExpenses,
      netProfit: totalRevenue - totalExpenses,
      subscriptions: (subscriptionsRaw as unknown as Subscription[])
        .filter(s => s.status === 'active' || s.status === 'trial')
        .reduce((sum, s) => sum + toMonthlyCost(s.cost, s.billing_cycle), 0),
    };
  }, [filteredByPeriod, subscriptionsRaw]);

  // Search + type + category filters
  const filtered = useMemo(() => {
    let result = filteredByPeriod;

    if (typeFilter !== 'all') {
      result = result.filter((f) => f.type === typeFilter);
    }

    if (categoryFilter !== 'all') {
      result = result.filter((f) => f.category === categoryFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (f) =>
          f.description.toLowerCase().includes(q) ||
          f.category.toLowerCase().includes(q) ||
          (f.linked_job && f.linked_job.toLowerCase().includes(q)) ||
          (f.notes && f.notes.toLowerCase().includes(q)),
      );
    }

    // Sort newest first
    return [...result].sort((a, b) => b.date.localeCompare(a.date));
  }, [filteredByPeriod, typeFilter, categoryFilter, search]);

  // Categories that actually appear in filtered data (for the category dropdown)
  const activeCategories = useMemo(() => {
    const cats = new Set(filteredByPeriod.map((f) => f.category));
    return ALL_CATEGORIES.filter((c) => cats.has(c));
  }, [filteredByPeriod]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(page, totalPages);
  const paginatedData = filtered.slice(
    (safeCurrentPage - 1) * PAGE_SIZE,
    safeCurrentPage * PAGE_SIZE,
  );
  const startIndex = (safeCurrentPage - 1) * PAGE_SIZE + 1;
  const endIndex = Math.min(safeCurrentPage * PAGE_SIZE, filtered.length);

  // -----------------------------------------------------------------------
  // Handlers
  // -----------------------------------------------------------------------

  const openCreate = () => {
    setEditingEntry(null);
    setSlideOpen(true);
  };

  const openEdit = (entry: Finance) => {
    setEditingEntry(entry);
    setSlideOpen(true);
  };

  const closeSlide = () => {
    setSlideOpen(false);
    setEditingEntry(null);
  };

  const handleFormSubmit = async (data: FinanceFormData) => {
    try {
      if (editingEntry) {
        await update(editingEntry.id, data);
        toast.success('Entry updated successfully');
      } else {
        await create(data);
        toast.success('Entry added successfully');
      }
      closeSlide();
    } catch (e: any) {
      toast.error(e.message || 'Something went wrong');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await remove(deleteTarget.id);
      toast.success('Entry deleted');
      setDeleteTarget(null);
    } catch (e: any) {
      toast.error(e.message || 'Failed to delete');
    }
  };

  const openLightbox = (photos: string[], index: number) => {
    setLightboxPhotos(photos);
    setLightboxIndex(index);
  };

  // Reset page when filters change
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };
  const handleTypeFilterChange = (value: 'all' | 'revenue' | 'expense') => {
    setTypeFilter(value);
    setPage(1);
  };
  const handleCategoryFilterChange = (value: string) => {
    setCategoryFilter(value);
    setPage(1);
  };
  const handlePeriodChange = (value: Period) => {
    setPeriod(value);
    setPage(1);
  };
  const handleCustomRangeChange = (start: string, end: string) => {
    setCustomStart(start);
    setCustomEnd(end);
    setPage(1);
  };

  // -----------------------------------------------------------------------
  // Default form values
  // -----------------------------------------------------------------------

  const formDefaults: FinanceFormData = editingEntry
    ? {
        date: editingEntry.date,
        type: editingEntry.type,
        category: editingEntry.category,
        description: editingEntry.description,
        amount: editingEntry.amount,
        payment_method: editingEntry.payment_method ?? '',
        gst_included: editingEntry.gst_included,
        receipt_photos: editingEntry.receipt_photos ?? [],
        linked_job: editingEntry.linked_job ?? '',
        notes: editingEntry.notes ?? '',
      }
    : {
        date: todayISO(),
        type: 'revenue' as const,
        category: '',
        description: '',
        amount: 0,
        payment_method: '',
        gst_included: true,
        receipt_photos: [],
        linked_job: '',
        notes: '',
      };

  // -----------------------------------------------------------------------
  // Loading state
  // -----------------------------------------------------------------------

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Finances</h2>
            <p className="text-slate-500 text-sm mt-1">Track revenue, expenses, and receipts</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 space-y-2"
            >
              <div className="h-3 w-20 bg-slate-200 rounded animate-pulse" />
              <div className="h-7 w-28 bg-slate-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
        <TableSkeleton rows={8} cols={6} />
      </div>
    );
  }

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Finances</h2>
            <p className="text-slate-500 text-sm mt-1">Track revenue, expenses, and receipts</p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 bg-[#1B2A4A] text-white rounded-lg font-medium hover:bg-[#1e335a] transition-colors shadow-sm whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Entry</span>
          </button>
        </div>
        <PeriodFilter
          value={period}
          onChange={handlePeriodChange}
          options={['today', 'this_week', 'this_month', 'this_quarter', 'this_year', 'all_time', 'custom']}
          customStart={customStart}
          customEnd={customEnd}
          onCustomRangeChange={handleCustomRangeChange}
        />
      </div>

      {/* Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-medium text-slate-500">Total Revenue</p>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{formatAUD(summary.totalRevenue)}</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-medium text-slate-500">Total Expenses</p>
            <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center">
              <TrendingDown className="w-4 h-4 text-rose-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{formatAUD(summary.totalExpenses)}</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-medium text-slate-500">Net Profit</p>
            <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-teal-600" />
            </div>
          </div>
          <p
            className={cn(
              'text-2xl font-bold',
              summary.netProfit >= 0 ? 'text-[#16A34A]' : 'text-[#DC2626]',
            )}
          >
            {formatAUD(summary.netProfit)}
          </p>
        </div>
        <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-medium text-slate-500">Monthly Subs</p>
            <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-slate-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-700">{formatAUD(summary.subscriptions)}</p>
          <p className="text-xs text-slate-400 mt-0.5">Read-only estimate</p>
        </div>
      </div>

      {/* Empty State */}
      {finances.length === 0 && !loading ? (
        <EmptyState
          icon={Receipt}
          title="No finance entries yet"
          description="Start tracking your revenue and expenses by adding your first entry."
          actionLabel="Add Entry"
          onAction={openCreate}
        />
      ) : (
        /* Data Table Card */
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Toolbar */}
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search entries..."
                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent"
              />
            </div>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) =>
                handleTypeFilterChange(e.target.value as 'all' | 'revenue' | 'expense')
              }
              className="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent bg-white"
            >
              <option value="all">All Types</option>
              <option value="revenue">Revenue</option>
              <option value="expense">Expense</option>
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => handleCategoryFilterChange(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent bg-white"
            >
              <option value="all">All Categories</option>
              {activeCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Table */}
          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-500">No entries match your filters.</p>
              <button
                onClick={() => {
                  setSearch('');
                  setTypeFilter('all');
                  setCategoryFilter('all');
                }}
                className="mt-2 text-sm text-[#0D9488] hover:underline font-medium"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                      <th className="p-4">Date</th>
                      <th className="p-4">Type</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Description</th>
                      <th className="p-4 text-right">Amount</th>
                      <th className="p-4 text-center">Receipt</th>
                      <th className="p-4 text-center w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {paginatedData.map((entry) => {
                      const isRevenue = entry.type === 'revenue';
                      const hasReceipt =
                        entry.receipt_photos && entry.receipt_photos.length > 0;

                      return (
                        <tr
                          key={entry.id}
                          onClick={() => openEdit(entry)}
                          className="hover:bg-slate-50 transition-colors cursor-pointer group"
                        >
                          <td className="p-4 text-slate-600 whitespace-nowrap">
                            {(() => {
                              if (!entry.date) return '-';
                              const d = parseISO(entry.date);
                              return isValid(d) ? format(d, 'MMM dd, yyyy') : entry.date;
                            })()}
                          </td>
                          <td className="p-4">
                            <span
                              className={cn(
                                'inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border',
                                isRevenue
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : 'bg-rose-50 text-rose-700 border-rose-200',
                              )}
                            >
                              {isRevenue ? 'Revenue' : 'Expense'}
                            </span>
                          </td>
                          <td className="p-4 text-slate-900 font-medium">{entry.category}</td>
                          <td className="p-4 text-slate-600 max-w-xs truncate">
                            {entry.description}
                          </td>
                          <td
                            className={cn(
                              'p-4 text-right font-semibold whitespace-nowrap',
                              isRevenue ? 'text-emerald-600' : 'text-slate-900',
                            )}
                          >
                            {isRevenue ? '+' : '-'}
                            {formatAUD(entry.amount)}
                          </td>
                          <td className="p-4 text-center">
                            {hasReceipt ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openLightbox(entry.receipt_photos, 0);
                                }}
                                className="text-[#0D9488] hover:text-[#0f766e] transition-colors"
                                title={`${entry.receipt_photos.length} receipt(s)`}
                              >
                                <ImageIcon className="w-4 h-4 mx-auto" />
                              </button>
                            ) : (
                              <span className="text-slate-300">
                                <Receipt className="w-4 h-4 mx-auto" />
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteTarget(entry);
                              }}
                              className="p-1.5 text-slate-400 hover:text-[#DC2626] rounded-md hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="p-4 border-t border-slate-200 flex items-center justify-between text-sm text-slate-500">
                <span>
                  Showing {startIndex} to {endIndex} of {filtered.length}{' '}
                  {filtered.length === 1 ? 'entry' : 'entries'}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={safeCurrentPage <= 1}
                    className="px-3 py-1.5 border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => {
                      // Show first, last, current, and neighbors
                      if (p === 1 || p === totalPages) return true;
                      if (Math.abs(p - safeCurrentPage) <= 1) return true;
                      return false;
                    })
                    .reduce<(number | 'ellipsis')[]>((acc, p, idx, arr) => {
                      if (idx > 0 && p - (arr[idx - 1] as number) > 1) {
                        acc.push('ellipsis');
                      }
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((item, idx) =>
                      item === 'ellipsis' ? (
                        <span key={`e-${idx}`} className="px-2 text-slate-400">
                          ...
                        </span>
                      ) : (
                        <button
                          key={item}
                          onClick={() => setPage(item)}
                          className={cn(
                            'px-3 py-1.5 border rounded-md transition-colors',
                            item === safeCurrentPage
                              ? 'bg-[#1B2A4A] text-white border-[#1B2A4A]'
                              : 'border-slate-300 hover:bg-slate-50',
                          )}
                        >
                          {item}
                        </button>
                      ),
                    )}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={safeCurrentPage >= totalPages}
                    className="px-3 py-1.5 border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Slide-Over Form */}
      <SlideOver
        open={slideOpen}
        onClose={closeSlide}
        title={editingEntry ? 'Edit Finance Entry' : 'Add Finance Entry'}
        width="lg"
      >
        <FinanceForm
          key={editingEntry?.id ?? 'new'}
          defaultValues={formDefaults}
          onSubmit={handleFormSubmit}
          onCancel={closeSlide}
          isEdit={!!editingEntry}
        />
      </SlideOver>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Finance Entry"
        description={`Are you sure you want to delete "${deleteTarget?.description ?? ''}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
      />

      {/* Receipt Lightbox */}
      {lightboxPhotos && (
        <ReceiptLightbox
          photos={lightboxPhotos}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxPhotos(null)}
        />
      )}
    </div>
  );
}
