'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { formatDate } from '@/lib/utils'

export interface EditionRow {
  id: string
  title: string
  slug: string
  published_at: string | null
  totalSubmissions: number
  rcCount: number
  rnCount: number
  acCount: number
}

interface Props {
  editions: EditionRow[]
}

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
}

export function EditionList({ editions }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      variants={container}
      initial="hidden"
      animate={inView ? 'show' : 'hidden'}
      className="space-y-8"
    >
      {editions.map((edition) => (
        <motion.article
          key={edition.id}
          variants={item}
          className="flex gap-6 rounded-2xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] p-6 hover:border-[var(--color-brand-teal-light)] dark:hover:border-[var(--color-brand-teal)] transition-colors group"
        >
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <Link
                  href={`/newsletter/${edition.slug}`}
                  className="font-display text-xl font-bold text-[var(--color-brand-teal)] dark:text-white hover:underline group-hover:text-[var(--color-brand-teal-dark)] dark:group-hover:text-[var(--color-brand-teal-light)] transition-colors"
                >
                  {edition.title}
                </Link>
                {edition.published_at && (
                  <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
                    Published {formatDate(edition.published_at)}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-3 text-sm">
              <span className="text-[var(--color-text-muted)]">
                {edition.totalSubmissions}{' '}
                {edition.totalSubmissions === 1 ? 'submission' : 'submissions'}
              </span>
              {edition.rcCount > 0 && (
                <span className="px-2 py-0.5 rounded bg-[var(--color-brand-teal)] text-white text-xs font-medium">
                  RC: {edition.rcCount}
                </span>
              )}
              {edition.rnCount > 0 && (
                <span className="px-2 py-0.5 rounded bg-amber-500 text-white text-xs font-medium">
                  RN: {edition.rnCount}
                </span>
              )}
              {edition.acCount > 0 && (
                <span className="px-2 py-0.5 rounded bg-purple-600 text-white text-xs font-medium">
                  AC: {edition.acCount}
                </span>
              )}
            </div>

            <Link
              href={`/newsletter/${edition.slug}`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-brand-teal)] dark:text-white hover:text-[var(--color-brand-teal-dark)] dark:hover:text-white/80 transition-colors"
            >
              Read Edition →
            </Link>
          </div>
        </motion.article>
      ))}
    </motion.div>
  )
}
