import { cache } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Calendar, ExternalLink } from 'lucide-react'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import EventCard from '@/components/events/EventCard'
import { formatDate, formatTime, truncate, stripHtml } from '@/lib/utils'
import { buildMetadata } from '@/lib/metadata'
import { DetailPageShell } from '@/components/shared/DetailPageShell'

interface Props {
  params: Promise<{ id: string }>
}

const getEvent = cache(async (id: string) => {
  const supabase = await createClient()
  const { data } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .eq('published', true)
    .single()
  return data ?? null
})

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const event = await getEvent(id)
  if (!event) return buildMetadata({ noIndex: true })
  const supabase = await createClient()
  const imageUrl = event.cover_path
    ? supabase.storage.from('institute-media').getPublicUrl(event.cover_path).data.publicUrl
    : null
  return buildMetadata({
    title: event.title,
    description: truncate(stripHtml(event.description), 160),
    imageUrl,
  })
}

export default async function EventDetailPage({ params }: Props) {
  const { id } = await params
  const event = await getEvent(id)
  if (!event) notFound()

  const supabase = await createClient()
  const coverUrl = event.cover_path
    ? supabase.storage.from('institute-media').getPublicUrl(event.cover_path).data.publicUrl
    : null

  const now = new Date()
  const isPast = new Date(event.event_date) < now

  const { data: moreData } = await supabase
    .from('events')
    .select('id, title, description, cover_path, location, event_date, event_type')
    .eq('published', true)
    .neq('id', event.id)
    .order('event_date', { ascending: true })
    .limit(6)

  const otherEvents = (moreData ?? []).map((e) => ({
    id: e.id,
    title: e.title,
    description_excerpt: truncate(stripHtml(e.description), 150),
    cover_url: e.cover_path
      ? supabase.storage.from('institute-media').getPublicUrl(e.cover_path).data.publicUrl
      : '',
    location: e.location,
    event_date: e.event_date,
    isPast: new Date(e.event_date) < now,
    event_type: (e.event_type ?? 'kustawi') as 'kustawi' | 'other',
  }))

  const moreEvents = [
    ...otherEvents.filter((e) => !e.isPast),
    ...otherEvents.filter((e) => e.isPast).sort((a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime()),
  ].slice(0, 3)

  return (
    <DetailPageShell className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      <Link
        href="/events"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-brand-teal)] dark:hover:text-white transition-colors"
      >
        ← Back to Events
      </Link>

      {coverUrl && (
        <div className="relative w-full rounded-2xl overflow-hidden" style={{ aspectRatio: '16/7' }}>
          <Image
            src={coverUrl}
            alt={event.title}
            fill
            priority
            className={`object-cover${isPast ? ' grayscale-[30%]' : ''}`}
            sizes="(max-width: 1024px) 100vw, 896px"
          />
        </div>
      )}

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

      <h1 className="font-display text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] dark:text-white leading-tight">
        {event.title}
      </h1>

      <div className="flex flex-wrap items-center gap-3">
        {event.event_type === 'other' ? (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
            Other Event
          </span>
        ) : (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-[var(--color-brand-teal)] text-white">
            Kustawi Event
          </span>
        )}
        {isPast && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] text-[var(--color-text-muted)] border border-[var(--color-border)] dark:border-[var(--color-dark-border)]">
            This event has passed.
          </span>
        )}
      </div>

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

      <div
        className="tiptap-content"
        dangerouslySetInnerHTML={{ __html: event.description }}
      />

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
    </DetailPageShell>
  )
}
