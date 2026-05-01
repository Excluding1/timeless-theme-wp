import React, { useState, useRef } from 'react';
import { usePreferences } from '../contexts/PreferencesContext';
import { useAuth } from '../contexts/AuthContext';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Save, User, LayoutDashboard, Sidebar, SlidersHorizontal, GripVertical, Eye, EyeOff, Bell, Loader2, Camera } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '../lib/utils';
import { UserAvatar } from '../components/UserAvatar';
import { uploadToCloudinary } from '../lib/cloudinary';

const DASHBOARD_SECTIONS = [
  { id: 'quick_links', label: 'Quick Links', description: 'Pinned shortcut cards to tools and services' },
  { id: 'todos', label: 'My To-Dos & Assigned', description: 'Tasks due today/overdue and assigned to you' },
  { id: 'events', label: 'Upcoming Events', description: 'Next 7 days personal and shared events' },
  { id: 'revenue', label: 'Revenue Snapshot', description: 'This month revenue, expenses, and net profit' },
  { id: 'alerts', label: 'Alerts', description: 'Insurance expiring, renewals, overdue tasks' },
];

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', alwaysVisible: true },
  { id: 'overview', label: 'Overview' },
  { id: 'tasks', label: 'Tasks' },
  { id: 'messages', label: 'Messages' },
  { id: 'calendar', label: 'Calendar' },
  { id: 'finances', label: 'Finances' },
  { id: 'cashflow', label: 'Cashflow' },
  { id: 'kpis', label: 'KPIs' },
  { id: 'subscriptions', label: 'Subscriptions' },
  { id: 'subs', label: 'Subs Tracker' },
  { id: 'contacts', label: 'Contacts' },
  { id: 'credentials', label: 'Credentials' },
  { id: 'goals', label: 'Goals' },
  { id: 'weekly_review', label: 'Weekly Review' },
  { id: 'notes', label: 'Notes' },
  { id: 'links', label: 'Links & Sheets' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'settings', label: 'Settings', alwaysVisible: true },
];

const VIEW_OPTIONS = {
  default_task_view: [
    { value: 'kanban', label: 'Kanban Board' },
    { value: 'list', label: 'List View' },
  ],
  default_sub_view: [
    { value: 'cards', label: 'Card Grid' },
    { value: 'table', label: 'Table View' },
  ],
  default_subscription_view: [
    { value: 'cards', label: 'Card Grid' },
    { value: 'table', label: 'Table View' },
  ],
  default_calendar_view: [
    { value: 'month', label: 'Month View' },
    { value: 'week', label: 'Week View' },
  ],
  default_finance_period: [
    { value: 'today', label: 'Today' },
    { value: 'this_week', label: 'This Week' },
    { value: 'this_month', label: 'This Month' },
    { value: 'this_quarter', label: 'This Quarter' },
    { value: 'this_year', label: 'This Year' },
    { value: 'all_time', label: 'All Time' },
  ],
  default_overview_period: [
    { value: 'this_month', label: 'This Month' },
    { value: 'this_quarter', label: 'This Quarter' },
    { value: 'this_year', label: 'This Year' },
    { value: 'all_time', label: 'All Time' },
  ],
};

