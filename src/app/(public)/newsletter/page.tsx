import type { Metadata } from 'next'
import Link from 'next/link'
import { getPublishedEditions, getEditionSubmissions } from '@/actions/newsletter'
import { getPageContent } from '@/actions/page-content'
import { buildMetadata } from '@/lib/metadata'
import { EditionList } from './EditionList'
import type { EditionRow } from './EditionList'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ title: 'Newsletter' })
}

export default async function NewsletterPage() {
  const [{ data: editions = [] }, { data: sections }] = await Promise.all([
    getPublishedEditions(),
    getPageContent('newsletter'),
  ])
  const heroTitle    = sections?.find((s) => s.section === 'hero_title')?.content    ?? 'Newsletter'
  const heroSubtitle = sections?.find((s) => s.section === 'hero_subtitle')?.content ?? ''

  const submissionsResults = await Promise.all(
    editions.map((e) => getEditionSubmissions(e.id))
  )

  const editionRows: EditionRow[] = editions.map((edition, i) => {
    const subs = submissionsResults[i].data ?? []
    return {
      id:               edition.id,
      title:            edition.title,
      slug:             edition.slug,
      published_at:     edition.published_at ?? null,
      totalSubmissions: subs.length,
      rcCount:          subs.filter((s) => s.type === 'research_call').length,
      rnCount:          subs.filter((s) => s.type === 'research_note').length,
      acCount:          subs.filter((s) => s.type === 'commentary').length,
    }
  })

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <header className="space-y-3">
        <h1 className="font-display text-4xl font-bold text-(--color-brand-teal) dark:text-white">
          {heroTitle}
        </h1>
        {heroSubtitle && (
          <p className="text-lg text-text-muted max-w-2xl">{heroSubtitle}</p>
        )}
        <div className="pt-2">
          <Link
            href="/newsletter/submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-(--color-brand-teal) text-white text-sm font-medium hover:bg-(--color-brand-teal-dark) transition-colors"
          >
            Submit a Contribution
          </Link>
        </div>
      </header>

      {editionRows.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-text-muted">No editions published yet. Check back soon.</p>
        </div>
      ) : (
        <EditionList editions={editionRows} />
      )}
    </div>
  )
}
