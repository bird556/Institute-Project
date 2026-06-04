import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { truncate, stripHtml } from '@/lib/utils'
import { getSiteSettings } from '@/actions/settings'
import { getPageContent } from '@/actions/page-content'
import { buildMetadata } from '@/lib/metadata'
import EventsClient from './EventsClient'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ title: 'Events' })
}

interface Props {
  searchParams: Promise<{ filter?: string }>
}

export default async function EventsPage({ searchParams }: Props) {
  const { filter } = await searchParams
  const initialFilter = filter === 'kustawi' || filter === 'other' ? filter : 'all'

  const [{ data: sections }, { data: settings }, supabase] = await Promise.all([
    getPageContent('events'),
    getSiteSettings(),
    createClient(),
  ])

  const heroTitle        = sections?.find((s) => s.section === 'hero_title')?.content    ?? 'Events'
  const heroSubtitle     = sections?.find((s) => s.section === 'hero_subtitle')?.content ?? ''
  const kustawiBlurb     = settings?.kustawi_blurb ?? ''
  const otherEventsBlurb = settings?.non_affiliated_blurb ?? ''

  const { data } = await supabase
    .from('events')
    .select('id, title, description, cover_path, location, event_date, event_type')
    .eq('published', true)
    .order('event_date', { ascending: true })

  const now = new Date()
  const events = (data ?? []).map((e) => ({
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      <header className="space-y-3">
        <h1 className="font-display text-4xl font-bold text-[var(--color-brand-teal)] dark:text-white">
          {heroTitle}
        </h1>
        {heroSubtitle && (
          <p className="text-lg text-[var(--color-text-muted)] max-w-2xl">{heroSubtitle}</p>
        )}
      </header>

      <EventsClient events={events} kustawiBlurb={kustawiBlurb} otherEventsBlurb={otherEventsBlurb} initialFilter={initialFilter} />
    </div>
  )
}
