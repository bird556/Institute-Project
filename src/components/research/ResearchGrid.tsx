'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import ResearchCard from './ResearchCard'
import Pagination from '@/components/shared/Pagination'
import type { ResearchCategory } from '@/types'

const PAGE_SIZE = 16

type SortOrder = 'recent' | 'oldest' | 'a-z' | 'z-a'
type RegionFilter = 'all' | 'canadian' | 'world'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
}

interface ResearchGridPost {
  id: string
  title: string
  excerpt: string | null
  cover_url: string
  category: ResearchCategory
  published_at: string | null
  region?: 'canadian' | 'world' | null
  external_url?: string | null
}

interface ResearchGridProps {
  posts: ResearchGridPost[]
  showRegionFilter?: boolean
}

const filterBtnClass = (active: boolean) =>
  `px-3 py-1.5 text-sm rounded-md cursor-pointer transition-colors ${
    active
      ? 'bg-[var(--color-brand-teal)] text-white'
      : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] dark:hover:bg-[var(--color-dark-surface-hover)]'
  }`

export default function ResearchGrid({ posts, showRegionFilter = false }: ResearchGridProps) {
  const [page, setPage]           = useState(1)
  const [sort, setSort]           = useState<SortOrder>('recent')
  const [region, setRegion]       = useState<RegionFilter>('all')

  function resetPage() { setPage(1) }

  const filtered = posts.filter((p) => {
    if (!showRegionFilter || region === 'all') return true
    return p.region === region
  })

  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'a-z') return a.title.localeCompare(b.title)
    if (sort === 'z-a') return b.title.localeCompare(a.title)
    const aDate = a.published_at ? new Date(a.published_at).getTime() : 0
    const bDate = b.published_at ? new Date(b.published_at).getTime() : 0
    if (sort === 'oldest') return aDate - bDate
    return bDate - aDate // 'recent' default
  })

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE)
  const paginated  = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  if (posts.length === 0) {
    return (
      <p className="text-[var(--color-text-muted)] py-8">No posts yet — check back soon.</p>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {showRegionFilter && (
          <div className="flex gap-1 p-1 rounded-lg bg-surface dark:bg-dark-surface w-fit">
            {(['all', 'canadian', 'world'] as RegionFilter[]).map((r) => (
              <button
                key={r}
                onClick={() => { setRegion(r); resetPage() }}
                className={filterBtnClass(region === r)}
              >
                {r === 'all' ? 'All' : r === 'canadian' ? 'Canadian' : 'International'}
              </button>
            ))}
          </div>
        )}

        <div className={showRegionFilter ? 'sm:ml-auto' : ''}>
          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value as SortOrder); resetPage() }}
            className="h-9 px-3 text-sm rounded-lg border border-(--color-border) dark:border-dark-border bg-(--color-background) dark:bg-dark-surface text-text-primary dark:text-[#e8ecec] focus:outline-none focus:border-(--color-brand-teal) transition-colors cursor-pointer"
          >
            <option value="recent">Date Added: Newest</option>
            <option value="oldest">Date Added: Oldest</option>
            <option value="a-z">A–Z</option>
            <option value="z-a">Z–A</option>
          </select>
        </div>
      </div>

      {sorted.length === 0 ? (
        <p className="text-text-muted py-8">No posts match the selected filter.</p>
      ) : (
        <div className="space-y-8">
          <motion.div
            key={`${sort}-${region}-${page}`}
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {paginated.map((post) => (
              <motion.div key={post.id} variants={item}>
                <ResearchCard {...post} />
              </motion.div>
            ))}
          </motion.div>
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
          />
        </div>
      )}
    </div>
  )
}
