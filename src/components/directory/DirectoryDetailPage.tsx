import { cache } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Globe, Mail, ArrowLeft, UserRound, Building2, Users } from 'lucide-react'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { buildMetadata } from '@/lib/metadata'
import { stripHtml, truncate } from '@/lib/utils'
import { DetailPageShell } from '@/components/shared/DetailPageShell'
import { DIRECTORY_CATEGORY_LABELS, DIRECTORY_MODE_LABELS, type DirectoryCategory, type DirectoryMode } from '@/types'

const BACK_HREFS: Record<DirectoryCategory, string> = {
  advocate:         '/advocates',
  psychotherapist:  '/psychotherapists',
  referral_agency:  '/referral-agencies',
  black_mens_group: '/black-mens-groups',
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
    title: entry.name,
    description: entry.description ? truncate(stripHtml(entry.description), 160) : undefined,
    imageUrl,
  })
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

  return (
    <DetailPageShell className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      <Link
        href={backHref}
        className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-brand-teal)] dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to {backLabel}
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-10 items-start">
        {/* Photo column */}
        <div className="space-y-4">
          <div className="relative w-full rounded-2xl overflow-hidden" style={{ aspectRatio: '1/1' }}>
            {photoUrl ? (
              <Image
                src={photoUrl}
                alt={entry.name}
                fill
                priority
                className="object-cover object-top"
                sizes="(max-width: 768px) 100vw, 240px"
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

          {entry.email && (
            <a
              href={`mailto:${entry.email}`}
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] text-[var(--color-text-primary)] dark:text-[#e8ecec] text-sm font-medium hover:bg-[var(--color-surface)] dark:hover:bg-[var(--color-dark-surface-hover)] transition-colors"
            >
              <Mail className="w-4 h-4" />
              {entry.email}
            </a>
          )}
        </div>

        {/* Content column */}
        <div className="space-y-4">
          {entry.mode && (
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
            {entry.name}
          </h1>

          {entry.organization && (
            <p className="text-lg text-[var(--color-text-muted)]">{entry.organization}</p>
          )}

          {entry.description && (
            <div
              className="tiptap-content pt-4"
              dangerouslySetInnerHTML={{ __html: entry.description }}
            />
          )}
        </div>
      </div>
    </DetailPageShell>
  )
}
