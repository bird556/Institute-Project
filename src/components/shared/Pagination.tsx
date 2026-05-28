'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (p: number) => void
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  const btnBase =
    'inline-flex items-center justify-center h-9 min-w-[2.25rem] px-2 rounded-lg text-sm font-medium transition-colors'

  const pageNumbers = buildPageNumbers(page, totalPages)

  return (
    <div className="flex items-center justify-center gap-1 mt-12">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className={cn(
          btnBase,
          'gap-1 px-3',
          page <= 1
            ? 'text-[var(--color-text-muted)] opacity-40 cursor-not-allowed'
            : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface)] dark:hover:bg-[var(--color-dark-surface)] cursor-pointer',
        )}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Previous</span>
      </button>

      {pageNumbers.map((n, i) =>
        n === '…' ? (
          <span
            key={`ellipsis-${i}`}
            className="h-9 min-w-[2.25rem] flex items-center justify-center text-sm text-[var(--color-text-muted)]"
          >
            …
          </span>
        ) : (
          <button
            key={n}
            onClick={() => onPageChange(n as number)}
            className={cn(
              btnBase,
              n === page
                ? 'bg-[var(--color-brand-teal)] text-white cursor-default'
                : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface)] dark:hover:bg-[var(--color-dark-surface)] cursor-pointer',
            )}
            aria-current={n === page ? 'page' : undefined}
          >
            {n}
          </button>
        ),
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className={cn(
          btnBase,
          'gap-1 px-3',
          page >= totalPages
            ? 'text-[var(--color-text-muted)] opacity-40 cursor-not-allowed'
            : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface)] dark:hover:bg-[var(--color-dark-surface)] cursor-pointer',
        )}
        aria-label="Next page"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  )
}

function buildPageNumbers(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const pages: (number | '…')[] = [1]

  if (current > 3) pages.push('…')

  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  for (let i = start; i <= end; i++) pages.push(i)

  if (current < total - 2) pages.push('…')
  pages.push(total)

  return pages
}
