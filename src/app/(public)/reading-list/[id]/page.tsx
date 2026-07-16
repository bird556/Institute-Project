import { cache } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ExternalLink, Mail, Video } from 'lucide-react'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { truncate, stripHtml } from '@/lib/utils'
import { buildMetadata } from '@/lib/metadata'
import { DetailPageShell } from '@/components/shared/DetailPageShell'

interface Props {
  params: Promise<{ id: string }>
}

const EXTERNAL_LINK_LABELS: Record<string, string> = {
  bookstore:  'Visit Website',
  thesis_ma:  'Read Thesis',
  thesis_phd: 'Read Thesis',
  book:       'Find this book',
}

const getItem = cache(async (id: string) => {
  const supabase = await createClient()
  const { data } = await supabase
    .from('reading_list')
    .select('*')
    .eq('id', id)
    .eq('published', true)
    .single()
  return data ?? null
})

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const item = await getItem(id)
  if (!item) return buildMetadata({ noIndex: true })
  const supabase = await createClient()
  const imageUrl = item.cover_path
    ? supabase.storage.from('institute-media').getPublicUrl(item.cover_path).data.publicUrl
    : null
  return buildMetadata({
    title: item.title,
    description: truncate(stripHtml(item.description ?? ''), 160),
    imageUrl,
  })
}

export default async function ReadingListDetailPage({ params }: Props) {
  const { id } = await params
  const item = await getItem(id)
  if (!item) notFound()

  const supabase = await createClient()
  const coverUrl = item.cover_path
    ? supabase.storage.from('institute-media').getPublicUrl(item.cover_path).data.publicUrl
    : null

  return (
    <DetailPageShell className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      <Link
        href="/reading-list"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-brand-teal)] dark:hover:text-white transition-colors"
      >
        ← Back to Reading List
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_220px] gap-10 items-start">
        <div className="space-y-6 min-w-0">
          <div className="space-y-2">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] dark:text-white leading-tight">
              {item.title}
            </h1>
            {item.author && (
              <p className="text-lg text-[var(--color-text-muted)]">{item.author}</p>
            )}
          </div>
          <div
            className="tiptap-content"
            dangerouslySetInnerHTML={{ __html: item.description ?? '' }}
          />
        </div>

        <aside className="space-y-5 sticky top-24">
          {coverUrl && (
            <div className="relative w-full rounded-xl overflow-hidden shadow-md" style={{ aspectRatio: '3/4' }}>
              <Image
                src={coverUrl}
                alt={item.title}
                fill
                priority
                className="object-cover"
                sizes="220px"
              />
            </div>
          )}
          {item.external_url && (
            <a
              href={item.external_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-[var(--color-brand-teal)] hover:bg-[var(--color-brand-teal-dark)] text-white text-sm font-medium transition-colors duration-200"
            >
              <ExternalLink className="w-4 h-4" />
              {EXTERNAL_LINK_LABELS[item.item_type ?? 'book'] ?? 'Find this book'}
            </a>
          )}
          {item.video_url && (
            <a
              href={item.video_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] text-[var(--color-text-primary)] dark:text-[#e8ecec] text-sm font-medium hover:bg-[var(--color-surface)] dark:hover:bg-[var(--color-dark-surface-hover)] transition-colors"
            >
              <Video className="w-4 h-4" />
              Watch Video
            </a>
          )}
          {item.email && (
            <a
              href={`mailto:${item.email}`}
              className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] text-[var(--color-text-primary)] dark:text-[#e8ecec] text-sm font-medium hover:bg-[var(--color-surface)] dark:hover:bg-[var(--color-dark-surface-hover)] transition-colors"
            >
              <Mail className="w-4 h-4" />
              {item.email}
            </a>
          )}
        </aside>
      </div>
    </DetailPageShell>
  )
}
