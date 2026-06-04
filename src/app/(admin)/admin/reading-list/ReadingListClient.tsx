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
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { createReadingListItem, deleteReadingListItem, toggleReadingListPublished } from '@/actions/reading-list'
import { formatDate } from '@/lib/utils'
import type { ReadingListItem } from '@/types'

type StatusFilter = 'all' | 'published' | 'drafts'

interface ReadingListListItem extends ReadingListItem {
  cover_url: string | null
}

interface ReadingListClientProps {
  items: ReadingListListItem[]
}

export default function ReadingListClient({ items: initial }: ReadingListClientProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [items, setItems] = useState(initial)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [togglingId, setTogglingId] = useState<string | null>(null)

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
    return matchesQuery && matchesStatus
  })

  const isFiltering = query !== '' || statusFilter !== 'all'

  async function handleNew() {
    startTransition(async () => {
      const result = await createReadingListItem()
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

        {/* Search + filter bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)] pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title or author…"
              className="w-full sm:w-80 pl-9 pr-8 h-9 text-sm rounded-lg border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-background)] dark:bg-[var(--color-dark-surface)] text-[var(--color-text-primary)] dark:text-[#e8ecec] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-teal)] transition-colors"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="flex gap-1 p-1 rounded-lg bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] w-fit">
            {(['all', 'published', 'drafts'] as StatusFilter[]).map((f) => (
              <button key={f} onClick={() => setStatusFilter(f)} className={filterBtnClass(statusFilter === f)}>
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
        {filtered.length === 0 ? (
          <EmptyState isFiltering={isFiltering} query={query} onClear={() => { setQuery(''); setStatusFilter('all') }} onNew={handleNew} creating={isPending} />
        ) : (
          <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] overflow-hidden">
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.25 }}
                className="flex items-center gap-4 px-4 py-3 border-b last:border-b-0 border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-background)] dark:bg-[var(--color-dark-surface)] hover:bg-[var(--color-surface)] dark:hover:bg-[var(--color-dark-surface-hover)] transition-colors"
              >
                {/* Thumbnail */}
                {item.cover_url ? (
                  <div className="h-10 w-10 rounded-md overflow-hidden relative shrink-0">
                    <Image src={item.cover_url} alt={item.title} fill className="object-cover" sizes="40px" />
                  </div>
                ) : (
                  <div className="h-10 w-10 rounded-md bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface-hover)] flex items-center justify-center shrink-0">
                    <BookOpen className="h-5 w-5 text-[var(--color-text-muted)]" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[var(--color-text-primary)] dark:text-[#e8ecec] truncate">
                    {item.title}
                  </p>
                  <div className="flex items-center gap-3 mt-0.5">
                    {item.author && (
                      <span className="text-sm text-[var(--color-text-muted)] truncate">
                        {item.author}
                      </span>
                    )}
                    <span className="text-sm text-[var(--color-text-muted)]">
                      {formatDate(item.created_at)}
                    </span>
                  </div>
                </div>

                <PublishPill
                  published={item.published}
                  toggling={togglingId === item.id}
                  onClick={() => handleToggle(item.id, item.published)}
                />

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
              </motion.div>
            ))}
          </div>
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
