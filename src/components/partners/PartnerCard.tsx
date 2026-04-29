'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { stripHtml } from '@/lib/utils'

export interface PartnerCardProps {
  id: string
  name: string
  logo_url: string
  description: string
  website_url?: string | null
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')
}

export default function PartnerCard({ id, name, logo_url, description }: PartnerCardProps) {
  return (
    <Link href={`/partners/${id}`} className="block h-full">
      <motion.div
        whileHover={{ y: -2 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        className="flex flex-col h-full rounded-2xl bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] border border-[var(--color-border)] dark:border-[var(--color-dark-border)] hover:shadow-lg hover:border-[var(--color-brand-teal-light)] dark:hover:border-[var(--color-brand-teal)] transition-all duration-300 p-6 space-y-4"
      >
        {/* Logo or initials */}
        <div className="flex items-center justify-center h-16">
          {logo_url ? (
            <div className="relative h-16 w-full">
              <Image
                src={logo_url}
                alt={`${name} logo`}
                fill
                unoptimized
                className="object-contain"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
          ) : (
            <div className="h-14 w-14 rounded-full bg-[var(--color-brand-teal)] flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-lg leading-none">
                {getInitials(name)}
              </span>
            </div>
          )}
        </div>

        {/* Name */}
        <h2 className="font-display text-lg font-bold text-[var(--color-text-primary)] dark:text-white leading-snug text-center">
          {name}
        </h2>

        {/* Description — HTML stripped and truncated on card */}
        {description && (
          <p className="text-sm text-[var(--color-text-muted)] leading-relaxed line-clamp-4 flex-1">
            {stripHtml(description)}
          </p>
        )}

        <p className="text-xs font-medium text-[var(--color-brand-teal)] dark:text-white mt-auto">
          Learn more →
        </p>
      </motion.div>
    </Link>
  )
}
