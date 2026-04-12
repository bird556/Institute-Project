'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Sidebar } from './Sidebar';
import { AdminHeader } from './AdminHeader';
import { MobileNav } from './MobileNav';
import { cn } from '@/lib/utils';

const STORAGE_KEY = 'admin-sidebar-collapsed';

interface SidebarContextValue {
  collapsed: boolean;
  toggleCollapsed: () => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function useSidebar(): SidebarContextValue {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error('useSidebar must be used inside <AdminShell>');
  return ctx;
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  // Default false on both server and client first render to avoid hydration
  // mismatch. localStorage is read post-mount and may flip this to true.
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) === 'true') setCollapsed(true);
  }, []);

  function toggleCollapsed() {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  }

  return (
    <SidebarContext.Provider value={{ collapsed, toggleCollapsed }}>
      <div className="min-h-screen flex bg-[var(--color-surface)] dark:bg-[var(--color-dark-background)]">
        <Sidebar />
        <div
          className={cn(
            'flex-1 flex flex-col min-w-0 transition-[margin] duration-300 ease-out',
            collapsed ? 'lg:ml-16' : 'lg:ml-64',
          )}
        >
          <AdminHeader />
          <main className="flex-1 p-4 md:p-6 lg:p-8 pb-20 lg:pb-8 bg-[var(--color-background)]">
            {children}
          </main>
        </div>
        <MobileNav />
      </div>
    </SidebarContext.Provider>
  );
}
