import React, { useState, useMemo } from 'react';
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Lock,
  Clock,
  Trash2,
  Loader2,
} from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'sonner';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  startOfDay,
  parseISO,
  isToday,
} from 'date-fns';
import { SlideOver } from '../components/SlideOver';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { EmptyState } from '../components/EmptyState';
import { useData } from '../hooks/useData';
import { usePreferences } from '../contexts/PreferencesContext';
import { cn } from '../lib/utils';
import type { CalendarEvent } from '../lib/database';

// ── Constants ──────────────────────────────────────────────────────────────

type ViewMode = 'month' | 'week';
type VisibilityFilter = 'all' | 'shared' | 'personal';
type CategoryOption =
  | 'Meeting'
  | 'Deadline'
  | 'Reminder'
  | 'Sub Job'
  | 'Ad Review'
  | 'Insurance'
  | 'Legal'
  | 'Other';

const CATEGORIES: CategoryOption[] = [
  'Meeting',
  'Deadline',
  'Reminder',
  'Sub Job',
  'Ad Review',
  'Insurance',
  'Legal',
  'Other',
];

const COLOUR_SWATCHES = [
  { value: '#3B82F6', label: 'Blue' },
  { value: '#0D9488', label: 'Teal' },
  { value: '#F59E0B', label: 'Amber' },
  { value: '#DC2626', label: 'Red' },
  { value: '#6366F1', label: 'Indigo' },
  { value: '#16A34A', label: 'Green' },
] as const;

const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

const HOUR_RANGE_START = 8;
const HOUR_RANGE_END = 20; // 8pm exclusive — renders 8am..7pm slots

interface EventFormValues {
  title: string;
  description: string;
  visibility: 'shared' | 'personal';
  date: string;
  is_all_day: boolean;
  start_time: string;
  end_time: string;
  category: string;
  colour: string;
}

const DEFAULT_FORM: EventFormValues = {
  title: '',
  description: '',
  visibility: 'shared',
  date: format(new Date(), 'yyyy-MM-dd'),
  is_all_day: true,
  start_time: '09:00',
  end_time: '10:00',
  category: 'Meeting',
  colour: '#3B82F6',
};

// ── Helpers ────────────────────────────────────────────────────────────────

function parseTimeToHours(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h + m / 60;
}

function eventColourClasses(event: CalendarEvent): { bg: string; text: string; dot: string } {
  if (event.visibility === 'personal') {
    return { bg: 'bg-indigo-100', text: 'text-indigo-700', dot: '#6366F1' };
  }
  // Build inline-friendly colour vars — use Tailwind-compatible utility for the dot only
  return { bg: '', text: '', dot: event.colour };
}

// ── Component ──────────────────────────────────────────────────────────────

