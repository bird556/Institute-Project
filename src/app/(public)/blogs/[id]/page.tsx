import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { mockBlogs } from '@/lib/mock-data'
import BlogCard from '@/components/blog/BlogCard'
import { formatDate } from '@/lib/utils'

interface Props {
  params: Promise<{ id: string }>
}

function getPost(id: string) {
  return mockBlogs.find((b) => b.id === id && b.published) ?? null
  // TODO: replace with:
  // const supabase = await createClient()
  // const { data } = await supabase
  //   .from('blog_posts')
  //   .select('*')
  //   .eq('id', id)
  //   .eq('published', true)
  //   .single()
  // return data ?? null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const post = getPost(id)
  if (!post) return {}
  return {
    title: `${post.title} | Blog | Institute Name`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.cover_url ? [{ url: post.cover_url }] : [],
    },
  }
}

export default async function BlogDetailPage({ params }: Props) {
  const { id } = await params
  const post = getPost(id)
  if (!post) notFound()

  const morePosts = mockBlogs
    .filter((b) => b.published && b.id !== post.id)
    .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
    .slice(0, 3)
    .map((b) => ({
      id: b.id,
      title: b.title,
      slug: b.slug,
      excerpt: b.excerpt,
      cover_url: b.cover_url,
      published_at: b.published_at,
    }))

  // TODO: replace morePosts with:
  // const { data } = await supabase
  //   .from('blog_posts')
  //   .select('id, title, slug, excerpt, cover_path, published_at')
  //   .eq('published', true)
  //   .neq('id', post.id)
  //   .order('published_at', { ascending: false })
  //   .limit(3)
  // const morePosts = (data ?? []).map((p) => ({
  //   ...p,
  //   cover_url: p.cover_path
  //     ? supabase.storage.from('institute-media').getPublicUrl(p.cover_path).data.publicUrl
  //     : '',
  // }))

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      {/* Back link */}
      <Link
        href="/blogs"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-brand-teal)] transition-colors"
      >
        ← Back to Blog
      </Link>

      {/* Cover image */}
      {post.cover_url && (
        <div className="relative w-full rounded-2xl overflow-hidden" style={{ aspectRatio: '16/7' }}>
          <Image
            src={post.cover_url}
            alt={post.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 896px"
          />
        </div>
      )}

      {/* Article header */}
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

      {/* Article body */}
      <div
        className="tiptap-content prose max-w-prose mx-auto"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* More Posts */}
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
