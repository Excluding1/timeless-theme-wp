import React, { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Search, Pin, Lock, Pencil, Trash2, StickyNote } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import { SlideOver } from '../components/SlideOver';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { EmptyState } from '../components/EmptyState';
import { CardSkeleton } from '../components/LoadingSkeleton';
import { useData } from '../hooks/useData';
import { cn, sanitizeUrl } from '../lib/utils';
import type { Note, Attachment } from '../lib/database';
import { ImageUploader, ImageGallery } from '../components/ImageUploader';

const CATEGORY_OPTIONS = ['SOP', 'Meeting Notes', 'Ideas', 'Reference', 'Other'] as const;

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  SOP: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  'Meeting Notes': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  Ideas: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  Reference: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  Other: { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200' },
};

type NoteForm = {
  title: string;
  content: string;
  visibility: 'personal' | 'shared';
  category: string;
  pinned: boolean;
};

type VisibilityFilter = 'all' | 'shared' | 'personal';

export function Notes() {
  const { data: rawData, loading, create, update, remove } = useData('notes');
  const data = rawData as unknown as Note[];
  const [search, setSearch] = useState('');
  const [visibilityFilter, setVisibilityFilter] = useState<VisibilityFilter>('all');
  const [slideOpen, setSlideOpen] = useState(false);
  const [editing, setEditing] = useState<Note | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Note | null>(null);
  const [noteAttachments, setNoteAttachments] = useState<Attachment[]>([]);

  const { register, handleSubmit, reset, watch, setValue, formState: { isSubmitting } } = useForm<NoteForm>();
  const watchedVisibility = watch('visibility');

  const filtered = useMemo(() => {
    let result = [...data];

    // Visibility filter
    if (visibilityFilter === 'shared') {
      result = result.filter(n => n.visibility === 'shared');
    } else if (visibilityFilter === 'personal') {
      result = result.filter(n => n.visibility === 'personal');
    }

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(n =>
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.category?.toLowerCase().includes(q)
      );
    }

    // Sort: pinned first, then by created_at descending
    result.sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return dateB - dateA;
    });

    return result;
  }, [data, search, visibilityFilter]);

  function openNew() {
    setEditing(null);
    setNoteAttachments([]);
    reset({ title: '', content: '', visibility: 'shared', category: 'Other', pinned: false });
    setSlideOpen(true);
  }

  function openEdit(note: Note) {
    setEditing(note);
    setNoteAttachments(note.attachments || []);
    reset({
      title: note.title,
      content: note.content,
      visibility: note.visibility,
      category: note.category || 'Other',
      pinned: note.pinned,
    });
    setSlideOpen(true);
  }

  async function onSubmit(form: NoteForm) {
    try {
      const payload = { ...form, attachments: noteAttachments };
      if (editing) {
        await update(editing.id, payload);
        toast.success('Note updated');
      } else {
        await create(payload);
        toast.success('Note created');
      }
      setSlideOpen(false);
    } catch {
      toast.error('Failed to save note');
    }
  }

  async function onDelete() {
    if (!deleteTarget) return;
    try {
      await remove(deleteTarget.id);
      toast.success('Note deleted');
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
          {[1, 2, 3].map(i => <CardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Notes</h2>
          <p className="text-slate-500 text-sm mt-1">SOPs, meeting notes, ideas, and references</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2 bg-[#1B2A4A] text-white rounded-lg font-medium hover:bg-[#1e335a] transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Note</span>
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1">
          {(['all', 'shared', 'personal'] as const).map(f => (
            <button
              key={f}
              onClick={() => setVisibilityFilter(f)}
              className={cn(
                'px-3 py-1.5 text-sm font-medium rounded-md transition-colors capitalize',
                visibilityFilter === f
                  ? 'bg-[#1B2A4A] text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              )}
            >
              {f === 'personal' ? 'My Private' : f === 'all' ? 'All' : 'Shared'}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={StickyNote}
          title="No notes found"
          description={search ? 'Try adjusting your search terms' : 'Create your first note to get started'}
          actionLabel={search ? undefined : 'New Note'}
          onAction={search ? undefined : openNew}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(note => {
            const isPersonal = note.visibility === 'personal';
            const catColors = CATEGORY_COLORS[note.category || 'Other'] || CATEGORY_COLORS.Other;

            return (
              <div
                key={note.id}
                className={cn(
                  'bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer group',
                  isPersonal && 'border-l-4 border-l-[#6366F1]'
                )}
                onClick={() => openEdit(note)}
              >
                <div className="p-5">
                  {/* Top badges */}
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    {note.pinned && (
                      <Pin className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    )}
                    {note.category && (
                      <span className={cn('inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border', catColors.bg, catColors.text, catColors.border)}>
                        {note.category}
                      </span>
                    )}
                    {isPersonal && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-indigo-50 text-[#6366F1] border border-indigo-200">
                        <Lock className="w-3 h-3" />
                        Private
                      </span>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); setDeleteTarget(note); }}
                      className="opacity-0 group-hover:opacity-100 ml-auto p-1 text-slate-400 hover:text-red-600 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-slate-900 mb-2">{note.title}</h3>

                  {/* Content preview */}
                  <div className="text-sm text-slate-500 line-clamp-4 prose prose-sm prose-slate max-w-none">
                    <ReactMarkdown
                      components={{
                        a: ({ href, children }) => (
                          <a href={sanitizeUrl(href)} target="_blank" rel="noopener noreferrer">{children}</a>
                        ),
                      }}
                      disallowedElements={['script', 'iframe', 'style', 'object', 'embed']}
                    >{note.content}</ReactMarkdown>
                  </div>

                  {/* Image thumbnails */}
                  {note.attachments && note.attachments.length > 0 && (
                    <ImageGallery attachments={note.attachments} maxShow={2} />
                  )}

                  {/* Date */}
                  {note.created_at && (
                    <p className="text-xs text-slate-400 mt-3">
                      {format(parseISO(note.created_at), 'dd MMM yyyy')}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SlideOver Form */}
      <SlideOver open={slideOpen} onClose={() => setSlideOpen(false)} title={editing ? 'Edit Note' : 'New Note'} width="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
            <input {...register('title', { required: true })} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Content (Markdown supported)</label>
            <textarea
              {...register('content')}
              rows={12}
              placeholder="Write your note here... Markdown is supported."
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488] font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <select {...register('category')} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]">
                {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Visibility</label>
              <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1 mt-0.5">
                <button
                  type="button"
                  onClick={() => setValue('visibility', 'shared')}
                  className={cn(
                    'flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                    watchedVisibility === 'shared' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'
                  )}
                >
                  Shared
                </button>
                <button
                  type="button"
                  onClick={() => setValue('visibility', 'personal')}
                  className={cn(
                    'flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                    watchedVisibility === 'personal' ? 'bg-[#6366F1] text-white shadow-sm' : 'text-slate-500'
                  )}
                >
                  Personal
                </button>
              </div>
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
            <input type="checkbox" {...register('pinned')} className="rounded border-slate-300 text-[#0D9488] focus:ring-[#0D9488]" />
            Pin to top
          </label>

          {/* Attachments */}
          <ImageUploader attachments={noteAttachments} onChange={setNoteAttachments} />

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button type="button" onClick={() => setSlideOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-white bg-[#1B2A4A] rounded-lg hover:bg-[#1e335a] transition-colors disabled:opacity-50">
              {isSubmitting ? 'Saving...' : editing ? 'Update' : 'Create'} {isSubmitting ? '' : 'Note'}
            </button>
          </div>
        </form>
      </SlideOver>

      {/* Confirm Delete */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={onDelete}
        title="Delete Note"
        description={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
      />
    </div>
  );
}
