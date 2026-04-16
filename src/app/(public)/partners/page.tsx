import type { Metadata } from 'next'
import { mockPartners } from '@/lib/mock-data'
import PartnerGrid from '@/components/partners/PartnerGrid'

export const metadata: Metadata = {
  title: 'Partners | Institute Name',
  description: 'Organisations that support and collaborate with the Institute in advancing educational excellence.',
}

export default async function PartnersPage() {
  const partners = mockPartners
    .filter((p) => p.published)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((p) => ({
      id: p.id,
      name: p.name,
      logo_url: p.logo_url,
      description: p.description,
      website_url: p.website_url,
    }))

  // TODO: replace with:
  // const supabase = await createClient()
  // const { data } = await supabase
  //   .from('partners')
  //   .select('*')
  //   .eq('published', true)
  //   .order('sort_order', { ascending: true })
  // const partners = (data ?? []).map((p) => ({
  //   id: p.id,
  //   name: p.name,
  //   logo_url: p.logo_path
  //     ? supabase.storage.from('institute-media').getPublicUrl(p.logo_path).data.publicUrl
  //     : '',
  //   description: p.description ?? '',
  //   website_url: p.website_url,
  // }))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      {/* Page header */}
      <header className="space-y-3">
        <h1 className="font-display text-4xl font-bold text-[var(--color-brand-teal)] dark:text-white">
          Our Partners
        </h1>
        <p className="text-lg text-[var(--color-text-muted)] max-w-2xl">
          Organisations that support and collaborate with the Institute in advancing educational excellence.
        </p>
      </header>

      {/* Grid */}
      {partners.length === 0 ? (
        <p className="text-[var(--color-text-muted)] py-8">No partners listed yet.</p>
      ) : (
        <PartnerGrid partners={partners} />
      )}
    </div>
  )
}
