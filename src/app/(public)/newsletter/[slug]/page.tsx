import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPublishedEditionBySlug, getEditionSubmissions } from '@/actions/newsletter'
import { formatDate } from '@/lib/utils'
import type { NewsletterSubmission } from '@/types'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function EditionDetailPage({ params }: Props) {
  const { slug } = await params
  const { data: edition } = await getPublishedEditionBySlug(slug)
  if (!edition) notFound()

  const { data: submissions = [] } = await getEditionSubmissions(edition.id)

  const researchCalls = submissions.filter((s) => s.type === 'research_call')
  const researchNotes = submissions.filter((s) => s.type === 'research_note')
  const commentaries  = submissions.filter((s) => s.type === 'commentary')

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      {/* Back link */}
      <Link
        href="/newsletter"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-brand-teal)] transition-colors"
      >
        ← All Editions
      </Link>

      {/* Edition header */}
      <header className="space-y-2">
        <h1 className="font-display text-4xl font-bold text-[var(--color-brand-teal)] dark:text-white">
          {edition.title}
        </h1>
        {edition.published_at && (
          <p className="text-[var(--color-text-muted)]">
            Published {formatDate(edition.published_at)}
          </p>
        )}
      </header>

      {/* Editorial introduction */}
      {edition.intro && (
        <section className="rounded-2xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] p-6 lg:p-8">
          <h2 className="font-display text-lg font-semibold text-[var(--color-brand-teal)] dark:text-white mb-4">
            Editorial Introduction
          </h2>
          <div
            className="tiptap-content"
            dangerouslySetInnerHTML={{ __html: edition.intro }}
          />
        </section>
      )}

      {/* Research Calls */}
      {researchCalls.length > 0 && (
        <SubmissionGroup
          heading="Research Calls"
          badge={{ label: 'RC', color: 'bg-[var(--color-brand-teal)] text-white' }}
          submissions={researchCalls}
        />
      )}

      {/* Research Notes */}
      {researchNotes.length > 0 && (
        <SubmissionGroup
          heading="Research Notes"
          badge={{ label: 'RN', color: 'bg-amber-500 text-white' }}
          submissions={researchNotes}
        />
      )}

      {/* Analytical Commentaries */}
      {commentaries.length > 0 && (
        <SubmissionGroup
          heading="Analytical Commentaries"
          badge={{ label: 'AC', color: 'bg-purple-600 text-white' }}
          submissions={commentaries}
        />
      )}

      {submissions.length === 0 && (
        <p className="text-[var(--color-text-muted)] italic">No submissions in this edition yet.</p>
      )}

      {/* Submit CTA */}
      <div className="pt-8 border-t border-[var(--color-border)] dark:border-[var(--color-dark-border)] text-center space-y-3">
        <p className="text-[var(--color-text-muted)]">
          Interested in contributing to a future edition?
        </p>
        <Link
          href="/newsletter/submit"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--color-brand-teal)] text-white text-sm font-medium hover:bg-[var(--color-brand-teal-dark)] transition-colors"
        >
          Submit a Contribution
        </Link>
      </div>
    </div>
  )
}

// ─── Submission group ─────────────────────────────────────────────────────────

function SubmissionGroup({
  heading,
  badge,
  submissions,
}: {
  heading: string
  badge: { label: string; color: string }
  submissions: NewsletterSubmission[]
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <h2 className="font-display text-2xl font-bold text-[var(--color-brand-teal)] dark:text-white">
          {heading}
        </h2>
        <span className={`px-2 py-0.5 rounded text-xs font-bold ${badge.color}`}>
          {badge.label}
        </span>
        <span className="text-sm text-[var(--color-text-muted)]">
          ({submissions.length})
        </span>
      </div>

      <div className="space-y-6">
        {submissions.map((s) => (
          <SubmissionCard key={s.id} submission={s} />
        ))}
      </div>
    </section>
  )
}

// ─── Individual submission card ───────────────────────────────────────────────

function SubmissionCard({ submission: s }: { submission: NewsletterSubmission }) {
  return (
    <article className="rounded-2xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] p-6 space-y-4">
      {/* Header */}
      <header className="space-y-1">
        <h3 className="font-display text-xl font-semibold text-[var(--color-text-primary)] dark:text-white">
          {s.title}
        </h3>
        <p className="text-sm text-[var(--color-text-muted)]">
          {s.submitter_name}
          {s.submitter_role ? ` · ${s.submitter_role}` : ''}
          {s.institution ? ` · ${s.institution}` : ''}
        </p>

        {/* Research call extras */}
        {s.type === 'research_call' && (
          <div className="flex flex-wrap gap-4 pt-1 text-sm text-[var(--color-text-muted)]">
            {s.deadline && (
              <span>
                <span className="font-medium text-[var(--color-text-primary)] dark:text-[#e8ecec]">Deadline:</span>{' '}
                {formatDate(s.deadline)}
              </span>
            )}
            {s.contact_email && (
              <span>
                <span className="font-medium text-[var(--color-text-primary)] dark:text-[#e8ecec]">Contact:</span>{' '}
                <a href={`mailto:${s.contact_email}`} className="text-[var(--color-brand-teal)] hover:underline">
                  {s.contact_email}
                </a>
              </span>
            )}
          </div>
        )}
      </header>

      {/* Abstract */}
      {s.abstract && (
        <p className="text-[var(--color-text-muted)] italic text-sm leading-relaxed">
          {s.abstract}
        </p>
      )}

      {/* Content */}
      {s.content && (
        <div
          className="tiptap-content"
          dangerouslySetInnerHTML={{ __html: s.content }}
        />
      )}
    </article>
  )
}
