import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePreferences } from '../contexts/PreferencesContext';
import { cn } from '../lib/utils';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import {
  LayoutDashboard,
  BarChart3,
  DollarSign,
  TrendingUp,
  CreditCard,
  KeyRound,
  CheckSquare,
  CalendarDays,
  HardHat,
  Users,
  Target,
  ClipboardCheck,
  StickyNote,
  Settings,
  Menu,
  X,
  LogOut,
  GripVertical,
  PanelLeftClose,
  Link as LinkIcon,
  Bell,
  MessageCircle,
  Wallet,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { NotificationBell } from './NotificationBell';
import { UserAvatar } from './UserAvatar';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { id: 'overview', label: 'Overview', icon: BarChart3, path: '/overview' },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare, path: '/tasks' },
  { id: 'messages', label: 'Messages', icon: MessageCircle, path: '/messages' },
  { id: 'calendar', label: 'Calendar', icon: CalendarDays, path: '/calendar' },
  { id: 'finances', label: 'Finances', icon: DollarSign, path: '/finances' },
  { id: 'cashflow', label: 'Cashflow', icon: Wallet, path: '/cashflow' },
  { id: 'kpis', label: 'KPIs', icon: TrendingUp, path: '/kpis' },
  { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard, path: '/subscriptions' },
  { id: 'subs', label: 'Subs Tracker', icon: HardHat, path: '/subs' },
  { id: 'contacts', label: 'Contacts', icon: Users, path: '/contacts' },
  { id: 'credentials', label: 'Credentials', icon: KeyRound, path: '/credentials' },
  { id: 'goals', label: 'Goals', icon: Target, path: '/goals' },
  { id: 'weekly_review', label: 'Weekly Review', icon: ClipboardCheck, path: '/weekly-review' },
  { id: 'notes', label: 'Notes', icon: StickyNote, path: '/notes' },
  { id: 'links', label: 'Links & Sheets', icon: LinkIcon, path: '/links' },
  { id: 'notifications', label: 'Notifications', icon: Bell, path: '/notifications' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
];

// Category groups for nested nav mode
const NAV_GROUPS = [
  { label: 'Daily', ids: ['tasks', 'messages', 'calendar'] },
  { label: 'Money', ids: ['finances', 'cashflow', 'kpis', 'subscriptions'] },
  { label: 'Operations', ids: ['subs', 'contacts', 'credentials'] },
  { label: 'Goals', ids: ['goals', 'weekly_review'] },
  { label: 'Reference', ids: ['notes', 'links'] },
  { label: 'System', ids: ['notifications'] },
];

// Always-visible items in grouped mode (not inside any group)
const TOP_LEVEL_IDS = ['dashboard', 'overview'];

function NavItem({
  item,
  isActive,
  isCollapsed,
  isEditMode,
  onClick,
}: {
  item: typeof NAV_ITEMS[0];
  isActive: boolean;
  isCollapsed: boolean;
  isEditMode: boolean;
  onClick: () => void;
}) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.path}
      onClick={(e) => {
        if (isEditMode) e.preventDefault();
        else onClick();
      }}
      className={cn(
        "flex items-center gap-3 rounded-lg py-2 text-sm font-medium transition-colors",
        !isEditMode && isActive
          ? "bg-[#0D9488] text-white"
          : !isEditMode
            ? "hover:bg-white/10 hover:text-white text-slate-300"
            : "text-slate-300 cursor-default",
        isCollapsed ? "justify-center px-0 py-2.5" : "px-3"
      )}
      title={isCollapsed ? item.label : undefined}
      aria-label={item.label}
      aria-current={isActive ? 'page' : undefined}
    >
      <Icon className="w-5 h-5 shrink-0" aria-hidden="true" />
      {!isCollapsed && <span className="truncate">{item.label}</span>}
    </NavLink>
  );
}

