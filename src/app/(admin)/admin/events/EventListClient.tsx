'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { MoreVertical, PenLine, Trash2, Plus, CalendarDays, MapPin, Search, X } from 'lucide-react'
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
import { createEvent, deleteEvent, toggleEventPublished } from '@/actions/events'
import type { Event } from '@/types'

type StatusFilter = 'all' | 'published' | 'drafts'
type DateFilter   = 'all' | 'upcoming' | 'past'

interface EventListItem extends Event {
  cover_url: string | null
}

interface EventListClientProps {
  events: EventListItem[]
}

function formatEventDate(iso: string): string {
  return new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC',
  }).format(new Date(iso))
}

export default function EventListClient({ events: initial }: EventListClientProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [events, setEvents] = useState(initial)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [dateFilter, setDateFilter] = useState<DateFilter>('all')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  const now = new Date()

  const filtered = events.filter((e) => {
    const q = query.toLowerCase()
    const matchesQuery =
      !q ||
      e.title.toLowerCase().includes(q) ||
      (e.location ?? '').toLowerCase().includes(q)
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'published' && e.published) ||
      (statusFilter === 'drafts' && !e.published)
    const matchesDate =
      dateFilter === 'all' ||
      (dateFilter === 'upcoming' && new Date(e.event_date) > now) ||
      (dateFilter === 'past' && new Date(e.event_date) <= now)
    return matchesQuery && matchesStatus && matchesDate
  })

  const isFiltering = query !== '' || statusFilter !== 'all' || dateFilter !== 'all'

  async function handleNew() {
    startTransition(async () => {
      const result = await createEvent()
      if (!result.success || !result.data) {
        toast.error(result.error ?? 'Could not create event.')
        return
      }
      router.push(`/admin/events/${result.data.id}`)
    })
  }

  async function handleDelete() {
    if (!deleteId) return
    setDeleting(true)
    const result = await deleteEvent(deleteId)
    setDeleting(false)
    setDeleteId(null)
    if (!result.success) {
      toast.error(result.error ?? 'Could not delete event.')
      return
    }
    setEvents((prev) => prev.filter((e) => e.id !== deleteId))
    toast.success('Event deleted.')
  }

  async function handleToggle(id: string, current: boolean) {
    setTogglingId(id)
    setEvents((prev) => prev.map((e) => e.id === id ? { ...e, published: !current } : e))
    const result = await toggleEventPublished(id, !current)
    setTogglingId(null)
    if (!result.success) {
      setEvents((prev) => prev.map((e) => e.id === id ? { ...e, published: current } : e))
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
            Events
          </h1>
          <Button
            onClick={handleNew}
            disabled={isPending}
            className="cursor-pointer bg-[var(--color-brand-teal)] hover:bg-[var(--color-brand-teal-dark)] text-white gap-1.5"
          >
            <Plus className="h-4 w-4" />
            New Event
          </Button>
        </div>

        {/* Search + filter bar */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)] pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title or location…"
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

          <div className="flex gap-1 p-1 rounded-lg bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] w-fit">
            {(['all', 'upcoming', 'past'] as DateFilter[]).map((f) => (
              <button key={f} onClick={() => setDateFilter(f)} className={filterBtnClass(dateFilter === f)}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Result count */}
        {isFiltering && (
          <p className="text-sm text-[var(--color-text-muted)] -mt-2">
            Showing {filtered.length} of {events.length} {events.length === 1 ? 'event' : 'events'}
          </p>
        )}

        {/* List */}
        {filtered.length === 0 ? (
          <EmptyState isFiltering={isFiltering} query={query} onClear={() => { setQuery(''); setStatusFilter('all'); setDateFilter('all') }} onNew={handleNew} creating={isPending} />
        ) : (
          <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] overflow-hidden">
            {filtered.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.25 }}
                className="flex items-center gap-4 px-4 py-3 border-b last:border-b-0 border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-background)] dark:bg-[var(--color-dark-surface)] hover:bg-[var(--color-surface)] dark:hover:bg-[var(--color-dark-surface-hover)] transition-colors"
              >
                {/* Thumbnail */}
                {event.cover_url ? (
                  <div className="h-10 w-10 rounded-md overflow-hidden relative shrink-0">
                    <Image src={event.cover_url} alt={event.title} fill className="object-cover" sizes="40px" />
                  </div>
                ) : (
                  <div className="h-10 w-10 rounded-md bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface-hover)] flex items-center justify-center shrink-0">
                    <CalendarDays className="h-5 w-5 text-[var(--color-text-muted)]" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[var(--color-text-primary)] dark:text-[#e8ecec] truncate">
                    {event.title}
                  </p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-sm text-[var(--color-text-muted)] truncate">
                      {formatEventDate(event.event_date)}
                    </span>
                    {event.location && (
                      <span className="hidden md:flex items-center gap-1 text-sm text-[var(--color-text-muted)] truncate">
                        <MapPin className="h-3 w-3 shrink-0" />
                        {event.location}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleToggle(event.id, event.published)}
                  disabled={togglingId === event.id}
                  className={`text-xs px-2.5 py-1 rounded-full font-medium cursor-pointer transition-colors shrink-0 ${
                    event.published
                      ? 'bg-[var(--color-brand-teal)] text-white hover:opacity-80'
                      : 'bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface-hover)] text-[var(--color-text-muted)] border border-[var(--color-border)] dark:border-[var(--color-dark-border)] hover:bg-[var(--color-surface-hover)]'
                  }`}
                >
                  {togglingId === event.id ? '…' : event.published ? 'Published' : 'Draft'}
                </button>

                <DropdownMenu>
                  <DropdownMenuTrigger className="p-1 rounded cursor-pointer text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] dark:hover:text-[#e8ecec] hover:bg-[var(--color-surface-hover)] dark:hover:bg-[var(--color-dark-surface-hover)] transition-colors">
                    <MoreVertical className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => router.push(`/admin/events/${event.id}`)} className="cursor-pointer gap-2">
                      <PenLine className="h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setDeleteId(event.id)} className="cursor-pointer gap-2 text-red-600 focus:text-red-600">
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
        title="Delete Event"
        description="This action cannot be undone. The event will be permanently removed."
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
        <CalendarDays className="h-6 w-6 text-[var(--color-text-muted)]" />
      </div>
      <div>
        <p className="font-medium text-[var(--color-text-primary)] dark:text-[#e8ecec]">
          {isFiltering ? `No results${query ? ` for "${query}"` : ''}` : 'No events yet'}
        </p>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          {isFiltering ? 'Try a different search or clear the filters.' : 'Create your first event to get started.'}
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
          Create your first event
        </Button>
      )}
    </div>
  )
}
