import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ExternalLink } from 'lucide-react'
import type { Metadata } from 'next'
import { mockReadingList } from '@/lib/mock-data'
import { truncate } from '@/lib/utils'

interface Props {
  params: Promise<{ id: string }>
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

function getItem(id: string) {
  return mockReadingList.find((r) => r.id === id && r.published) ?? null
  // TODO: replace with:
  // const supabase = await createClient()
  // const { data } = await supabase
  //   .from('reading_list')
  //   .select('*')
  //   .eq('id', id)
  //   .eq('published', true)
  //   .single()
  // return data ?? null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const item = getItem(id)
  if (!item) return {}
  return {
    title: `${item.title} | Reading List | Institute Name`,
    description: truncate(stripHtml(item.description), 160),
  }
}

export default async function ReadingListDetailPage({ params }: Props) {
  const { id } = await params
  const item = getItem(id)
  if (!item) notFound()

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      {/* Back link */}
      <Link
        href="/reading-list"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-brand-teal)] dark:hover:text-white transition-colors"
      >
        ← Back to Reading List
      </Link>

      {/* Main layout: content + sidebar */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_220px] gap-10 items-start">
        {/* Content */}
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
            dangerouslySetInnerHTML={{ __html: item.description }}
          />
        </div>

        {/* Sidebar */}
        <aside className="space-y-5">
          {/* Cover portrait */}
          {item.cover_url && (
            <div className="relative w-full rounded-xl overflow-hidden shadow-md" style={{ aspectRatio: '3/4' }}>
              <Image
                src={item.cover_url}
                alt={item.title}
                fill
                priority
                className="object-cover"
                sizes="220px"
              />
            </div>
          )}

          {/* External link */}
          {item.external_url && (
            <a
              href={item.external_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-[var(--color-brand-teal)] hover:bg-[var(--color-brand-teal-dark)] text-white text-sm font-medium transition-colors duration-200"
            >
              <ExternalLink className="w-4 h-4" />
              Find this book
            </a>
          )}
        </aside>
      </div>
    </div>
  )
}
