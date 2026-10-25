import { cache } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Globe, Mail, Phone, MapPin, ArrowLeft, UserRound, Building2, Users } from 'lucide-react'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { buildMetadata } from '@/lib/metadata'
import { stripHtml, truncate } from '@/lib/utils'
import { DetailPageShell } from '@/components/shared/DetailPageShell'
import { DIRECTORY_CATEGORY_LABELS, DIRECTORY_FEE_OPTIONS, DIRECTORY_LANGUAGE_OPTIONS, DIRECTORY_HIDE_NAME, DIRECTORY_HIDE_MODE, DIRECTORY_MODE_LABELS, type DirectoryCategory, type DirectoryMode } from '@/types'

const BACK_HREFS: Record<DirectoryCategory, string> = {
  advocate:                    '/advocates',
  psychotherapist:             '/psychotherapists',
  referral_agency:             '/referral-agencies',
  black_mens_group:            '/black-mens-groups',
  youth_service_organization:  '/youth-service-organizations',
  community_organization:      '/community-organizations',
  racial_profiling_litigator:  '/racial-profiling-litigators',
}

export const getDirectoryEntry = cache(async (id: string) => {
  const supabase = await createClient()
  const { data } = await supabase
    .from('directory_entries')
    .select('*')
    .eq('id', id)
    .eq('published', true)
    .single()
  return data ?? null
})

export async function generateDirectoryDetailMetadata(id: string): Promise<Metadata> {
  const entry = await getDirectoryEntry(id)
  if (!entry) return buildMetadata({ noIndex: true })
  const supabase = await createClient()
  const imageUrl = entry.photo_path
    ? supabase.storage.from('institute-media').getPublicUrl(entry.photo_path).data.publicUrl
    : null
  return buildMetadata({
    title: entry.name.trim() || entry.organization || undefined,
    description: entry.description ? truncate(stripHtml(entry.description), 160) : undefined,
    imageUrl,
  })
}

