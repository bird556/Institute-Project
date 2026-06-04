'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { toast } from 'sonner'
import { BookOpen, Star, X, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Pagination from '@/components/shared/Pagination'
import { setBookOfTheMonth } from '@/actions/reading-list'

interface PickerItem {
  id: string
  title: string
  author: string | null
  author_region: 'canadian' | 'world' | null
  cover_url: string | null
}

interface BookOfMonthClientProps {
  items: PickerItem[]
  currentId: string | null
}

type RegionTab = 'all' | 'canadian' | 'world'

type SortOption =
  | 'author_az'
  | 'author_za'
  | 'title_az'
  | 'title_za'
  | 'region'

const SORT_LABELS: Record<SortOption, string> = {
  author_az: 'Author A → Z',
  author_za: 'Author Z → A',
  title_az:  'Title A → Z',
  title_za:  'Title Z → A',
  region:    'Region',
}

const PAGE_SIZE = 15

const selectClass =
  'text-sm rounded-lg border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-background)] dark:bg-[var(--color-dark-surface)] text-[var(--color-text-primary)] dark:text-[#e8ecec] px-3 h-9 cursor-pointer focus:outline-none focus:border-[var(--color-brand-teal)] transition-colors'

export default function BookOfMonthClient({ items, currentId }: BookOfMonthClientProps) {
  const [selectedId, setSelectedId] = useState<string | null>(currentId)
  const [saving, setSaving] = useState(false)
  const [page, setPage] = useState(1)
  const [query, setQuery] = useState('')
  const [regionTab, setRegionTab] = useState<RegionTab>('all')
  const [sort, setSort] = useState<SortOption>('author_az')

  const hasRegionData = useMemo(() => items.some((i) => i.author_region), [items])

  const filtered = useMemo(() => {
    let result = items.filter((item) => {
      const q = query.toLowerCase()
      if (q && !item.title.toLowerCase().includes(q) && !(item.author ?? '').toLowerCase().includes(q)) return false
      if (regionTab !== 'all' && item.author_region !== regionTab) return false
      return true
    })

    result = [...result].sort((a, b) => {
      switch (sort) {
        case 'author_az': return (a.author ?? '').trim().localeCompare((b.author ?? '').trim())
        case 'author_za': return (b.author ?? '').trim().localeCompare((a.author ?? '').trim())
        case 'title_az':  return a.title.localeCompare(b.title)
        case 'title_za':  return b.title.localeCompare(a.title)
        case 'region':    return (a.author_region ?? 'zzz').localeCompare(b.author_region ?? 'zzz')
        default:          return 0
      }
    })

    return result
  }, [items, query, regionTab, sort])

  function resetPage() { setPage(1) }

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const selectedItem = items.find((i) => i.id === selectedId)
  const selectedIndexInFiltered = selectedId ? filtered.findIndex((i) => i.id === selectedId) : -1
  const selectedPage = selectedIndexInFiltered >= 0
    ? Math.ceil((selectedIndexInFiltered + 1) / PAGE_SIZE)
    : null

  async function handleSelect(id: string) {
    const next = selectedId === id ? null : id
    setSaving(true)
    const result = await setBookOfTheMonth(next)
    setSaving(false)
    if (!result.success) {
      toast.error(result.error ?? 'Failed to update.')
      return
    }
    setSelectedId(next)
    toast.success(next ? 'Book of the Month updated.' : 'Book of the Month cleared.')
  }

  async function handleClear() {
    setSaving(true)
    const result = await setBookOfTheMonth(null)
    setSaving(false)
    if (!result.success) {
      toast.error(result.error ?? 'Failed to clear.')
      return
    }
    setSelectedId(null)
    toast.success('Book of the Month cleared.')
  }

  const tabClass = (active: boolean) =>
    `px-4 py-1.5 text-sm rounded-md cursor-pointer transition-colors ${
      active
        ? 'bg-[var(--color-brand-teal)] text-white font-medium'
        : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] dark:hover:bg-[var(--color-dark-surface-hover)]'
    }`

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-[var(--color-brand-teal)] dark:text-white flex items-center gap-2">
            <Star className="h-6 w-6 fill-[hsl(35_60%_50%)] text-[hsl(35_60%_50%)]" />
            Book of the Month
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            Click any item to set it as Book of the Month. Click again to deselect.
          </p>
        </div>
        {selectedId && (
          <Button
            variant="outline"
            onClick={handleClear}
            disabled={saving}
            className="cursor-pointer gap-1.5 text-[var(--color-text-muted)] border-[var(--color-border)] dark:border-[var(--color-dark-border)]"
          >
            <X className="h-4 w-4" />
            Clear selection
          </Button>
        )}
      </div>

      {/* Current selection banner */}
      {selectedId && (
        <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg bg-[hsl(35_60%_50%/0.1)] border border-[hsl(35_60%_50%/0.3)] text-sm text-[hsl(35_60%_40%)] dark:text-[hsl(35_60%_70%)]">
          <div className="flex items-center gap-2 min-w-0">
            <Star className="h-4 w-4 fill-current shrink-0" />
            <span className="truncate">
              <strong>{selectedItem?.title ?? 'Selected item'}</strong> is currently featured as Book of the Month.
            </span>
          </div>
          {selectedPage !== null && selectedPage !== page && (
            <button
              onClick={() => setPage(selectedPage)}
              className="text-xs font-medium underline shrink-0 cursor-pointer hover:no-underline"
            >
              Jump to page {selectedPage}
            </button>
          )}
        </div>
      )}

      {/* Empty state */}
      {items.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center rounded-xl border border-dashed border-[var(--color-border)] dark:border-[var(--color-dark-border)]">
          <BookOpen className="h-8 w-8 text-[var(--color-text-muted)]" />
          <div>
            <p className="font-medium text-[var(--color-text-primary)] dark:text-[#e8ecec]">No published items yet</p>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">Publish at least one reading list item to set a Book of the Month.</p>
          </div>
        </div>
      )}

      {items.length > 0 && (
        <>
          {/* Region tabs */}
          {hasRegionData && (
            <div className="flex gap-1 p-1 rounded-lg bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] w-fit">
              {([
                { value: 'all',      label: 'All' },
                { value: 'canadian', label: 'Canadian' },
                { value: 'world',    label: 'International' },
              ] as { value: RegionTab; label: string }[]).map(({ value, label }) => (
                <button key={value} onClick={() => { setRegionTab(value); resetPage() }} className={tabClass(regionTab === value)}>
                  {label}
                </button>
              ))}
            </div>
          )}

          {/* Search + sort bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)] pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); resetPage() }}
                placeholder="Search by title or author…"
                className="w-full sm:w-72 pl-9 pr-8 h-9 text-sm rounded-lg border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-background)] dark:bg-[var(--color-dark-surface)] text-[var(--color-text-primary)] dark:text-[#e8ecec] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-teal)] transition-colors"
              />
              {query && (
                <button
                  onClick={() => { setQuery(''); resetPage() }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value as SortOption); resetPage() }}
              className={selectClass}
            >
              {(Object.keys(SORT_LABELS) as SortOption[]).map((key) => (
                <option key={key} value={key}>{SORT_LABELS[key]}</option>
              ))}
            </select>

            <span className="self-center text-sm text-[var(--color-text-muted)] ml-auto">
              {filtered.length} of {items.length} item{items.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* List */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center rounded-xl border border-dashed border-[var(--color-border)] dark:border-[var(--color-dark-border)]">
              <BookOpen className="h-7 w-7 text-[var(--color-text-muted)]" />
              <p className="text-sm text-[var(--color-text-muted)]">No results — try a different search or filter.</p>
              <button onClick={() => { setQuery(''); setRegionTab('all'); resetPage() }} className="text-sm text-[var(--color-brand-teal)] hover:underline cursor-pointer">
                Clear filters
              </button>
            </div>
          ) : (
            <>
              <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] overflow-hidden">
                {paginated.map((item) => {
                  const selected = selectedId === item.id
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item.id)}
                      disabled={saving}
                      className={`w-full flex items-center gap-4 px-4 py-3 border-b last:border-b-0 text-left transition-colors cursor-pointer focus:outline-none ${
                        selected
                          ? 'border-2 border-[hsl(35_60%_50%)] bg-[hsl(35_60%_50%/0.05)] dark:bg-[hsl(35_60%_50%/0.08)]'
                          : 'border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-background)] dark:bg-[var(--color-dark-surface)] hover:bg-[var(--color-surface)] dark:hover:bg-[var(--color-dark-surface-hover)]'
                      }`}
                    >
                      {/* Thumbnail */}
                      {item.cover_url ? (
                        <div className="relative h-16 w-12 rounded-md overflow-hidden shrink-0">
                          <Image src={item.cover_url} alt={item.title} fill className="object-cover" sizes="48px" />
                        </div>
                      ) : (
                        <div className="h-16 w-12 rounded-md bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface-hover)] flex items-center justify-center shrink-0">
                          <BookOpen className="h-5 w-5 text-[var(--color-text-muted)]" />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-[var(--color-text-primary)] dark:text-[#e8ecec] truncate">
                          {item.title}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          {item.author && (
                            <p className="text-sm text-[var(--color-text-muted)] truncate">{item.author}</p>
                          )}
                          {item.author_region && (
                            <span className="text-xs px-1.5 py-0.5 rounded bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface-hover)] text-[var(--color-text-muted)] border border-[var(--color-border)] dark:border-[var(--color-dark-border)] shrink-0">
                              {item.author_region === 'canadian' ? 'Canadian' : 'International'}
                            </span>
                          )}
                        </div>
                      </div>

                      {selected && (
                        <div className="flex items-center gap-1.5 shrink-0 px-2.5 py-1 rounded-full bg-[hsl(35_60%_50%/0.15)] border border-[hsl(35_60%_50%/0.4)]">
                          <Star className="h-3.5 w-3.5 fill-[hsl(35_60%_50%)] text-[hsl(35_60%_50%)]" />
                          <span className="text-xs font-semibold text-[hsl(35_60%_40%)] dark:text-[hsl(35_60%_70%)] whitespace-nowrap">
                            Book of the Month
                          </span>
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>

              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </>
          )}
        </>
      )}
    </div>
  )
}
