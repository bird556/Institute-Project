'use client'

import { useState, useMemo } from 'react'
import DirectoryGrid from './DirectoryGrid'
import Pagination from '@/components/shared/Pagination'
import type { DirectoryCardProps } from './DirectoryCard'
import { DIRECTORY_MODE_LABELS, type DirectoryMode } from '@/types'

const PAGE_SIZE = 16

type ModeFilter = 'all' | DirectoryMode

const selectClass =
  'text-sm rounded-lg border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-background)] dark:bg-[var(--color-dark-surface)] text-[var(--color-text-primary)] dark:text-[#e8ecec] px-3 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-teal)]'

export default function DirectoryListClient({ entries }: { entries: DirectoryCardProps[] }) {
  const [modeFilter, setModeFilter] = useState<ModeFilter>('all')
  const [page, setPage]             = useState(1)

  const hasModes = useMemo(() => entries.some((e) => e.mode), [entries])

  const displayed = useMemo(() => {
    if (modeFilter === 'all') return entries
    return entries.filter((e) => e.mode === modeFilter)
  }, [entries, modeFilter])

  const totalPages = Math.ceil(displayed.length / PAGE_SIZE)
  const paginated  = displayed.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const isFiltered = modeFilter !== 'all'

  return (
    <div className="space-y-6">
      {hasModes && (
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-sm text-[var(--color-text-muted)] font-medium whitespace-nowrap">
              Mode
            </label>
            <select
              value={modeFilter}
              onChange={(e) => { setModeFilter(e.target.value as ModeFilter); setPage(1) }}
              className={selectClass}
            >
              <option value="all">All</option>
              {(Object.keys(DIRECTORY_MODE_LABELS) as DirectoryMode[]).map((m) => (
                <option key={m} value={m}>{DIRECTORY_MODE_LABELS[m]}</option>
              ))}
            </select>
          </div>
          <span className="ml-auto text-sm text-[var(--color-text-muted)]">
            {isFiltered
              ? `${displayed.length} of ${entries.length} entries`
              : `${entries.length} ${entries.length === 1 ? 'entry' : 'entries'}`}
          </span>
        </div>
      )}

      {displayed.length === 0 ? (
        <p className="text-[var(--color-text-muted)] py-8">No entries match your filter.</p>
      ) : (
        <>
          <DirectoryGrid entries={paginated} />
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  )
}
