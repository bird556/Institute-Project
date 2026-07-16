'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { MoreVertical, PenLine, Trash2, Plus, BookOpen, Search, X } from 'lucide-react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import PublishPill from '@/components/admin/PublishPill'
import Pagination from '@/components/shared/Pagination'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { createReadingListItem, deleteReadingListItem, toggleReadingListPublished } from '@/actions/reading-list'
import type { ReadingListItem } from '@/types'

type StatusFilter = 'all' | 'published' | 'drafts'
type RegionTab = 'all' | 'canadian' | 'world'
type GroupTab = 'bibliography' | 'theses'

type AdminSortOption =
  | 'author_az'
  | 'author_za'
  | 'newest'
  | 'oldest'
  | 'title_az'
  | 'title_za'
  | 'region'
  | 'type'

const SORT_LABELS: Record<AdminSortOption, string> = {
  author_az: 'Author A → Z',
  author_za: 'Author Z → A',
  newest:    'Date Added: Newest',
  oldest:    'Date Added: Oldest',
  title_az:  'Title A → Z',
  title_za:  'Title Z → A',
  region:    'Region',
  type:      'Type',
}

interface ReadingListListItem extends ReadingListItem {
  cover_url: string | null
}

interface ReadingListClientProps {
  items: ReadingListListItem[]
}

const PAGE_SIZE = 20

