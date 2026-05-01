import type { Metadata } from 'next'
import { searchContent } from '@/actions/search'
import SearchResults from '@/components/search/SearchResults'
import { buildMetadata } from '@/lib/metadata'

interface Props {
  searchParams: Promise<{ q?: string }>
}

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ title: 'Search', noIndex: true })
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams
  const query = q?.trim() ?? ''

  const { data: results = [] } = query.length >= 2
    ? await searchContent(query)
    : { data: [] }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      {/* Page header */}
      <header className="space-y-3">
        <h1 className="font-display text-4xl font-bold text-[var(--color-brand-teal)] dark:text-white">
          Search
        </h1>
        <p className="text-lg text-[var(--color-text-muted)] max-w-xl">
          Find blogs, events, and reading list items across the site.
        </p>
      </header>

      {/* Results */}
      <SearchResults results={results} query={query} />
    </div>
  )
}
