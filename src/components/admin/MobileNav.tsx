'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, FileText, CalendarDays, Handshake,
  BookOpen, Home, Info, Target, Settings, Newspaper,
  Calendar, List, Mail, Heart, Star, Menu, X, LogOut,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { logoutAction } from '@/actions/auth'

interface NavItem {
  label: string
  href: string
  icon: LucideIcon
  exact?: boolean
}

interface NavGroup {
  label: string
  items: NavItem[]
}

const BOTTOM_TABS: NavItem[] = [
  { label: 'Dashboard', href: '/admin',          icon: LayoutDashboard, exact: true },
  { label: 'Blogs',     href: '/admin/blogs',    icon: FileText },
  { label: 'Events',    href: '/admin/events',   icon: CalendarDays },
  { label: 'Partners',  href: '/admin/partners', icon: Handshake },
]

const DRAWER_GROUPS: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard',    href: '/admin',             icon: LayoutDashboard, exact: true },
    ],
  },
  {
    label: 'Content',
    items: [
      { label: 'Blogs',             href: '/admin/blogs',           icon: FileText },
      { label: 'Events',            href: '/admin/events',          icon: CalendarDays },
      { label: 'Reading List',      href: '/admin/reading-list',                     icon: BookOpen },
      { label: 'Book of the Month', href: '/admin/reading-list/book-of-the-month', icon: Star },
      { label: 'Partners',          href: '/admin/partners',        icon: Handshake },
      { label: 'Newsletter',        href: '/admin/newsletter',      icon: Newspaper },
      { label: 'Health & Wellness', href: '/admin/health-wellness', icon: Heart },
    ],
  },
  {
    label: 'Pages',
    items: [
      { label: 'Home',              href: '/admin/home',               icon: Home },
      { label: 'About',             href: '/admin/about',              icon: Info },
      { label: 'Mission',           href: '/admin/mission',            icon: Target },
      { label: 'Blogs Page',             href: '/admin/pages/blogs',            icon: FileText },
      { label: 'Events Page',            href: '/admin/pages/events',           icon: Calendar },
      { label: 'Newsletter Page',        href: '/admin/pages/newsletter',       icon: Mail },
      { label: 'Reading List Page',      href: '/admin/pages/reading-list',     icon: List },
      { label: 'Partners Page',          href: '/admin/pages/partners',         icon: Handshake },
      { label: 'Health & Wellness Page', href: '/admin/pages/health-wellness',  icon: Heart },
    ],
  },
  {
    label: 'Settings',
    items: [
      { label: 'Settings', href: '/admin/settings', icon: Settings },
    ],
  },
]

export function MobileNav() {
  const pathname = usePathname()
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Listen for the custom event dispatched by AdminHeader's hamburger button
  useEffect(() => {
    const handler = () => setDrawerOpen(true)
    window.addEventListener('open-mobile-nav', handler)
    return () => window.removeEventListener('open-mobile-nav', handler)
  }, [])

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  function closeDrawer() {
    setDrawerOpen(false)
  }

  return (
    <>
      {/* ── Bottom tab bar ────────────────────────────────── */}
      <nav className="flex lg:hidden fixed bottom-0 inset-x-0 z-30 h-16 bg-[var(--color-background)] dark:bg-[var(--color-dark-background)] border-t border-[var(--color-border)] dark:border-[var(--color-dark-border)] pb-safe">
        <div className="flex w-full">
          {BOTTOM_TABS.map((tab) => {
            const active = isActive(tab.href, tab.exact)
            const Icon = tab.icon
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  'flex flex-1 flex-col items-center justify-center gap-0.5 text-xs font-medium transition-colors',
                  active
                    ? 'text-[var(--color-brand-teal)] dark:text-white'
                    : 'text-[var(--color-text-muted)]'
                )}
              >
                <Icon size={20} />
                <span>{tab.label}</span>
              </Link>
            )
          })}

          {/* More button */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex flex-1 flex-col items-center justify-center gap-0.5 text-xs font-medium text-[var(--color-text-muted)] transition-colors cursor-pointer"
          >
            <Menu size={20} />
            <span>More</span>
          </button>
        </div>
      </nav>

      {/* ── Slide-out drawer ──────────────────────────────── */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={closeDrawer}
            />

            {/* Drawer panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 w-72 bg-[var(--color-background)] dark:bg-[var(--color-dark-background)] shadow-xl flex flex-col lg:hidden"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between h-14 px-4 border-b border-[var(--color-border)] dark:border-[var(--color-dark-border)] shrink-0">
                <span className="font-display font-extrabold text-[var(--color-brand-teal)] dark:text-white">
                  Institute
                </span>
                <button
                  onClick={closeDrawer}
                  className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] dark:hover:bg-[var(--color-dark-surface-hover)] transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Drawer nav */}
              <nav className="flex-1 overflow-y-auto py-4 space-y-6 px-2">
                {DRAWER_GROUPS.map((group) => (
                  <div key={group.label}>
                    <p className="px-2 mb-1 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                      {group.label}
                    </p>
                    <ul className="space-y-0.5">
                      {group.items.map((item) => {
                        const active = isActive(item.href, item.exact)
                        const Icon = item.icon
                        return (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              onClick={closeDrawer}
                              className={cn(
                                'flex items-center gap-3 px-2 py-2 rounded-lg text-sm font-medium transition-colors',
                                active
                                  ? 'bg-[var(--color-brand-teal)] text-white'
                                  : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)] dark:hover:bg-[var(--color-dark-surface-hover)] dark:hover:text-[#e8ecec]'
                              )}
                            >
                              <Icon className="shrink-0" size={18} />
                              <span>{item.label}</span>
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                ))}
              </nav>

              {/* Drawer footer: logout */}
              <div className="shrink-0 border-t border-[var(--color-border)] dark:border-[var(--color-dark-border)] p-2">
                <button
                  onClick={() => logoutAction()}
                  className="flex w-full items-center gap-3 px-2 py-2 rounded-lg text-sm font-medium text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)] dark:hover:bg-[var(--color-dark-surface-hover)] dark:hover:text-[#e8ecec] transition-colors cursor-pointer"
                >
                  <LogOut className="shrink-0" size={18} />
                  <span>Sign out</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
