'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { logoutAction } from '@/actions/auth';
import { useSidebar } from './AdminShell';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  ADMIN_NAV_GROUPS,
  NAV_LINK_BASE,
  NAV_LINK_ACTIVE,
  NAV_LINK_INACTIVE,
  isNavActive,
  type NavItem,
  type NavSubgroup,
} from './admin-nav';
import { NavSubgroupSection } from './NavSubgroupSection';

const BTN_BASE =
  'flex w-full items-center gap-3 px-2 py-2 rounded-lg text-sm font-medium text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)] dark:hover:bg-[var(--color-dark-surface-hover)] dark:hover:text-[#e8ecec] transition-colors cursor-pointer';

function WithTooltip({ show, label, children }: { show: boolean; label: string; children: React.ReactElement }) {
  if (!show) return children;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}

function SidebarLink({ item, active, collapsed }: { item: NavItem; active: boolean; collapsed: boolean }) {
  const Icon = item.icon;
  return (
    <li>
      <WithTooltip show={collapsed} label={item.label}>
        <Link
          href={item.href}
          title={collapsed ? undefined : item.label}
          className={cn(NAV_LINK_BASE, active ? NAV_LINK_ACTIVE : NAV_LINK_INACTIVE)}
        >
          <Icon className="shrink-0" size={18} />
          {!collapsed && <span className="truncate">{item.label}</span>}
        </Link>
      </WithTooltip>
    </li>
  );
}

// Collapsed sidebar: a subgroup is one icon — clicking it expands the sidebar with that section open
function CollapsedSubgroup({ subgroup, active, onOpen }: { subgroup: NavSubgroup; active: boolean; onOpen: () => void }) {
  const Icon = subgroup.icon;
  return (
    <li>
      <WithTooltip show label={subgroup.label}>
        <button type="button" onClick={onOpen} className={cn(NAV_LINK_BASE, 'w-full cursor-pointer', active ? NAV_LINK_ACTIVE : NAV_LINK_INACTIVE)}>
          <Icon className="shrink-0" size={18} />
        </button>
      </WithTooltip>
    </li>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { collapsed, toggleCollapsed } = useSidebar();
  const [pendingOpen, setPendingOpen] = useState<string | null>(null);

  const currentTab = useSearchParams().get('tab');
  const isActive = (item: NavItem) => isNavActive(pathname, item, currentTab);

  function openSubgroupFromCollapsed(label: string) {
    setPendingOpen(label);
    toggleCollapsed();
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
        {ADMIN_NAV_GROUPS.map((group) => (
          <div key={group.label}>
            {!collapsed && (
              <p className="px-2 mb-1 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                {group.label}
              </p>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => (
                <SidebarLink key={item.href} item={item} active={isActive(item)} collapsed={collapsed} />
              ))}
              {group.subgroups?.map((sg) =>
                collapsed ? (
                  <CollapsedSubgroup
                    key={sg.label}
                    subgroup={sg}
                    active={sg.items.some(isActive)}
                    onOpen={() => openSubgroupFromCollapsed(sg.label)}
                  />
                ) : (
                  <NavSubgroupSection key={sg.label} subgroup={sg} isActive={isActive} defaultOpen={pendingOpen === sg.label} />
                ),
              )}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer: logout + collapse toggle */}
      <div className="shrink-0 border-t border-[var(--color-border)] dark:border-[var(--color-dark-border)] p-2 space-y-0.5">
        <WithTooltip show={collapsed} label="Sign out">
          <button onClick={() => logoutAction()} className={BTN_BASE}>
            <LogOut className="shrink-0" size={18} />
            {!collapsed && <span>Sign out</span>}
          </button>
        </WithTooltip>

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
