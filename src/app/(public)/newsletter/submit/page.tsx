import SubmitForm from './SubmitForm'

export const metadata = {
  title: 'Submit a Contribution',
  description: 'Submit a research call, research note, or analytical commentary to our quarterly newsletter.',
}

export default function SubmitPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      <header className="space-y-3">
        <h1 className="font-display text-4xl font-bold text-[var(--color-brand-teal)] dark:text-white">
          Submit a Contribution
        </h1>
        <p className="text-lg text-[var(--color-text-muted)] max-w-2xl">
          We welcome research calls, practitioner research notes, and analytical commentaries. All submissions are reviewed by our editorial team before publication.
        </p>
      </header>
      <SubmitForm />
    </div>
  )
}
