import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getPageContent } from '@/actions/page-content'
import ResearchGrid from '@/components/research/ResearchGrid'
import { buildMetadata } from '@/lib/metadata'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ title: 'Research Institutes — Research' })
}

export default async function ResearchInstitutesPage() {
  const [supabase, { data: sections }] = await Promise.all([
    createClient(),
    getPageContent('research'),
  ])
  const subtitle = sections?.find((s) => s.section === 'research_institutes_description')?.content ?? ''

  const { data } = await supabase
    .from('research_posts')
    .select('id, title, excerpt, cover_path, category, published_at, external_url, region')
    .eq('published', true)
    .eq('category', 'research-institutes')
    .order('published_at', { ascending: false })

  const posts = (data ?? []).map((p) => ({
    id:           p.id,
    title:        p.title,
    excerpt:      p.excerpt,
    cover_url:    p.cover_path
      ? supabase.storage.from('institute-media').getPublicUrl(p.cover_path).data.publicUrl
      : '',
    category:     p.category as 'research-institutes',
    published_at: p.published_at,
    region:       (p.region ?? null) as 'canadian' | 'world' | null,
    external_url: p.external_url ?? null,
  }))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="space-y-3">
        <Link
          href="/research"
          className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-(--color-brand-teal) transition-colors"
        >
          <ChevronLeft size={15} /> Research
        </Link>
        <h1 className="font-display text-4xl font-bold text-(--color-brand-teal) dark:text-white">
          Research Institutes
        </h1>
        {subtitle && (
          <p className="text-lg text-text-muted max-w-2xl">{subtitle}</p>
        )}
      </div>

      <ResearchGrid posts={posts} showRegionFilter />
    </div>
  )
}