function GroupedNav({
  isCollapsed,
  location,
  closeMobile,
}: {
  isCollapsed: boolean;
  location: ReturnType<typeof useLocation>;
  closeMobile: () => void;
}) {
  const { preferences } = usePreferences();
  const pinnedIds = preferences.nav_pinned_items || [];
  const hiddenIds = preferences.hidden_nav_items || [];
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => {
    // Auto-expand the group that contains the current page
    const currentId = NAV_ITEMS.find(i => i.path === location.pathname)?.id;
    const activeGroup = NAV_GROUPS.find(g => g.ids.includes(currentId || ''));
    return new Set(activeGroup ? [activeGroup.label] : []);
  });

  const toggleGroup = (label: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  // Pinned items (always visible at top) — Settings excluded, it's permanently in the footer
  const pinnedItems = pinnedIds
    .map(id => NAV_ITEMS.find(i => i.id === id))
    .filter((i): i is typeof NAV_ITEMS[0] => !!i && !hiddenIds.includes(i.id) && i.id !== 'settings');

  // Group the remaining items
  const pinnedSet = new Set(pinnedIds);

  return (
    <nav className="space-y-1 px-2">
      {/* Pinned items */}
      {pinnedItems.map(item => (
        <NavItem
          key={item.id}
          item={item}
          isActive={location.pathname === item.path}
          isCollapsed={isCollapsed}
          isEditMode={false}
          onClick={closeMobile}
        />
      ))}

      {/* Divider */}
      {!isCollapsed && pinnedItems.length > 0 && (
        <div className="my-2 border-t border-white/10" />
      )}

      {/* Grouped sections */}
      {NAV_GROUPS.map(group => {
        const groupItems = group.ids
          .filter(id => !pinnedSet.has(id) && !hiddenIds.includes(id))
          .map(id => NAV_ITEMS.find(i => i.id === id))
          .filter((i): i is typeof NAV_ITEMS[0] => !!i);

        if (groupItems.length === 0) return null;

        const isExpanded = expandedGroups.has(group.label);
        const hasActiveChild = groupItems.some(i => location.pathname === i.path);

        if (isCollapsed) {
          // In collapsed mode, just show icons without headers
          return groupItems.map(item => (
            <NavItem
              key={item.id}
              item={item}
              isActive={location.pathname === item.path}
              isCollapsed={true}
              isEditMode={false}
              onClick={closeMobile}
            />
          ));
        }

        return (
          <div key={group.label}>
            <button
              onClick={() => toggleGroup(group.label)}
              className={cn(
                "flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                hasActiveChild && !isExpanded
                  ? "text-[#0D9488]"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              )}
              aria-expanded={isExpanded}
              aria-label={`${group.label} navigation group, ${isExpanded ? 'expanded' : 'collapsed'}`}
            >
              <span>{group.label}</span>
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" aria-hidden="true" />
              ) : (
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              )}
            </button>

            {isExpanded && (
              <div className="ml-3 space-y-1 border-l border-white/10 pl-2">
                {groupItems.map(item => (
                  <NavItem
                    key={item.id}
                    item={item}
                    isActive={location.pathname === item.path}
                    isCollapsed={false}
                    isEditMode={false}
                    onClick={closeMobile}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}

export function Layout() {
  const { preferences, updatePreferences } = usePreferences();
  const { signOut, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const location = useLocation();

  const isCollapsed = preferences.sidebar_collapsed;
  const isGrouped = preferences.nav_grouped;
  const toggleSidebar = () => updatePreferences({ sidebar_collapsed: !isCollapsed });

  const handleEditModeToggle = () => {
    const newEditMode = !isEditMode;
    setIsEditMode(newEditMode);
    if (newEditMode && isCollapsed) {
      updatePreferences({ sidebar_collapsed: false });
    }
  };

  const visibleNavItems = NAV_ITEMS.filter(
    item => item.id !== 'settings' && !preferences.hidden_nav_items?.includes(item.id)
  );

  const navOrder = preferences.nav_item_order || NAV_ITEMS.map(i => i.id);

  const orderedNavItems = [...visibleNavItems].sort((a, b) => {
    const indexA = navOrder.indexOf(a.id);
    const indexB = navOrder.indexOf(b.id);
    if (indexA === -1 && indexB === -1) return 0;
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const newOrder = Array.from(navOrder);

    const draggedItemId = result.draggableId;

    const currentIndex = newOrder.indexOf(draggedItemId);
    if (currentIndex !== -1) {
      newOrder.splice(currentIndex, 1);
    }

    const visibleIds = orderedNavItems.map(i => i.id);
    visibleIds.splice(result.source.index, 1);
    visibleIds.splice(result.destination.index, 0, draggedItemId);

    const hiddenIds = navOrder.filter(id => !visibleIds.includes(id));
    const finalOrder = [...visibleIds, ...hiddenIds];

    updatePreferences({ nav_item_order: finalOrder });
  };

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 md:hidden"
          onClick={closeMobile}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-[#1B2A4A] text-slate-300 transition-all duration-300 md:relative shrink-0",
          isCollapsed ? "w-20" : "w-64",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-white/10 shrink-0">
          <div className={cn("flex items-center gap-3 font-semibold text-white", isCollapsed && "hidden")}>
            <div className="w-8 h-8 rounded bg-[#0D9488] flex items-center justify-center shrink-0">
              <span className="text-white font-bold">TR</span>
            </div>
            <span className="truncate">Timeless Resurfacing</span>
          </div>

          {isCollapsed && (
            <div className="w-full flex justify-center">
              <button
                onClick={toggleSidebar}
                className="w-8 h-8 rounded bg-[#0D9488] flex items-center justify-center shrink-0 hover:bg-teal-500 transition-colors"
                title="Expand Menu"
                aria-label="Expand sidebar"
                aria-expanded={false}
              >
                <span className="text-white font-bold" aria-hidden="true">TR</span>
              </button>
            </div>
          )}

          {!isCollapsed && (
            <button
              onClick={toggleSidebar}
              className="hidden md:flex text-slate-400 hover:text-white transition-colors"
              title="Collapse Menu"
              aria-label="Collapse sidebar"
              aria-expanded={true}
            >
              <PanelLeftClose className="w-5 h-5" aria-hidden="true" />
            </button>
          )}

          {!isCollapsed && (
            <button
              className="md:hidden text-slate-300 hover:text-white"
              onClick={closeMobile}
              aria-label="Close navigation menu"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto py-4 scrollbar-hide">
          {isGrouped && !isEditMode ? (
            <GroupedNav
              isCollapsed={isCollapsed}
              location={location}
              closeMobile={closeMobile}
            />
          ) : (
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="nav-items" direction="vertical">
                {(provided) => (
                  <nav
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="space-y-1 px-2"
                  >
                    {orderedNavItems.map((item, index) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.path;
                      return (
                        <Draggable key={item.id} draggableId={item.id} index={index} isDragDisabled={!isEditMode}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={cn(
                                "flex items-center rounded-lg transition-all",
                                snapshot.isDragging && "shadow-lg ring-2 ring-[#0D9488] ring-opacity-50 z-50 bg-[#1e335a]",
                                isEditMode ? "bg-white/5 border border-white/10 mb-1" : ""
                              )}
                            >
                              {isEditMode && (
                                <div
                                  {...provided.dragHandleProps}
                                  className={cn(
                                    "p-2 text-slate-400 hover:text-white cursor-grab active:cursor-grabbing",
                                    isCollapsed && "hidden"
                                  )}
                                >
                                  <GripVertical className="w-4 h-4" />
                                </div>
                              )}
                              <NavLink
                                to={item.path}
                                onClick={(e) => {
                                  if (isEditMode) e.preventDefault();
                                  else closeMobile();
                                }}
                                className={cn(
                                  "flex flex-1 items-center gap-3 rounded-lg py-2.5 text-sm font-medium transition-colors",
                                  !isEditMode && isActive
                                    ? "bg-[#0D9488] text-white"
                                    : !isEditMode
                                      ? "hover:bg-white/10 hover:text-white text-slate-300"
                                      : "text-slate-300 cursor-default",
                                  isCollapsed ? "justify-center px-0" : "px-3",
                                  isEditMode && !isCollapsed ? "pr-3 pl-1" : ""
                                )}
                                title={isCollapsed ? item.label : undefined}
                                aria-label={item.label}
                                aria-current={isActive ? 'page' : undefined}
                              >
                                <Icon className="w-5 h-5 shrink-0" aria-hidden="true" />
                                {!isCollapsed && <span className="truncate">{item.label}</span>}
                              </NavLink>
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </nav>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </div>

        <div className="p-4 border-t border-white/10 shrink-0 space-y-1">
          {/* Edit Order Toggle — only in flat mode */}
          {!isGrouped && (
            <div className={cn("flex items-center mb-2", isCollapsed ? "justify-center" : "justify-between px-3 py-2")}>
              {!isCollapsed && <span className="text-sm font-medium text-slate-300">Edit Menu Order</span>}
              <button
                onClick={handleEditModeToggle}
                className={cn(
                  "relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none",
                  isEditMode ? "bg-[#0D9488]" : "bg-slate-600",
                  isCollapsed && "mx-auto"
                )}
                title={isCollapsed ? "Toggle Edit Mode" : undefined}
                role="switch"
                aria-checked={isEditMode}
                aria-label={isEditMode ? "Exit nav reorder mode" : "Enter nav reorder mode"}
              >
                <span
                  className={cn(
                    "inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform",
                    isEditMode ? "translate-x-4" : "translate-x-1"
                  )}
                />
              </button>
            </div>
          )}

          {/* Settings — always visible, pinned above Sign Out */}
          <NavLink
            to="/settings"
            onClick={closeMobile}
            className={cn(
              "flex items-center gap-3 rounded-lg py-2.5 text-sm font-medium transition-colors",
              location.pathname === '/settings'
                ? "bg-[#0D9488] text-white"
                : "text-slate-300 hover:bg-white/10 hover:text-white",
              isCollapsed ? "justify-center px-0" : "px-3"
            )}
            title={isCollapsed ? "Settings" : undefined}
            aria-label="Settings"
            aria-current={location.pathname === '/settings' ? 'page' : undefined}
          >
            <Settings className="w-5 h-5 shrink-0" aria-hidden="true" />
            {!isCollapsed && <span>Settings</span>}
          </NavLink>

          <button
            onClick={signOut}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-colors",
              isCollapsed && "justify-center px-0"
            )}
            title={isCollapsed ? "Sign Out" : undefined}
            aria-label="Sign out"
          >
            <LogOut className="w-5 h-5 shrink-0" aria-hidden="true" />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50/50">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden text-slate-500 hover:text-slate-700"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              <Menu className="w-6 h-6" aria-hidden="true" />
            </button>
            <h1 className="text-xl font-semibold text-slate-800 capitalize">
              {location.pathname === '/' ? 'Dashboard' : location.pathname.slice(1).replace('-', ' ')}
            </h1>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <NotificationBell />
            <UserAvatar
              avatarUrl={user?.user_metadata?.avatar_url}
              name={user?.user_metadata?.full_name}
              email={user?.email}
              size="md"
            />
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto h-full">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
