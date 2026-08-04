import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { buildMetadata } from '@/lib/metadata'
import { getPageContent } from '@/actions/page-content'
import BookstoreSection from '@/components/reading-list/BookstoreSection'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ title: 'Bookstores — Reading List' })
}

export default async function BookstoresPage() {
  const [{ data: sections }, supabase] = await Promise.all([
    getPageContent('bookstores'),
    createClient(),
  ])

  const heroTitle    = sections?.find((s) => s.section === 'hero_title')?.content    ?? 'Bookstores'
  const heroSubtitle = sections?.find((s) => s.section === 'hero_subtitle')?.content ?? ''

  const { data } = await supabase
    .from('bookstores')
    .select('id, name, description, email, province, address, phone_number, website_url, photo_path')
    .eq('published', true)
    .order('name', { ascending: true })

  const bookstores = (data ?? []).map((b) => ({
    id: b.id,
    name: b.name,
    description: b.description,
    email: b.email,
    province: b.province,
    address: b.address,
    phone_number: b.phone_number,
    website_url: b.website_url,
    photo_url: b.photo_path
      ? supabase.storage.from('institute-media').getPublicUrl(b.photo_path).data.publicUrl
      : null,
  }))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      <header className="space-y-3">
        <Link
          href="/reading-list"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-brand-teal)] transition-colors"
        >
          <ChevronLeft size={15} /> Reading List
        </Link>
        <h1 className="font-display text-4xl font-bold text-[var(--color-brand-teal)] dark:text-white">
          {heroTitle}
        </h1>
        {heroSubtitle && (
          <p className="text-lg text-[var(--color-text-muted)] max-w-2xl">{heroSubtitle}</p>
        )}
      </header>

      <BookstoreSection items={bookstores} defaultOpen collapsible={false} />
    </div>
  )
}