function ChipList({ label, items }: { label: string; items: string[] }) {
  if (items.length === 0) return null
  return (
    <div className="space-y-1.5">
      <p className="text-xs uppercase tracking-wide font-medium text-[var(--color-text-muted)]">{label}</p>
      <ul className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <li key={item} className="text-xs font-medium px-2.5 py-1 rounded-full bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface-hover)] text-[var(--color-text-primary)] dark:text-[#e8ecec] border border-[var(--color-border)] dark:border-[var(--color-dark-border)]">
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default async function DirectoryDetailPage({ id }: { id: string }) {
  const entry = await getDirectoryEntry(id)
  if (!entry) notFound()

  const supabase = await createClient()
  const photoUrl = entry.photo_path
    ? supabase.storage.from('institute-media').getPublicUrl(entry.photo_path).data.publicUrl
    : null

  const backHref  = BACK_HREFS[entry.category as DirectoryCategory]
  const backLabel = DIRECTORY_CATEGORY_LABELS[entry.category as DirectoryCategory]
  const location  = [entry.city, entry.province].filter(Boolean).join(', ')
  // Name is optional for litigators — fall back to the firm/organization as the heading
  const hasName     = entry.name.trim() !== ''
  const displayName = hasName ? entry.name : (entry.organization ?? '')
  // Only show options currently offered in the editor (hidden ones may still be stored)
  const feeOptions = ((entry.fee_options ?? []) as string[]).filter((o) => (DIRECTORY_FEE_OPTIONS as readonly string[]).includes(o))
  const languages  = ((entry.languages ?? []) as string[]).filter((l) => (DIRECTORY_LANGUAGE_OPTIONS as readonly string[]).includes(l))

  return (
    <DetailPageShell className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      <Link
        href={backHref}
        className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-brand-teal)] dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to {backLabel}
      </Link>

      {/* Mobile order: details → photo → contact buttons → description.
          The two column wrappers use `contents` on mobile so their children join one ordered flex column. */}
      <div className="flex flex-col gap-6 md:grid md:grid-cols-[240px_1fr] md:gap-10 md:items-start">
        {/* Photo column */}
        <div className="contents md:block md:space-y-4">
            <div className="order-2 md:order-none relative w-full max-w-80 mx-auto md:max-w-none rounded-2xl overflow-hidden bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface-hover)]" style={{ aspectRatio: '1/1' }}>
              {photoUrl ? (
                <Image
                  src={photoUrl}
                  alt={displayName}
                  fill
                  priority
                  className={entry.image_fit === 'cover' ? 'object-cover' : 'object-contain'}
                  sizes="(max-width: 768px) 320px, 240px"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface-hover)]">
                  {entry.category === 'referral_agency'
                    ? <Building2 className="w-20 h-20 text-[var(--color-text-muted)] opacity-30" strokeWidth={1} />
                    : entry.category === 'black_mens_group'
                    ? <Users     className="w-20 h-20 text-[var(--color-text-muted)] opacity-30" strokeWidth={1} />
                    : <UserRound  className="w-20 h-20 text-[var(--color-text-muted)] opacity-30" strokeWidth={1} />
                  }
                </div>
              )}
            </div>

          <div className="order-3 md:order-none space-y-4">
            {entry.website_url && (
              <a
                href={entry.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-[var(--color-brand-teal)] hover:bg-[var(--color-brand-teal-dark)] text-white text-sm font-medium transition-colors"
              >
                <Globe className="w-4 h-4" />
                Visit Website
              </a>
            )}

            {entry.phone && (
              <a
                href={`tel:${entry.phone.replace(/[^\d+]/g, '')}`}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] text-[var(--color-text-primary)] dark:text-[#e8ecec] text-sm font-medium hover:bg-[var(--color-surface)] dark:hover:bg-[var(--color-dark-surface-hover)] transition-colors"
              >
                <Phone className="w-4 h-4 shrink-0" />
                {entry.phone}
              </a>
            )}

            {entry.email && (
              <a
                href={`mailto:${entry.email}`}
                className="flex items-center justify-center gap-2 w-full min-w-0 px-4 py-2.5 rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] text-[var(--color-text-primary)] dark:text-[#e8ecec] text-sm font-medium hover:bg-[var(--color-surface)] dark:hover:bg-[var(--color-dark-surface-hover)] transition-colors"
              >
                <Mail className="w-4 h-4 shrink-0" />
                <span className="break-all">{entry.email}</span>
              </a>
            )}
          </div>
        </div>

        {/* Content column */}
        <div className="contents md:block md:space-y-4">
          <div className="order-1 md:order-none space-y-4">
            {entry.mode && !DIRECTORY_HIDE_MODE.includes(entry.category as DirectoryCategory) && (
              <span className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full border border-[var(--color-brand-teal)] text-[var(--color-brand-teal)] dark:text-white dark:border-white/30">
                {DIRECTORY_MODE_LABELS[entry.mode as DirectoryMode]}
              </span>
            )}
            {entry.category === 'black_mens_group' && (
              <span className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface-hover)] text-[var(--color-text-muted)] border border-[var(--color-border)] dark:border-[var(--color-dark-border)]">
                Canadian
              </span>
            )}

            <h1 className="font-display text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] dark:text-white leading-tight">
              {displayName}
            </h1>

            {hasName && entry.organization && !DIRECTORY_HIDE_NAME.includes(entry.category as DirectoryCategory) && (
              <p className="text-lg text-[var(--color-text-muted)]">{entry.organization}</p>
            )}

            {location && (
              <p className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-muted)]">
                <MapPin className="w-4 h-4 shrink-0" />
                {location}
              </p>
            )}

            <ChipList label="Fee Options" items={feeOptions} />
            <ChipList label="Languages Spoken" items={languages} />
          </div>

          <div className="order-4 md:order-none">
            {entry.description && (
              <div
                className="tiptap-content md:pt-4"
                dangerouslySetInnerHTML={{ __html: entry.description }}
              />
            )}
          </div>
        </div>
      </div>
    </DetailPageShell>
  )
}
