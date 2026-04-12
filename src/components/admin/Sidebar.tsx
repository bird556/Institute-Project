'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  CalendarDays,
  BookOpen,
  Handshake,
  Home,
  Info,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { logoutAction } from '@/actions/auth';
import { useSidebar } from './AdminShell';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  exact?: boolean;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      {
        label: 'Dashboard',
        href: '/admin',
        icon: LayoutDashboard,
        exact: true,
      },
    ],
  },
  {
    label: 'Content',
    items: [
      { label: 'Blogs', href: '/admin/blogs', icon: FileText },
      { label: 'Events', href: '/admin/events', icon: CalendarDays },
      { label: 'Reading List', href: '/admin/reading-list', icon: BookOpen },
      { label: 'Partners', href: '/admin/partners', icon: Handshake },
    ],
  },
  {
    label: 'Pages',
    items: [
      { label: 'Home', href: '/admin/home', icon: Home },
      { label: 'About', href: '/admin/about', icon: Info },
    ],
  },
  {
    label: 'Settings',
    items: [{ label: 'Settings', href: '/admin/settings', icon: Settings }],
  },
];

const NAV_LINK_BASE =
  'flex items-center gap-3 px-2 py-2 rounded-lg text-sm font-medium transition-colors';
const NAV_LINK_ACTIVE = 'bg-[var(--color-brand-teal)] text-white';
const NAV_LINK_INACTIVE =
  'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)] dark:hover:bg-[var(--color-dark-surface-hover)] dark:hover:text-[#e8ecec]';
const BTN_BASE =
  'flex w-full items-center gap-3 px-2 py-2 rounded-lg text-sm font-medium text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)] dark:hover:bg-[var(--color-dark-surface-hover)] dark:hover:text-[#e8ecec] transition-colors cursor-pointer';

export function Sidebar() {
  const pathname = usePathname();
  const { collapsed, toggleCollapsed } = useSidebar();

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col fixed inset-y-0 left-0 z-30 overflow-hidden bg-[var(--color-background)] dark:bg-[var(--color-background)] border-r border-[var(--color-border)] dark:border-[var(--color-dark-border)] transition-[width] duration-300 ease-out',
        collapsed ? 'w-16' : 'w-64',
      )}
    >
      {/* Logo */}
      <div className="flex items-center h-14 px-4 border-b border-[var(--color-border)] dark:border-[var(--color-dark-border)] shrink-0">
        {!collapsed && (
          <span className="font-display font-extrabold text-[var(--color-brand-teal)] dark:text-white truncate">
            Institute
          </span>
        )}
      </div>

      {/* Nav groups */}
      <nav className="flex-1 overflow-y-auto py-4 space-y-6 px-2">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            {!collapsed && (
              <p className="px-2 mb-1 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                {group.label}
              </p>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.href, item.exact);
                const Icon = item.icon;
                const link = (
                  <Link
                    href={item.href}
                    className={cn(
                      NAV_LINK_BASE,
                      active ? NAV_LINK_ACTIVE : NAV_LINK_INACTIVE,
                    )}
                  >
                    <Icon className="shrink-0" size={18} />
                    {!collapsed && (
                      <span className="truncate">{item.label}</span>
                    )}
                  </Link>
                );

                return (
                  <li key={item.href}>
                    {collapsed ? (
                      <Tooltip>
                        <TooltipTrigger asChild>{link}</TooltipTrigger>
                        <TooltipContent side="right">
                          {item.label}
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      link
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer: logout + collapse toggle */}
      <div className="shrink-0 border-t border-[var(--color-border)] dark:border-[var(--color-dark-border)] p-2 space-y-0.5">
        {/* Logout */}
        {collapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <button onClick={() => logoutAction()} className={BTN_BASE}>
                <LogOut className="shrink-0" size={18} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Sign out</TooltipContent>
          </Tooltip>
        ) : (
          <button onClick={() => logoutAction()} className={BTN_BASE}>
            <LogOut className="shrink-0" size={18} />
            <span>Sign out</span>
          </button>
        )}

        {/* Collapse toggle */}
        <button onClick={toggleCollapsed} className={BTN_BASE}>
          {collapsed ? (
            <ChevronRight className="shrink-0" size={18} />
          ) : (
            <>
              <ChevronLeft className="shrink-0" size={18} />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
