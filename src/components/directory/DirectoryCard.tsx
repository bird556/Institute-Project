'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Globe, Mail, UserRound, Building2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { DIRECTORY_MODE_LABELS, type DirectoryCategory, type DirectoryMode } from '@/types'

export interface DirectoryCardProps {
  id: string
  name: string
  organization: string | null
  description_excerpt: string | null
  photo_url: string | null
  website_url: string | null
  email: string | null
  mode: DirectoryMode | null
  category: DirectoryCategory
  created_at: string
}

function PlaceholderIcon({ category }: { category: DirectoryCategory }) {
  const Icon = category === 'referral_agency' ? Building2 : UserRound
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface-hover)]">
      <Icon className="w-16 h-16 text-[var(--color-text-muted)] opacity-30" strokeWidth={1} />
    </div>
  )
}

const CATEGORY_HREFS: Record<DirectoryCategory, string> = {
  advocate:         '/advocates',
  psychotherapist:  '/psychotherapists',
  referral_agency:  '/referral-agencies',
  black_mens_group: '/black-mens-groups',
}

export default function DirectoryCard({
  id, name, organization, description_excerpt,
  photo_url, website_url, email, mode, category,
}: DirectoryCardProps) {
  const href = `${CATEGORY_HREFS[category]}/${id}`

  return (
    <motion.div
      className="group h-full"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
    >
      <div className="flex flex-col h-full rounded-2xl overflow-hidden bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] border border-[var(--color-border)] dark:border-[var(--color-dark-border)] hover:shadow-lg hover:border-[var(--color-brand-teal-light)] dark:hover:border-[var(--color-brand-teal)] transition-all duration-300">
        {/* Photo — clickable */}
        <Link href={href} className="block relative w-full overflow-hidden cursor-pointer" style={{ aspectRatio: '1/1' }}>
          {photo_url ? (
            <Image
              src={photo_url}
              alt={name}
              fill
              className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <PlaceholderIcon category={category} />
          )}
        </Link>

        {/* Body */}
        <div className="flex flex-col flex-1 p-4 space-y-2">
          {mode && (
            <span className="self-start text-xs font-medium px-2 py-0.5 rounded-full border border-[var(--color-brand-teal)] text-[var(--color-brand-teal)] dark:text-white dark:border-white/30">
              {DIRECTORY_MODE_LABELS[mode]}
            </span>
          )}

          <h2 className="font-display text-base font-bold text-[var(--color-text-primary)] dark:text-white line-clamp-2 leading-snug">
            {name}
          </h2>

          {organization && (
            <p className="text-sm text-[var(--color-text-muted)] line-clamp-1">{organization}</p>
          )}

          {description_excerpt && (
            <p className="text-sm text-[var(--color-text-muted)] line-clamp-3 leading-relaxed flex-1">
              {description_excerpt}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href={href}
              className="text-sm font-medium text-[var(--color-brand-teal)] dark:text-white hover:underline"
            >
              View Profile →
            </Link>
            {website_url && (
              <a
                href={website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-brand-teal)] dark:hover:text-white transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <Globe className="w-3.5 h-3.5" />
                Website
              </a>
            )}
            {email && (
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center gap-1 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-brand-teal)] dark:hover:text-white transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <Mail className="w-3.5 h-3.5" />
                Email
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
