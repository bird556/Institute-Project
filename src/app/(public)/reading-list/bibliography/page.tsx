import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { truncate, stripHtml } from '@/lib/utils'
import { buildMetadata } from '@/lib/metadata'
import { getPageContent } from '@/actions/page-content'
import ReadingListSection from '@/components/reading-list/ReadingListSection'
import BookOfMonthCard from '@/components/reading-list/BookOfMonthCard'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ title: 'Bibliography — Reading List' })
}

export default async function BibliographyPage() {
  const [{ data: sections }, supabase] = await Promise.all([
    getPageContent('bibliography'),
    createClient(),
  ])

  const heroTitle    = sections?.find((s) => s.section === 'hero_title')?.content    ?? 'Bibliography'
  const heroSubtitle = sections?.find((s) => s.section === 'hero_subtitle')?.content ?? ''

  const { data: botmSetting } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', 'book_of_the_month_id')
    .single()

  const botmId = botmSetting?.value || null

  let botm: {
    id: string
    title: string
    author: string | null
    description_excerpt: string | null
    cover_url: string | null
  } | null = null

  if (botmId) {
    const { data: botmData } = await supabase
      .from('reading_list')
      .select('id, title, author, description, cover_path')
      .eq('id', botmId)
      .eq('published', true)
      .single()

    if (botmData) {
      botm = {
        id: botmData.id,
        title: botmData.title,
        author: botmData.author ?? null,
        description_excerpt: truncate(stripHtml(botmData.description ?? ''), 180),
        cover_url: botmData.cover_path
          ? supabase.storage.from('institute-media').getPublicUrl(botmData.cover_path).data.publicUrl
          : null,
      }
    }
  }

  const { data } = await supabase
    .from('reading_list')
    .select('id, title, author, description, cover_path, external_url, video_url, email, author_region, item_type, created_at')
    .eq('published', true)
    .order('created_at', { ascending: false })

  const items = (data ?? [])
    .filter((r) => r.item_type !== 'thesis_ma' && r.item_type !== 'thesis_phd')
    .map((r) => ({
      id: r.id,
      title: r.title,
      author: r.author ?? '',
      description_excerpt: truncate(stripHtml(r.description ?? ''), 120),
      cover_url: r.cover_path
        ? supabase.storage.from('institute-media').getPublicUrl(r.cover_path).data.publicUrl
        : '',
      external_url: r.external_url,
      video_url: r.video_url,
      email: r.email,
      author_region: (r.author_region ?? null) as 'canadian' | 'world' | null,
      item_type: (r.item_type ?? null) as 'book' | 'thesis_ma' | 'thesis_phd' | null,
      created_at: r.created_at,
    }))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      <header className="space-y-3">
        <Link
          href="/reading-list"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-brand-teal)] transition-colors"
        >
          <ChevronLeft size={15} /> Reading List
        </Link>
        <h1 className="font-display text-4xl font-bold text-[var(--color-brand-teal)] dark:text-white">
          {heroTitle}
        </h1>
        {heroSubtitle && (
          <p className="text-lg text-[var(--color-text-muted)] max-w-2xl">{heroSubtitle}</p>
        )}
      </header>

      {botm && <BookOfMonthCard {...botm} />}

      <ReadingListSection
        title="Bibliography"
        items={items}
        defaultOpen
        collapsible={false}
        typeOptions={[
          { value: 'book', label: 'Books' },
        ]}
      />
    </div>
  )
}
