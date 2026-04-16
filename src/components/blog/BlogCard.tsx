'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { formatDate } from '@/lib/utils'

export interface BlogCardProps {
  id: string
  title: string
  slug: string
  excerpt: string
  cover_url: string
  published_at: string
}

export default function BlogCard({
  id,
  title,
  excerpt,
  cover_url,
  published_at,
}: BlogCardProps) {
  return (
    <motion.div
      className="group h-full"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={`/blogs/${id}`}
        className="flex flex-col h-full rounded-2xl overflow-hidden bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] border border-[var(--color-border)] dark:border-[var(--color-dark-border)] hover:shadow-lg hover:border-[var(--color-brand-teal-light)] dark:hover:border-[var(--color-brand-teal)] transition-all duration-300"
      >
        {/* Cover image */}
        <div className="relative aspect-video w-full overflow-hidden">
          {cover_url ? (
            <Image
              src={cover_url}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-brand-teal)] to-[var(--color-brand-teal-light)]" />
          )}
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 p-5 space-y-2">
          {published_at && (
            <p className="text-sm text-[var(--color-text-muted)]">
              {formatDate(published_at)}
            </p>
          )}
          <h2 className="font-display text-xl font-bold text-[var(--color-text-primary)] dark:text-white line-clamp-2 leading-snug">
            {title}
          </h2>
          <p className="text-sm text-[var(--color-text-muted)] line-clamp-3 leading-relaxed flex-1">
            {excerpt}
          </p>
          <p className="text-sm font-medium text-[var(--color-accent)] group-hover:underline pt-1">
            Read More →
          </p>
        </div>
      </Link>
    </motion.div>
  )
}
