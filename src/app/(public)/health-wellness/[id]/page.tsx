import { cache } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { Download } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import WellnessCard from '@/components/wellness/WellnessCard'
import { formatDate } from '@/lib/utils'

interface Props {
  params: Promise<{ id: string }>
}

const getPost = cache(async (id: string) => {
  const supabase = await createClient()
  const { data } = await supabase
    .from('wellness_posts')
    .select('*')
    .eq('id', id)
    .eq('published', true)
    .single()
  return data ?? null
})

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const post = await getPost(id)
  if (!post) return {}
  return {
    title: `${post.title} | Health & Wellness | Institute Name`,
    description: post.excerpt ?? undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
    },
  }
}

export default async function WellnessDetailPage({ params }: Props) {
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
    .from('wellness_posts')
    .select('id, title, slug, excerpt, cover_path, tags, published_at')
    .eq('published', true)
    .neq('id', post.id)
    .order('published_at', { ascending: false })
    .limit(3)

  const morePosts = (moreData ?? []).map((w) => ({
    id:           w.id,
    title:        w.title,
    excerpt:      w.excerpt,
    cover_url:    w.cover_path
      ? supabase.storage.from('institute-media').getPublicUrl(w.cover_path).data.publicUrl
      : '',
    tags:         w.tags ?? [],
    published_at: w.published_at ?? null,
  }))

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      <Link
        href="/health-wellness"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-brand-teal)] dark:hover:text-white transition-colors"
      >
        ← Back to Health &amp; Wellness
      </Link>

      {coverUrl && (
        <div className="relative w-full rounded-2xl overflow-hidden" style={{ aspectRatio: '16/7' }}>
          <Image
            src={coverUrl}
            alt={post.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 896px"
          />
        </div>
      )}

      <header className="space-y-4">
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag: string) => (
              <Link
                key={tag}
                href={`/health-wellness?tag=${encodeURIComponent(tag)}`}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[var(--color-brand-teal)] text-white hover:bg-[var(--color-brand-teal-dark)] transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}

        {post.published_at && (
          <p className="text-sm text-[var(--color-text-muted)]">{formatDate(post.published_at)}</p>
        )}

        <h1 className="font-display text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] dark:text-white leading-tight">
          {post.title}
        </h1>

        {docUrl && (
          <a
            href={docUrl}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-brand-teal)] text-white text-sm font-medium hover:bg-[var(--color-brand-teal-dark)] transition-colors"
          >
            <Download size={16} />
            Download Curriculum
          </a>
        )}
      </header>

      <div
        className="tiptap-content prose max-w-prose mx-auto"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {morePosts.length > 0 && (
        <section className="pt-10 border-t border-[var(--color-border)] dark:border-[var(--color-dark-border)] space-y-6">
          <h2 className="font-display text-2xl font-bold text-[var(--color-brand-teal)] dark:text-white">
            More Posts
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {morePosts.map((p) => (
              <WellnessCard key={p.id} {...p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
