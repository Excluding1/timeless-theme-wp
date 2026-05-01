import React, { useMemo, useCallback, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usePreferences } from '../contexts/PreferencesContext';
import { useData } from '../hooks/useData';
import { Skeleton } from '../components/LoadingSkeleton';
import type { Finance, Task, CalendarEvent, Subscription, Subcontractor, Goal, QuickLink, AppNotification } from '../lib/database';
import { ArrowRight, Calendar, CheckCircle2, Circle, DollarSign, Link as LinkIcon, AlertTriangle, ExternalLink, LayoutDashboard, FileSpreadsheet, GripVertical, Rocket, ChevronDown, ChevronUp, Bell, MessageSquare, Star } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Link } from 'react-router-dom';
import { cn, sanitizeUrl } from '../lib/utils';
import { isWithinInterval, parseISO, startOfMonth, endOfMonth, addDays, differenceInDays, isBefore, isToday as isDateToday, startOfDay } from 'date-fns';
import { useNotificationAlerts } from '../hooks/useNotificationAlerts';
import { useSubscriptionSync } from '../hooks/useSubscriptionSync';

export function Dashboard() {
  useNotificationAlerts();
  useSubscriptionSync();
  const { preferences } = usePreferences();
  const { user } = useAuth();
  const sections = preferences.dashboard_sections;

  if (sections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <LayoutDashboard className="w-8 h-8 text-slate-400" />
        </div>
        <h2 className="text-xl font-semibold text-slate-800 mb-2">Your dashboard is empty</h2>
        <p className="text-slate-500 mb-6">Configure your dashboard sections in Settings.</p>
        <Link to="/settings" className="px-4 py-2 bg-[#0D9488] text-white rounded-lg font-medium hover:bg-[#0f766e] transition-colors">
          Go to Settings
        </Link>
      </div>
    );
  }

  const sectionOrder = ['quick_links', 'todos', 'events', 'revenue', 'alerts'];
  const orderedSections = sectionOrder.filter(s => sections.includes(s));

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h2 className="text-2xl font-bold text-slate-900 truncate">Welcome back, {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Owner'}</h2>
      </div>

      <GettingStartedSection />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {orderedSections.includes('quick_links') && <QuickLinksSection />}
          <BusinessLinksSection />
          {orderedSections.includes('todos') && <TodosSection />}
          {orderedSections.includes('events') && <EventsSection />}
        </div>
        <div className="space-y-6">
          {orderedSections.includes('revenue') && <RevenueSection />}
          {orderedSections.includes('alerts') && <AlertsSection />}
          <NotificationsSection />
        </div>
      </div>
    </div>
  );
}

const SETUP_STEPS = [
  { label: 'Add your logins & credentials', path: '/credentials', tip: 'Store all your platform logins (Google Ads, Xero, etc.) — these auto-generate Quick Links above.' },
  { label: 'Set up subscriptions', path: '/subscriptions', tip: 'Track what you pay monthly — tools, software, insurance. The dashboard totals them automatically.' },
  { label: 'Add subcontractors', path: '/subs', tip: 'Register your subbies with ABN, insurance expiry, skills. You\'ll get alerts when docs expire.' },
  { label: 'Log your first finance entry', path: '/finances', tip: 'Revenue or expense — start tracking so your monthly snapshot and profit numbers work.' },
  { label: 'Review your cashflow position', path: '/cashflow', tip: 'See your buffer balance, business phase, GST tracker, and partner drawings calculator.' },
  { label: 'Enter weekly KPIs', path: '/kpis', tip: 'Leads, quotes, jobs, ad spend. This powers the Overview trends and conversion rates.' },
  { label: 'Set business goals', path: '/goals', tip: 'Revenue targets, lead goals, cost-per-lead caps. KPIs and the dashboard compare against these.' },
  { label: 'Create tasks & to-dos', path: '/tasks', tip: 'Your kanban board — track jobs, follow-ups, admin. Urgent/overdue tasks show on this dashboard.' },
  { label: 'Add calendar events', path: '/calendar', tip: 'Jobs, inspections, meetings. Upcoming events show in the sidebar here.' },
  { label: 'Save key contacts', path: '/contacts', tip: 'Suppliers, real estate agents, anyone you deal with regularly.' },
  { label: 'Add your links & sheets', path: '/links', tip: 'Google Sheets, docs, tools — anything you use regularly. Shows on the dashboard too.' },
  { label: 'Review your week', path: '/weekly-review', tip: 'Weekly checklist — invoices sent, follow-ups done, KPIs logged. Keeps you consistent.' },
];

