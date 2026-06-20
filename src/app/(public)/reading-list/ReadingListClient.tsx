'use client'

import { useState, useMemo } from 'react'
import ReadingListRows from './ReadingListRows'
import Pagination from '@/components/shared/Pagination'
import type { ReadingListRowProps } from '@/components/reading-list/ReadingListRow'

const PAGE_SIZE = 16

export interface ReadingListItem extends ReadingListRowProps {
  created_at: string
  author_region: 'canadian' | 'world' | null
  item_type: 'book' | 'thesis_ma' | 'thesis_phd' | 'bookstore' | null
}

type SortOption = 'author_az' | 'author_za' | 'newest' | 'oldest' | 'az' | 'za'

const SORT_LABELS: Record<SortOption, string> = {
  author_az: 'Author A → Z',
  author_za: 'Author Z → A',
  newest:    'Date Added (Newest)',
  oldest:    'Date Added (Oldest)',
  az:        'Title A → Z',
  za:        'Title Z → A',
}

const selectClass =
  'text-sm rounded-lg border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-background)] dark:bg-[var(--color-dark-surface)] text-[var(--color-text-primary)] dark:text-[#e8ecec] px-3 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-teal)]'

export default function ReadingListClient({ items }: { items: ReadingListItem[] }) {
  const [sort, setSort]               = useState<SortOption>('author_az')
  const [authorFilter, setAuthorFilter] = useState('all')
  const [regionFilter, setRegionFilter] = useState<'all' | 'canadian' | 'world'>('all')
  const [typeFilter, setTypeFilter]     = useState<'all' | 'book' | 'thesis_ma' | 'thesis_phd' | 'thesis' | 'bookstore'>('all')
  const [page, setPage]               = useState(1)

  const authors = useMemo(
    () => [...new Set(items.map((i) => i.author).filter(Boolean))].sort(),
    [items],
  )

  const hasRegionData = useMemo(() => items.some((i) => i.author_region), [items])
  const hasTypeData   = useMemo(() => items.some((i) => i.item_type), [items])

  const displayed = useMemo(() => {
    let result = items.filter((i) => {
      if (authorFilter !== 'all' && i.author !== authorFilter) return false
      if (regionFilter !== 'all' && i.author_region !== regionFilter) return false
      if (typeFilter !== 'all') {
        if (typeFilter === 'thesis') {
          if (i.item_type !== 'thesis_ma' && i.item_type !== 'thesis_phd') return false
        } else {
          if (i.item_type !== typeFilter) return false
        }
      }
      return true
    })

    switch (sort) {
      case 'author_az': result = [...result].sort((a, b) => (a.author ?? '').trim().localeCompare((b.author ?? '').trim())); break
      case 'author_za': result = [...result].sort((a, b) => (b.author ?? '').trim().localeCompare((a.author ?? '').trim())); break
      case 'newest':    result = [...result].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()); break
      case 'oldest':    result = [...result].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()); break
      case 'az':        result = [...result].sort((a, b) => a.title.localeCompare(b.title)); break
      case 'za':        result = [...result].sort((a, b) => b.title.localeCompare(a.title)); break
    }

    return result
  }, [items, sort, authorFilter, regionFilter, typeFilter])

  const totalPages = Math.ceil(displayed.length / PAGE_SIZE)
  const paginated  = displayed.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const isFiltered = authorFilter !== 'all' || regionFilter !== 'all' || typeFilter !== 'all'

  function resetPage() { setPage(1) }

  return (
    <div className="space-y-6">
      {/* Region tabs — shown when at least one item has region data */}
      {hasRegionData && (
        <div className="flex gap-1 p-1 rounded-lg bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] w-fit">
          {([
            { value: 'all',      label: 'All' },
            { value: 'canadian', label: 'Canadian' },
            { value: 'world',    label: 'International' },
          ] as { value: typeof regionFilter; label: string }[]).map(({ value, label }) => (
            <button
              key={value}
              onClick={() => { setRegionFilter(value); resetPage() }}
              className={`px-4 py-1.5 text-sm rounded-md cursor-pointer transition-colors ${
                regionFilter === value
                  ? 'bg-[var(--color-brand-teal)] text-white font-medium'
                  : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] dark:hover:bg-[var(--color-dark-surface-hover)]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Sort */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-[var(--color-text-muted)] font-medium whitespace-nowrap">
            Sort by
          </label>
          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value as SortOption); resetPage() }}
            className={selectClass}
          >
            {(Object.keys(SORT_LABELS) as SortOption[]).map((key) => (
              <option key={key} value={key}>{SORT_LABELS[key]}</option>
            ))}
          </select>
        </div>

        {/* Author filter — only shown when 2+ distinct authors exist */}
        {authors.length >= 2 && (
          <div className="flex items-center gap-2">
            <label className="text-sm text-[var(--color-text-muted)] font-medium whitespace-nowrap">
              Author
            </label>
            <select
              value={authorFilter}
              onChange={(e) => { setAuthorFilter(e.target.value); resetPage() }}
              className={selectClass}
            >
              <option value="all">All authors</option>
              {authors.map((author) => (
                <option key={author} value={author}>{author}</option>
              ))}
            </select>
          </div>
        )}

        {/* Type filter */}
        {hasTypeData && (
          <div className="flex items-center gap-2">
            <label className="text-sm text-[var(--color-text-muted)] font-medium whitespace-nowrap">
              Type
            </label>
            <select
              value={typeFilter}
              onChange={(e) => { setTypeFilter(e.target.value as typeof typeFilter); resetPage() }}
              className={selectClass}
            >
              <option value="all">All types</option>
              <option value="book">Books</option>
              <option value="thesis">Theses</option>
              <option value="thesis_ma">Thesis (M.A.)</option>
              <option value="thesis_phd">Thesis (Ph.D.)</option>
              <option value="bookstore">Bookstores</option>
            </select>
          </div>
        )}

        {/* Result count */}
        <span className="ml-auto text-sm text-[var(--color-text-muted)]">
          {isFiltered
            ? `${displayed.length} of ${items.length} items`
            : `${items.length} item${items.length !== 1 ? 's' : ''}`}
        </span>
      </div>

      {/* Rows */}
      {displayed.length === 0 ? (
        <p className="text-[var(--color-text-muted)] py-8">No items match your filter.</p>
      ) : (
        <>
          <ReadingListRows items={paginated} />
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  )
}
