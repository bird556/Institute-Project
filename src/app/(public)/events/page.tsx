import type { Metadata } from 'next'
import { mockEvents } from '@/lib/mock-data'
import { truncate } from '@/lib/utils'
import EventGrid from './EventGrid'

export const metadata: Metadata = {
  title: 'Events | Institute Name',
  description: 'Upcoming and past events from the Institute.',
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

export default async function EventsPage() {
  const now = new Date()

  const allPublished = mockEvents
    .filter((e) => e.published)
    .map((e) => ({
      id: e.id,
      title: e.title,
      description_excerpt: truncate(stripHtml(e.description), 150),
      cover_url: e.cover_url,
      location: e.location,
      event_date: e.event_date,
      isPast: new Date(e.event_date) < now,
    }))

  // TODO: replace with:
  // const supabase = await createClient()
  // const { data } = await supabase
  //   .from('events')
  //   .select('id, title, description, cover_path, location, event_date')
  //   .eq('published', true)
  //   .order('event_date', { ascending: true })
  // const now = new Date()
  // const allPublished = (data ?? []).map((e) => ({
  //   ...e,
  //   description_excerpt: truncate(stripHtml(e.description), 150),
  //   cover_url: e.cover_path
  //     ? supabase.storage.from('institute-media').getPublicUrl(e.cover_path).data.publicUrl
  //     : '',
  //   isPast: new Date(e.event_date) < now,
  // }))

  const upcoming = allPublished
    .filter((e) => !e.isPast)
    .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime())

  const past = allPublished
    .filter((e) => e.isPast)
    .sort((a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime())

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Page header */}
      <header className="space-y-3">
        <h1 className="font-display text-4xl font-bold text-[var(--color-brand-teal)] dark:text-white">
          Events
        </h1>
        <p className="text-lg text-[var(--color-text-muted)] max-w-2xl">
          Workshops, panels, summits and reading circles.
        </p>
      </header>

      {/* Upcoming */}
      <section className="space-y-6">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
          Upcoming Events
        </h2>
        {upcoming.length === 0 ? (
          <p className="text-[var(--color-text-muted)] py-8">
            No upcoming events — check back soon.
          </p>
        ) : (
          <EventGrid events={upcoming} />
        )}
      </section>

      {/* Past */}
      {past.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
            Past Events
          </h2>
          <EventGrid events={past} />
        </section>
      )}
    </div>
  )
}
