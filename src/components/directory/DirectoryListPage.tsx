import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { getPublishedDirectoryEntries } from '@/actions/directory'
import { getPageContent } from '@/actions/page-content'
import { buildMetadata } from '@/lib/metadata'
import { stripHtml, truncate } from '@/lib/utils'
import { DIRECTORY_CATEGORY_LABELS, type DirectoryCategory } from '@/types'
import DirectoryListClient from './DirectoryListClient'

interface Props {
  category: DirectoryCategory
  pageSlug: string        // e.g. 'advocates'
}

export async function generateDirectoryMetadata(category: DirectoryCategory): Promise<Metadata> {
  return buildMetadata({ title: DIRECTORY_CATEGORY_LABELS[category] })
}

export default async function DirectoryListPage({ category, pageSlug }: Props) {
  const [{ data: entries }, { data: sections }, supabase] = await Promise.all([
    getPublishedDirectoryEntries(category),
    getPageContent(pageSlug),
    createClient(),
  ])

  const heroTitle    = sections?.find((s) => s.section === 'hero_title')?.content    ?? DIRECTORY_CATEGORY_LABELS[category]
  const heroSubtitle = sections?.find((s) => s.section === 'hero_subtitle')?.content ?? ''
  const titleLines   = heroTitle.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
  const titleAlign   = sections?.find((s) => s.section === 'hero_title_align')?.content === 'left' ? 'text-left' : 'text-center'

  const cards = (entries ?? []).map((e) => ({
    id: e.id,
    name: e.name,
    organization: e.organization,
    description_excerpt: e.description ? truncate(stripHtml(e.description), 150) : null,
    photo_url: e.photo_path
      ? supabase.storage.from('institute-media').getPublicUrl(e.photo_path).data.publicUrl
      : null,
    website_url: e.website_url,
    email: e.email,
    mode: e.mode,
    province: e.province,
    city: e.city,
    languages: e.languages ?? [],
    fee_options: e.fee_options ?? [],
    category: e.category,
    created_at: e.created_at,
    image_fit: (e.image_fit ?? 'contain') as 'cover' | 'contain',
  }))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      <header className="space-y-3">
        {titleLines.length > 1 ? (
          // Line break set in the admin: with "Centred", later lines centre under the first; the block stays left-aligned
          <h1 className={`inline-block ${titleAlign} font-display text-3xl sm:text-4xl font-bold text-[var(--color-brand-teal)] dark:text-white`}>
            {titleLines.map((line, i) => (
              <span key={i} className="block">{line}</span>
            ))}
          </h1>
        ) : (
          <h1 className="font-display text-4xl font-bold text-[var(--color-brand-teal)] dark:text-white">
            {heroTitle}
          </h1>
        )}
        {heroSubtitle && (
          <p className="text-lg text-[var(--color-text-muted)] max-w-2xl">{heroSubtitle}</p>
        )}
      </header>

      <DirectoryListClient entries={cards} />
    </div>
  )
}
