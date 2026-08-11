import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { truncate, stripHtml } from '@/lib/utils'
import { getSiteSettings } from '@/actions/settings'
import { buildMetadata } from '@/lib/metadata'
import EventGrid from '../EventGrid'
import PastEventsSection from '../PastEventsSection'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ title: 'Kustawi Events' })
}

export default async function KustawiEventsPage() {
  const [{ data: settings }, supabase] = await Promise.all([
    getSiteSettings(),
    createClient(),
  ])

  const kustawiBlurb = settings?.kustawi_blurb ?? ''

  const { data } = await supabase
    .from('events')
    .select('id, slug, title, description, cover_path, location, event_date, event_type, organizer, image_fit')
    .eq('published', true)
    .eq('event_type', 'kustawi')
    .order('event_date', { ascending: true })

  const now = new Date()
  const events = (data ?? []).map((e) => ({
    id: e.id,
    slug: e.slug,
    title: e.title,
    description_excerpt: truncate(stripHtml(e.description), 150),
    cover_url: e.cover_path
      ? supabase.storage.from('institute-media').getPublicUrl(e.cover_path).data.publicUrl
      : '',
    location: e.location,
    event_date: e.event_date,
    isPast: new Date(e.event_date) < now,
    event_type: 'kustawi' as const,
    organizer: e.organizer ?? null,
    image_fit: (e.image_fit ?? 'cover') as 'cover' | 'contain',
  }))

  const upcoming = events.filter((e) => !e.isPast)
  const past = events.filter((e) => e.isPast)
    .sort((a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime())

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      <header className="space-y-3">
        <Link
          href="/events"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-brand-teal)] transition-colors"
        >
          <ChevronLeft size={15} /> Events
        </Link>
        <h1 className="font-display text-4xl font-bold text-[var(--color-brand-teal)] dark:text-white">
          Kustawi Events
        </h1>
        {kustawiBlurb && (
          <p className="text-[var(--color-text-muted)] italic max-w-2xl">{kustawiBlurb}</p>
        )}
      </header>

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

      {past.length > 0 && <PastEventsSection events={past} />}
    </div>
  )
}
