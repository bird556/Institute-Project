import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { truncate, stripHtml } from '@/lib/utils'
import ReadingListClient from './ReadingListClient'
import { getPageContent } from '@/actions/page-content'
import { buildMetadata } from '@/lib/metadata'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ title: 'Reading List' })
}

export default async function ReadingListPage() {
  const [{ data: sections }, supabase] = await Promise.all([
    getPageContent('reading_list'),
    createClient(),
  ])
  const heroTitle    = sections?.find((s) => s.section === 'hero_title')?.content    ?? 'Reading List'
  const heroSubtitle = sections?.find((s) => s.section === 'hero_subtitle')?.content ?? ''

  const { data } = await supabase
    .from('reading_list')
    .select('id, title, author, description, cover_path, external_url, created_at')
    .eq('published', true)
    .order('created_at', { ascending: false })

  const items = (data ?? []).map((r) => ({
    id: r.id,
    title: r.title,
    author: r.author ?? '',
    description_excerpt: truncate(stripHtml(r.description ?? ''), 120),
    cover_url: r.cover_path
      ? supabase.storage.from('institute-media').getPublicUrl(r.cover_path).data.publicUrl
      : '',
    external_url: r.external_url,
    created_at: r.created_at,
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

      {items.length === 0 ? (
        <p className="text-[var(--color-text-muted)] py-8">
          No items yet — check back soon.
        </p>
      ) : (
        <ReadingListClient items={items} />
      )}
    </div>
  )
}
