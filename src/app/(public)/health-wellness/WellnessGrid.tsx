'use client'

import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import WellnessCard from '@/components/wellness/WellnessCard'
import { WELLNESS_TAGS } from '@/types'

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

  function setTag(tag: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (tag && tag !== activeTag) {
      params.set('tag', tag)
    } else {
      params.delete('tag')
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const filtered = activeTag
    ? posts.filter((p) => p.tags.includes(activeTag))
    : posts

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
        {WELLNESS_TAGS.map((tag) => {
          const isActive = activeTag === tag
          const count    = posts.filter((p) => p.tags.includes(tag)).length
          if (count === 0) return null
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
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filtered.map((post) => (
            <motion.div key={post.id} variants={item}>
              <WellnessCard {...post} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
