'use client'

import { useState, useMemo } from 'react'
import EventGrid from './EventGrid'
import PastEventsSection from './PastEventsSection'
import type { EventCardProps } from '@/components/events/EventCard'

type TypeFilter = 'all' | 'kustawi' | 'other'

export interface EventItem extends EventCardProps {
  event_type: 'kustawi' | 'other'
  organizer?: string | null
}

interface EventsClientProps {
  events: EventItem[]
  kustawiBlurb: string
  otherEventsBlurb: string
  initialFilter?: TypeFilter
}

const FILTER_LABELS: Record<TypeFilter, string> = {
  all:     'All Events',
  kustawi: 'Kustawi Events',
  other:   'Other Events',
}

export default function EventsClient({ events, kustawiBlurb, otherEventsBlurb, initialFilter = 'all' }: EventsClientProps) {
  const [typeFilter, setTypeFilter] = useState<TypeFilter>(initialFilter)

  const filtered = useMemo(
    () => typeFilter === 'all' ? events : events.filter((e) => e.event_type === typeFilter),
    [events, typeFilter],
  )

  const now = new Date()
  const upcoming = filtered.filter((e) => !e.isPast)
  const past     = filtered.filter((e) => e.isPast)
    .sort((a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime())

  const pillBase = 'px-4 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer'
  const pillActive = 'bg-[var(--color-brand-teal)] text-white'
  const pillInactive = 'text-[var(--color-text-muted)] hover:text-[var(--color-brand-teal)] dark:hover:text-white border border-[var(--color-border)] dark:border-[var(--color-dark-border)] hover:border-[var(--color-brand-teal)] dark:hover:border-white'

  return (
    <div className="space-y-10">
      {/* Filter pills */}
      <div className="flex flex-wrap gap-2">
        {(Object.keys(FILTER_LABELS) as TypeFilter[]).map((f) => (
          <button
            key={f}
            onClick={() => setTypeFilter(f)}
            className={`${pillBase} ${typeFilter === f ? pillActive : pillInactive}`}
          >
            {FILTER_LABELS[f]}
          </button>
        ))}
      </div>

      {/* Section blurb — shown only when the matching filter is active */}
      {typeFilter === 'kustawi' && kustawiBlurb && (
        <p className="text-[var(--color-text-muted)] italic max-w-2xl -mt-4">
          {kustawiBlurb}
        </p>
      )}
      {typeFilter === 'other' && otherEventsBlurb && (
        <p className="text-[var(--color-text-muted)] italic max-w-2xl -mt-4">
          {otherEventsBlurb}
        </p>
      )}

      {/* Upcoming */}
      <section className="space-y-6">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
          Upcoming Events
        </h2>
        {upcoming.length === 0 ? (
          <p className="text-[var(--color-text-muted)] py-4">
            No upcoming events — check back soon.
          </p>
        ) : (
          <EventGrid events={upcoming} />
        )}
      </section>

      {/* Past */}
      {past.length > 0 && (
        <PastEventsSection key={typeFilter} events={past} />
      )}
    </div>
  )
}
