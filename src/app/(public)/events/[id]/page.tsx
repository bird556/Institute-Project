import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Calendar, ExternalLink } from 'lucide-react'
import type { Metadata } from 'next'
import { mockEvents } from '@/lib/mock-data'
import EventCard from '@/components/events/EventCard'
import { formatDate, formatTime, truncate } from '@/lib/utils'

interface Props {
  params: Promise<{ id: string }>
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

function getEvent(id: string) {
  return mockEvents.find((e) => e.id === id && e.published) ?? null
  // TODO: replace with:
  // const supabase = await createClient()
  // const { data } = await supabase
  //   .from('events')
  //   .select('*')
  //   .eq('id', id)
  //   .eq('published', true)
  //   .single()
  // return data ?? null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const event = getEvent(id)
  if (!event) return {}
  return {
    title: `${event.title} | Events | Institute Name`,
    description: truncate(stripHtml(event.description), 160),
    openGraph: {
      title: event.title,
      description: truncate(stripHtml(event.description), 160),
      images: event.cover_url ? [{ url: event.cover_url }] : [],
    },
  }
}

export default async function EventDetailPage({ params }: Props) {
  const { id } = await params
  const event = getEvent(id)
  if (!event) notFound()

  const now = new Date()
  const isPast = new Date(event.event_date) < now

  // "More Events" — prefer upcoming, fill with past if needed, exclude current
  const otherEvents = mockEvents
    .filter((e) => e.published && e.id !== event.id)
    .map((e) => ({ ...e, isPastEvent: new Date(e.event_date) < now }))

  const moreEvents = [
    ...otherEvents.filter((e) => !e.isPastEvent).sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime()),
    ...otherEvents.filter((e) => e.isPastEvent).sort((a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime()),
  ]
    .slice(0, 3)
    .map((e) => ({
      id: e.id,
      title: e.title,
      description_excerpt: truncate(stripHtml(e.description), 150),
      cover_url: e.cover_url,
      location: e.location,
      event_date: e.event_date,
      isPast: e.isPastEvent,
    }))

  // TODO: replace moreEvents with:
  // const { data } = await supabase
  //   .from('events')
  //   .select('id, title, description, cover_path, location, event_date')
  //   .eq('published', true)
  //   .neq('id', event.id)
  //   .order('event_date', { ascending: true })
  //   .limit(3)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      {/* Back link */}
      <Link
        href="/events"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-brand-teal)] transition-colors"
      >
        ← Back to Events
      </Link>

      {/* Cover image */}
      {event.cover_url && (
        <div className="relative w-full rounded-2xl overflow-hidden" style={{ aspectRatio: '16/7' }}>
          <Image
            src={event.cover_url}
            alt={event.title}
            fill
            priority
            className={`object-cover${isPast ? ' grayscale-[30%]' : ''}`}
            sizes="(max-width: 1024px) 100vw, 896px"
          />
        </div>
      )}

      {/* Event meta row */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[var(--color-text-muted)]">
        <span className="flex items-center gap-1.5">
          <Calendar className="w-4 h-4 shrink-0" />
          {formatDate(event.event_date)} · {formatTime(event.event_date)}
        </span>
        {event.location && (
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 shrink-0" />
            {event.location}
          </span>
        )}
      </div>

      {/* Title */}
      <h1 className="font-display text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] dark:text-white leading-tight">
        {event.title}
      </h1>

      {/* Past event banner */}
      {isPast && (
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 text-sm font-medium">
          This event has passed.
        </div>
      )}

      {/* Register / Attend button */}
      {event.external_url && !isPast && (
        <div>
          <a
            href={event.external_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-brand-teal)] hover:bg-[var(--color-brand-teal-dark)] text-white font-medium text-sm transition-colors duration-200"
          >
            Register / Attend
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      )}

      {/* Description body */}
      <div
        className="tiptap-content"
        dangerouslySetInnerHTML={{ __html: event.description }}
      />

      {/* More Events */}
      {moreEvents.length > 0 && (
        <section className="pt-10 border-t border-[var(--color-border)] dark:border-[var(--color-dark-border)] space-y-6">
          <h2 className="font-display text-2xl font-bold text-[var(--color-brand-teal)] dark:text-white">
            More Events
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {moreEvents.map((e) => (
              <EventCard key={e.id} {...e} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
