import Link from 'next/link'
import { getPublishedEditions, getEditionSubmissions } from '@/actions/newsletter'
import { getPageContent } from '@/actions/page-content'
import { formatDate } from '@/lib/utils'
import type { NewsletterEdition } from '@/types'

export const metadata = {
  title: 'Newsletter',
  description: 'Quarterly scholarly newsletter featuring research calls, practitioner notes, and analytical commentaries.',
}

export default async function NewsletterPage() {
  const [{ data: editions = [] }, { data: sections }] = await Promise.all([
    getPublishedEditions(),
    getPageContent('newsletter'),
  ])
  const heroTitle    = sections?.find((s) => s.section === 'hero_title')?.content    ?? 'Newsletter'
  const heroSubtitle = sections?.find((s) => s.section === 'hero_subtitle')?.content ?? ''

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      {/* Header */}
      <header className="space-y-3">
        <h1 className="font-display text-4xl font-bold text-[var(--color-brand-teal)] dark:text-white">
          {heroTitle}
        </h1>
        {heroSubtitle && (
          <p className="text-lg text-[var(--color-text-muted)] max-w-2xl">{heroSubtitle}</p>
        )}
        <div className="pt-2">
          <Link
            href="/newsletter/submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--color-brand-teal)] text-white text-sm font-medium hover:bg-[var(--color-brand-teal-dark)] transition-colors"
          >
            Submit a Contribution
          </Link>
        </div>
      </header>

      {/* Edition list */}
      {editions.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-[var(--color-text-muted)]">No editions published yet. Check back soon.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {editions.map((edition) => (
            <EditionCard key={edition.id} edition={edition} />
          ))}
        </div>
      )}
    </div>
  )
}

async function EditionCard({ edition }: { edition: NewsletterEdition }) {
  const { data: submissions = [] } = await getEditionSubmissions(edition.id)

  const rcCount = submissions.filter((s) => s.type === 'research_call').length
  const rnCount = submissions.filter((s) => s.type === 'research_note').length
  const acCount = submissions.filter((s) => s.type === 'commentary').length

  return (
    <article className="flex gap-6 rounded-2xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] p-6 hover:border-[var(--color-brand-teal-light)] dark:hover:border-[var(--color-brand-teal)] transition-colors group">
      <div className="flex-1 space-y-3">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <Link
              href={`/newsletter/${edition.slug}`}
              className="font-display text-xl font-bold text-[var(--color-brand-teal)] dark:text-white hover:underline group-hover:text-[var(--color-brand-teal-dark)] dark:group-hover:text-[var(--color-brand-teal-light)] transition-colors"
            >
              {edition.title}
            </Link>
            {edition.published_at && (
              <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
                Published {formatDate(edition.published_at)}
              </p>
            )}
          </div>
        </div>

        {/* Submission counts */}
        <div className="flex flex-wrap gap-3 text-sm">
          <span className="text-[var(--color-text-muted)]">
            {submissions.length} {submissions.length === 1 ? 'submission' : 'submissions'}
          </span>
          {rcCount > 0 && (
            <span className="px-2 py-0.5 rounded bg-[var(--color-brand-teal)] text-white text-xs font-medium">
              RC: {rcCount}
            </span>
          )}
          {rnCount > 0 && (
            <span className="px-2 py-0.5 rounded bg-amber-500 text-white text-xs font-medium">
              RN: {rnCount}
            </span>
          )}
          {acCount > 0 && (
            <span className="px-2 py-0.5 rounded bg-purple-600 text-white text-xs font-medium">
              AC: {acCount}
            </span>
          )}
        </div>

        <Link
          href={`/newsletter/${edition.slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-brand-teal)] hover:text-[var(--color-brand-teal-dark)] transition-colors"
        >
          Read Edition →
        </Link>
      </div>
    </article>
  )
}
