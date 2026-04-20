import { Suspense } from 'react'
import type { Metadata } from 'next'
import { mockWellnessPosts } from '@/lib/mock-data'
import { getPageContent } from '@/actions/page-content'
import WellnessGrid from './WellnessGrid'

export const metadata: Metadata = {
  title: 'Health & Wellness | Institute Name',
  description: 'Resources, guides, and insights to support your wellbeing.',
}

export default async function HealthWellnessPage() {
  const { data: sections } = await getPageContent('health_wellness')
  const heroTitle    = sections?.find((s) => s.section === 'hero_title')?.content    ?? 'Health & Wellness'
  const heroSubtitle = sections?.find((s) => s.section === 'hero_subtitle')?.content ?? ''

  const posts = mockWellnessPosts
    .filter((w) => w.published)
    .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
    .map((w) => ({
      id:           w.id,
      title:        w.title,
      excerpt:      w.excerpt,
      cover_url:    w.cover_url,
      tags:         w.tags,
      published_at: w.published_at || null,
    }))

  // TODO: replace with:
  // const supabase = await createClient()
  // const { data } = await supabase
  //   .from('wellness_posts')
  //   .select('id, title, slug, excerpt, cover_path, tags, published_at')
  //   .eq('published', true)
  //   .order('published_at', { ascending: false })
  // const posts = (data ?? []).map((w) => ({
  //   ...w,
  //   cover_url: w.cover_path
  //     ? supabase.storage.from('institute-media').getPublicUrl(w.cover_path).data.publicUrl
  //     : '',
  // }))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      {/* Page header */}
      <header className="space-y-3">
        <h1 className="font-display text-4xl font-bold text-[var(--color-brand-teal)] dark:text-white">
          {heroTitle}
        </h1>
        {heroSubtitle && (
          <p className="text-lg text-[var(--color-text-muted)] max-w-2xl">{heroSubtitle}</p>
        )}
      </header>

      {/* Grid with tag filter — needs Suspense for useSearchParams */}
      <Suspense>
        <WellnessGrid posts={posts} />
      </Suspense>
    </div>
  )
}
