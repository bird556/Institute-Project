import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { truncate, stripHtml } from '@/lib/utils'
import { buildMetadata } from '@/lib/metadata'
import BookOfMonthCard from '@/components/reading-list/BookOfMonthCard'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ title: 'Book of the Month — Reading List' })
}

export default async function BookOfTheMonthPage() {
  const supabase = await createClient()

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
    image_fit?: 'cover' | 'contain'
  } | null = null

  if (botmId) {
    const { data: botmData } = await supabase
      .from('reading_list')
      .select('id, title, author, description, cover_path, image_fit')
      .eq('id', botmId)
      .eq('published', true)
      .single()

    if (botmData) {
      botm = {
        id: botmData.id,
        title: botmData.title,
        author: botmData.author ?? null,
        description_excerpt: truncate(stripHtml(botmData.description ?? ''), 300),
        cover_url: botmData.cover_path
          ? supabase.storage.from('institute-media').getPublicUrl(botmData.cover_path).data.publicUrl
          : null,
        image_fit: (botmData.image_fit ?? 'cover') as 'cover' | 'contain',
      }
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      <header className="space-y-3">
        <Link
          href="/reading-list"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-brand-teal)] transition-colors"
        >
          <ChevronLeft size={15} /> Reading List
        </Link>
        <h1 className="font-display text-4xl font-bold text-[var(--color-brand-teal)] dark:text-white">
          Book of the Month
        </h1>
      </header>

      {botm ? (
        <BookOfMonthCard {...botm} />
      ) : (
        <p className="text-[var(--color-text-muted)]">No book of the month has been set yet — check back soon.</p>
      )}
    </div>
  )
}
