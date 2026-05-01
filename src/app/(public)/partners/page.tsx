import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import PartnerGrid from '@/components/partners/PartnerGrid'
import { getPageContent } from '@/actions/page-content'
import { buildMetadata } from '@/lib/metadata'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ title: 'Partners' })
}

export default async function PartnersPage() {
  const [{ data: sections }, supabase] = await Promise.all([
    getPageContent('partners'),
    createClient(),
  ])
  const heroTitle    = sections?.find((s) => s.section === 'hero_title')?.content    ?? 'Our Partners'
  const heroSubtitle = sections?.find((s) => s.section === 'hero_subtitle')?.content ?? ''

  const { data } = await supabase
    .from('partners')
    .select('*')
    .eq('published', true)
    .order('sort_order', { ascending: true })

  const partners = (data ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    logo_url: p.logo_path
      ? supabase.storage.from('institute-media').getPublicUrl(p.logo_path).data.publicUrl
      : '',
    description: p.description ?? '',
    website_url: p.website_url,
  }))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      <header className="space-y-3">
        <h1 className="font-display text-4xl font-bold text-[var(--color-brand-teal)] dark:text-white">
          {heroTitle}
        </h1>
        {heroSubtitle && (
          <p className="text-lg text-[var(--color-text-muted)] max-w-2xl">{heroSubtitle}</p>
        )}
      </header>

      {partners.length === 0 ? (
        <p className="text-[var(--color-text-muted)] py-8">No partners listed yet.</p>
      ) : (
        <PartnerGrid partners={partners} />
      )}
    </div>
  )
}