export default function ReadingListClient({ items: initial }: ReadingListClientProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [items, setItems] = useState(initial)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [groupTab, setGroupTab] = useState<GroupTab>('bibliography')
  const [regionTab, setRegionTab] = useState<RegionTab>('all')
  const [sort, setSort] = useState<AdminSortOption>('author_az')
  const [page, setPage] = useState(1)

  const hasRegionData = initial.some((i) => i.author_region)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  function resetPage() { setPage(1) }

  const filtered = items.filter((item) => {
    const q = query.toLowerCase()
    const matchesQuery =
      !q ||
      item.title.toLowerCase().includes(q) ||
      (item.author ?? '').toLowerCase().includes(q)
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'published' && item.published) ||
      (statusFilter === 'drafts' && !item.published)
    const matchesRegion =
      regionTab === 'all' || item.author_region === regionTab
    const isThesis = item.item_type === 'thesis_ma' || item.item_type === 'thesis_phd'
    const matchesGroup = groupTab === 'bibliography' ? !isThesis : isThesis
    return matchesQuery && matchesStatus && matchesRegion && matchesGroup
  })

  const sorted = [...filtered].sort((a, b) => {
    switch (sort) {
      case 'author_az': return (a.author ?? '').trim().localeCompare((b.author ?? '').trim())
      case 'author_za': return (b.author ?? '').trim().localeCompare((a.author ?? '').trim())
      case 'newest':    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      case 'oldest':    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      case 'title_az':  return a.title.localeCompare(b.title)
      case 'title_za':  return b.title.localeCompare(a.title)
      case 'region':    return (a.author_region ?? 'zzz').localeCompare(b.author_region ?? 'zzz')
      case 'type':      return (a.item_type ?? 'zzz').localeCompare(b.item_type ?? 'zzz')
      default:          return 0
    }
  })

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE)
  const paginated  = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const isFiltering = query !== '' || statusFilter !== 'all'

  async function handleNew() {
    startTransition(async () => {
      const result = await createReadingListItem(groupTab === 'theses' ? 'thesis_ma' : null)
      if (!result.success || !result.data) {
        toast.error(result.error ?? 'Could not create item.')
        return
      }
      router.push(`/admin/reading-list/${result.data.id}`)
    })
  }

  async function handleDelete() {
    if (!deleteId) return
    setDeleting(true)
    const result = await deleteReadingListItem(deleteId)
    setDeleting(false)
    setDeleteId(null)
    if (!result.success) {
      toast.error(result.error ?? 'Could not delete item.')
      return
    }
    setItems((prev) => prev.filter((item) => item.id !== deleteId))
    toast.success('Item deleted.')
  }

  async function handleToggle(id: string, current: boolean) {
    setTogglingId(id)
    setItems((prev) => prev.map((item) => item.id === id ? { ...item, published: !current } : item))
    const result = await toggleReadingListPublished(id, !current)
    setTogglingId(null)
    if (!result.success) {
      setItems((prev) => prev.map((item) => item.id === id ? { ...item, published: current } : item))
      toast.error(result.error ?? 'Failed to update status.')
    }
  }

  const filterBtnClass = (active: boolean) =>
    `px-3 py-1.5 text-sm rounded-md cursor-pointer transition-colors ${
      active
        ? 'bg-[var(--color-brand-teal)] text-white'
        : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] dark:hover:bg-[var(--color-dark-surface-hover)]'
    }`

  const selectClass =
    'text-sm rounded-lg border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-background)] dark:bg-[var(--color-dark-surface)] text-[var(--color-text-primary)] dark:text-[#e8ecec] px-3 h-9 cursor-pointer focus:outline-none focus:border-[var(--color-brand-teal)] transition-colors'

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold text-[var(--color-brand-teal)] dark:text-white">
            Reading List
          </h1>
          <Button
            onClick={handleNew}
            disabled={isPending}
            className="cursor-pointer bg-[var(--color-brand-teal)] hover:bg-[var(--color-brand-teal-dark)] text-white gap-1.5"
          >
            <Plus className="h-4 w-4" />
            New Item
          </Button>
        </div>

        {/* Bibliography / Theses tabs */}
        <div className="flex gap-1 p-1 rounded-lg bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] w-fit">
          {([
            { value: 'bibliography', label: 'Bibliography' },
            { value: 'theses',       label: 'MA and PhD Theses' },
          ] as { value: GroupTab; label: string }[]).map(({ value, label }) => (
            <button
              key={value}
              onClick={() => { setGroupTab(value); resetPage() }}
              className={`px-4 py-1.5 text-sm rounded-md cursor-pointer transition-colors ${
                groupTab === value
                  ? 'bg-[var(--color-brand-teal)] text-white font-medium'
                  : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] dark:hover:bg-[var(--color-dark-surface-hover)]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Region tabs */}
        {hasRegionData && (
          <div className="flex gap-1 p-1 rounded-lg bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] w-fit">
            {([
              { value: 'all',      label: 'All' },
              { value: 'canadian', label: 'Canadian' },
              { value: 'world',    label: 'International' },
            ] as { value: RegionTab; label: string }[]).map(({ value, label }) => (
              <button
                key={value}
                onClick={() => { setRegionTab(value); resetPage() }}
                className={`px-4 py-1.5 text-sm rounded-md cursor-pointer transition-colors ${
                  regionTab === value
                    ? 'bg-[var(--color-brand-teal)] text-white font-medium'
                    : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] dark:hover:bg-[var(--color-dark-surface-hover)]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Search + sort + filter bar */}
        <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
          {/* Search */}
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

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value as AdminSortOption); resetPage() }}
            className={selectClass}
          >
            {(Object.keys(SORT_LABELS) as AdminSortOption[]).map((key) => (
              <option key={key} value={key}>{SORT_LABELS[key]}</option>
            ))}
          </select>

          {/* Status filter pills */}
          <div className="flex gap-1 p-1 rounded-lg bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] w-fit">
            {(['all', 'published', 'drafts'] as StatusFilter[]).map((f) => (
              <button key={f} onClick={() => { setStatusFilter(f); resetPage() }} className={filterBtnClass(statusFilter === f)}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Result count */}
        {isFiltering && (
          <p className="text-sm text-[var(--color-text-muted)] -mt-2">
            Showing {filtered.length} of {items.length} {items.length === 1 ? 'item' : 'items'}
          </p>
        )}

        {/* List */}
        {sorted.length === 0 ? (
          <EmptyState isFiltering={isFiltering} query={query} onClear={() => { setQuery(''); setStatusFilter('all'); resetPage() }} onNew={handleNew} creating={isPending} />
        ) : (
          <>
            <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] overflow-hidden">
              {paginated.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.25 }}
                  className="flex items-center gap-4 px-4 py-3 border-b last:border-b-0 border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-background)] dark:bg-[var(--color-dark-surface)] hover:bg-[var(--color-surface)] dark:hover:bg-[var(--color-dark-surface-hover)] transition-colors cursor-pointer"
                  onClick={() => router.push(`/admin/reading-list/${item.id}`)}
                >
                  {/* Thumbnail — portrait 64×48 */}
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
                        <span className="text-sm text-[var(--color-text-muted)] truncate">
                          {item.author}
                        </span>
                      )}
                      {item.author_region && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface-hover)] text-[var(--color-text-muted)] border border-[var(--color-border)] dark:border-[var(--color-dark-border)] shrink-0">
                          {item.author_region === 'canadian' ? 'Canadian' : 'International'}
                        </span>
                      )}
                    </div>
                  </div>

                  <div onClick={(e) => e.stopPropagation()}>
                    <PublishPill
                      published={item.published}
                      toggling={togglingId === item.id}
                      onClick={() => handleToggle(item.id, item.published)}
                    />
                  </div>

                  <div onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <DropdownMenuTrigger className="p-1 rounded cursor-pointer text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] dark:hover:text-[#e8ecec] hover:bg-[var(--color-surface-hover)] dark:hover:bg-[var(--color-dark-surface-hover)] transition-colors">
                            <MoreVertical className="h-4 w-4" />
                          </DropdownMenuTrigger>
                        </TooltipTrigger>
                        <TooltipContent side="left"><p>More actions</p></TooltipContent>
                      </Tooltip>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/admin/reading-list/${item.id}`)} className="cursor-pointer gap-2">
                          <PenLine className="h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setDeleteId(item.id)} className="cursor-pointer gap-2 text-red-600 focus:text-red-600">
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </motion.div>
              ))}
            </div>

            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Item"
        description="This action cannot be undone. The reading list item will be permanently removed."
        onConfirm={handleDelete}
        loading={deleting}
      />
    </>
  )
}

function EmptyState({
  isFiltering,
  query,
  onClear,
  onNew,
  creating,
}: {
  isFiltering: boolean
  query: string
  onClear: () => void
  onNew: () => void
  creating: boolean
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center rounded-xl border border-dashed border-[var(--color-border)] dark:border-[var(--color-dark-border)]">
      <div className="h-12 w-12 rounded-full bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] flex items-center justify-center">
        <BookOpen className="h-6 w-6 text-[var(--color-text-muted)]" />
      </div>
      <div>
        <p className="font-medium text-[var(--color-text-primary)] dark:text-[#e8ecec]">
          {isFiltering ? `No results${query ? ` for "${query}"` : ''}` : 'No reading list items yet'}
        </p>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          {isFiltering ? 'Try a different search or clear the filters.' : 'Add your first item to get started.'}
        </p>
      </div>
      {isFiltering ? (
        <Button variant="ghost" onClick={onClear} className="cursor-pointer text-[var(--color-brand-teal)]">
          Clear filters
        </Button>
      ) : (
        <Button
          onClick={onNew}
          disabled={creating}
          className="cursor-pointer bg-[var(--color-brand-teal)] hover:bg-[var(--color-brand-teal-dark)] text-white gap-1.5"
        >
          <Plus className="h-4 w-4" />
          Add your first item
        </Button>
      )}
    </div>
  )
}
