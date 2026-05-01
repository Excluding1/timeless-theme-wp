import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Plus, Lock, Calendar, LayoutGrid, List, ChevronDown, ChevronUp,
  Trash2, CheckSquare, Square, X, GripVertical, ClipboardList, Archive, ArchiveRestore,
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { format, isToday, isBefore, startOfDay, endOfWeek, endOfMonth, startOfWeek, startOfMonth, parseISO } from 'date-fns';
import { SlideOver } from '../components/SlideOver';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { EmptyState } from '../components/EmptyState';
import { Skeleton } from '../components/LoadingSkeleton';
import { useData } from '../hooks/useData';
import { cn, safeGetItem, safeSetItem } from '../lib/utils';
import type { Task, Attachment } from '../lib/database';
import { ImageUploader, ImageGallery } from '../components/ImageUploader';

// ── Constants ──────────────────────────────────────────────────────────────────

const COLUMNS = [
  { id: 'todo' as const, title: 'To Do', color: 'bg-slate-100 border-slate-200' },
  { id: 'in_progress' as const, title: 'In Progress', color: 'bg-blue-50 border-blue-100' },
  { id: 'review' as const, title: 'Review', color: 'bg-amber-50 border-amber-100' },
  { id: 'done' as const, title: 'Done', color: 'bg-emerald-50 border-emerald-100' },
];

const STATUS_OPTIONS: { value: Task['status']; label: string }[] = [
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'review', label: 'Review' },
  { value: 'done', label: 'Done' },
];

const PRIORITY_OPTIONS: { value: Task['priority']; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

const PRIORITY_DOT_COLOR: Record<Task['priority'], string> = {
  low: 'bg-slate-400',
  medium: 'bg-blue-500',
  high: 'bg-amber-500',
  urgent: 'bg-red-500',
};

const CATEGORIES = [
  'Marketing', 'Legal', 'Subs', 'Tech', 'Admin', 'Finance',
  'Week 1', 'Week 2', 'Week 3', 'General',
];

const ASSIGNEES = ['Allan', 'Marko'];

type DueDateFilter = 'all' | 'overdue' | 'today' | 'this_week' | 'this_month';
type VisibilityFilter = 'all' | 'shared' | 'personal';
type PriorityFilter = 'all' | 'urgent' | 'high' | 'medium' | 'low';
type SortField = 'title' | 'status' | 'priority' | 'due_date' | 'category' | 'visibility';
type SortDir = 'asc' | 'desc';

// ── Zod Schema ─────────────────────────────────────────────────────────────────

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(2000),
  visibility: z.enum(['shared', 'personal']),
  status: z.enum(['todo', 'in_progress', 'review', 'done']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  due_date: z.string(),
  assigned_to: z.string(),
  category: z.string(),
});

type TaskFormValues = z.infer<typeof taskSchema>;

// ── Helpers ────────────────────────────────────────────────────────────────────