export function Settings() {
  const { preferences, updatePreferences } = usePreferences();
  const { user, updateUserMetadata } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences'>('preferences');
  const [displayName, setDisplayName] = useState(user?.user_metadata?.full_name || 'Owner');
  const [avatarUrl, setAvatarUrl] = useState(user?.user_metadata?.avatar_url || '');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB');
      return;
    }
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setAvatarUrl(url);
      toast.success('Avatar uploaded');
    } catch (err: any) {
      toast.error('Upload failed: ' + (err.message || 'Unknown error'));
    } finally {
      setUploading(false);
      if (avatarInputRef.current) avatarInputRef.current.value = '';
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await updateUserMetadata({ full_name: displayName, avatar_url: avatarUrl });
      toast.success('Profile saved successfully');
    } catch {
      toast.error('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleDashboardSection = (sectionId: string) => {
    const current = preferences.dashboard_sections;
    const newSections = current.includes(sectionId)
      ? current.filter(id => id !== sectionId)
      : [...current, sectionId];
    updatePreferences({ dashboard_sections: newSections });
    toast.success('Dashboard updated');
  };

  const handleDashboardDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(preferences.dashboard_sections);
    const allSections = DASHBOARD_SECTIONS.map(s => s.id);
    const visibleInOrder = allSections.filter(id => items.includes(id));
    const [removed] = visibleInOrder.splice(result.source.index, 1);
    visibleInOrder.splice(result.destination.index, 0, removed);
    updatePreferences({ dashboard_sections: visibleInOrder });
    toast.success('Dashboard order updated');
  };

  const handleResetLayout = () => {
    updatePreferences({
      hidden_nav_items: [],
      nav_item_order: ['dashboard', 'overview', 'tasks', 'messages', 'calendar', 'finances', 'cashflow', 'kpis', 'subscriptions', 'subs', 'contacts', 'credentials', 'goals', 'weekly_review', 'notes', 'links', 'notifications', 'settings'],
      dashboard_sections: ['quick_links', 'todos', 'events', 'revenue', 'alerts'],
      sidebar_collapsed: false,
      nav_grouped: false,
      nav_pinned_items: ['dashboard', 'tasks', 'messages', 'finances', 'cashflow', 'subs', 'goals', 'settings'],
    });
    toast.success('Layout reset to default');
  };

  const handleToggleNavItem = (itemId: string) => {
    const hidden = preferences.hidden_nav_items || [];
    const item = NAV_ITEMS.find(n => n.id === itemId);
    if (item?.alwaysVisible) return;

    const visibleCount = NAV_ITEMS.length - hidden.length;
    const isHiding = !hidden.includes(itemId);

    if (isHiding && visibleCount <= 3) {
      toast.error('You must keep at least 3 sidebar items visible');
      return;
    }

    const newHidden = isHiding
      ? [...hidden, itemId]
      : hidden.filter(id => id !== itemId);
    updatePreferences({ hidden_nav_items: newHidden });
    toast.success('Sidebar updated');
  };

  const handleViewChange = (key: string, value: string) => {
    updatePreferences({ [key]: value } as any);
    toast.success('Preference saved');
  };

  const handleSidebarCollapsedToggle = () => {
    updatePreferences({ sidebar_collapsed: !preferences.sidebar_collapsed });
    toast.success('Sidebar preference saved');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Settings</h2>
        <p className="text-slate-500 text-sm mt-1">Manage your personal profile and app preferences</p>
      </div>

      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('profile')}
          className={cn(
            "px-4 py-3 text-sm font-medium border-b-2 transition-colors",
            activeTab === 'profile' ? "border-[#0D9488] text-[#0D9488]" : "border-transparent text-slate-500 hover:text-slate-700"
          )}
        >
          <div className="flex items-center gap-2"><User className="w-4 h-4" />Profile</div>
        </button>
        <button
          onClick={() => setActiveTab('preferences')}
          className={cn(
            "px-4 py-3 text-sm font-medium border-b-2 transition-colors",
            activeTab === 'preferences' ? "border-[#0D9488] text-[#0D9488]" : "border-transparent text-slate-500 hover:text-slate-700"
          )}
        >
          <div className="flex items-center gap-2"><SlidersHorizontal className="w-4 h-4" />Preferences</div>
        </button>
      </div>

      {activeTab === 'profile' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Profile Information</h3>
          <div className="flex items-center gap-6">
            <div className="relative">
              <UserAvatar avatarUrl={avatarUrl} name={displayName} email={user?.email} size="lg" />
              {uploading && (
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                </div>
              )}
            </div>
            <div>
              <input ref={avatarInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
              <button
                onClick={() => avatarInputRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                <Camera className="w-4 h-4" />
                {uploading ? 'Uploading...' : 'Change Avatar'}
              </button>
              <p className="text-xs text-slate-400 mt-1">JPG, PNG or GIF. Max 5MB.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                disabled
                defaultValue={user?.email || ''}
                className="w-full px-3 py-2 border border-slate-200 bg-slate-50 text-slate-500 rounded-lg cursor-not-allowed"
              />
              <p className="text-xs text-slate-500 mt-1">Email cannot be changed here.</p>
            </div>
          </div>
          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button onClick={handleSaveProfile} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-[#1B2A4A] text-white rounded-lg font-medium hover:bg-[#1e335a] transition-colors disabled:opacity-50">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </div>
      )}

      {activeTab === 'preferences' && (
        <div className="space-y-6">
          {/* Dashboard Sections */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-2">
              <LayoutDashboard className="w-5 h-5 text-slate-400" />
              <h3 className="text-lg font-semibold text-slate-800">Dashboard Sections</h3>
            </div>
            <p className="text-sm text-slate-500 mb-4">Drag to reorder. Toggle to show/hide sections on your dashboard.</p>
            <DragDropContext onDragEnd={handleDashboardDragEnd}>
              <Droppable droppableId="dashboard-sections">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-2">
                    {DASHBOARD_SECTIONS.map((section, index) => {
                      const isVisible = preferences.dashboard_sections.includes(section.id);
                      return (
                        <Draggable key={section.id} draggableId={section.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={cn(
                                "flex items-center gap-3 p-3 rounded-lg border transition-all",
                                isVisible ? "bg-white border-slate-200" : "bg-slate-50 border-slate-100 opacity-60",
                                snapshot.isDragging && "shadow-lg ring-2 ring-[#0D9488]/30"
                              )}
                            >
                              <div {...provided.dragHandleProps} className="text-slate-400 hover:text-slate-600 cursor-grab active:cursor-grabbing">
                                <GripVertical className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-700">{section.label}</p>
                                <p className="text-xs text-slate-500 truncate">{section.description}</p>
                              </div>
                              <button
                                onClick={() => handleToggleDashboardSection(section.id)}
                                className={cn("p-1.5 rounded-md transition-colors", isVisible ? "text-[#0D9488] hover:bg-teal-50" : "text-slate-400 hover:bg-slate-100")}
                              >
                                {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                              </button>
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>

          {/* Default Views */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-2">
              <SlidersHorizontal className="w-5 h-5 text-slate-400" />
              <h3 className="text-lg font-semibold text-slate-800">Default Views</h3>
            </div>
            <p className="text-sm text-slate-500 mb-4">Set default view preferences for each page.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(VIEW_OPTIONS).map(([key, options]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {key.replace('default_', '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </label>
                  <select
                    value={(preferences as any)[key] || options[0].value}
                    onChange={(e) => handleViewChange(key, e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent bg-white"
                  >
                    {options.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar Navigation */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sidebar className="w-5 h-5 text-slate-400" />
                <h3 className="text-lg font-semibold text-slate-800">Sidebar Navigation</h3>
              </div>
              <button
                onClick={handleResetLayout}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 border border-slate-200 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Reset to Default
              </button>
            </div>
            <p className="text-sm text-slate-500 mb-4">Hide items you don't use. Minimum 3 must remain visible.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {NAV_ITEMS.map(item => {
                const isVisible = !preferences.hidden_nav_items?.includes(item.id);
                return (
                  <label
                    key={item.id}
                    className={cn(
                      "flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-colors",
                      item.alwaysVisible ? "bg-slate-50 border-slate-100 cursor-not-allowed" :
                      isVisible ? "bg-white border-slate-200 hover:border-slate-300" : "bg-slate-50 border-slate-100 opacity-60"
                    )}
                  >
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-[#0D9488] rounded border-slate-300 focus:ring-[#0D9488]"
                      checked={isVisible}
                      disabled={item.alwaysVisible}
                      onChange={() => handleToggleNavItem(item.id)}
                    />
                    <span className="text-sm font-medium text-slate-700">{item.label}</span>
                    {item.alwaysVisible && <span className="text-xs text-slate-400 ml-auto">Always visible</span>}
                  </label>
                );
              })}
            </div>
          </div>

          {/* Sidebar Collapsed Default */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-800">Start with sidebar collapsed</h3>
                <p className="text-xs text-slate-500 mt-1">Sidebar will start in icon-only mode on desktop.</p>
              </div>
              <button
                onClick={handleSidebarCollapsedToggle}
                className={cn(
                  "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                  preferences.sidebar_collapsed ? "bg-[#0D9488]" : "bg-slate-300"
                )}
              >
                <span className={cn(
                  "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                  preferences.sidebar_collapsed ? "translate-x-6" : "translate-x-1"
                )} />
              </button>
            </div>
          </div>

          {/* Grouped Navigation */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-800">Grouped Navigation</h3>
                <p className="text-xs text-slate-500 mt-1">Show your top pinned items, with the rest under collapsible category headers.</p>
              </div>
              <button
                onClick={() => {
                  updatePreferences({ nav_grouped: !preferences.nav_grouped });
                  toast.success(preferences.nav_grouped ? 'Flat navigation enabled' : 'Grouped navigation enabled');
                }}
                className={cn(
                  "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                  preferences.nav_grouped ? "bg-[#0D9488]" : "bg-slate-300"
                )}
              >
                <span className={cn(
                  "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                  preferences.nav_grouped ? "translate-x-6" : "translate-x-1"
                )} />
              </button>
            </div>

            {preferences.nav_grouped && (
              <div>
                <p className="text-xs font-medium text-slate-600 mb-2">Pinned items (always visible at top, max 8):</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {NAV_ITEMS.map(item => {
                    const isPinned = (preferences.nav_pinned_items || []).includes(item.id);
                    const pinnedCount = (preferences.nav_pinned_items || []).length;
                    return (
                      <label
                        key={item.id}
                        className={cn(
                          "flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-colors",
                          isPinned ? "bg-[#0D9488]/5 border-[#0D9488]/20" : "bg-white border-slate-200 hover:border-slate-300"
                        )}
                      >
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-[#0D9488] rounded border-slate-300 focus:ring-[#0D9488]"
                          checked={isPinned}
                          onChange={() => {
                            const current = preferences.nav_pinned_items || [];
                            if (isPinned) {
                              updatePreferences({ nav_pinned_items: current.filter(id => id !== item.id) });
                            } else {
                              if (pinnedCount >= 8) {
                                toast.error('Maximum 8 pinned items');
                                return;
                              }
                              updatePreferences({ nav_pinned_items: [...current, item.id] });
                            }
                          }}
                        />
                        <span className="text-sm font-medium text-slate-700">{item.label}</span>
                        {isPinned && <span className="text-[10px] text-[#0D9488] font-medium ml-auto">Pinned</span>}
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Notifications */}
          <NotificationsSettings />
        </div>
      )}
    </div>
  );
}

function NotificationsSettings() {
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>(() => {
    if (!('Notification' in window)) return 'unsupported';
    return Notification.permission;
  });

  const handleEnable = async () => {
    if (!('Notification' in window)) return;
    const result = await Notification.requestPermission();
    setPermission(result);
    if (result === 'granted') {
      new Notification('Timeless Resurfacing', {
        body: 'Notifications are now enabled!',
        icon: '/icon-192.svg',
      });
      toast.success('Notifications enabled');
    } else {
      toast.error('Notification permission denied');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center gap-2 mb-2">
        <Bell className="w-5 h-5 text-slate-400" />
        <h3 className="text-lg font-semibold text-slate-800">Notifications</h3>
      </div>
      <p className="text-sm text-slate-500 mb-4">
        Enable browser notifications for task reminders, subscription renewals, and insurance expiry alerts.
      </p>
      {permission === 'unsupported' ? (
        <p className="text-sm text-amber-600">Your browser does not support notifications.</p>
      ) : permission === 'granted' ? (
        <div className="flex items-center gap-2 text-sm text-emerald-600">
          <Bell className="w-4 h-4" />
          Notifications are enabled
        </div>
      ) : permission === 'denied' ? (
        <p className="text-sm text-red-600">
          Notifications are blocked. To enable, go to your browser settings and allow notifications for this site.
        </p>
      ) : (
        <button
          onClick={handleEnable}
          className="flex items-center gap-2 px-4 py-2 bg-[#1B2A4A] text-white rounded-lg font-medium text-sm hover:bg-[#1e335a] transition-colors"
        >
          <Bell className="w-4 h-4" />
          Enable Notifications
        </button>
      )}
    </div>
  );
}
