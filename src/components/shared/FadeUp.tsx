'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface FadeUpProps {
  children: React.ReactNode
  className?: string
  delay?: number
  distance?: number
}

export function FadeUp({ children, className, delay = 0, distance = 24 }: FadeUpProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: distance }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: distance }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number], delay }}
    >
      {children}
    </motion.div>
  )
}
