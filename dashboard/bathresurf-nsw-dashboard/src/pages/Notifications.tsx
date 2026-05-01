import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import {
  Bell, AlertTriangle, MessageSquare, Clock, Plus, Trash2, CheckCheck,
  Send, X, ArrowRight, Reply, ExternalLink, ClipboardList
} from 'lucide-react';
import { format, parseISO, isToday, isYesterday, isThisWeek, formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { SlideOver } from '../components/SlideOver';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { EmptyState } from '../components/EmptyState';
import { Skeleton } from '../components/LoadingSkeleton';
import { useData } from '../hooks/useData';
import { cn } from '../lib/utils';
import type { AppNotification, NotificationReply } from '../lib/database';

type TabFilter = 'all' | 'system' | 'message' | 'reminder';

const TABS: { value: TabFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'system', label: 'System' },
  { value: 'message', label: 'Messages' },
  { value: 'reminder', label: 'Reminders' },
];

const CATEGORY_ICON: Record<string, React.ElementType> = {
  overdue_task: AlertTriangle,
  insurance_expiry: AlertTriangle,
  subscription_renewal: Clock,
  general: MessageSquare,
};

const CATEGORY_COLOR: Record<string, { bg: string; text: string; border: string }> = {
  overdue_task: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' },
  insurance_expiry: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' },
  subscription_renewal: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
  general: { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200' },
};

type ComposeForm = {
  title: string;
  body: string;
  type: 'message' | 'reminder';
};

function groupByDate(items: AppNotification[]): { label: string; items: AppNotification[] }[] {
  const groups: Record<string, AppNotification[]> = {
    Today: [],
    Yesterday: [],
    'This Week': [],
    Older: [],
  };

  items.forEach(n => {
    const d = n.created_at ? parseISO(n.created_at) : new Date();
    if (isToday(d)) groups.Today.push(n);
    else if (isYesterday(d)) groups.Yesterday.push(n);
    else if (isThisWeek(d, { weekStartsOn: 1 })) groups['This Week'].push(n);
    else groups.Older.push(n);
  });

  return Object.entries(groups)
    .filter(([, items]) => items.length > 0)
    .map(([label, items]) => ({ label, items }));
}

// ── Detail Panel ────────────────────────────────────────────────────────────

function NotificationDetail({
  notification,
  onClose,
  onReply,
  onNavigate,
  onCreateTask,
}: {
  notification: AppNotification;
  onClose: () => void;
  onReply: (body: string) => void;
  onNavigate: () => void;
  onCreateTask: () => void;
}) {
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const repliesEndRef = useRef<HTMLDivElement>(null);
  const Icon = CATEGORY_ICON[notification.category] || MessageSquare;
  const colors = CATEGORY_COLOR[notification.category] || CATEGORY_COLOR.general;

  useEffect(() => {
    repliesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [notification.replies?.length]);

  async function handleSendReply() {
    if (!replyText.trim()) return;
    setSending(true);
    onReply(replyText.trim());
    setReplyText('');
    setSending(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendReply();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-slate-100">
          <div className="flex items-start gap-3 min-w-0">
            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mt-0.5", colors.bg)}>
              <Icon className={cn("w-5 h-5", colors.text)} />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-semibold text-slate-900">{notification.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded", colors.bg, colors.text)}>
                  {notification.type === 'system' ? 'System' : notification.type === 'message' ? 'Message' : 'Reminder'}
                </span>
                {notification.created_at && (
                  <span className="text-xs text-slate-400">
                    {format(parseISO(notification.created_at), 'MMM d, h:mm a')}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body + Replies */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Original message */}
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
            <p className="text-sm text-slate-700 whitespace-pre-wrap">{notification.body}</p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3">
            {notification.link_to && (
              <button
                onClick={onNavigate}
                className="flex items-center gap-2 text-sm text-[#0D9488] hover:text-[#0f766e] font-medium transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Go to {notification.link_to.replace('/', '')} →
              </button>
            )}
            <button
              onClick={onCreateTask}
              className="flex items-center gap-2 text-sm text-[#1B2A4A] hover:text-[#0D9488] font-medium bg-slate-100 hover:bg-[#0D9488]/10 px-3 py-1.5 rounded-lg transition-colors"
            >
              <ClipboardList className="w-4 h-4" />
              Create Task
            </button>
          </div>

          {/* Replies */}
          {notification.replies && notification.replies.length > 0 && (
            <div className="space-y-3 pt-2">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Replies</p>
              {notification.replies.map(reply => (
                <div key={reply.id} className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#1B2A4A] flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[10px] font-bold text-white">
                      {reply.sender_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 bg-white rounded-lg border border-slate-200 p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-slate-700">{reply.sender_name}</span>
                      <span className="text-[10px] text-slate-400">
                        {formatDistanceToNow(parseISO(reply.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 whitespace-pre-wrap">{reply.body}</p>
                  </div>
                </div>
              ))}
              <div ref={repliesEndRef} />
            </div>
          )}
        </div>

        {/* Reply Input */}
        <div className="border-t border-slate-100 p-4 bg-slate-50">
          <div className="flex gap-2">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Write a reply... (Enter to send)"
              rows={2}
              className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent resize-none"
            />
            <button
              onClick={handleSendReply}
              disabled={!replyText.trim() || sending}
              className="self-end p-2.5 bg-[#1B2A4A] text-white rounded-lg hover:bg-[#1e335a] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              title="Send reply"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-slate-400 mt-1.5">Press Enter to send, Shift+Enter for new line</p>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────

export function Notifications() {
  const { data: rawData, loading, create, update, remove } = useData('notifications');
  const notifications = rawData as unknown as AppNotification[];
  const navigate = useNavigate();
  const { user } = useAuth();

  const [tab, setTab] = useState<TabFilter>('all');
  const [slideOpen, setSlideOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AppNotification | null>(null);
  const [viewing, setViewing] = useState<AppNotification | null>(null);

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<ComposeForm>();

  const filtered = useMemo(() => {
    let items = [...notifications];
    if (tab !== 'all') {
      items = items.filter(n => n.type === tab);
    }
    return items.sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
  }, [notifications, tab]);

  const grouped = useMemo(() => groupByDate(filtered), [filtered]);
  const unreadCount = notifications.filter(n => !n.read).length;

  // Keep the viewing notification in sync when data changes (e.g. after reply)
  const viewingLive = useMemo(
    () => viewing ? notifications.find(n => n.id === viewing.id) || viewing : null,
    [viewing, notifications]
  );

  async function markAllRead() {
    const unread = notifications.filter(n => !n.read);
    await Promise.all(unread.map(n => update(n.id, { read: true })));
    toast.success('All notifications marked as read');
  }

  async function handleClick(n: AppNotification) {
    if (!n.read) await update(n.id, { read: true });
    setViewing(n);
  }

  async function handleReply(body: string) {
    if (!viewing) return;
    const senderName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Owner';
    const newReply: NotificationReply = {
      id: crypto.randomUUID(),
      sender_name: senderName,
      body,
      created_at: new Date().toISOString(),
    };
    const existingReplies = (viewing.replies || []);
    await update(viewing.id, {
      replies: [...existingReplies, newReply],
      updated_at: new Date().toISOString(),
    } as any);
    setViewing(prev => prev ? { ...prev, replies: [...existingReplies, newReply] } : null);
    toast.success('Reply sent');
  }

  async function onCompose(form: ComposeForm) {
    try {
      await create({
        type: form.type,
        category: 'general',
        title: form.title,
        body: form.body,
        read: false,
      } as any);
      toast.success('Message sent');
      setSlideOpen(false);
      reset();
    } catch {
      toast.error('Failed to send message');
    }
  }

  async function onDelete() {
    if (!deleteTarget) return;
    try {
      await remove(deleteTarget.id);
      toast.success('Notification deleted');
      setDeleteTarget(null);
      if (viewing?.id === deleteTarget.id) setViewing(null);
    } catch {
      toast.error('Failed to delete');
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-10 w-36" />
        </div>
        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-20" />)}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Notifications</h2>
          <p className="text-slate-500 text-sm mt-1">
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <CheckCheck className="w-4 h-4" />
              Mark all read
            </button>
          )}
          <button
            onClick={() => { reset({ title: '', body: '', type: 'message' }); setSlideOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-[#1B2A4A] text-white rounded-lg font-medium hover:bg-[#1e335a] transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New Message
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 w-fit">
        {TABS.map(t => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={cn(
              "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
              tab === t.value
                ? "bg-white text-slate-800 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications"
          description={tab === 'all' ? 'You\'re all caught up! Notifications will appear here when something needs your attention.' : `No ${tab} notifications.`}
        />
      ) : (
        <div className="space-y-6">
          {grouped.map(group => (
            <div key={group.label}>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                {group.label}
              </h3>
              <div className="space-y-2">
                {group.items.map(n => {
                  const Icon = CATEGORY_ICON[n.category] || MessageSquare;
                  const colors = CATEGORY_COLOR[n.category] || CATEGORY_COLOR.general;
                  const replyCount = n.replies?.length || 0;
                  return (
                    <div
                      key={n.id}
                      className={cn(
                        "bg-white rounded-xl border p-4 flex items-start gap-4 group transition-all cursor-pointer hover:shadow-sm",
                        !n.read ? "border-[#0D9488]/30 bg-[#0D9488]/5" : "border-slate-200"
                      )}
                      onClick={() => handleClick(n)}
                    >
                      <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0", colors.bg)}>
                        <Icon className={cn("w-4.5 h-4.5", colors.text)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={cn("text-sm", !n.read ? "font-semibold text-slate-900" : "font-medium text-slate-700")}>
                            {n.title}
                          </p>
                          <div className="flex items-center gap-2 shrink-0">
                            {!n.read && (
                              <span className="w-2 h-2 rounded-full bg-[#0D9488]" />
                            )}
                            <button
                              onClick={(e) => { e.stopPropagation(); setDeleteTarget(n); }}
                              className="p-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-slate-500 mt-0.5 line-clamp-1">{n.body}</p>
                        <div className="flex items-center gap-3 mt-2">
                          {n.created_at && (
                            <span className="text-xs text-slate-400">
                              {format(parseISO(n.created_at), 'MMM d, h:mm a')}
                            </span>
                          )}
                          <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded", colors.bg, colors.text)}>
                            {n.type === 'system' ? 'System' : n.type === 'message' ? 'Message' : 'Reminder'}
                          </span>
                          {replyCount > 0 && (
                            <span className="flex items-center gap-1 text-xs text-slate-500">
                              <Reply className="w-3 h-3" />
                              {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
                            </span>
                          )}
                          {n.link_to && (
                            <span className="text-xs text-[#0D9488] font-medium">View →</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Popup */}
      {viewingLive && (
        <NotificationDetail
          notification={viewingLive}
          onClose={() => setViewing(null)}
          onReply={handleReply}
          onNavigate={() => { setViewing(null); if (viewingLive.link_to) navigate(viewingLive.link_to); }}
          onCreateTask={() => {
            const title = viewingLive.title;
            const body = viewingLive.body;
            const params = new URLSearchParams({
              from_notification: 'true',
              title,
              description: body,
            });
            navigate(`/tasks?${params.toString()}`);
            setViewing(null);
          }}
        />
      )}

      {/* Compose SlideOver */}
      <SlideOver open={slideOpen} onClose={() => setSlideOpen(false)} title="New Message">
        <form onSubmit={handleSubmit(onCompose)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
            <select
              {...register('type')}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
            >
              <option value="message">Message</option>
              <option value="reminder">Reminder</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
            <input
              {...register('title', { required: true })}
              placeholder="e.g. Follow up with John"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Message *</label>
            <textarea
              {...register('body', { required: true })}
              rows={4}
              placeholder="Write your message..."
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488] resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setSlideOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#1B2A4A] rounded-lg hover:bg-[#1e335a] transition-colors disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? 'Sending...' : 'Send'}
            </button>
          </div>
        </form>
      </SlideOver>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={onDelete}
        title="Delete Notification"
        description="Are you sure you want to delete this notification?"
      />
    </div>
  );
}
