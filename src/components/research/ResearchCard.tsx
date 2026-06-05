'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Megaphone, ScrollText, BarChart2, Building2, Send, type LucideIcon } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { RESEARCH_CATEGORY_LABELS } from '@/types'
import type { ResearchCategory } from '@/types'

interface ResearchCardProps {
  id: string
  title: string
  excerpt: string | null
  cover_url: string
  category: ResearchCategory
  published_at: string | null
  region?: 'canadian' | 'world' | null
  external_url?: string | null
}

const CATEGORY_ICONS: Record<ResearchCategory, LucideIcon> = {
  'announcements':       Megaphone,
  'recent-publications': ScrollText,
  'reports':             BarChart2,
  'research-institutes': Building2,
  'call-for-papers':     Send,
}

export default function ResearchCard({
  id,
  title,
  excerpt,
  cover_url,
  category,
  published_at,
  region,
  external_url,
}: ResearchCardProps) {
  const PlaceholderIcon = CATEGORY_ICONS[category] ?? Megaphone

  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
      <Link
        href={`/research/${category}/${id}`}
        className="group flex flex-col h-full rounded-2xl overflow-hidden bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] border border-[var(--color-border)] dark:border-[var(--color-dark-border)] hover:shadow-lg transition-shadow"
      >
        {cover_url ? (
          <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16/9' }}>
            <Image
              src={cover_url}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        ) : (
          <div
            className="w-full flex items-center justify-center bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface-hover)]"
            style={{ aspectRatio: '16/9' }}
          >
            <PlaceholderIcon
              className="h-14 w-14 text-[var(--color-brand-teal)] dark:text-[var(--color-brand-teal-light)] opacity-40"
            />
          </div>
        )}

        <div className="flex flex-col flex-1 p-5 gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center w-fit px-2 py-0.5 rounded-full text-xs font-medium bg-[var(--color-brand-teal)] text-white">
              {RESEARCH_CATEGORY_LABELS[category]}
            </span>
            {region && (
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                region === 'canadian'
                  ? 'border-[var(--color-brand-teal)] text-[var(--color-brand-teal)] dark:text-white dark:border-white/30'
                  : 'border-[var(--color-border)] dark:border-[var(--color-dark-border)] text-[var(--color-text-muted)]'
              }`}>
                {region === 'canadian' ? 'Canadian' : 'International'}
              </span>
            )}
          </div>

          <h3 className="font-display text-lg font-bold text-[var(--color-text-primary)] dark:text-white group-hover:text-[var(--color-brand-teal)] dark:group-hover:text-[var(--color-brand-teal-light)] transition-colors leading-snug">
            {title}
          </h3>

          {excerpt && (
            <p className="text-sm text-[var(--color-text-muted)] line-clamp-3 flex-1">
              {excerpt}
            </p>
          )}

          {published_at && (
            <p className="text-xs text-[var(--color-text-muted)] mt-auto pt-2">
              {formatDate(published_at)}
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  )
}
