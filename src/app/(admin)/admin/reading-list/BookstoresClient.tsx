'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { MoreVertical, PenLine, Trash2, Plus, Store, Search, X } from 'lucide-react'
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
import { deleteBookstore, toggleBookstorePublished } from '@/actions/bookstores'
import type { Bookstore } from '@/types'

type StatusFilter = 'all' | 'published' | 'drafts'
type SortOption = 'name_az' | 'name_za' | 'newest' | 'oldest'

const SORT_LABELS: Record<SortOption, string> = {
  name_az: 'Name A → Z',
  name_za: 'Name Z → A',
  newest:  'Date Added: Newest',
  oldest:  'Date Added: Oldest',
}

export interface BookstoreListItem extends Bookstore {
  photo_url: string | null
}

interface BookstoresClientProps {
  items: BookstoreListItem[]
  onNew: () => void
  creating: boolean
}

const PAGE_SIZE = 20

export default function BookstoresClient({ items: initial, onNew, creating }: BookstoresClientProps) {
  const router = useRouter()
  const [items, setItems] = useState(initial)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [sort, setSort] = useState<SortOption>('name_az')
  const [page, setPage] = useState(1)

  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  function resetPage() { setPage(1) }

  const filtered = items.filter((item) => {
    const q = query.toLowerCase()
    const matchesQuery =
      !q ||
      item.name.toLowerCase().includes(q) ||
      (item.province ?? '').toLowerCase().includes(q) ||
      (item.address ?? '').toLowerCase().includes(q)
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'published' && item.published) ||
      (statusFilter === 'drafts' && !item.published)
    return matchesQuery && matchesStatus
  })

  const sorted = [...filtered].sort((a, b) => {
    switch (sort) {
      case 'name_az': return a.name.localeCompare(b.name)
      case 'name_za': return b.name.localeCompare(a.name)
      case 'newest':  return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      case 'oldest':  return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      default:        return 0
    }
  })

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE)
  const paginated  = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const isFiltering = query !== '' || statusFilter !== 'all'

  async function handleDelete() {
    if (!deleteId) return
    setDeleting(true)
    const result = await deleteBookstore(deleteId)
    setDeleting(false)
    setDeleteId(null)
    if (!result.success) {
      toast.error(result.error ?? 'Could not delete bookstore.')
      return
    }
    setItems((prev) => prev.filter((item) => item.id !== deleteId))
    toast.success('Bookstore deleted.')
  }

  async function handleToggle(id: string, current: boolean) {
    setTogglingId(id)
    setItems((prev) => prev.map((item) => item.id === id ? { ...item, published: !current } : item))
    const result = await toggleBookstorePublished(id, !current)
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
        {/* Search + sort + filter bar */}
        <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)] pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); resetPage() }}
              placeholder="Search by name, province, or address…"
              className="w-full sm:w-80 pl-9 pr-8 h-9 text-sm rounded-lg border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-background)] dark:bg-[var(--color-dark-surface)] text-[var(--color-text-primary)] dark:text-[#e8ecec] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-teal)] transition-colors"
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

          <div className="flex gap-1 p-1 rounded-lg bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] w-fit">
            {(['all', 'published', 'drafts'] as StatusFilter[]).map((f) => (
              <button key={f} onClick={() => { setStatusFilter(f); resetPage() }} className={filterBtnClass(statusFilter === f)}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {isFiltering && (
          <p className="text-sm text-[var(--color-text-muted)] -mt-2">
            Showing {filtered.length} of {items.length} {items.length === 1 ? 'bookstore' : 'bookstores'}
          </p>
        )}

        {sorted.length === 0 ? (
          <EmptyState isFiltering={isFiltering} query={query} onClear={() => { setQuery(''); setStatusFilter('all'); resetPage() }} onNew={onNew} creating={creating} />
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
                  onClick={() => router.push(`/admin/bookstores/${item.id}`)}
                >
                  {item.photo_url ? (
                    <div className="relative h-12 w-12 rounded-md overflow-hidden shrink-0">
                      <Image src={item.photo_url} alt={item.name} fill className="object-cover" sizes="96px" quality={90} />
                    </div>
                  ) : (
                    <div className="h-12 w-12 rounded-md bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface-hover)] flex items-center justify-center shrink-0">
                      <Store className="h-5 w-5 text-[var(--color-text-muted)]" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[var(--color-text-primary)] dark:text-[#e8ecec] truncate">
                      {item.name || 'Untitled bookstore'}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      {item.address && (
                        <span className="text-sm text-[var(--color-text-muted)] truncate">
                          {item.address}
                        </span>
                      )}
                      {item.province && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface-hover)] text-[var(--color-text-muted)] border border-[var(--color-border)] dark:border-[var(--color-dark-border)] shrink-0">
                          {item.province}
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
                        <DropdownMenuItem onClick={() => router.push(`/admin/bookstores/${item.id}`)} className="cursor-pointer gap-2">
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
        title="Delete Bookstore"
        description="This action cannot be undone. The bookstore will be permanently removed."
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
        <Store className="h-6 w-6 text-[var(--color-text-muted)]" />
      </div>
      <div>
        <p className="font-medium text-[var(--color-text-primary)] dark:text-[#e8ecec]">
          {isFiltering ? `No results${query ? ` for "${query}"` : ''}` : 'No bookstores yet'}
        </p>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          {isFiltering ? 'Try a different search or clear the filters.' : 'Add your first bookstore to get started.'}
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
          Add your first bookstore
        </Button>
      )}
    </div>
  )
}
