'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { MoreVertical, PenLine, Trash2, Plus, CalendarDays, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import { createEvent, deleteEvent } from '@/actions/events'
import type { Event } from '@/types'

type Filter = 'all' | 'published' | 'drafts' | 'upcoming'

interface EventListClientProps {
  events: Event[]
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
  const [filter, setFilter] = useState<Filter>('all')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const now = new Date()

  const filtered = events.filter((e) => {
    if (filter === 'published') return e.published
    if (filter === 'drafts') return !e.published
    if (filter === 'upcoming') return e.published && new Date(e.event_date) > now
    return true
  })

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

        {/* Filter tabs */}
        <div className="flex gap-1 p-1 rounded-lg bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] w-fit">
          {(['all', 'published', 'drafts', 'upcoming'] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={filterBtnClass(filter === f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <EmptyState filter={filter} onNew={handleNew} creating={isPending} />
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
                {/* Icon */}
                <div className="h-10 w-10 rounded-md bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface-hover)] flex items-center justify-center shrink-0">
                  <CalendarDays className="h-5 w-5 text-[var(--color-text-muted)]" />
                </div>

                {/* Title + meta */}
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

                {/* Status badge */}
                <Badge
                  variant={event.published ? 'default' : 'secondary'}
                  className={
                    event.published
                      ? 'bg-[var(--color-brand-teal)] text-white shrink-0'
                      : 'shrink-0'
                  }
                >
                  {event.published ? 'Published' : 'Draft'}
                </Badge>

                {/* Actions menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger className="p-1 rounded cursor-pointer text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] dark:hover:text-[#e8ecec] hover:bg-[var(--color-surface-hover)] dark:hover:bg-[var(--color-dark-surface-hover)] transition-colors">
                    <MoreVertical className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => router.push(`/admin/events/${event.id}`)}
                      className="cursor-pointer gap-2"
                    >
                      <PenLine className="h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setDeleteId(event.id)}
                      className="cursor-pointer gap-2 text-red-600 focus:text-red-600"
                    >
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
  filter,
  onNew,
  creating,
}: {
  filter: Filter
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
          {filter === 'all' ? 'No events yet' : `No ${filter} events`}
        </p>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          {filter === 'all' ? 'Create your first event to get started.' : 'Try a different filter.'}
        </p>
      </div>
      {filter === 'all' && (
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
