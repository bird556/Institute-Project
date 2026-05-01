import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { truncate, stripHtml } from '@/lib/utils'
import EventGrid from './EventGrid'
import { getPageContent } from '@/actions/page-content'
import { buildMetadata } from '@/lib/metadata'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ title: 'Events' })
}

export default async function EventsPage() {
  const [{ data: sections }, supabase] = await Promise.all([
    getPageContent('events'),
    createClient(),
  ])
  const heroTitle    = sections?.find((s) => s.section === 'hero_title')?.content    ?? 'Events'
  const heroSubtitle = sections?.find((s) => s.section === 'hero_subtitle')?.content ?? ''

  const { data } = await supabase
    .from('events')
    .select('id, title, description, cover_path, location, event_date')
    .eq('published', true)
    .order('event_date', { ascending: true })

  const now = new Date()
  const allPublished = (data ?? []).map((e) => ({
    id: e.id,
    title: e.title,
    description_excerpt: truncate(stripHtml(e.description), 150),
    cover_url: e.cover_path
      ? supabase.storage.from('institute-media').getPublicUrl(e.cover_path).data.publicUrl
      : '',
    location: e.location,
    event_date: e.event_date,
    isPast: new Date(e.event_date) < now,
  }))

  const upcoming = allPublished.filter((e) => !e.isPast)
  const past = allPublished
    .filter((e) => e.isPast)
    .sort((a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime())

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <header className="space-y-3">
        <h1 className="font-display text-4xl font-bold text-[var(--color-brand-teal)] dark:text-white">
          {heroTitle}
        </h1>
        {heroSubtitle && (
          <p className="text-lg text-[var(--color-text-muted)] max-w-2xl">{heroSubtitle}</p>
        )}
      </header>

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
