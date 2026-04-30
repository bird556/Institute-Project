'use client'

import { useState, useMemo } from 'react'
import ReadingListGrid from './ReadingListGrid'
import type { ReadingListCardProps } from '@/components/reading-list/ReadingListCard'

export interface ReadingListItem extends ReadingListCardProps {
  created_at: string
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
  const [sort, setSort] = useState<SortOption>('newest')
  const [authorFilter, setAuthorFilter] = useState('all')

  const authors = useMemo(
    () => [...new Set(items.map((i) => i.author).filter(Boolean))].sort(),
    [items],
  )

  const displayed = useMemo(() => {
    let result = authorFilter === 'all'
      ? items
      : items.filter((i) => i.author === authorFilter)

    switch (sort) {
      case 'newest':
        result = [...result].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        break
      case 'oldest':
        result = [...result].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        break
      case 'az':
        result = [...result].sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'za':
        result = [...result].sort((a, b) => b.title.localeCompare(a.title))
        break
    }

    return result
  }, [items, sort, authorFilter])

  const isFiltered = authorFilter !== 'all'

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
            onChange={(e) => setSort(e.target.value as SortOption)}
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
              onChange={(e) => setAuthorFilter(e.target.value)}
              className={selectClass}
            >
              <option value="all">All authors</option>
              {authors.map((author) => (
                <option key={author} value={author}>{author}</option>
              ))}
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
        <ReadingListGrid items={displayed} />
      )}
    </div>
  )
}