function GettingStartedSection() {
  // Persists in user_preferences (Supabase) so collapse state survives across
  // refreshes, devices, browsers, and incognito sessions — not just this browser's localStorage.
  const { preferences, updatePreferences } = usePreferences();
  const expanded = !preferences.setup_guide_collapsed;

  const toggleExpanded = () => {
    updatePreferences({ setup_guide_collapsed: expanded });
  };

  return (
    <section className="bg-gradient-to-br from-[#0D9488]/5 to-[#0D9488]/10 rounded-xl border border-[#0D9488]/20 p-6">
      <button onClick={toggleExpanded} className="flex items-center justify-between w-full text-left">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#0D9488]/10 flex items-center justify-center">
            <Rocket className="w-5 h-5 text-[#0D9488]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800">Setup Guide</h3>
            <p className="text-sm text-slate-500">Set up each workspace in order — takes about 15 minutes</p>
          </div>
        </div>
        <div className="p-1.5 rounded-lg hover:bg-white/50 text-slate-400 hover:text-slate-600 transition-colors">
          {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {expanded && (
        <ol className="mt-4 space-y-2">
          {SETUP_STEPS.map((step, i) => (
            <li key={step.path}>
              <Link
                to={step.path}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/60 transition-colors group"
              >
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#0D9488]/10 text-[#0D9488] text-xs font-bold shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-800 group-hover:text-[#0D9488] transition-colors">
                    {step.label}
                    <ArrowRight className="w-3.5 h-3.5 inline ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">{step.tip}</p>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

function QuickLinksSection() {
  const { data: links, loading: linksLoading, update } = useData('quick_links');
  const { data: credentials, loading: credsLoading } = useData('credentials');

  const manualLinks = useMemo(() =>
    (links as QuickLink[]).sort((a, b) => {
      // Important links always first
      if (a.important && !b.important) return -1;
      if (!a.important && b.important) return 1;
      return a.sort_order - b.sort_order;
    }),
    [links]
  );

  const toggleImportant = useCallback(async (link: QuickLink) => {
    await update(link.id, { important: !link.important });
  }, [update]);

  const autoLinks = useMemo(() => {
    const linkedCredIds = new Set(manualLinks.filter(l => l.credential_id).map(l => l.credential_id));
    return (credentials as unknown as import('../lib/database').Credential[])
      .filter(c => c.login_url && !linkedCredIds.has(c.id))
      .map(c => ({
        id: `auto-${c.id}`,
        name: c.service_name,
        url: c.login_url!,
        icon: '🔑',
        sort_order: 999,
        source: 'credential' as const,
        credential_id: c.id,
      }));
  }, [manualLinks, credentials]);

  const allLinks = useMemo(() => [...manualLinks, ...autoLinks], [manualLinks, autoLinks]);

  const handleDragEnd = useCallback(async (result: import('@hello-pangea/dnd').DropResult) => {
    if (!result.destination || result.source.index === result.destination.index) return;
    const reordered = [...manualLinks];
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    // Persist new sort_order for each moved link
    for (let i = 0; i < reordered.length; i++) {
      if (reordered[i].sort_order !== i) {
        await update(reordered[i].id, { sort_order: i });
      }
    }
  }, [manualLinks, update]);

  const loading = linksLoading || credsLoading;

  if (loading) {
    return (
      <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <Skeleton className="h-5 w-32 mb-4" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-20 rounded-lg" />)}
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <LinkIcon className="w-5 h-5 text-slate-400" />
          Quick Links
        </h3>
      </div>
      {allLinks.length > 0 ? (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="quick-links" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex flex-wrap gap-4"
              >
                {manualLinks.map((link, index) => (
                  <Draggable key={link.id} draggableId={link.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={cn(
                          "relative flex flex-col items-center justify-center p-4 rounded-lg border border-slate-100 bg-slate-50 hover:bg-slate-100 hover:border-slate-200 transition-all group w-[calc(50%-8px)] sm:w-[calc(25%-12px)]",
                          snapshot.isDragging && "shadow-lg ring-2 ring-[#0D9488]/30 z-10"
                        )}
                      >
                        <div className="absolute top-1 right-1 flex items-center gap-0.5">
                          <button
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleImportant(link); }}
                            className={cn(
                              "p-0.5 rounded transition-all",
                              link.important
                                ? "text-amber-400"
                                : "text-slate-300 hover:text-amber-400 opacity-0 group-hover:opacity-100"
                            )}
                            title={link.important ? 'Remove priority' : 'Mark as priority'}
                          >
                            <Star className={cn("w-3.5 h-3.5", link.important && "fill-amber-400")} />
                          </button>
                          <div
                            {...provided.dragHandleProps}
                            className="p-0.5 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-slate-500 cursor-grab active:cursor-grabbing transition-opacity"
                          >
                            <GripVertical className="w-3.5 h-3.5" />
                          </div>
                        </div>
                        <a href={sanitizeUrl(link.url)} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center">
                          <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">{link.icon || '🔗'}</span>
                          <span className="text-sm font-medium text-slate-700 text-center">{link.name}</span>
                        </a>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
                {autoLinks.map(link => (
                  <a
                    key={link.id}
                    href={sanitizeUrl(link.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center p-4 rounded-lg border border-slate-100 bg-slate-50 hover:bg-slate-100 hover:border-slate-200 transition-all group w-[calc(50%-8px)] sm:w-[calc(25%-12px)]"
                  >
                    <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">{link.icon || '🔗'}</span>
                    <span className="text-sm font-medium text-slate-700 text-center">{link.name}</span>
                  </a>
                ))}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      ) : (
        <p className="text-sm text-slate-500">No quick links added yet. Add credentials with login URLs to auto-generate links.</p>
      )}
    </section>
  );
}

function BusinessLinksSection() {
  const { data: links, loading } = useData('business_links');
  const typedLinks = links as unknown as import('../lib/database').BusinessLink[];

  if (loading) {
    return (
      <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <Skeleton className="h-5 w-48 mb-4" />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 rounded-lg" />)}
        </div>
      </section>
    );
  }

  if (typedLinks.length === 0) return null;

  return (
    <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-[#0D9488]" />
          Links & Sheets
        </h3>
        <Link to="/links" className="text-sm text-[#0D9488] font-medium hover:underline flex items-center gap-1">
          Manage <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {typedLinks.sort((a, b) => a.sort_order - b.sort_order).slice(0, 6).map(link => (
          <a
            key={link.id}
            href={sanitizeUrl(link.url)}
            target={link.url ? '_blank' : undefined}
            rel="noopener noreferrer"
            className={cn(
              "flex items-start gap-3 p-3 rounded-lg border transition-all",
              link.url
                ? "border-slate-100 bg-slate-50 hover:bg-slate-100 hover:border-slate-200 cursor-pointer"
                : "border-dashed border-slate-200 bg-slate-50/50 cursor-default opacity-70"
            )}
          >
            <span className="text-xl shrink-0 mt-0.5">{link.icon || '🔗'}</span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-700 truncate">{link.name}</p>
              {link.description && <p className="text-xs text-slate-400 truncate">{link.description}</p>}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

function TodosSection() {
  const { data: tasks, loading, update } = useData('tasks');

  const myTodos = useMemo(() => {
    const today = startOfDay(new Date());
    return (tasks as Task[])
      .filter(t => t.status !== 'done' && (
        (t.due_date && (isBefore(parseISO(t.due_date), addDays(today, 1)))) ||
        t.priority === 'urgent' || t.priority === 'high'
      ))
      .sort((a, b) => {
        const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
        return (priorityOrder[a.priority] || 2) - (priorityOrder[b.priority] || 2);
      })
      .slice(0, 10);
  }, [tasks]);

  const toggleDone = async (task: Task) => {
    await update(task.id, { status: 'done', completed_at: new Date().toISOString() });
  };

  if (loading) {
    return (
      <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <Skeleton className="h-5 w-48 mb-4" />
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-14 mb-2" />)}
      </section>
    );
  }

  return (
    <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-slate-400" />
          My To-Dos &amp; Assigned
        </h3>
        <Link to="/tasks" className="text-sm text-[#0D9488] font-medium hover:underline flex items-center gap-1">
          View all <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      {myTodos.length > 0 ? (
        <div className="space-y-2">
          {myTodos.map(task => (
            <div key={task.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors group">
              <button onClick={() => toggleDone(task)} className="mt-0.5 text-slate-300 hover:text-[#0D9488] transition-colors">
                <Circle className="w-5 h-5" />
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{task.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full",
                    task.priority === 'urgent' ? "bg-red-100 text-red-700" :
                    task.priority === 'high' ? "bg-amber-100 text-amber-700" :
                    task.priority === 'medium' ? "bg-blue-100 text-blue-700" :
                    "bg-slate-100 text-slate-600"
                  )}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  </span>
                  {task.due_date && (
                    <span className={cn("text-xs",
                      isBefore(parseISO(task.due_date), startOfDay(new Date())) ? "text-red-600 font-medium" : "text-slate-500"
                    )}>
                      {isBefore(parseISO(task.due_date), startOfDay(new Date())) ? 'Overdue' :
                       isDateToday(parseISO(task.due_date)) ? 'Due Today' :
                       `Due ${new Date(task.due_date).toLocaleDateString('en-AU', { month: 'short', day: 'numeric' })}`}
                    </span>
                  )}
                  {task.visibility === 'personal' && (
                    <span className="text-xs font-medium text-[#6366F1] bg-indigo-50 px-1.5 py-0.5 rounded">Private</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-500 py-4 text-center">No urgent tasks. Nice work!</p>
      )}
    </section>
  );
}

function EventsSection() {
  const { data: events, loading } = useData('calendar_events');

  const upcoming = useMemo(() => {
    const now = startOfDay(new Date());
    const weekAhead = addDays(now, 7);
    return (events as CalendarEvent[])
      .filter(e => {
        const d = parseISO(e.date);
        return isWithinInterval(d, { start: now, end: weekAhead });
      })
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 5);
  }, [events]);

  if (loading) {
    return (
      <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <Skeleton className="h-5 w-48 mb-4" />
        {[1, 2].map(i => <Skeleton key={i} className="h-16 mb-2" />)}
      </section>
    );
  }

  return (
    <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-slate-400" />
          Upcoming Events (7 Days)
        </h3>
        <Link to="/calendar" className="text-sm text-[#0D9488] font-medium hover:underline flex items-center gap-1">
          View all <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      {upcoming.length > 0 ? (
        <div className="space-y-4">
          {upcoming.map(event => {
            const d = parseISO(event.date);
            return (
              <div key={event.id} className="flex gap-4">
                <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-slate-50 border border-slate-100 shrink-0">
                  <span className="text-xs font-medium text-slate-500 uppercase">{d.toLocaleDateString('en-AU', { month: 'short' })}</span>
                  <span className="text-lg font-bold text-slate-800 leading-none">{d.getDate()}</span>
                </div>
                <div className="flex-1 py-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium text-slate-800">{event.title}</h4>
                    {event.visibility === 'personal' && (
                      <span className="text-xs font-medium text-[#6366F1] bg-indigo-50 px-1.5 py-0.5 rounded">Private</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {event.is_all_day ? 'All day' : `${event.start_time || ''} - ${event.end_time || ''}`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-slate-500 py-4 text-center">No events in the next 7 days.</p>
      )}
    </section>
  );
}

function RevenueSection() {
  const { data: finances, loading } = useData('finances');
  const { data: goals } = useData('goals');

  const { revenue, expenses, profit } = useMemo(() => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    const monthFinances = (finances as Finance[]).filter(f => {
      const d = parseISO(f.date);
      return isWithinInterval(d, { start: monthStart, end: monthEnd });
    });
    const rev = monthFinances.filter(f => f.type === 'revenue').reduce((s, f) => s + f.amount, 0);
    const exp = monthFinances.filter(f => f.type === 'expense').reduce((s, f) => s + f.amount, 0);
    return { revenue: rev, expenses: exp, profit: rev - exp };
  }, [finances]);

  const revenueGoal = (goals as Goal[]).find(g => g.metric_name.toLowerCase().includes('revenue') && g.period === 'monthly');
  const goalTarget = revenueGoal?.target_value || 20000;
  const goalPct = goalTarget === 0 ? 0 : Math.min((revenue / goalTarget) * 100, 100);

  if (loading) {
    return (
      <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-6 w-full" />
      </section>
    );
  }

  const fmt = (n: number) => new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', minimumFractionDigits: 0 }).format(n);

  return (
    <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-slate-400" />
          Revenue Snapshot
        </h3>
        <span className="text-xs font-medium px-2 py-1 rounded-md bg-slate-100 text-slate-600">This Month</span>
      </div>
      <div className="space-y-6">
        <div>
          <p className="text-sm text-slate-500 mb-1">Revenue</p>
          <p className="text-2xl font-bold text-slate-900">{fmt(revenue)}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-slate-500 mb-1">Expenses</p>
            <p className="text-lg font-semibold text-slate-700">{fmt(expenses)}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500 mb-1">Net Profit</p>
            <p className={cn("text-lg font-semibold", profit >= 0 ? "text-[#16A34A]" : "text-[#DC2626]")}>{fmt(profit)}</p>
          </div>
        </div>
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">Monthly Goal</span>
            <span className="text-sm font-medium text-slate-700">{Math.round(goalPct)}%</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#0D9488] rounded-full transition-all" style={{ width: `${goalPct}%` }} />
          </div>
          <p className="text-xs text-slate-500 mt-2 text-right">{fmt(revenue)} / {fmt(goalTarget)}</p>
        </div>
      </div>
    </section>
  );
}

function AlertsSection() {
  const { data: subcontractors, loading: subLoading } = useData('subcontractors');
  const { data: subscriptions, loading: subsLoading } = useData('subscriptions');
  const { data: tasks, loading: taskLoading } = useData('tasks');

  const loading = subLoading || subsLoading || taskLoading;

  const alerts = useMemo(() => {
    const result: { type: 'danger' | 'warning'; title: string; description: string }[] = [];
    const now = new Date();

    // Sub insurance expiring
    (subcontractors as Subcontractor[]).forEach(s => {
      if (s.status === 'active' && s.pl_insurance_expiry) {
        const days = differenceInDays(parseISO(s.pl_insurance_expiry), now);
        if (days <= 30 && days >= 0) {
          result.push({ type: 'danger', title: 'Subcontractor Insurance Expiring', description: `${s.name}'s PL insurance expires in ${days} days.` });
        }
      }
    });

    // Subscription renewals
    (subscriptions as Subscription[]).forEach(s => {
      if (s.status === 'active' && s.next_renewal) {
        const days = differenceInDays(parseISO(s.next_renewal), now);
        if (days <= 14 && days >= 0 && s.cost > 0) {
          result.push({ type: 'warning', title: 'Subscription Renewal', description: `${s.name} renews in ${days} days ($${s.cost.toFixed(2)}).` });
        }
      }
    });

    // Overdue tasks
    const overdueTasks = (tasks as Task[]).filter(t => t.status !== 'done' && t.due_date && isBefore(parseISO(t.due_date), startOfDay(now)));
    if (overdueTasks.length > 0) {
      result.push({ type: 'warning', title: 'Overdue Tasks', description: `${overdueTasks.length} task${overdueTasks.length > 1 ? 's' : ''} overdue.` });
    }

    return result;
  }, [subcontractors, subscriptions, tasks]);

  if (loading) {
    return (
      <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <Skeleton className="h-5 w-24 mb-4" />
        <Skeleton className="h-16 mb-2" />
        <Skeleton className="h-16" />
      </section>
    );
  }

  if (alerts.length === 0) return null;

  return (
    <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          Alerts
        </h3>
      </div>
      <div className="space-y-3">
        {alerts.map((alert, i) => (
          <div key={i} className={cn("flex items-start gap-3 p-3 rounded-lg border",
            alert.type === 'danger' ? "bg-red-50 border-red-100" : "bg-amber-50 border-amber-100"
          )}>
            <AlertTriangle className={cn("w-5 h-5 shrink-0 mt-0.5", alert.type === 'danger' ? "text-red-600" : "text-amber-600")} />
            <div>
              <p className={cn("text-sm font-medium", alert.type === 'danger' ? "text-red-900" : "text-amber-900")}>{alert.title}</p>
              <p className={cn("text-xs mt-1", alert.type === 'danger' ? "text-red-700" : "text-amber-700")}>{alert.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function NotificationsSection() {
  const { data: rawData, loading, update } = useData('notifications');
  const notifications = rawData as unknown as AppNotification[];

  const unread = useMemo(
    () => notifications
      .filter(n => !n.read)
      .sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''))
      .slice(0, 5),
    [notifications]
  );

  if (loading) {
    return (
      <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <Skeleton className="h-5 w-36 mb-4" />
        <Skeleton className="h-14 mb-2" />
        <Skeleton className="h-14" />
      </section>
    );
  }

  if (unread.length === 0) return null;

  return (
    <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <Bell className="w-5 h-5 text-[#0D9488]" />
          Notifications
        </h3>
        <Link to="/notifications" className="text-sm text-[#0D9488] font-medium hover:underline flex items-center gap-1">
          View all <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="space-y-2">
        {unread.map(n => (
          <Link
            key={n.id}
            to={n.link_to || '/notifications'}
            onClick={() => { if (!n.read) update(n.id, { read: true }); }}
            className="flex items-start gap-3 p-3 rounded-lg bg-[#0D9488]/5 border border-[#0D9488]/20 hover:bg-[#0D9488]/10 transition-colors"
          >
            <MessageSquare className="w-4 h-4 text-[#0D9488] mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">{n.title}</p>
              <p className="text-xs text-slate-500 truncate mt-0.5">{n.body}</p>
              {n.created_at && (
                <p className="text-[10px] text-slate-400 mt-1">
                  {formatDistanceToNow(parseISO(n.created_at), { addSuffix: true })}
                </p>
              )}
            </div>
            <span className="w-2 h-2 rounded-full bg-[#0D9488] shrink-0 mt-1.5" />
          </Link>
        ))}
      </div>
    </section>
  );
}
