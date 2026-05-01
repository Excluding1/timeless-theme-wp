import React, { useState, useRef, useEffect, useMemo } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import { format, parseISO, isToday, isYesterday } from 'date-fns';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../hooks/useData';
import { supabase } from '../lib/supabase';
import { UserAvatar } from '../components/UserAvatar';
import { EmptyState } from '../components/EmptyState';
import { Skeleton } from '../components/LoadingSkeleton';
import { cn } from '../lib/utils';
import type { Message } from '../lib/database';

function formatDateDivider(dateStr: string): string {
  const d = parseISO(dateStr);
  if (isToday(d)) return 'Today';
  if (isYesterday(d)) return 'Yesterday';
  return format(d, 'EEEE, MMM d');
}

function shouldShowAvatar(messages: Message[], index: number): boolean {
  if (index === 0) return true;
  const prev = messages[index - 1];
  const curr = messages[index];
  if (prev.sender_id !== curr.sender_id) return true;
  // Show avatar if more than 2 minutes apart
  const prevTime = new Date(prev.created_at).getTime();
  const currTime = new Date(curr.created_at).getTime();
  return currTime - prevTime > 2 * 60 * 1000;
}

function groupMessagesByDate(messages: Message[]): { date: string; messages: Message[] }[] {
  const groups: Record<string, Message[]> = {};
  messages.forEach(m => {
    const dateKey = m.created_at.slice(0, 10); // YYYY-MM-DD
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(m);
  });
  return Object.entries(groups)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, msgs]) => ({ date, messages: msgs }));
}

export function Messages() {
  const { user } = useAuth();
  const { data: rawData, loading, create, setData } = useData('messages', { orderBy: 'created_at', ascending: true });
  const messages = rawData as unknown as Message[];

  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    // Small delay to ensure DOM has updated after state change
    const timer = setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
    return () => clearTimeout(timer);
  }, [messages]);

  // Supabase realtime subscription for live updates
  useEffect(() => {
    if (!supabase) return;
    const channel = supabase
      .channel('messages-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        const newMsg = payload.new as Message;
        // Only add if not already present (create() may have already added it)
        setData((prev: any) => {
          if (prev.some((m: Message) => m.id === newMsg.id)) return prev;
          // Insert in chronological order
          const updated = [...prev, newMsg].sort((a: Message, b: Message) =>
            (a.created_at || '').localeCompare(b.created_at || '')
          );
          return updated;
        });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [setData]);

  const grouped = useMemo(() => groupMessagesByDate(messages), [messages]);

  async function handleSend() {
    const body = newMessage.trim();
    if (!body || sending) return;
    setSending(true);
    try {
      await create({
        sender_id: user?.id,
        sender_name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Unknown',
        sender_avatar: user?.user_metadata?.avatar_url || undefined,
        body,
      } as any);
      setNewMessage('');
      inputRef.current?.focus();
    } catch {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto h-full flex flex-col">
        <Skeleton className="h-7 w-36 mb-4" />
        <div className="flex-1 space-y-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className={cn("flex gap-3", i % 2 === 0 ? "justify-end" : "")}>
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="h-16 w-48 rounded-2xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto h-full flex flex-col -mt-2">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Messages</h2>
          <p className="text-slate-500 text-sm mt-1">Chat with your business partner</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          {messages.length} messages
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto py-4 space-y-1 min-h-0">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <EmptyState
              icon={MessageCircle}
              title="No messages yet"
              description="Start a conversation with your business partner"
            />
          </div>
        ) : (
          grouped.map(group => (
            <div key={group.date}>
              {/* Date divider */}
              <div className="flex items-center justify-center my-4">
                <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-wider">
                  {formatDateDivider(group.messages[0].created_at)}
                </span>
              </div>

              {/* Messages in this date group */}
              {group.messages.map((msg, idx) => {
                const isMe = msg.sender_id === user?.id;
                const showAv = shouldShowAvatar(group.messages, idx);
                const showName = showAv && !isMe;
                const showTime = showAv;

                return (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex gap-2 px-1",
                      isMe ? "justify-end" : "justify-start",
                      showAv ? "mt-3" : "mt-0.5"
                    )}
                  >
                    {/* Partner avatar */}
                    {!isMe && (
                      <div className="w-7 shrink-0">
                        {showAv ? (
                          <UserAvatar
                            avatarUrl={msg.sender_avatar}
                            name={msg.sender_name}
                            size="sm"
                          />
                        ) : null}
                      </div>
                    )}

                    {/* Bubble */}
                    <div className={cn("max-w-[75%]", isMe ? "items-end" : "items-start")}>
                      {showName && (
                        <p className="text-[10px] font-semibold text-slate-500 mb-0.5 ml-1">
                          {msg.sender_name}
                        </p>
                      )}
                      <div
                        className={cn(
                          "px-3.5 py-2 text-sm leading-relaxed whitespace-pre-wrap break-words",
                          isMe
                            ? "bg-[#0D9488] text-white rounded-2xl rounded-br-md"
                            : "bg-white border border-slate-200 text-slate-800 rounded-2xl rounded-bl-md"
                        )}
                      >
                        {msg.body}
                      </div>
                      {showTime && (
                        <p className={cn("text-[10px] text-slate-400 mt-0.5", isMe ? "text-right mr-1" : "ml-1")}>
                          {format(parseISO(msg.created_at), 'h:mm a')}
                        </p>
                      )}
                    </div>

                    {/* My avatar */}
                    {isMe && (
                      <div className="w-7 shrink-0">
                        {showAv ? (
                          <UserAvatar
                            avatarUrl={user?.user_metadata?.avatar_url}
                            name={user?.user_metadata?.full_name}
                            email={user?.email}
                            size="sm"
                          />
                        ) : null}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="border-t border-slate-200 pt-3 pb-1">
        <div className="flex gap-2 items-end">
          <textarea
            ref={inputRef}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            className="flex-1 px-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent resize-none max-h-32"
            style={{ minHeight: '42px' }}
          />
          <button
            onClick={handleSend}
            disabled={!newMessage.trim() || sending}
            className={cn(
              "p-2.5 rounded-xl transition-all shadow-sm",
              newMessage.trim()
                ? "bg-[#0D9488] text-white hover:bg-[#0f766e]"
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            )}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-[10px] text-slate-400 mt-1 ml-1">Enter to send, Shift+Enter for new line</p>
      </div>
    </div>
  );
}
