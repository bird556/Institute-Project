'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { FileText, CalendarDays, BookOpen, Handshake, Inbox, Plus } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { DashboardData } from '@/actions/dashboard'

// ── Quick actions ─────────────────────────────────────────────────────────────

const QUICK_ACTIONS = [
  { label: 'New Blog',    href: '/admin/blogs/new' },
  { label: 'New Event',   href: '/admin/events/new' },
  { label: 'New Partner', href: '/admin/partners/new' },
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

export default function DashboardOverview({ data }: { data: DashboardData }) {
  const { stats, pendingSubmissions, recentActivity } = data

  const STAT_CARDS = [
    {
      label:    'Blog Posts',
      icon:     FileText,
      value:    stats.blogs,
      subLabel: 'published',
      urgent:   false,
    },
    {
      label:    'Events',
      icon:     CalendarDays,
      value:    stats.upcomingEvents,
      subLabel: 'upcoming',
      urgent:   false,
    },
    {
      label:    'Reading List',
      icon:     BookOpen,
      value:    stats.readingList,
      subLabel: 'items',
      urgent:   false,
    },
    {
      label:    'Partners',
      icon:     Handshake,
      value:    stats.partners,
      subLabel: 'active',
      urgent:   false,
    },
    {
      label:    'Submissions Pending',
      icon:     Inbox,
      value:    stats.pendingSubmissions,
      subLabel: 'need review',
      urgent:   stats.pendingSubmissions > 0,
      href:     '/admin/newsletter',
    },
  ]

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {STAT_CARDS.map((card) => {
          const Icon = card.icon
          const inner = (
            <motion.div
              key={card.label}
              whileHover={{ y: -2 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className={cn(
                'bg-[var(--color-background)] dark:bg-[var(--color-dark-surface)] border rounded-xl p-5 flex items-center gap-4',
                card.urgent
                  ? 'border-amber-400 dark:border-amber-500 ring-1 ring-amber-300 dark:ring-amber-600'
                  : 'border-[var(--color-border)] dark:border-[var(--color-dark-border)]',
              )}
            >
              <div className={cn(
                'flex items-center justify-center w-10 h-10 rounded-lg shrink-0',
                card.urgent
                  ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                  : 'bg-[var(--color-brand-teal)]/10 text-[var(--color-brand-teal)] dark:text-white',
              )}>
                <Icon size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-[var(--color-text-muted)] truncate">{card.label}</p>
                <p className={cn(
                  'font-display text-2xl font-bold leading-tight',
                  card.urgent
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-[var(--color-text-primary)] dark:text-[#e8ecec]',
                )}>
                  {card.value}
                </p>
                <p className="text-xs text-[var(--color-text-muted)]">{card.subLabel}</p>
              </div>
            </motion.div>
          )

          return card.href ? (
            <Link key={card.label} href={card.href} className="block">{inner}</Link>
          ) : (
            <div key={card.label}>{inner}</div>
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
              {action.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Pending newsletter submissions */}
      {stats.pendingSubmissions > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
              Pending Submissions
            </h3>
            <Link
              href="/admin/newsletter"
              className="text-xs text-[var(--color-brand-teal)] hover:underline"
            >
              View all →
            </Link>
          </div>
          <div className="bg-[var(--color-background)] dark:bg-[var(--color-dark-surface)] border border-amber-300 dark:border-amber-700 rounded-xl divide-y divide-[var(--color-border)] dark:divide-[var(--color-dark-border)] overflow-hidden">
            {pendingSubmissions.map((s) => (
              <Link
                key={s.id}
                href={`/admin/newsletter/submissions/${s.id}`}
                className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-[var(--color-surface-hover)] dark:hover:bg-[var(--color-dark-surface-hover)] transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className={cn(
                    'shrink-0 inline-flex items-center px-2 py-0.5 rounded text-xs font-bold',
                    s.type === 'research_call' ? 'bg-[var(--color-brand-teal)] text-white' :
                    s.type === 'research_note' ? 'bg-amber-500 text-white' :
                                                 'bg-purple-600 text-white',
                  )}>
                    {s.type === 'research_call' ? 'RC' : s.type === 'research_note' ? 'RN' : 'AC'}
                  </span>
                  <span className="text-sm text-[var(--color-text-primary)] dark:text-[#e8ecec] truncate">
                    {s.title}
                  </span>
                </div>
                <span className="shrink-0 text-xs text-[var(--color-text-muted)]">
                  Review →
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recent activity */}
      <div>
        <h3 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-3">
          Recent Activity
        </h3>
        {recentActivity.length === 0 ? (
          <p className="text-sm text-[var(--color-text-muted)]">No recent activity yet.</p>
        ) : (
          <div className="bg-[var(--color-background)] dark:bg-[var(--color-dark-surface)] border border-[var(--color-border)] dark:border-[var(--color-dark-border)] rounded-xl divide-y divide-[var(--color-border)] dark:divide-[var(--color-dark-border)]">
            {recentActivity.map((item, i) => (
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
        )}
      </div>
    </div>
  )
}
