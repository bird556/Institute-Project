import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { getPublishedDirectoryEntries } from '@/actions/directory'
import { getSiteSettings } from '@/actions/settings'
import { getPageContent } from '@/actions/page-content'
import { buildMetadata } from '@/lib/metadata'
import { stripHtml, truncate } from '@/lib/utils'
import { DIRECTORY_CATEGORIES, DIRECTORY_CATEGORY_LABELS, type DirectoryCategory, type SiteSettings } from '@/types'
import DirectoryCategorySection from '@/components/directory/DirectoryCategorySection'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ title: 'Access to Services' })
}

const CATEGORY_HREFS: Record<DirectoryCategory, string> = {
  advocate:                    '/advocates',
  psychotherapist:             '/psychotherapists',
  referral_agency:             '/referral-agencies',
  black_mens_group:            '/black-mens-groups',
  youth_service_organization:  '/youth-service-organizations',
  community_organization:      '/community-organizations',
}

const CATEGORY_ENABLED_KEY: Partial<Record<DirectoryCategory, keyof SiteSettings>> = {
  referral_agency:             'referral_agencies_enabled',
  black_mens_group:            'black_mens_groups_enabled',
  youth_service_organization:  'youth_service_organizations_enabled',
  community_organization:      'community_organizations_enabled',
}

export default async function AccessToServicesPage() {
  const [{ data: settings }, { data: sections }, supabase] = await Promise.all([
    getSiteSettings(),
    getPageContent('access_to_services'),
    createClient(),
  ])

  const heroTitle    = sections?.find((s) => s.section === 'hero_title')?.content    ?? 'Access to Services'
  const heroSubtitle = sections?.find((s) => s.section === 'hero_subtitle')?.content ?? 'Advocates, therapists, and organizations offering support and services.'

  const categories = DIRECTORY_CATEGORIES.filter((cat) => {
    const key = CATEGORY_ENABLED_KEY[cat]
    return !key || settings?.[key] !== 'false'
  })

  const results = await Promise.all(
    categories.map((cat) => getPublishedDirectoryEntries(cat)),
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      <header className="space-y-3">
        <h1 className="font-display text-4xl font-bold text-[var(--color-brand-teal)] dark:text-white">
          {heroTitle}
        </h1>
        {heroSubtitle && (
          <p className="text-lg text-[var(--color-text-muted)] max-w-2xl">{heroSubtitle}</p>
        )}
      </header>

      <div className="space-y-6">
        {categories.map((cat, i) => {
          const entries = (results[i].data ?? []).map((e) => ({
            id: e.id,
            name: e.name,
            organization: e.organization,
            description_excerpt: e.description ? truncate(stripHtml(e.description), 150) : null,
            photo_url: e.photo_path
              ? supabase.storage.from('institute-media').getPublicUrl(e.photo_path).data.publicUrl
              : null,
            website_url: e.website_url,
            email: e.email,
            mode: e.mode,
            province: e.province,
            category: e.category,
            created_at: e.created_at,
          }))

          return (
            <DirectoryCategorySection
              key={cat}
              title={DIRECTORY_CATEGORY_LABELS[cat]}
              viewAllHref={CATEGORY_HREFS[cat]}
              entries={entries}
              defaultOpen={i === 0}
            />
          )
        })}
      </div>
    </div>
  )
}
