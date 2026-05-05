'use client'

import { motion } from 'framer-motion'

interface Props {
  children: React.ReactNode
  className?: string
}

export function DetailPageShell({ children, className }: Props) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
    >
      {children}
    </motion.div>
  )
}
