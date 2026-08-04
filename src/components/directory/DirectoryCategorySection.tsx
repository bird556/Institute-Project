'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ArrowRight } from 'lucide-react'
import DirectoryListClient from './DirectoryListClient'
import type { DirectoryCardProps } from './DirectoryCard'

export default function DirectoryCategorySection({
  title,
  viewAllHref,
  entries,
  defaultOpen,
}: {
  title: string
  viewAllHref: string
  entries: DirectoryCardProps[]
  defaultOpen: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <section className="rounded-2xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] cursor-pointer"
      >
        <span className="font-display text-xl font-bold text-[var(--color-brand-teal)] dark:text-white">
          {title}
        </span>
        <span className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
          {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
          <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
        </span>
      </button>

      {open && (
        <div className="p-5 space-y-4 border-t border-[var(--color-border)] dark:border-[var(--color-dark-border)]">
          {entries.length === 0 ? (
            <p className="text-[var(--color-text-muted)] py-4">No entries yet — check back soon.</p>
          ) : (
            <>
              <DirectoryListClient entries={entries} />
              <Link
                href={viewAllHref}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-brand-teal)] dark:text-white hover:underline"
              >
                View {title} page <ArrowRight size={14} />
              </Link>
            </>
          )}
        </div>
      )}
    </section>
  )
}
