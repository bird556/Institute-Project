'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import EventCard, { type EventCardProps } from '@/components/events/EventCard'

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

export default function EventGrid({ events }: { events: EventCardProps[] }) {
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
      {events.map((event) => (
        <motion.div key={event.id} variants={item}>
          <EventCard {...event} />
        </motion.div>
      ))}
    </motion.div>
  )
}
