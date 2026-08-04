'use client'

import { useState, useMemo } from 'react'
import { ChevronDown } from 'lucide-react'
import BookstoreRows from '@/components/reading-list/BookstoreRows'
import Pagination from '@/components/shared/Pagination'
import type { BookstoreRowProps } from '@/components/reading-list/BookstoreRow'

const PAGE_SIZE = 16

type BookstoreSortOption = 'name_az' | 'name_za'

const BOOKSTORE_SORT_LABELS: Record<BookstoreSortOption, string> = {
  name_az: 'Name A → Z',
  name_za: 'Name Z → A',
}

const selectClass =
  'text-sm rounded-lg border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-background)] dark:bg-[var(--color-dark-surface)] text-[var(--color-text-primary)] dark:text-[#e8ecec] px-3 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-teal)]'

export default function BookstoreSection({
  items,
  defaultOpen,
  collapsible = true,
}: {
  items: BookstoreRowProps[]
  defaultOpen: boolean
  collapsible?: boolean
}) {
  const [open, setOpen]                 = useState(collapsible ? defaultOpen : true)
  const [sort, setSort]                 = useState<BookstoreSortOption>('name_az')
  const [provinceFilter, setProvinceFilter] = useState('all')
  const [page, setPage]                 = useState(1)

  const provinces = useMemo(
    () => [...new Set(items.map((i) => i.province).filter(Boolean))].sort() as string[],
    [items],
  )

  const displayed = useMemo(() => {
    let result = items.filter((i) => provinceFilter === 'all' || i.province === provinceFilter)
    switch (sort) {
      case 'name_az': result = [...result].sort((a, b) => a.name.localeCompare(b.name)); break
      case 'name_za': result = [...result].sort((a, b) => b.name.localeCompare(a.name)); break
    }
    return result
  }, [items, sort, provinceFilter])

  const totalPages = Math.ceil(displayed.length / PAGE_SIZE)
  const paginated  = displayed.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const isFiltered = provinceFilter !== 'all'

  function resetPage() { setPage(1) }

  return (
    <section className="rounded-2xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] overflow-hidden">
      <div
        onClick={collapsible ? () => setOpen((v) => !v) : undefined}
        className={`w-full flex items-center justify-between gap-3 px-5 py-4 bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] ${collapsible ? 'cursor-pointer' : ''}`}
      >
        <span className="font-display text-xl font-bold text-[var(--color-brand-teal)] dark:text-white">
          Bookstores
        </span>
        <span className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
          {items.length} {items.length === 1 ? 'store' : 'stores'}
          {collapsible && (
            <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
          )}
        </span>
      </div>

      {open && (
        <div className="p-5 space-y-6 border-t border-[var(--color-border)] dark:border-[var(--color-dark-border)]">
          {items.length === 0 ? (
            <p className="text-[var(--color-text-muted)] py-4">No bookstores yet — check back soon.</p>
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-[var(--color-text-muted)] font-medium whitespace-nowrap">
                    Sort by
                  </label>
                  <select
                    value={sort}
                    onChange={(e) => { setSort(e.target.value as BookstoreSortOption); resetPage() }}
                    className={selectClass}
                  >
                    {(Object.keys(BOOKSTORE_SORT_LABELS) as BookstoreSortOption[]).map((key) => (
                      <option key={key} value={key}>{BOOKSTORE_SORT_LABELS[key]}</option>
                    ))}
                  </select>
                </div>

                {provinces.length >= 2 && (
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-[var(--color-text-muted)] font-medium whitespace-nowrap">
                      Province
                    </label>
                    <select
                      value={provinceFilter}
                      onChange={(e) => { setProvinceFilter(e.target.value); resetPage() }}
                      className={selectClass}
                    >
                      <option value="all">All provinces</option>
                      {provinces.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                )}

                <span className="ml-auto text-sm text-[var(--color-text-muted)]">
                  {isFiltered
                    ? `${displayed.length} of ${items.length} stores`
                    : `${items.length} store${items.length !== 1 ? 's' : ''}`}
                </span>
              </div>

              {displayed.length === 0 ? (
                <p className="text-[var(--color-text-muted)] py-8">No bookstores match your filter.</p>
              ) : (
                <>
                  <BookstoreRows items={paginated} />
                  <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
                </>
              )}
            </>
          )}
        </div>
      )}
    </section>
  )
}
