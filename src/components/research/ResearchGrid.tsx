'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import ResearchCard from './ResearchCard'
import Pagination from '@/components/shared/Pagination'
import type { ResearchCategory } from '@/types'

const PAGE_SIZE = 16

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
}

interface ResearchGridProps {
  posts: ResearchGridPost[]
}

export default function ResearchGrid({ posts }: ResearchGridProps) {
  const [page, setPage] = useState(1)

  const totalPages = Math.ceil(posts.length / PAGE_SIZE)
  const paginated  = posts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  if (posts.length === 0) {
    return (
      <p className="text-[var(--color-text-muted)] py-8">No posts yet — check back soon.</p>
    )
  }

  return (
    <div className="space-y-8">
      <motion.div
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
      <Pagination page={page} totalPages={totalPages} onPageChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }} />
    </div>
  )
}
