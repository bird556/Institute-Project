'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import PartnerCard, { type PartnerCardProps } from './PartnerCard'

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
}

export default function PartnerGrid({ partners }: { partners: PartnerCardProps[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      variants={container}
      initial="hidden"
      animate={inView ? 'show' : 'hidden'}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {partners.map((partner) => (
        <motion.div key={partner.id} variants={item} className="h-full">
          <PartnerCard {...partner} />
        </motion.div>
      ))}
    </motion.div>
  )
}
