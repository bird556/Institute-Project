import type { Metadata } from 'next'
import { mockReadingList } from '@/lib/mock-data'
import { truncate } from '@/lib/utils'
import ReadingListGrid from './ReadingListGrid'

export const metadata: Metadata = {
  title: 'Reading List | Institute Name',
  description: 'Curated books, articles and resources recommended by the Institute.',
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

export default async function ReadingListPage() {
  const items = mockReadingList
    .filter((r) => r.published)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .map((r) => ({
      id: r.id,
      title: r.title,
      author: r.author,
      description_excerpt: truncate(stripHtml(r.description), 120),
      cover_url: r.cover_url,
      external_url: r.external_url,
    }))

  // TODO: replace with:
  // const supabase = await createClient()
  // const { data } = await supabase
  //   .from('reading_list')
  //   .select('id, title, author, description, cover_path, external_url')
  //   .eq('published', true)
  //   .order('created_at', { ascending: false })
  // const items = (data ?? []).map((r) => ({
  //   id: r.id,
  //   title: r.title,
  //   author: r.author ?? '',
  //   description_excerpt: truncate(stripHtml(r.description ?? ''), 120),
  //   cover_url: r.cover_path
  //     ? supabase.storage.from('institute-media').getPublicUrl(r.cover_path).data.publicUrl
  //     : '',
  //   external_url: r.external_url,
  // }))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      {/* Page header */}
      <header className="space-y-3">
        <h1 className="font-display text-4xl font-bold text-[var(--color-brand-teal)] dark:text-white">
          Reading List
        </h1>
        <p className="text-lg text-[var(--color-text-muted)] max-w-2xl">
          Curated books, articles and resources recommended by the Institute.
        </p>
      </header>

      {/* Grid */}
      {items.length === 0 ? (
        <p className="text-[var(--color-text-muted)] py-8">
          No items yet — check back soon.
        </p>
      ) : (
        <ReadingListGrid items={items} />
      )}
    </div>
  )
}
