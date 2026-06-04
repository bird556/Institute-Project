'use client'

import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Calendar } from 'lucide-react'
import { motion } from 'framer-motion'
import { formatDate, formatTime } from '@/lib/utils'

export interface EventCardProps {
  id: string
  title: string
  description_excerpt: string
  cover_url: string
  location: string
  event_date: string
  isPast: boolean
  event_type?: 'kustawi' | 'other'
}

export default function EventCard({
  id,
  title,
  description_excerpt,
  cover_url,
  location,
  event_date,
  isPast,
  event_type,
}: EventCardProps) {
  return (
    <motion.div
      className="group h-full"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
    >
      <Link
        href={`/events/${id}`}
        className="flex flex-col h-full rounded-2xl overflow-hidden bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] border border-[var(--color-border)] dark:border-[var(--color-dark-border)] hover:shadow-lg hover:border-[var(--color-brand-teal-light)] dark:hover:border-[var(--color-brand-teal)] transition-all duration-300"
      >
        {/* Cover image */}
        <div className="relative aspect-video w-full overflow-hidden">
          {cover_url ? (
            <Image
              src={cover_url}
              alt={title}
              fill
              className={`object-cover transition-transform duration-500 group-hover:scale-105${isPast ? ' grayscale-[40%]' : ''}`}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-brand-teal)] to-[var(--color-brand-teal-light)]" />
          )}
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 p-5 space-y-2">
          {/* Date & time */}
          <div className="flex items-center gap-1.5 text-sm text-[var(--color-text-muted)]">
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            <span>
              {formatDate(event_date)} · {formatTime(event_date)}
            </span>
          </div>

          {/* Location */}
          {location && (
            <div className="flex items-center gap-1.5 text-sm text-[var(--color-text-muted)]">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="line-clamp-1">{location}</span>
            </div>
          )}

          {/* Type pill */}
          {event_type && (
            <span className={`self-start text-xs font-semibold px-2.5 py-0.5 rounded-full ${
              event_type === 'kustawi'
                ? 'bg-[var(--color-brand-teal)] text-white'
                : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
            }`}>
              {event_type === 'kustawi' ? 'Kustawi' : 'Other Event'}
            </span>
          )}

          {/* Title */}
          <h2 className="font-display text-xl font-bold text-[var(--color-text-primary)] dark:text-white line-clamp-2 leading-snug">
            {title}
          </h2>

          {/* Excerpt */}
          <p className="text-sm text-[var(--color-text-muted)] line-clamp-3 leading-relaxed flex-1">
            {description_excerpt}
          </p>

          {/* CTA */}
          <p className="text-sm font-medium text-[var(--color-brand-teal)] dark:text-[var(--color-brand-teal-light)] group-hover:underline pt-1">
            {isPast ? 'View Past Event →' : 'View Event →'}
          </p>
        </div>
      </Link>
    </motion.div>
  )
}
