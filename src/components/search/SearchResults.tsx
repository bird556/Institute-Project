'use client'

import { motion } from 'framer-motion'
import SearchResultItem from './SearchResultItem'
import type { SearchResult } from '@/types'

interface SearchResultsProps {
  results: SearchResult[]
  query: string
}

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06 },
  },
}

const item = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
}

export default function SearchResults({ results, query }: SearchResultsProps) {
  if (!query || query.trim().length < 2) {
    return (
      <div className="py-24 text-center space-y-2">
        <p className="text-[var(--color-text-muted)]">
          Enter at least 2 characters to search.
        </p>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="py-24 text-center space-y-2">
        <p className="text-[var(--color-text-primary)] dark:text-white font-medium">
          No results for &ldquo;{query}&rdquo;
        </p>
        <p className="text-sm text-[var(--color-text-muted)]">
          Try a different keyword or browse our content below.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-[var(--color-text-muted)]">
        {results.length} result{results.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
      </p>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-3"
      >
        {results.map((result) => (
          <motion.div key={`${result.type}-${result.id}`} variants={item}>
            <SearchResultItem result={result} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
