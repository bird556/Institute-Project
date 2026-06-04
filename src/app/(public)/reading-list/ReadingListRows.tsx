'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import ReadingListRow, { type ReadingListRowProps } from '@/components/reading-list/ReadingListRow'

export default function ReadingListRows({ items }: { items: ReadingListRowProps[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <div
      ref={ref}
      className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] overflow-hidden divide-y divide-[var(--color-border)] dark:divide-[var(--color-dark-border)]"
    >
      {items.map((item, i) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 8 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          transition={{ delay: i * 0.04, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <ReadingListRow {...item} />
        </motion.div>
      ))}
    </div>
  )
}
