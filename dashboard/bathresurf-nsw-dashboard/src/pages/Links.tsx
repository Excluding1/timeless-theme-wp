import React, { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Search, ExternalLink, Pencil, Trash2, Link as LinkIcon, FileSpreadsheet, FileText, Wrench } from 'lucide-react';
import { toast } from 'sonner';
import { SlideOver } from '../components/SlideOver';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { EmptyState } from '../components/EmptyState';
import { CardSkeleton } from '../components/LoadingSkeleton';
import { useData } from '../hooks/useData';
import { cn, sanitizeUrl } from '../lib/utils';
import type { BusinessLink } from '../lib/database';

const CATEGORY_CONFIG: Record<string, { label: string; icon: React.ElementType; bg: string; text: string }> = {
  sheet: { label: 'Google Sheet', icon: FileSpreadsheet, bg: 'bg-emerald-50', text: 'text-emerald-700' },
  doc: { label: 'Document', icon: FileText, bg: 'bg-blue-50', text: 'text-blue-700' },
  link: { label: 'Link', icon: LinkIcon, bg: 'bg-violet-50', text: 'text-violet-700' },
  tool: { label: 'Tool', icon: Wrench, bg: 'bg-amber-50', text: 'text-amber-700' },
};

const ICON_OPTIONS = ['📋', '📝', '👷', '💰', '🧾', '📅', '📊', '🔗', '📁', '🛠️', '📞', '📧', '🏠', '🚿', '🔑', '📦'];

type LinkForm = {
  name: string;
  url: string;
  icon: string;
  description: string;
  category: string;
};

export function Links() {
  const { data: rawData, loading, create, update, remove } = useData('business_links');
  const data = rawData as unknown as BusinessLink[];
  const [search, setSearch] = useState('');
  const [slideOpen, setSlideOpen] = useState(false);
  const [editing, setEditing] = useState<BusinessLink | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BusinessLink | null>(null);

  const { register, handleSubmit, reset, setValue, watch, formState: { isSubmitting } } = useForm<LinkForm>();
  const watchedIcon = watch('icon');

  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter(l =>
      l.name.toLowerCase().includes(q) ||
      l.description?.toLowerCase().includes(q) ||
      l.category.toLowerCase().includes(q)
    );
  }, [data, search]);

  const grouped = useMemo(() => {
    const groups: Record<string, BusinessLink[]> = { sheet: [], doc: [], tool: [], link: [] };
    filtered.forEach(l => {
      if (groups[l.category]) groups[l.category].push(l);
      else groups.link.push(l);
    });
    return groups;
  }, [filtered]);

  function openNew() {
    setEditing(null);
    reset({ name: '', url: '', icon: '🔗', description: '', category: 'sheet' });
    setSlideOpen(true);
  }

  function openEdit(link: BusinessLink) {
    setEditing(link);
    reset({
      name: link.name,
      url: link.url,
      icon: link.icon || '🔗',
      description: link.description || '',
      category: link.category,
    });
    setSlideOpen(true);
  }

  async function onSubmit(form: LinkForm) {
    const payload = {
      ...form,
      category: form.category as 'sheet' | 'doc' | 'link' | 'tool',
      sort_order: editing?.sort_order ?? data.length,
    };
    try {
      if (editing) {
        await update(editing.id, payload);
        toast.success('Link updated');
      } else {
        await create(payload);
        toast.success('Link added');
      }
      setSlideOpen(false);
    } catch {
      toast.error('Failed to save link');
    }
  }

  async function onDelete() {
    if (!deleteTarget) return;
    try {
      await remove(deleteTarget.id);
      toast.success('Link deleted');
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
            <div className="h-7 w-48 bg-slate-200 rounded animate-pulse" />
            <div className="h-4 w-64 bg-slate-200 rounded animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => <CardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Links & Sheets</h2>
          <p className="text-slate-500 text-sm mt-1">Your Google Sheets, docs, tools, and bookmarks</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2 bg-[#1B2A4A] text-white rounded-lg font-medium hover:bg-[#1e335a] transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Link</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative w-full sm:w-72">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search links..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent"
        />
      </div>

      {/* Content */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={LinkIcon}
          title="No links yet"
          description={search ? 'Try adjusting your search' : 'Add your Google Sheets, docs, and tool links'}
          actionLabel={search ? undefined : 'Add Link'}
          onAction={search ? undefined : openNew}
        />
      ) : (
        <div className="space-y-8">
          {(Object.entries(grouped) as [string, BusinessLink[]][]).map(([cat, links]) => {
            if (links.length === 0) return null;
            const cfg = CATEGORY_CONFIG[cat] || CATEGORY_CONFIG.link;
            const Icon = cfg.icon;
            return (
              <div key={cat}>
                <div className="flex items-center gap-2 mb-3">
                  <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium', cfg.bg, cfg.text)}>
                    <Icon className="w-3.5 h-3.5" />
                    {cfg.label}s
                  </span>
                  <span className="text-sm text-slate-400">({links.length})</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {links.sort((a, b) => a.sort_order - b.sort_order).map(link => (
                    <div
                      key={link.id}
                      className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 hover:shadow-md transition-shadow group"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-2xl shrink-0">{link.icon || '🔗'}</span>
                          <div className="min-w-0">
                            <h3 className="font-semibold text-slate-900 truncate">{link.name}</h3>
                            {link.description && <p className="text-xs text-slate-500 truncate">{link.description}</p>}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          <button onClick={() => openEdit(link)} className="p-1 text-slate-400 hover:text-slate-700">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => setDeleteTarget(link)} className="p-1 text-slate-400 hover:text-red-600">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      {link.url ? (
                        <a
                          href={sanitizeUrl(link.url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-[#0D9488] hover:underline mt-1"
                        >
                          Open <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-xs text-amber-500 mt-1">No URL set</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SlideOver Form */}
      <SlideOver open={slideOpen} onClose={() => setSlideOpen(false)} title={editing ? 'Edit Link' : 'Add Link'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Name *</label>
            <input {...register('name', { required: true })} placeholder="e.g. Job Tracker" className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">URL</label>
            <input type="url" {...register('url')} placeholder="https://docs.google.com/spreadsheets/..." className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
            <select {...register('category')} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]">
              {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => (
                <option key={key} value={key}>{cfg.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Icon</label>
            <div className="flex flex-wrap gap-2">
              {ICON_OPTIONS.map(icon => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setValue('icon', icon)}
                  className={cn(
                    "w-10 h-10 rounded-lg border-2 text-xl flex items-center justify-center transition-all",
                    watchedIcon === icon ? "border-[#0D9488] bg-[#0D9488]/10 scale-110" : "border-slate-200 hover:border-slate-300"
                  )}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <input {...register('description')} placeholder="Brief description" className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]" />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button type="button" onClick={() => setSlideOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-white bg-[#1B2A4A] rounded-lg hover:bg-[#1e335a] transition-colors disabled:opacity-50">
              {isSubmitting ? 'Saving...' : editing ? 'Update' : 'Add'} Link
            </button>
          </div>
        </form>
      </SlideOver>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={onDelete}
        title="Delete Link"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This cannot be undone.`}
      />
    </div>
  );
}
