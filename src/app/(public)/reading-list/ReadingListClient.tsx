'use client'

import { useState, useMemo } from 'react'
import ReadingListGrid from './ReadingListGrid'
import Pagination from '@/components/shared/Pagination'
import type { ReadingListCardProps } from '@/components/reading-list/ReadingListCard'

const PAGE_SIZE = 16

export interface ReadingListItem extends ReadingListCardProps {
  created_at: string
  author_region: 'canadian' | 'world' | null
  item_type: 'book' | 'thesis_ma' | 'thesis_phd' | null
}

type SortOption = 'newest' | 'oldest' | 'az' | 'za'

const SORT_LABELS: Record<SortOption, string> = {
  newest: 'Date Added (Newest)',
  oldest: 'Date Added (Oldest)',
  az:     'Title A → Z',
  za:     'Title Z → A',
}

const selectClass =
  'text-sm rounded-lg border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-background)] dark:bg-[var(--color-dark-surface)] text-[var(--color-text-primary)] dark:text-[#e8ecec] px-3 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-teal)]'

export default function ReadingListClient({ items }: { items: ReadingListItem[] }) {
  const [sort, setSort]               = useState<SortOption>('newest')
  const [authorFilter, setAuthorFilter] = useState('all')
  const [regionFilter, setRegionFilter] = useState<'all' | 'canadian' | 'world'>('all')
  const [typeFilter, setTypeFilter]     = useState<'all' | 'book' | 'thesis_ma' | 'thesis_phd' | 'thesis'>('all')
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
      case 'newest': result = [...result].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()); break
      case 'oldest': result = [...result].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()); break
      case 'az':     result = [...result].sort((a, b) => a.title.localeCompare(b.title)); break
      case 'za':     result = [...result].sort((a, b) => b.title.localeCompare(a.title)); break
    }

    return result
  }, [items, sort, authorFilter, regionFilter, typeFilter])

  const totalPages = Math.ceil(displayed.length / PAGE_SIZE)
  const paginated  = displayed.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const isFiltered = authorFilter !== 'all' || regionFilter !== 'all' || typeFilter !== 'all'

  function resetPage() { setPage(1) }

  return (
    <div className="space-y-6">
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

        {/* Region filter */}
        {hasRegionData && (
          <div className="flex items-center gap-2">
            <label className="text-sm text-[var(--color-text-muted)] font-medium whitespace-nowrap">
              Region
            </label>
            <select
              value={regionFilter}
              onChange={(e) => { setRegionFilter(e.target.value as typeof regionFilter); resetPage() }}
              className={selectClass}
            >
              <option value="all">All regions</option>
              <option value="canadian">Canadian</option>
              <option value="world">International</option>
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

      {/* Grid */}
      {displayed.length === 0 ? (
        <p className="text-[var(--color-text-muted)] py-8">No items match your filter.</p>
      ) : (
        <>
          <ReadingListGrid items={paginated} />
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  )
}
