'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { formatDate } from '@/lib/utils'

interface WellnessCardProps {
  id: string
  title: string
  excerpt: string | null
  cover_url: string
  tags: string[]
  published_at: string | null
}

export default function WellnessCard({
  id,
  title,
  excerpt,
  cover_url,
  tags,
  published_at,
}: WellnessCardProps) {
  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
      <Link
        href={`/health-wellness/${id}`}
        className="group flex flex-col h-full rounded-2xl overflow-hidden bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] border border-[var(--color-border)] dark:border-[var(--color-dark-border)] hover:shadow-lg transition-shadow"
      >
        {/* Cover image */}
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
            className="w-full bg-[var(--color-brand-teal)] opacity-10"
            style={{ aspectRatio: '16/9' }}
          />
        )}

        {/* Content */}
        <div className="flex flex-col flex-1 p-5 gap-3">
          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[var(--color-brand-teal)] text-white"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h3 className="font-display text-lg font-bold text-[var(--color-text-primary)] dark:text-white group-hover:text-[var(--color-brand-teal)] dark:group-hover:text-[var(--color-brand-teal-light)] transition-colors leading-snug">
            {title}
          </h3>

          {/* Excerpt */}
          {excerpt && (
            <p className="text-sm text-[var(--color-text-muted)] line-clamp-3 flex-1">
              {excerpt}
            </p>
          )}

          {/* Date */}
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
