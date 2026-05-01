import { Suspense } from 'react'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { getPageContent } from '@/actions/page-content'
import WellnessGrid from './WellnessGrid'
import { buildMetadata } from '@/lib/metadata'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ title: 'Health & Wellness' })
}

export default async function HealthWellnessPage() {
  const [{ data: sections }, supabase] = await Promise.all([
    getPageContent('health_wellness'),
    createClient(),
  ])
  const heroTitle    = sections?.find((s) => s.section === 'hero_title')?.content    ?? 'Health & Wellness'
  const heroSubtitle = sections?.find((s) => s.section === 'hero_subtitle')?.content ?? ''

  const { data } = await supabase
    .from('wellness_posts')
    .select('id, title, slug, excerpt, cover_path, tags, published_at')
    .eq('published', true)
    .order('published_at', { ascending: false })

  const posts = (data ?? []).map((w) => ({
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <header className="space-y-3">
        <h1 className="font-display text-4xl font-bold text-[var(--color-brand-teal)] dark:text-white">
          {heroTitle}
        </h1>
        {heroSubtitle && (
          <p className="text-lg text-[var(--color-text-muted)] max-w-2xl">{heroSubtitle}</p>
        )}
      </header>

      <Suspense>
        <WellnessGrid posts={posts} />
      </Suspense>
    </div>
  )
}