function getInitials(name?: string): string {
  if (!name) return '?';
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function dueDateLabel(dateStr?: string): { text: string; className: string } | null {
  if (!dateStr) return null;
  const d = parseISO(dateStr);
  const today = startOfDay(new Date());
  if (isBefore(d, today)) return { text: format(d, 'MMM d'), className: 'text-red-600 bg-red-50' };
  if (isToday(d)) return { text: 'Today', className: 'text-amber-700 bg-amber-50' };
  return { text: format(d, 'MMM d'), className: 'text-slate-500 bg-slate-50' };
}

function matchesDueDateFilter(task: Task, filter: DueDateFilter): boolean {
  if (filter === 'all') return true;
  if (!task.due_date) return false;
  const d = parseISO(task.due_date);
  const now = new Date();
  const today = startOfDay(now);
  switch (filter) {
    case 'overdue':
      return isBefore(d, today);
    case 'today':
      return isToday(d);
    case 'this_week':
      return d >= startOfWeek(now, { weekStartsOn: 1 }) && d <= endOfWeek(now, { weekStartsOn: 1 });
    case 'this_month':
      return d >= startOfMonth(now) && d <= endOfMonth(now);
    default:
      return true;
  }
}

const PRIORITY_RANK: Record<Task['priority'], number> = { urgent: 0, high: 1, medium: 2, low: 3 };
const STATUS_RANK: Record<Task['status'], number> = { todo: 0, in_progress: 1, review: 2, done: 3 };

// ── Loading Skeleton ───────────────────────────────────────────────────────────

function TasksLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-4 w-56" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-28 rounded-lg" />
          <Skeleton className="h-10 w-28 rounded-lg" />
        </div>
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-9 w-64 rounded-lg" />
        <Skeleton className="h-9 w-48 rounded-lg" />
      </div>
      <div className="flex gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="w-80 space-y-3">
            <Skeleton className="h-5 w-24" />
            <div className="space-y-3 p-3 rounded-xl bg-slate-50">
              <Skeleton className="h-28 w-full rounded-lg" />
              <Skeleton className="h-28 w-full rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export function Tasks() {
  const { data: tasks, loading, create, update, remove, setData } = useData('tasks');
  const [searchParams, setSearchParams] = useSearchParams();
  const [prefillTask, setPrefillTask] = useState<Partial<Task> | null>(null);

  // UI state — persist view preference
  const [view, setView] = useState<'kanban' | 'list'>(() => {
    const saved = safeGetItem('tasks_view');
    return saved === 'list' ? 'list' : 'kanban';
  });
  const handleSetView = (v: 'kanban' | 'list') => {
    setView(v);
    safeSetItem('tasks_view', v);
  };
  const [dueDateFilter, setDueDateFilter] = useState<DueDateFilter>('all');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all');
  const [visibilityFilter, setVisibilityFilter] = useState<VisibilityFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [slideOverOpen, setSlideOverOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);
  const [sortField, setSortField] = useState<SortField>('due_date');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [showArchived, setShowArchived] = useState(false);

  // ── Auto-open from notification "Create Task" ────────────────────────────────
  useEffect(() => {
    if (searchParams.get('from_notification') === 'true') {
      const title = searchParams.get('title') || '';
      const description = searchParams.get('description') || '';
      setPrefillTask({
        id: '',
        title,
        description,
        status: 'todo',
        priority: 'medium',
        visibility: 'shared',
      } as Partial<Task>);
      setEditingTask(null);
      setSlideOverOpen(true);
      // Clear params so it doesn't re-open on re-render
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // ── Filtering ────────────────────────────────────────────────────────────────

  const filteredTasks = useMemo(() => {
    return (tasks as Task[]).filter((t) => {
      if (!matchesDueDateFilter(t, dueDateFilter)) return false;
      if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;
      if (visibilityFilter === 'shared' && t.visibility !== 'shared') return false;
      if (visibilityFilter === 'personal' && t.visibility !== 'personal') return false;
      if (categoryFilter && t.category !== categoryFilter) return false;
      return true;
    });
  }, [tasks, dueDateFilter, priorityFilter, visibilityFilter, categoryFilter]);

  // ── Sorting (list view) ──────────────────────────────────────────────────────

  const sortedTasks = useMemo(() => {
    const sorted = [...filteredTasks].sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case 'title':
          cmp = a.title.localeCompare(b.title);
          break;
        case 'status':
          cmp = STATUS_RANK[a.status] - STATUS_RANK[b.status];
          break;
        case 'priority':
          cmp = PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
          break;
        case 'due_date':
          cmp = (a.due_date || '9999').localeCompare(b.due_date || '9999');
          break;
        case 'category':
          cmp = (a.category || '').localeCompare(b.category || '');
          break;
        case 'visibility':
          cmp = a.visibility.localeCompare(b.visibility);
          break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return sorted;
  }, [filteredTasks, sortField, sortDir]);

  // Split into active vs archived for list view
  const activeTasks = useMemo(() => sortedTasks.filter(t => t.status !== 'done'), [sortedTasks]);
  const archivedTasks = useMemo(() => sortedTasks.filter(t => t.status === 'done'), [sortedTasks]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  // ── Slide-over open/close ────────────────────────────────────────────────────

  const openCreate = useCallback(() => {
    setEditingTask(null);
    setSlideOverOpen(true);
  }, []);

  const openEdit = useCallback((task: Task) => {
    setEditingTask(task);
    setSlideOverOpen(true);
  }, []);

  const closeSlideOver = useCallback(() => {
    setSlideOverOpen(false);
    setEditingTask(null);
  }, []);

  // ── CRUD handlers ────────────────────────────────────────────────────────────

  const handleSave = useCallback(
    async (values: TaskFormValues, checklist: { text: string; done: boolean }[], attachments: Attachment[] = []) => {
      try {
        const payload: Partial<Task> = {
          title: values.title,
          description: values.description || undefined,
          visibility: values.visibility,
          status: values.status,
          priority: values.priority,
          due_date: values.due_date || undefined,
          assigned_to: values.assigned_to || undefined,
          category: values.category || undefined,
          checklist,
          attachments,
          completed_at: values.status === 'done' ? new Date().toISOString() : undefined,
        };

        if (editingTask) {
          await update(editingTask.id, payload);
          toast.success('Task updated');
        } else {
          const maxOrder = (tasks as Task[]).reduce((m, t) => Math.max(m, t.sort_order ?? 0), 0);
          await create({ ...payload, sort_order: maxOrder + 1 });
          toast.success('Task created');
        }
        closeSlideOver();
      } catch {
        toast.error('Failed to save task');
      }
    },
    [editingTask, tasks, create, update, closeSlideOver],
  );

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    try {
      await remove(deleteTarget.id);
      toast.success('Task deleted');
      setDeleteTarget(null);
      if (editingTask?.id === deleteTarget.id) closeSlideOver();
    } catch {
      toast.error('Failed to delete task');
    }
  }, [deleteTarget, editingTask, remove, closeSlideOver]);

  // ── Drag & drop ──────────────────────────────────────────────────────────────

  const onDragEnd = useCallback(
    async (result: DropResult) => {
      const { source, destination, draggableId } = result;
      if (!destination) return;
      if (source.droppableId === destination.droppableId && source.index === destination.index) return;

      const newStatus = destination.droppableId as Task['status'];
      const allTasks = [...(tasks as Task[])];
      const taskIndex = allTasks.findIndex((t) => t.id === draggableId);
      if (taskIndex < 0) return;

      const draggedTask = { ...allTasks[taskIndex], status: newStatus };
      if (newStatus === 'done' && !draggedTask.completed_at) {
        draggedTask.completed_at = new Date().toISOString();
      } else if (newStatus !== 'done') {
        draggedTask.completed_at = undefined;
      }

      // Reorder within the destination column
      const destTasks = allTasks
        .filter((t) => t.id !== draggableId && t.status === newStatus)
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
      destTasks.splice(destination.index, 0, draggedTask);

      // Assign sort_order
      const updates: Task[] = destTasks.map((t, i) => ({ ...t, sort_order: i }));

      // Merge back
      const remaining = allTasks.filter(
        (t) => t.id !== draggableId && t.status !== newStatus,
      );

      // Capture pre-drag state for rollback on Supabase failure
      const prevTasks = [...(tasks as Task[])];
      setData([...remaining, ...updates] as any);

      try {
        // Persist sort_order for ALL reordered tasks in the destination column
        await Promise.all(
          updates.map((t) =>
            update(t.id, {
              status: t.status,
              sort_order: t.sort_order,
              ...(t.id === draggableId ? { completed_at: draggedTask.completed_at } : {}),
            }),
          ),
        );
      } catch {
        // Rollback optimistic UI to pre-drag state
        setData(prevTasks as any);
        toast.error('Failed to move task — restored previous order');
      }
    },
    [tasks, update, setData],
  );

  // ── Unique categories from data ─────────────────────────────────────────────

  const usedCategories = useMemo(() => {
    const cats = new Set<string>();
    (tasks as Task[]).forEach((t) => {
      if (t.category) cats.add(t.category);
    });
    CATEGORIES.forEach((c) => cats.add(c));
    return Array.from(cats).sort();
  }, [tasks]);

  // ── Render ───────────────────────────────────────────────────────────────────

  if (loading) return <TasksLoadingSkeleton />;

  return (
    <div className="flex flex-col space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Tasks</h2>
          <p className="text-slate-500 text-sm mt-1">Manage personal and shared work</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 self-start lg:self-auto">
          {/* View toggle */}
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => handleSetView('kanban')}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                view === 'kanban'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700',
              )}
            >
              <LayoutGrid className="w-4 h-4" />
              Kanban
            </button>
            <button
              onClick={() => handleSetView('list')}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                view === 'list'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700',
              )}
            >
              <List className="w-4 h-4" />
              List
            </button>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 bg-[#0D9488] text-white rounded-lg font-medium hover:bg-[#0f766e] transition-colors shadow-sm whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-3 shrink-0">
        {/* Due date filter */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
          {([
            { value: 'overdue', label: 'Overdue' },
            { value: 'today', label: 'Due Today' },
            { value: 'this_week', label: 'Due This Week' },
            { value: 'this_month', label: 'Due This Month' },
            { value: 'all', label: 'All' },
          ] as { value: DueDateFilter; label: string }[]).map((opt) => (
            <button
              key={opt.value}
              onClick={() => setDueDateFilter(opt.value)}
              className={cn(
                'px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap',
                dueDateFilter === opt.value
                  ? 'bg-[#1B2A4A] text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100',
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Priority filter */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
          {([
            { value: 'all', label: 'All', dot: '' },
            { value: 'urgent', label: 'Urgent', dot: 'bg-red-500' },
            { value: 'high', label: 'High', dot: 'bg-amber-500' },
            { value: 'medium', label: 'Medium', dot: 'bg-blue-500' },
            { value: 'low', label: 'Low', dot: 'bg-slate-400' },
          ] as { value: PriorityFilter; label: string; dot: string }[]).map((opt) => (
            <button
              key={opt.value}
              onClick={() => setPriorityFilter(opt.value)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap',
                priorityFilter === opt.value
                  ? 'bg-[#1B2A4A] text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100',
              )}
            >
              {opt.dot && <span className={cn('w-2 h-2 rounded-full', opt.dot, priorityFilter === opt.value && 'opacity-80')} />}
              {opt.label}
            </button>
          ))}
        </div>

        {/* Visibility filter */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
          {([
            { value: 'all', label: 'All' },
            { value: 'shared', label: 'Shared Only' },
            { value: 'personal', label: 'My Private' },
          ] as { value: VisibilityFilter; label: string }[]).map((opt) => (
            <button
              key={opt.value}
              onClick={() => setVisibilityFilter(opt.value)}
              className={cn(
                'px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap',
                visibilityFilter === opt.value
                  ? 'bg-slate-200 text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100',
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Category filter */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="h-9 px-3 text-sm font-medium rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
        >
          <option value="">All Categories</option>
          {usedCategories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Empty state */}
      {filteredTasks.length === 0 && !loading && (
        <EmptyState
          icon={ClipboardList}
          title="No tasks found"
          description={
            dueDateFilter !== 'all' || visibilityFilter !== 'all' || categoryFilter
              ? 'Try adjusting your filters to see more tasks.'
              : 'Create your first task to get started.'
          }
          actionLabel="New Task"
          onAction={openCreate}
        />
      )}

      {/* Kanban View */}
      {view === 'kanban' && filteredTasks.length > 0 && (
        <div className="overflow-x-auto pb-4">
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex gap-6 min-w-max">
              {COLUMNS.map((column) => {
                const columnTasks = filteredTasks
                  .filter((t) => t.status === column.id)
                  .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
                return (
                  <div key={column.id} className="w-80 flex flex-col">
                    <div className="flex items-center justify-between mb-3 px-1">
                      <h3 className="font-semibold text-slate-700">{column.title}</h3>
                      <span className="text-xs font-medium bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
                        {columnTasks.length}
                      </span>
                    </div>
                    <Droppable droppableId={column.id}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={cn(
                            'flex-1 rounded-xl border p-3 flex flex-col gap-3 transition-colors min-h-[120px]',
                            column.color,
                            snapshot.isDraggingOver && 'bg-slate-200/50 border-dashed',
                          )}
                        >
                          {columnTasks.map((task, index) => (
                            <Draggable key={task.id} draggableId={task.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  onClick={() => openEdit(task)}
                                  className={cn(
                                    'bg-white p-4 rounded-lg shadow-sm border border-slate-200 group relative cursor-pointer hover:shadow-md transition-shadow',
                                    task.visibility === 'personal' && 'border-l-4 border-l-[#6366F1]',
                                    snapshot.isDragging && 'shadow-lg ring-2 ring-[#0D9488] ring-opacity-50',
                                  )}
                                >
                                  {/* Title + priority dot */}
                                  <div className="flex items-start gap-2 mb-2">
                                    <span
                                      className={cn(
                                        'w-2.5 h-2.5 rounded-full mt-1 shrink-0',
                                        PRIORITY_DOT_COLOR[task.priority],
                                      )}
                                      title={`Priority: ${task.priority}`}
                                      aria-label={`Priority: ${task.priority}`}
                                      role="img"
                                    />
                                    <h4 className="text-sm font-medium text-slate-900 leading-snug line-clamp-2">
                                      {task.title}
                                    </h4>
                                  </div>

                                  {/* Checklist progress */}
                                  {task.checklist && task.checklist.length > 0 && (
                                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
                                      <CheckSquare className="w-3.5 h-3.5" />
                                      <span>
                                        {task.checklist.filter((c) => c.done).length}/{task.checklist.length}
                                      </span>
                                    </div>
                                  )}

                                  {/* Image thumbnails */}
                                  {task.attachments && task.attachments.length > 0 && (
                                    <ImageGallery attachments={task.attachments} maxShow={2} />
                                  )}

                                  {/* Footer: badges + assignee */}
                                  <div className="flex items-center justify-between mt-3">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      {task.visibility === 'personal' && (
                                        <span className="inline-flex items-center gap-1 text-xs font-medium text-[#6366F1] bg-indigo-50 px-1.5 py-0.5 rounded">
                                          <Lock className="w-3 h-3" />
                                          Private
                                        </span>
                                      )}
                                      {task.due_date && (() => {
                                        const dl = dueDateLabel(task.due_date);
                                        if (!dl) return null;
                                        return (
                                          <span
                                            className={cn(
                                              'inline-flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded',
                                              dl.className,
                                            )}
                                          >
                                            <Calendar className="w-3 h-3" />
                                            {dl.text}
                                          </span>
                                        );
                                      })()}
                                    </div>
                                    {task.assigned_to && (
                                      <div className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-600">
                                        {getInitials(task.assigned_to)}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                );
              })}
            </div>
          </DragDropContext>
        </div>
      )}

      {/* List View */}
      {view === 'list' && filteredTasks.length > 0 && (<>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                  {([
                    { field: 'title' as SortField, label: 'Task' },
                    { field: 'status' as SortField, label: 'Status' },
                    { field: 'priority' as SortField, label: 'Priority' },
                    { field: 'due_date' as SortField, label: 'Due Date' },
                    { field: 'category' as SortField, label: 'Category' },
                    { field: 'visibility' as SortField, label: 'Visibility' },
                  ]).map((col) => (
                    <th
                      key={col.field}
                      onClick={() => toggleSort(col.field)}
                      className="p-4 cursor-pointer select-none hover:text-slate-700 transition-colors"
                    >
                      <div className="flex items-center gap-1">
                        {col.label}
                        {sortField === col.field &&
                          (sortDir === 'asc' ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          ))}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {activeTasks.map((task) => {
                  const dl = task.due_date ? dueDateLabel(task.due_date) : null;
                  return (
                    <tr
                      key={task.id}
                      onClick={() => openEdit(task)}
                      className={cn(
                        'hover:bg-slate-50 transition-colors cursor-pointer',
                        task.visibility === 'personal' && 'border-l-4 border-l-[#6366F1]',
                      )}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={async (e) => {
                              e.stopPropagation();
                              const prevStatus = task.status;
                              try {
                                await update(task.id, {
                                  status: 'done',
                                  completed_at: new Date().toISOString(),
                                } as any);
                                toast('Task archived', {
                                  action: {
                                    label: 'Undo',
                                    onClick: async () => {
                                      try {
                                        await update(task.id, {
                                          status: prevStatus,
                                          completed_at: undefined,
                                        } as any);
                                      } catch {
                                        toast.error('Undo failed');
                                      }
                                    },
                                  },
                                });
                              } catch {
                                toast.error('Failed to archive task');
                              }
                            }}
                            className="w-5 h-5 rounded-md border-2 border-slate-300 hover:border-[#0D9488] flex items-center justify-center shrink-0 transition-colors"
                            title="Mark as done (archive)"
                            aria-label={`Mark "${task.title}" as done`}
                          />
                          <span className="font-medium text-slate-900">{task.title}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={cn(
                            'inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border capitalize',
                            task.status === 'done'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : task.status === 'in_progress'
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : task.status === 'review'
                                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                                  : 'bg-slate-100 text-slate-700 border-slate-200',
                          )}
                        >
                          {task.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5">
                          <span className={cn('w-2 h-2 rounded-full', PRIORITY_DOT_COLOR[task.priority])} />
                          <span className="capitalize text-slate-600">{task.priority}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        {dl ? (
                          <span className={cn('inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded', dl.className)}>
                            <Calendar className="w-3 h-3" />
                            {dl.text}
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="p-4 text-slate-600">{task.category || '-'}</td>
                      <td className="p-4">
                        {task.visibility === 'personal' ? (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-[#6366F1] bg-indigo-50 px-2 py-1 rounded-md border border-indigo-100">
                            <Lock className="w-3 h-3" /> Private
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                            Shared
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Active task count */}
          {activeTasks.length === 0 && archivedTasks.length > 0 && (
            <div className="p-8 text-center">
              <p className="text-sm text-slate-500">All tasks are archived. Nice work!</p>
            </div>
          )}
        </div>

        {/* Archived Section */}
        {archivedTasks.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <button
              onClick={() => setShowArchived(!showArchived)}
              className="flex items-center justify-between w-full px-5 py-3 text-left hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Archive className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-semibold text-slate-600">
                  Archived ({archivedTasks.length})
                </span>
              </div>
              {showArchived ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {showArchived && (
              <div className="border-t border-slate-100">
                <table className="w-full text-left border-collapse">
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {archivedTasks.map((task) => (
                      <tr key={task.id} className="hover:bg-slate-50 transition-colors opacity-60">
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <CheckSquare className="w-4 h-4 text-[#0D9488] shrink-0" />
                            <span className="font-medium text-slate-500 line-through">{task.title}</span>
                          </div>
                        </td>
                        <td className="p-4 text-xs text-slate-400">
                          {task.completed_at ? format(parseISO(task.completed_at), 'dd MMM yyyy') : '-'}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={async () => {
                              try {
                                await update(task.id, { status: 'todo', completed_at: undefined } as any);
                                toast.success('Task unarchived');
                              } catch {
                                toast.error('Failed to unarchive task');
                              }
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 border border-slate-200 rounded-lg hover:bg-slate-200 transition-colors"
                            aria-label={`Unarchive "${task.title}"`}
                          >
                            <ArchiveRestore className="w-3.5 h-3.5" />
                            Unarchive
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </>)}

      {/* SlideOver: Create / Edit */}
      <SlideOver
        open={slideOverOpen}
        onClose={closeSlideOver}
        title={editingTask ? 'Edit Task' : prefillTask ? 'New Task from Notification' : 'New Task'}
        width="lg"
      >
        <TaskForm
          task={editingTask || (prefillTask as Task | null)}
          categories={usedCategories}
          onSave={async (values, checklist, attachments) => {
            await handleSave(values, checklist, attachments);
            setPrefillTask(null);
          }}
          onDelete={(t) => {
            setDeleteTarget(t);
          }}
          onCancel={() => { closeSlideOver(); setPrefillTask(null); }}
        />
      </SlideOver>

      {/* Confirm Delete */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Task"
        description={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}

// ── Task Form ──────────────────────────────────────────────────────────────────

interface TaskFormProps {
  task: Task | null;
  categories: string[];
  onSave: (values: TaskFormValues, checklist: { text: string; done: boolean }[], attachments: Attachment[]) => Promise<void>;
  onDelete: (task: Task) => void;
  onCancel: () => void;
}

function TaskForm({ task, categories, onSave, onDelete, onCancel }: TaskFormProps) {
  const [saving, setSaving] = useState(false);
  const [checklist, setChecklist] = useState<{ text: string; done: boolean }[]>(
    task?.checklist ? [...task.checklist] : [],
  );
  const [attachments, setAttachments] = useState<Attachment[]>(task?.attachments || []);
  const [newChecklistItem, setNewChecklistItem] = useState('');

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title ?? '',
      description: task?.description ?? '',
      visibility: task?.visibility ?? 'shared',
      status: task?.status ?? 'todo',
      priority: task?.priority ?? 'medium',
      due_date: task?.due_date ?? '',
      assigned_to: task?.assigned_to ?? '',
      category: task?.category ?? '',
    },
  });

  const onSubmit = async (values: TaskFormValues) => {
    setSaving(true);
    try {
      await onSave(values, checklist, attachments);
    } finally {
      setSaving(false);
    }
  };

  const addChecklistItem = () => {
    const text = newChecklistItem.trim();
    if (!text) return;
    setChecklist((prev) => [...prev, { text, done: false }]);
    setNewChecklistItem('');
  };

  const toggleChecklistItem = (index: number) => {
    setChecklist((prev) => prev.map((item, i) => (i === index ? { ...item, done: !item.done } : item)));
  };

  const removeChecklistItem = (index: number) => {
    setChecklist((prev) => prev.filter((_, i) => i !== index));
  };

  const labelCn = 'block text-sm font-medium text-slate-700 mb-1.5';
  const inputCn =
    'w-full h-10 px-3 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent transition-colors';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Title */}
      <div>
        <label className={labelCn}>
          Title <span className="text-red-500">*</span>
        </label>
        <input
          {...register('title')}
          className={cn(inputCn, errors.title && 'border-red-400 focus:ring-red-400')}
          placeholder="Enter task title"
        />
        {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
      </div>

      {/* Description */}
      <div>
        <label className={labelCn}>Description</label>
        <textarea
          {...register('description')}
          rows={3}
          className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent resize-none transition-colors"
          placeholder="Optional description..."
        />
      </div>

      {/* Visibility toggle */}
      <div>
        <label className={labelCn}>Visibility</label>
        <Controller
          control={control}
          name="visibility"
          render={({ field }) => (
            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 w-fit">
              <button
                type="button"
                onClick={() => field.onChange('shared')}
                className={cn(
                  'px-4 py-1.5 text-sm font-medium rounded-md transition-colors',
                  field.value === 'shared' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500',
                )}
              >
                Shared
              </button>
              <button
                type="button"
                onClick={() => field.onChange('personal')}
                className={cn(
                  'px-4 py-1.5 text-sm font-medium rounded-md transition-colors',
                  field.value === 'personal'
                    ? 'bg-[#6366F1] text-white shadow-sm'
                    : 'text-slate-500',
                )}
              >
                <span className="flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" />
                  Personal
                </span>
              </button>
            </div>
          )}
        />
      </div>

      {/* Status + Priority row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCn}>Status</label>
          <select {...register('status')} className={inputCn}>
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCn}>Priority</label>
          <select {...register('priority')} className={inputCn}>
            {PRIORITY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Due date + Assigned to row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCn}>Due Date</label>
          <input type="date" {...register('due_date')} className={inputCn} />
        </div>
        <div>
          <label className={labelCn}>Assigned To</label>
          <select {...register('assigned_to')} className={inputCn}>
            <option value="">Unassigned</option>
            {ASSIGNEES.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Category */}
      <div>
        <label className={labelCn}>Category</label>
        <select {...register('category')} className={inputCn}>
          <option value="">None</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Checklist */}
      <div>
        <label className={labelCn}>Checklist</label>
        <div className="space-y-2">
          {checklist.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2 border border-slate-200 group"
            >
              <button
                type="button"
                onClick={() => toggleChecklistItem(i)}
                className="shrink-0 text-slate-400 hover:text-[#0D9488] transition-colors"
              >
                {item.done ? (
                  <CheckSquare className="w-4.5 h-4.5 text-[#0D9488]" />
                ) : (
                  <Square className="w-4.5 h-4.5" />
                )}
              </button>
              <span
                className={cn(
                  'flex-1 text-sm',
                  item.done ? 'line-through text-slate-400' : 'text-slate-700',
                )}
              >
                {item.text}
              </span>
              <button
                type="button"
                onClick={() => removeChecklistItem(i)}
                className="shrink-0 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newChecklistItem}
              onChange={(e) => setNewChecklistItem(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addChecklistItem();
                }
              }}
              className="flex-1 h-9 px-3 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent"
              placeholder="Add a sub-task..."
            />
            <button
              type="button"
              onClick={addChecklistItem}
              disabled={!newChecklistItem.trim()}
              className="h-9 px-3 text-sm font-medium rounded-lg bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Attachments */}
      <div>
        <ImageUploader attachments={attachments} onChange={setAttachments} />
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        {task ? (
          <button
            type="button"
            onClick={() => onDelete(task)}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        ) : (
          <div />
        )}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 text-sm font-medium text-white bg-[#0D9488] rounded-lg hover:bg-[#0f766e] transition-colors shadow-sm disabled:opacity-60"
          >
            {saving ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
          </button>
        </div>
      </div>
    </form>
  );
}
