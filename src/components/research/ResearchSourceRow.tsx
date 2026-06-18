'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ExternalLink, FileText } from 'lucide-react'
import { ITEM_TYPE_LABELS } from '@/types'
import type { ResearchItemType } from '@/types'

export interface ResearchSourceRowProps {
  id: string
  href: string
  title: string
  author: string
  description_excerpt: string
  cover_url: string
  external_url?: string | null
  item_type?: ResearchItemType | null
}

export default function ResearchSourceRow({
  id,
  title,
  author,
  description_excerpt,
  cover_url,
  external_url,
  item_type,
  href,
}: ResearchSourceRowProps) {
  return (
    <div className="flex items-start gap-4 px-4 py-4 bg-[var(--color-background)] dark:bg-[var(--color-dark-surface)] hover:bg-[var(--color-surface)] dark:hover:bg-[var(--color-dark-surface-hover)] transition-colors">
      {/* Cover — portrait 3:4 */}
      <Link href={href} className="shrink-0 block">
        <div className="relative rounded-lg overflow-hidden bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface-hover)]" style={{ width: 64, height: 85 }}>
          {cover_url ? (
            <Image
              src={cover_url}
              alt={title}
              fill
              className="object-cover"
              sizes="64px"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <FileText className="w-7 h-7 text-[var(--color-text-muted)] opacity-40" />
            </div>
          )}
        </div>
      </Link>

      {/* Body */}
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <div className="flex items-start justify-between gap-3">
          <Link
            href={href}
            className="font-display font-bold text-base text-[var(--color-text-primary)] dark:text-white hover:text-[var(--color-brand-teal)] dark:hover:text-[var(--color-brand-teal-light)] transition-colors leading-snug line-clamp-2"
          >
            {title}
          </Link>
          {item_type && (
            <span className="shrink-0 text-xs px-2 py-0.5 rounded-full bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface-hover)] text-[var(--color-text-muted)] border border-[var(--color-border)] dark:border-[var(--color-dark-border)]">
              {ITEM_TYPE_LABELS[item_type]}
            </span>
          )}
        </div>

        {author && (
          <p className="text-sm text-[var(--color-text-muted)]">{author}</p>
        )}

        {description_excerpt && (
          <p className="text-sm text-[var(--color-text-muted)] line-clamp-2 leading-relaxed">
            {description_excerpt}
          </p>
        )}

        <div className="flex items-center gap-3 pt-1">
          <Link
            href={href}
            className="text-sm font-medium text-[var(--color-brand-teal)] dark:text-white hover:underline"
          >
            View →
          </Link>
          {external_url && (
            <a
              href={external_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-brand-teal)] dark:hover:text-white transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              External Link
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
