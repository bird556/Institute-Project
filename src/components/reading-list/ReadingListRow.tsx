'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ExternalLink, BookOpen, Mail, Video } from 'lucide-react'

const TYPE_LABELS: Record<string, string> = {
  book:      'Book',
  thesis_ma: 'Thesis (M.A.)',
  thesis_phd: 'Thesis (Ph.D.)',
  bookstore: 'Bookstore',
}

const EXTERNAL_LINK_LABELS: Record<string, string> = {
  bookstore:  'Visit Website',
  thesis_ma:  'Read Thesis',
  thesis_phd: 'Read Thesis',
}

export interface ReadingListRowProps {
  id: string
  title: string
  author: string
  description_excerpt: string
  cover_url: string
  external_url?: string | null
  video_url?: string | null
  email?: string | null
  author_region?: 'canadian' | 'world' | null
  item_type?: 'book' | 'thesis_ma' | 'thesis_phd' | 'bookstore' | null
}

export default function ReadingListRow({
  id,
  title,
  author,
  description_excerpt,
  cover_url,
  external_url,
  video_url,
  email,
  author_region,
  item_type,
}: ReadingListRowProps) {
  return (
    <div className="flex items-start gap-4 px-4 py-4 bg-[var(--color-background)] dark:bg-[var(--color-dark-surface)] hover:bg-[var(--color-surface)] dark:hover:bg-[var(--color-dark-surface-hover)] transition-colors">
      {/* Cover — portrait 3:4 */}
      <Link href={`/reading-list/${id}`} className="shrink-0 block">
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
              <BookOpen className="w-7 h-7 text-[var(--color-text-muted)] opacity-40" />
            </div>
          )}
        </div>
      </Link>

      {/* Body */}
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <div className="flex items-start justify-between gap-3">
          <Link
            href={`/reading-list/${id}`}
            className="font-display font-bold text-base text-[var(--color-text-primary)] dark:text-white hover:text-[var(--color-brand-teal)] dark:hover:text-[var(--color-brand-teal-light)] transition-colors leading-snug line-clamp-2"
          >
            {title}
          </Link>
          {item_type && TYPE_LABELS[item_type] && (
            <span className="shrink-0 text-xs px-2 py-0.5 rounded-full bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface-hover)] text-[var(--color-text-muted)] border border-[var(--color-border)] dark:border-[var(--color-dark-border)]">
              {TYPE_LABELS[item_type]}
            </span>
          )}
        </div>

        {(author || author_region) && (
          <div className="flex items-center gap-2 flex-wrap">
            {author && (
              <p className="text-sm text-[var(--color-text-muted)]">{author}</p>
            )}
            {author_region && (
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface-hover)] text-[var(--color-text-muted)] border border-[var(--color-border)] dark:border-[var(--color-dark-border)]">
                {author_region === 'canadian' ? 'Canadian' : 'International'}
              </span>
            )}
          </div>
        )}

        {description_excerpt && (
          <p className="text-sm text-[var(--color-text-muted)] line-clamp-2 leading-relaxed">
            {description_excerpt}
          </p>
        )}

        <div className="flex items-center gap-3 pt-1">
          <Link
            href={`/reading-list/${id}`}
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
              {(item_type && EXTERNAL_LINK_LABELS[item_type]) ?? 'External Link'}
            </a>
          )}
          {video_url && (
            <a
              href={video_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-brand-teal)] dark:hover:text-white transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Video className="w-3.5 h-3.5" />
              Watch Video
            </a>
          )}
          {email && (
            <a
              href={`mailto:${email}`}
              className="inline-flex items-center gap-1 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-brand-teal)] dark:hover:text-white transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Mail className="w-3.5 h-3.5" />
              Email
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