export function Calendar() {
  // Data
  const { data: events, loading, create, update, remove } = useData('calendar_events');

  // UI state
  const { preferences, updatePreferences } = usePreferences();
  const [currentDate, setCurrentDate] = useState(new Date());
  const viewMode = (preferences.default_calendar_view as ViewMode) || 'month';
  const setViewMode = (next: ViewMode) => updatePreferences({ default_calendar_view: next });
  const [filter, setFilter] = useState<VisibilityFilter>('all');
  const [slideOpen, setSlideOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // ── Form ──────────────────────────────────────────────────────────────

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<EventFormValues>({ defaultValues: DEFAULT_FORM });

  const watchAllDay = watch('is_all_day');
  const watchVisibility = watch('visibility');
  const watchColour = watch('colour');

  // ── Filtered events ───────────────────────────────────────────────────

  const filteredEvents = useMemo(
    () => events.filter((e) => filter === 'all' || e.visibility === filter),
    [events, filter],
  );

  // ── Navigation ────────────────────────────────────────────────────────

  function goNext() {
    setCurrentDate((d) => (viewMode === 'month' ? addMonths(d, 1) : addWeeks(d, 1)));
  }

  function goPrev() {
    setCurrentDate((d) => (viewMode === 'month' ? subMonths(d, 1) : subWeeks(d, 1)));
  }

  function goToday() {
    setCurrentDate(new Date());
  }

  // ── Month grid days ───────────────────────────────────────────────────

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const monthGridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const monthGridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const monthDays = eachDayOfInterval({ start: monthGridStart, end: monthGridEnd });

  // ── Week grid days ────────────────────────────────────────────────────

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const hours = Array.from({ length: HOUR_RANGE_END - HOUR_RANGE_START }, (_, i) => HOUR_RANGE_START + i);

  // ── Event actions ─────────────────────────────────────────────────────

  function openCreate(presetDate?: Date) {
    setEditingEvent(null);
    reset({
      ...DEFAULT_FORM,
      date: format(presetDate ?? new Date(), 'yyyy-MM-dd'),
    });
    setSlideOpen(true);
  }

  function openEdit(event: CalendarEvent) {
    setEditingEvent(event);
    reset({
      title: event.title,
      description: event.description ?? '',
      visibility: event.visibility,
      date: event.date,
      is_all_day: event.is_all_day,
      start_time: event.start_time ?? '09:00',
      end_time: event.end_time ?? '10:00',
      category: event.category ?? 'Meeting',
      colour: event.colour,
    });
    setSlideOpen(true);
  }

  function closeSlide() {
    setSlideOpen(false);
    setEditingEvent(null);
  }

  async function onSubmit(values: EventFormValues) {
    setSaving(true);
    try {
      const payload: Partial<CalendarEvent> = {
        title: values.title,
        description: values.description || undefined,
        visibility: values.visibility,
        date: values.date,
        is_all_day: values.is_all_day,
        start_time: values.is_all_day ? undefined : values.start_time,
        end_time: values.is_all_day ? undefined : values.end_time,
        category: values.category,
        colour: values.visibility === 'personal' ? '#6366F1' : values.colour,
      };

      if (editingEvent) {
        await update(editingEvent.id, payload);
        toast.success('Event updated');
      } else {
        await create(payload);
        toast.success('Event created');
      }
      closeSlide();
    } catch {
      toast.error('Failed to save event');
    } finally {
      setSaving(false);
    }
  }

  function askDelete(id: string) {
    setDeletingId(id);
    setConfirmOpen(true);
  }

  async function confirmDelete() {
    if (!deletingId) return;
    try {
      await remove(deletingId);
      toast.success('Event deleted');
      closeSlide();
    } catch {
      toast.error('Failed to delete event');
    } finally {
      setDeletingId(null);
    }
  }

  // ── Navigation title ──────────────────────────────────────────────────

  const navTitle =
    viewMode === 'month'
      ? format(currentDate, 'MMMM yyyy')
      : `${format(weekStart, 'MMM d')} – ${format(weekEnd, 'MMM d, yyyy')}`;

  // ── Render helpers ────────────────────────────────────────────────────

  function eventsForDay(day: Date) {
    return filteredEvents.filter((e) => isSameDay(parseISO(e.date), day));
  }

  function renderEventPill(event: CalendarEvent, compact = false) {
    const isPersonal = event.visibility === 'personal';
    const colour = isPersonal ? '#6366F1' : event.colour;

    return (
      <button
        key={event.id}
        onClick={(e) => {
          e.stopPropagation();
          openEdit(event);
        }}
        className={cn(
          'w-full text-left rounded truncate flex items-center gap-1 transition-opacity hover:opacity-80',
          compact ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-1',
        )}
        style={{
          backgroundColor: `${colour}18`,
          color: colour,
        }}
        title={event.title}
      >
        {isPersonal && <Lock className="w-3 h-3 shrink-0" />}
        <span className="truncate">{event.title}</span>
      </button>
    );
  }

  // ── Loading state ─────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
      </div>
    );
  }

  // ── Main render ───────────────────────────────────────────────────────

  return (
    <div className="max-w-7xl mx-auto space-y-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Calendar</h2>
          <p className="text-slate-500 text-sm mt-1">Manage personal and shared schedule</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* View toggle */}
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('month')}
              className={cn(
                'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                viewMode === 'month'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700',
              )}
            >
              Month
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={cn(
                'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                viewMode === 'week'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700',
              )}
            >
              Week
            </button>
          </div>

          {/* Visibility filter */}
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
            {(['all', 'shared', 'personal'] as VisibilityFilter[]).map((v) => (
              <button
                key={v}
                onClick={() => setFilter(v)}
                className={cn(
                  'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                  filter === v
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700',
                )}
              >
                {v === 'all' ? 'All' : v === 'shared' ? 'Shared' : 'My Private'}
              </button>
            ))}
          </div>

          {/* New event */}
          <button
            onClick={() => openCreate()}
            className="flex items-center gap-2 px-4 py-2 bg-[#1B2A4A] text-white rounded-lg font-medium hover:bg-[#1e335a] transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>New Event</span>
          </button>
        </div>
      </div>

      {/* Calendar card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold text-slate-900 min-w-[200px]">{navTitle}</h3>
            <div className="flex items-center gap-1">
              <button
                onClick={goPrev}
                className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={goToday}
                className="px-3 py-1.5 text-sm font-medium rounded-md hover:bg-slate-100 text-slate-700 transition-colors"
              >
                Today
              </button>
              <button
                onClick={goNext}
                className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          <span className="text-sm text-slate-500">
            {filteredEvents.length} event{filteredEvents.length !== 1 && 's'}
          </span>
        </div>

        {/* ── Month view ─────────────────────────────────────────────── */}
        {viewMode === 'month' && (
          <>
            {/* Day headers */}
            <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
              {WEEK_DAYS.map((day) => (
                <div
                  key={day}
                  className="py-2 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Day cells */}
            <div className="flex-1 grid grid-cols-7 auto-rows-fr bg-slate-200 gap-px overflow-auto">
              {monthDays.map((day, i) => {
                const dayEvents = eventsForDay(day);
                const isCurrentMonth = isSameMonth(day, monthStart);
                const today = isToday(day);

                return (
                  <div
                    key={i}
                    onClick={() => openCreate(day)}
                    className={cn(
                      'bg-white p-2 min-h-[100px] hover:bg-slate-50 transition-colors cursor-pointer',
                      !isCurrentMonth && 'bg-slate-50/50',
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={cn(
                          'text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full',
                          today && 'bg-[#0D9488] text-white',
                          !today && isCurrentMonth && 'text-slate-700',
                          !today && !isCurrentMonth && 'text-slate-400',
                        )}
                      >
                        {format(day, 'd')}
                      </span>
                    </div>
                    <div className="space-y-0.5">
                      {dayEvents.slice(0, 3).map((ev) => renderEventPill(ev, true))}
                      {dayEvents.length > 3 && (
                        <span className="text-[10px] text-slate-400 px-1">
                          +{dayEvents.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ── Week view ──────────────────────────────────────────────── */}
        {viewMode === 'week' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* All-day row */}
            {(() => {
              const allDayEvents = weekDays.map((day) =>
                eventsForDay(day).filter((e) => e.is_all_day),
              );
              const hasAnyAllDay = allDayEvents.some((d) => d.length > 0);

              if (!hasAnyAllDay) return null;

              return (
                <div className="grid grid-cols-[64px_repeat(7,1fr)] border-b border-slate-200 shrink-0">
                  <div className="border-r border-slate-200 p-2 text-[10px] font-medium text-slate-400 uppercase">
                    All day
                  </div>
                  {weekDays.map((day, di) => (
                    <div
                      key={di}
                      className={cn(
                        'p-1 min-h-[36px] border-r border-slate-100 last:border-r-0',
                        isToday(day) && 'bg-teal-50/40',
                      )}
                    >
                      {allDayEvents[di].map((ev) => renderEventPill(ev, true))}
                    </div>
                  ))}
                </div>
              );
            })()}

            {/* Time grid */}
            <div className="flex-1 overflow-auto">
              <div className="grid grid-cols-[64px_repeat(7,1fr)] min-h-full">
                {/* Day headers pinned */}
                <div className="sticky top-0 z-10 col-span-8 grid grid-cols-[64px_repeat(7,1fr)] bg-slate-50 border-b border-slate-200">
                  <div className="border-r border-slate-200" />
                  {weekDays.map((day, di) => (
                    <div
                      key={di}
                      className={cn(
                        'py-2 text-center border-r border-slate-100 last:border-r-0',
                        isToday(day) && 'bg-teal-50/60',
                      )}
                    >
                      <div className="text-xs font-semibold text-slate-500 uppercase">
                        {format(day, 'EEE')}
                      </div>
                      <div
                        className={cn(
                          'text-lg font-bold mx-auto w-8 h-8 flex items-center justify-center rounded-full',
                          isToday(day) ? 'bg-[#0D9488] text-white' : 'text-slate-800',
                        )}
                      >
                        {format(day, 'd')}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Hour rows */}
                {hours.map((hour) => (
                  <React.Fragment key={hour}>
                    {/* Time label */}
                    <div className="border-r border-slate-200 pr-2 pt-0 h-16 flex items-start justify-end">
                      <span className="text-[11px] text-slate-400 -mt-2 font-medium">
                        {format(new Date(2000, 0, 1, hour), 'h a')}
                      </span>
                    </div>

                    {/* Day columns */}
                    {weekDays.map((day, di) => {
                      const dayTimedEvents = eventsForDay(day).filter((e) => !e.is_all_day);
                      const slotEvents = dayTimedEvents.filter((e) => {
                        if (!e.start_time) return false;
                        const startH = parseTimeToHours(e.start_time);
                        return startH >= hour && startH < hour + 1;
                      });

                      return (
                        <div
                          key={di}
                          className={cn(
                            'relative border-r border-b border-slate-100 last:border-r-0 h-16 cursor-pointer hover:bg-slate-50/60 transition-colors',
                            isToday(day) && 'bg-teal-50/20',
                          )}
                          onClick={() => {
                            reset({
                              ...DEFAULT_FORM,
                              date: format(day, 'yyyy-MM-dd'),
                              is_all_day: false,
                              start_time: `${String(hour).padStart(2, '0')}:00`,
                              end_time: `${String(hour + 1).padStart(2, '0')}:00`,
                            });
                            setEditingEvent(null);
                            setSlideOpen(true);
                          }}
                        >
                          {slotEvents.map((ev) => {
                            const startH = ev.start_time ? parseTimeToHours(ev.start_time) : hour;
                            const endH = ev.end_time ? parseTimeToHours(ev.end_time) : startH + 1;
                            const topOffset = ((startH - hour) / 1) * 100;
                            const heightPct = Math.max(((endH - startH) / 1) * 100, 25);
                            const isPersonal = ev.visibility === 'personal';
                            const colour = isPersonal ? '#6366F1' : ev.colour;

                            return (
                              <button
                                key={ev.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openEdit(ev);
                                }}
                                className="absolute left-0.5 right-0.5 rounded px-1.5 py-0.5 text-[10px] leading-tight font-medium truncate z-10 hover:opacity-80 transition-opacity text-left"
                                style={{
                                  top: `${topOffset}%`,
                                  height: `${heightPct}%`,
                                  minHeight: '16px',
                                  backgroundColor: `${colour}22`,
                                  color: colour,
                                  borderLeft: `3px solid ${colour}`,
                                }}
                                title={`${ev.title} (${ev.start_time} – ${ev.end_time})`}
                              >
                                <span className="flex items-center gap-0.5">
                                  {isPersonal && <Lock className="w-2.5 h-2.5 shrink-0" />}
                                  {ev.title}
                                </span>
                                {endH - startH >= 0.75 && (
                                  <span className="opacity-70 block">
                                    {ev.start_time} – {ev.end_time}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Empty state */}
        {filteredEvents.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <EmptyState
              icon={CalendarIcon}
              title="No events yet"
              description="Create your first event to get started with scheduling."
              actionLabel="New Event"
              onAction={() => openCreate()}
            />
          </div>
        )}
      </div>

      {/* ── SlideOver form ─────────────────────────────────────────────── */}
      <SlideOver
        open={slideOpen}
        onClose={closeSlide}
        title={editingEvent ? 'Edit Event' : 'New Event'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              {...register('title', { required: 'Title is required' })}
              className={cn(
                'w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488]/40 focus:border-[#0D9488] transition-colors',
                errors.title ? 'border-red-300' : 'border-slate-300',
              )}
              placeholder="Event title"
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              {...register('description')}
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488]/40 focus:border-[#0D9488] transition-colors resize-none"
              placeholder="Optional notes..."
            />
          </div>

          {/* Visibility toggle */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Visibility</label>
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
                      field.value === 'shared'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700',
                    )}
                  >
                    Shared
                  </button>
                  <button
                    type="button"
                    onClick={() => field.onChange('personal')}
                    className={cn(
                      'px-4 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-1.5',
                      field.value === 'personal'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700',
                    )}
                  >
                    <Lock className="w-3.5 h-3.5" />
                    Personal
                  </button>
                </div>
              )}
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              {...register('date', { required: 'Date is required' })}
              className={cn(
                'w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488]/40 focus:border-[#0D9488] transition-colors',
                errors.date ? 'border-red-300' : 'border-slate-300',
              )}
            />
            {errors.date && (
              <p className="mt-1 text-xs text-red-500">{errors.date.message}</p>
            )}
          </div>

          {/* All-day toggle */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_all_day"
              {...register('is_all_day')}
              className="w-4 h-4 rounded border-slate-300 text-[#0D9488] focus:ring-[#0D9488]/40"
            />
            <label htmlFor="is_all_day" className="text-sm font-medium text-slate-700">
              All day
            </label>
          </div>

          {/* Time inputs */}
          {!watchAllDay && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  <Clock className="w-3.5 h-3.5 inline mr-1 -mt-0.5" />
                  Start time
                </label>
                <input
                  type="time"
                  {...register('start_time')}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488]/40 focus:border-[#0D9488] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  <Clock className="w-3.5 h-3.5 inline mr-1 -mt-0.5" />
                  End time
                </label>
                <input
                  type="time"
                  {...register('end_time')}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488]/40 focus:border-[#0D9488] transition-colors"
                />
              </div>
            </div>
          )}

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
            <select
              {...register('category')}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488]/40 focus:border-[#0D9488] transition-colors bg-white"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Colour swatches — hidden when personal */}
          {watchVisibility !== 'personal' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Colour</label>
              <Controller
                control={control}
                name="colour"
                render={({ field }) => (
                  <div className="flex flex-wrap gap-2">
                    {COLOUR_SWATCHES.map((swatch) => (
                      <button
                        key={swatch.value}
                        type="button"
                        title={swatch.label}
                        onClick={() => field.onChange(swatch.value)}
                        className={cn(
                          'w-8 h-8 rounded-full border-2 transition-all',
                          field.value === swatch.value
                            ? 'border-slate-800 scale-110 ring-2 ring-offset-2 ring-slate-300'
                            : 'border-transparent hover:scale-105',
                        )}
                        style={{ backgroundColor: swatch.value }}
                      />
                    ))}
                  </div>
                )}
              />
            </div>
          )}

          {watchVisibility === 'personal' && (
            <div className="flex items-center gap-2 text-sm text-indigo-600 bg-indigo-50 px-3 py-2 rounded-lg">
              <Lock className="w-4 h-4 shrink-0" />
              <span>Personal events always use indigo (#6366F1)</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            {editingEvent ? (
              <button
                type="button"
                onClick={() => askDelete(editingEvent.id)}
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
                onClick={closeSlide}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#1B2A4A] rounded-lg hover:bg-[#1e335a] transition-colors shadow-sm disabled:opacity-50"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingEvent ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </form>
      </SlideOver>

      {/* Confirm delete dialog */}
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete event"
        description="This event will be permanently removed. This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}
