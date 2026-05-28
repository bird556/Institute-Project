'use client'

import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import WellnessCard from '@/components/wellness/WellnessCard'
import Pagination from '@/components/shared/Pagination'
import { WELLNESS_TAGS } from '@/types'

const PAGE_SIZE = 16

function getAllTags(posts: WellnessGridPost[]): string[] {
  const hardcoded = WELLNESS_TAGS as readonly string[]
  const all = posts.flatMap((p) => p.tags)
  const custom = [...new Set(all.filter((t) => !hardcoded.includes(t)))]
  return [...hardcoded.filter((t) => all.includes(t)), ...custom]
}

interface WellnessGridPost {
  id: string
  title: string
  excerpt: string | null
  cover_url: string
  tags: string[]
  published_at: string | null
}

interface WellnessGridProps {
  posts: WellnessGridPost[]
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
}

export default function WellnessGrid({ posts }: WellnessGridProps) {
  const searchParams = useSearchParams()
  const router       = useRouter()
  const pathname     = usePathname()
  const activeTag    = searchParams.get('tag') ?? ''
  const page         = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))

  function setTag(tag: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (tag && tag !== activeTag) {
      params.set('tag', tag)
    } else {
      params.delete('tag')
    }
    params.delete('page')
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  function setPage(p: number) {
    const params = new URLSearchParams(searchParams.toString())
    if (p <= 1) {
      params.delete('page')
    } else {
      params.set('page', String(p))
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: true })
  }

  const filtered = activeTag
    ? posts.filter((p) => p.tags.includes(activeTag))
    : posts

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="space-y-8">
      {/* Tag filter bar */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setTag('')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${
            !activeTag
              ? 'bg-[var(--color-brand-teal)] text-white'
              : 'bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] dark:hover:bg-[var(--color-dark-surface-hover)]'
          }`}
        >
          All
        </button>
        {getAllTags(posts).map((tag) => {
          const isActive = activeTag === tag
          return (
            <button
              key={tag}
              onClick={() => setTag(tag)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                isActive
                  ? 'bg-[var(--color-brand-teal)] text-white'
                  : 'bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] dark:hover:bg-[var(--color-dark-surface-hover)]'
              }`}
            >
              {tag}
            </button>
          )
        })}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-[var(--color-text-muted)]">
            No posts found{activeTag ? ` for "${activeTag}"` : ''}.
          </p>
        </div>
      ) : (
        <>
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {paginated.map((post) => (
              <motion.div key={post.id} variants={item}>
                <WellnessCard {...post} />
              </motion.div>
            ))}
          </motion.div>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  )
}
