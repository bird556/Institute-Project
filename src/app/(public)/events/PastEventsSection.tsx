'use client'

import { useState } from 'react'
import EventGrid from './EventGrid'
import Pagination from '@/components/shared/Pagination'
import type { EventCardProps } from '@/components/events/EventCard'

const PAGE_SIZE = 16

export default function PastEventsSection({ events }: { events: EventCardProps[] }) {
  const [page, setPage] = useState(1)

  const totalPages = Math.ceil(events.length / PAGE_SIZE)
  const paginated  = events.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <section className="space-y-6">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
        Past Events
      </h2>
      <EventGrid events={paginated} />
      <Pagination page={page} totalPages={totalPages} onPageChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }} />
    </section>
  )
}
