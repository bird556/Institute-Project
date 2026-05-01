import { cache } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import BlogCard from '@/components/blog/BlogCard'
import { formatDate } from '@/lib/utils'
import { buildMetadata } from '@/lib/metadata'

interface Props {
  params: Promise<{ id: string }>
}

const getPost = cache(async (id: string) => {
  const supabase = await createClient()
  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .eq('published', true)
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
  return buildMetadata({
    title: post.title,
    description: post.excerpt ?? undefined,
    imageUrl,
  })
}

export default async function BlogDetailPage({ params }: Props) {
  const { id } = await params
  const post = await getPost(id)
  if (!post) notFound()

  const supabase = await createClient()
  const coverUrl = post.cover_path
    ? supabase.storage.from('institute-media').getPublicUrl(post.cover_path).data.publicUrl
    : null

  const { data: moreData } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, cover_path, published_at')
    .eq('published', true)
    .neq('id', post.id)
    .order('published_at', { ascending: false })
    .limit(3)

  const morePosts = (moreData ?? []).map((p) => ({
    ...p,
    cover_url: p.cover_path
      ? supabase.storage.from('institute-media').getPublicUrl(p.cover_path).data.publicUrl
      : '',
  }))

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      <Link
        href="/blogs"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-brand-teal)] dark:hover:text-white transition-colors"
      >
        ← Back to Blog
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

      <header className="space-y-3">
        {post.published_at && (
          <p className="text-sm text-[var(--color-text-muted)]">
            {formatDate(post.published_at)}
          </p>
        )}
        <h1 className="font-display text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] dark:text-white leading-tight">
          {post.title}
        </h1>
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
              <BlogCard key={p.id} {...p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
