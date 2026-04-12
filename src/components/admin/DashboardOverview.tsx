'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { FileText, CalendarDays, BookOpen, Handshake, Plus } from 'lucide-react'
import { mockDashboardStats, mockRecentActivity } from '@/lib/mock-data'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

// ── Stat cards ────────────────────────────────────────────────────────────────

const STAT_CARDS = [
  {
    label:    'Blog Posts',
    icon:     FileText,
    value:    mockDashboardStats.blogs.published,
    subLabel: 'published',
  },
  {
    label:    'Events',
    icon:     CalendarDays,
    value:    mockDashboardStats.events.upcoming,
    subLabel: 'upcoming',
  },
  {
    label:    'Reading List',
    icon:     BookOpen,
    value:    mockDashboardStats.readingList.published,
    subLabel: 'items',
  },
  {
    label:    'Partners',
    icon:     Handshake,
    value:    mockDashboardStats.partners.active,
    subLabel: 'active',
  },
]

// ── Quick actions ─────────────────────────────────────────────────────────────

const QUICK_ACTIONS = [
  { label: '+ New Blog',    href: '/admin/blogs/new' },
  { label: '+ New Event',   href: '/admin/events/new' },
  { label: '+ New Partner', href: '/admin/partners/new' },
]

// ── Activity type badge ───────────────────────────────────────────────────────

const TYPE_LABELS: Record<string, string> = {
  blog:         'Blog',
  event:        'Event',
  reading_list: 'Reading List',
}

const TYPE_COLORS: Record<string, string> = {
  blog:         'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  event:        'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  reading_list: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function DashboardOverview() {
  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h2 className="font-display text-2xl font-bold text-[var(--color-text-primary)] dark:text-[#e8ecec]">
          Welcome back
        </h2>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Here&apos;s what&apos;s happening on your site.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map((card) => {
          const Icon = card.icon
          return (
            <motion.div
              key={card.label}
              whileHover={{ y: -2 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="bg-[var(--color-background)] dark:bg-[var(--color-dark-surface)] border border-[var(--color-border)] dark:border-[var(--color-dark-border)] rounded-xl p-5 flex items-center gap-4"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--color-brand-teal)]/10 text-[var(--color-brand-teal)] dark:text-white shrink-0">
                <Icon size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-[var(--color-text-muted)] truncate">{card.label}</p>
                <p className="font-display text-2xl font-bold text-[var(--color-text-primary)] dark:text-[#e8ecec] leading-tight">
                  {card.value}
                </p>
                <p className="text-xs text-[var(--color-text-muted)]">{card.subLabel}</p>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Quick actions */}
      <div>
        <h3 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-3">
          Quick Actions
        </h3>
        <div className="flex flex-wrap gap-3">
          {QUICK_ACTIONS.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[var(--color-border)] dark:border-[var(--color-dark-border)] text-sm font-medium text-[var(--color-text-primary)] dark:text-[#e8ecec] hover:bg-[var(--color-surface-hover)] dark:hover:bg-[var(--color-dark-surface-hover)] transition-colors"
            >
              <Plus size={15} />
              {action.label.replace('+ ', '')}
            </Link>
          ))}
        </div>
      </div>

      {/* Recent activity */}
      <div>
        <h3 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-3">
          Recent Activity
        </h3>
        <div className="bg-[var(--color-background)] dark:bg-[var(--color-dark-surface)] border border-[var(--color-border)] dark:border-[var(--color-dark-border)] rounded-xl divide-y divide-[var(--color-border)] dark:divide-[var(--color-dark-border)]">
          {mockRecentActivity.map((item, i) => (
            <Link
              key={i}
              href={item.href}
              className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-[var(--color-surface-hover)] dark:hover:bg-[var(--color-dark-surface-hover)] transition-colors first:rounded-t-xl last:rounded-b-xl"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={cn(
                    'shrink-0 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
                    TYPE_COLORS[item.type]
                  )}
                >
                  {TYPE_LABELS[item.type]}
                </span>
                <span className="text-sm text-[var(--color-text-primary)] dark:text-[#e8ecec] truncate">{item.title}</span>
              </div>
              <span className="shrink-0 text-xs text-[var(--color-text-muted)]">
                {formatDate(item.date)}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
