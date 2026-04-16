import type { Metadata } from 'next'
import { mockBlogs } from '@/lib/mock-data'
import BlogGrid from '@/components/blog/BlogGrid'

export const metadata: Metadata = {
  title: 'Blog | Institute Name',
  description: 'Insights and perspectives from the Institute.',
}

export default async function BlogsPage() {
  const posts = mockBlogs
    .filter((b) => b.published)
    .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
    .map((b) => ({
      id: b.id,
      title: b.title,
      slug: b.slug,
      excerpt: b.excerpt,
      cover_url: b.cover_url,
      published_at: b.published_at,
    }))

  // TODO: replace with:
  // const supabase = await createClient()
  // const { data } = await supabase
  //   .from('blog_posts')
  //   .select('id, title, slug, excerpt, cover_path, published_at')
  //   .eq('published', true)
  //   .order('published_at', { ascending: false })
  // const posts = (data ?? []).map((p) => ({
  //   ...p,
  //   cover_url: p.cover_path
  //     ? supabase.storage.from('institute-media').getPublicUrl(p.cover_path).data.publicUrl
  //     : '',
  // }))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      {/* Page header */}
      <header className="space-y-3">
        <h1 className="font-display text-4xl font-bold text-[var(--color-brand-teal)] dark:text-white">
          Blog
        </h1>
        <p className="text-lg text-[var(--color-text-muted)] max-w-2xl">
          Insights, research and perspectives from the Institute.
        </p>
      </header>

      {/* Grid or empty state */}
      {posts.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-[var(--color-text-muted)]">No posts yet — check back soon.</p>
        </div>
      ) : (
        <BlogGrid posts={posts} />
      )}
    </div>
  )
}
