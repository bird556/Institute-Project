'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import DirectoryCard, { type DirectoryCardProps } from './DirectoryCard'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
}

export default function DirectoryGrid({ entries }: { entries: DirectoryCardProps[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      variants={container}
      initial="hidden"
      animate={inView ? 'show' : 'hidden'}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      {entries.map((entry) => (
        <motion.div key={entry.id} variants={item}>
          <DirectoryCard {...entry} />
        </motion.div>
      ))}
    </motion.div>
  )
}
