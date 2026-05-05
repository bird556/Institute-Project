'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { FadeUp } from '@/components/shared/FadeUp'
import { formatDate } from '@/lib/utils'

interface UpcomingEvent {
  id: string
  title: string
  location: string | null
  event_date: string
}

interface Props {
  events: UpcomingEvent[]
}

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
}

export function UpcomingEventsSection({ events }: Props) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section ref={ref} className="py-16 px-4 sm:px-6 lg:px-8 bg-(--color-brand-primary) dark:bg-dark-surface">
      <div className="max-w-6xl mx-auto">
        <FadeUp>
          <h2 className="font-display text-3xl font-bold text-white mb-8">
            Upcoming Events
          </h2>
        </FadeUp>

        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          className="grid sm:grid-cols-2 gap-6"
        >
          {events.map((event) => (
            <motion.div key={event.id} variants={item}>
              <Link
                href={`/events/${event.id}`}
                className="group block rounded-xl border border-white/20 bg-white/10 p-6 hover:bg-white/20 transition-colors"
              >
                <p className="text-xs text-white/60 mb-2">
                  {formatDate(event.event_date)} · {event.location}
                </p>
                <h3 className="font-display text-lg font-bold text-white">
                  {event.title}
                </h3>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-8">
          <Link
            href="/events"
            className="text-sm font-medium text-[hsl(35_60%_50%)] hover:underline"
          >
            View all events →
          </Link>
        </div>
      </div>
    </section>
  )
}
