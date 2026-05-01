import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import BlogGrid from '@/components/blog/BlogGrid'
import { getPageContent } from '@/actions/page-content'
import { buildMetadata } from '@/lib/metadata'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ title: 'Blog' })
}

export default async function BlogsPage() {
  const [{ data: sections }, supabase] = await Promise.all([
    getPageContent('blogs'),
    createClient(),
  ])
  const heroTitle    = sections?.find((s) => s.section === 'hero_title')?.content    ?? 'Our Blog'
  const heroSubtitle = sections?.find((s) => s.section === 'hero_subtitle')?.content ?? ''

  const { data } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, cover_path, published_at')
    .eq('published', true)
    .order('published_at', { ascending: false })

  const posts = (data ?? []).map((p) => ({
    ...p,
    cover_url: p.cover_path
      ? supabase.storage.from('institute-media').getPublicUrl(p.cover_path).data.publicUrl
      : '',
  }))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <header className="space-y-3">
        <h1 className="font-display text-4xl font-bold text-[var(--color-brand-teal)] dark:text-white">
          {heroTitle}
        </h1>
        {heroSubtitle && (
          <p className="text-lg text-[var(--color-text-muted)] max-w-2xl">{heroSubtitle}</p>
        )}
      </header>

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
