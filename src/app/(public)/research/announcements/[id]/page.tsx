import { cache } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Mail, FileDown } from 'lucide-react'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import ResearchCard from '@/components/research/ResearchCard'
import { formatDate } from '@/lib/utils'
import { buildMetadata } from '@/lib/metadata'
import { DetailPageShell } from '@/components/shared/DetailPageShell'

interface Props {
  params: Promise<{ id: string }>
}

const getPost = cache(async (id: string) => {
  const supabase = await createClient()
  const { data } = await supabase
    .from('research_posts')
    .select('*')
    .eq('id', id)
    .eq('published', true)
    .eq('category', 'announcements')
    .single()
  return data ?? null
})

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const post = await getPost(id)
  if (!post) return buildMetadata({ noIndex: true })
  const supabase = await createClient()
  const imageUrl = post.cover_path
    ? supabase.storage.from('institute-media').getPublicUrl(post.cover_path).data.publicUrl
    : null
  return buildMetadata({ title: post.title, description: post.excerpt ?? undefined, imageUrl })
}

export default async function AnnouncementDetailPage({ params }: Props) {
  const { id } = await params
  const post = await getPost(id)
  if (!post) notFound()

  const supabase = await createClient()

  const coverUrl = post.cover_path
    ? supabase.storage.from('institute-media').getPublicUrl(post.cover_path).data.publicUrl
    : null
  const docUrl = post.doc_path
    ? supabase.storage.from('institute-media').getPublicUrl(post.doc_path).data.publicUrl
    : null

  const { data: moreData } = await supabase
    .from('research_posts')
    .select('id, title, excerpt, cover_path, category, published_at')
    .eq('published', true)
    .eq('category', 'announcements')
    .neq('id', post.id)
    .order('published_at', { ascending: false })
    .limit(3)

  const morePosts = (moreData ?? []).map((p) => ({
    id:           p.id,
    title:        p.title,
    excerpt:      p.excerpt,
    cover_url:    p.cover_path
      ? supabase.storage.from('institute-media').getPublicUrl(p.cover_path).data.publicUrl
      : '',
    category:     p.category as 'announcements',
    published_at: p.published_at,
  }))

  return (
    <DetailPageShell className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      <Link
        href="/research/announcements"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-brand-teal)] dark:hover:text-white transition-colors"
      >
        ← Back to Call for Participants
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-10 items-start">
        {/* Photo column */}
        <div className="space-y-4">
          {coverUrl && (
            <div className="relative w-full rounded-2xl overflow-hidden bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface-hover)]" style={{ aspectRatio: '1/1' }}>
              <Image
                src={coverUrl}
                alt={post.title}
                fill
                priority
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 240px"
              />
            </div>
          )}

          {docUrl && (
            <a
              href={docUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-[var(--color-brand-teal)] hover:bg-[var(--color-brand-teal-dark)] text-white text-sm font-medium transition-colors"
            >
              <FileDown className="h-4 w-4" />
              Download Document
            </a>
          )}

          {post.email && (
            <a
              href={`mailto:${post.email}`}
              className="flex items-center justify-center gap-2 w-full min-w-0 px-4 py-2.5 rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] text-[var(--color-text-primary)] dark:text-[#e8ecec] text-sm font-medium hover:bg-[var(--color-surface)] dark:hover:bg-[var(--color-dark-surface-hover)] transition-colors"
            >
              <Mail className="w-4 h-4 shrink-0" />
              <span className="break-all">{post.email}</span>
            </a>
          )}
        </div>

        {/* Content column */}
        <div className="space-y-4">
          {post.published_at && (
            <p className="text-sm text-[var(--color-text-muted)]">{formatDate(post.published_at)}</p>
          )}
          <h1 className="font-display text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] dark:text-white leading-tight">
            {post.title}
          </h1>

          <div
            className="tiptap-content pt-4"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </div>

      {morePosts.length > 0 && (
        <section className="pt-10 border-t border-[var(--color-border)] dark:border-[var(--color-dark-border)] space-y-6">
          <h2 className="font-display text-2xl font-bold text-[var(--color-brand-teal)] dark:text-white">
            More Call for Participants
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {morePosts.map((p) => (
              <ResearchCard key={p.id} {...p} />
            ))}
          </div>
        </section>
      )}
    </DetailPageShell>
  )
}
