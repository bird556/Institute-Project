'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Switch } from '@/components/ui/switch'
import { toggleSectionVisibility } from '@/actions/settings'
import type { SiteSettings } from '@/types'

type VisibilityKey =
  | 'about_enabled' | 'advocates_enabled' | 'psychotherapists_enabled'
  | 'referral_agencies_enabled' | 'black_mens_groups_enabled'
  | 'youth_service_organizations_enabled' | 'community_organizations_enabled'
  | 'blogs_enabled' | 'events_enabled'
  | 'reading_list_enabled' | 'partners_enabled' | 'newsletter_enabled'
  | 'health_wellness_enabled' | 'research_enabled' | 'research_institutes_enabled' | 'call_for_papers_enabled'
  | 'intro_section_enabled'
  | 'goal_section_enabled' | 'impact_section_enabled' | 'mission_section_enabled'
  | 'cta_section_enabled' | 'wellness_section_enabled'

const PAGE_ITEMS: { key: VisibilityKey; label: string; description: string }[] = [
  { key: 'about_enabled',             label: 'About',             description: 'When hidden, /about redirects to home' },
  { key: 'advocates_enabled',         label: 'Advocates',         description: 'When hidden, /advocates and all profile pages redirect to home' },
  { key: 'psychotherapists_enabled',  label: 'Psychotherapists',  description: 'When hidden, /psychotherapists and all profile pages redirect to home' },
  { key: 'referral_agencies_enabled', label: 'Referral Agencies', description: 'When hidden, /referral-agencies and all profile pages redirect to home' },
  { key: 'black_mens_groups_enabled', label: "Black Men's Groups", description: "When hidden, /black-mens-groups and all profile pages redirect to home" },
  { key: 'youth_service_organizations_enabled', label: 'Youth Service Organizations', description: 'When hidden, the category is removed from the Services nav dropdown' },
  { key: 'community_organizations_enabled',     label: 'Community Organizations',     description: 'When hidden, the category is removed from the Services nav dropdown' },
  { key: 'blogs_enabled',             label: 'Blog',              description: 'When hidden, /blogs and all blog posts redirect to home' },
  { key: 'events_enabled',            label: 'Events',            description: 'When hidden, /events and all event pages redirect to home' },
  { key: 'reading_list_enabled',      label: 'Reading List',      description: 'When hidden, /reading-list and all items redirect to home' },
  { key: 'partners_enabled',          label: 'Partners',          description: 'When hidden, /partners redirects to home' },
  { key: 'newsletter_enabled',        label: 'Newsletter',        description: 'When hidden, /newsletter and all edition pages redirect to home' },
  { key: 'health_wellness_enabled',   label: 'Health & Wellness', description: 'When hidden, /health-wellness and all posts redirect to home' },
  { key: 'research_enabled',          label: 'Research',          description: 'When hidden, /research and all research posts redirect to home' },
  { key: 'research_institutes_enabled', label: 'Research Institutes', description: 'When hidden, the Research Institutes category is removed from the nav and research landing page' },
  { key: 'call_for_papers_enabled',   label: 'Call for Papers',   description: 'When hidden, the Call for Papers category is removed from the nav and research landing page' },
]

const HOME_ITEMS: { key: VisibilityKey; label: string; description: string }[] = [
  { key: 'intro_section_enabled',    label: 'Introduction',      description: 'Show/hide the Introduction section on the home page' },
  { key: 'goal_section_enabled',     label: 'Our Goal',          description: 'Show/hide the Our Goal section on the home page' },
  { key: 'impact_section_enabled',   label: 'The Challenge',     description: 'Show/hide the Addressing Hidden Crises section on the home page' },
  { key: 'mission_section_enabled',  label: 'What We Do',        description: 'Show/hide the Remembering Creative Power section on the home page' },
  { key: 'cta_section_enabled',      label: 'Call to Action',    description: 'Show/hide the Call to Action section on the home page' },
  { key: 'wellness_section_enabled', label: 'Health & Wellness', description: 'Show/hide the Health & Wellness featured section on the home page' },
]

export default function VisibilitySettingsClient({ initialSettings }: { initialSettings: SiteSettings | null }) {
  const s = initialSettings

  const [visibility, setVisibility] = useState<Record<VisibilityKey, boolean>>({
    about_enabled:             s?.about_enabled             !== 'false',
    advocates_enabled:         s?.advocates_enabled         !== 'false',
    psychotherapists_enabled:  s?.psychotherapists_enabled  !== 'false',
    referral_agencies_enabled: s?.referral_agencies_enabled !== 'false',
    black_mens_groups_enabled: s?.black_mens_groups_enabled !== 'false',
    youth_service_organizations_enabled: s?.youth_service_organizations_enabled !== 'false',
    community_organizations_enabled:     s?.community_organizations_enabled     !== 'false',
    blogs_enabled:             s?.blogs_enabled             !== 'false',
    events_enabled:            s?.events_enabled            !== 'false',
    reading_list_enabled:      s?.reading_list_enabled      !== 'false',
    partners_enabled:          s?.partners_enabled          !== 'false',
    newsletter_enabled:        s?.newsletter_enabled        !== 'false',
    health_wellness_enabled:   s?.health_wellness_enabled   !== 'false',
    research_enabled:              s?.research_enabled              !== 'false',
    research_institutes_enabled:   s?.research_institutes_enabled   !== 'false',
    call_for_papers_enabled:       s?.call_for_papers_enabled       !== 'false',
    intro_section_enabled:     s?.intro_section_enabled     !== 'false',
    goal_section_enabled:      s?.goal_section_enabled      !== 'false',
    impact_section_enabled:    s?.impact_section_enabled    !== 'false',
    mission_section_enabled:   s?.mission_section_enabled   !== 'false',
    cta_section_enabled:       s?.cta_section_enabled       !== 'false',
    wellness_section_enabled:  s?.wellness_section_enabled  !== 'false',
  })

  async function handleToggle(key: VisibilityKey, enabled: boolean) {
    setVisibility(prev => ({ ...prev, [key]: enabled }))
    const res = await toggleSectionVisibility(key, enabled)
    if (!res.success) {
      setVisibility(prev => ({ ...prev, [key]: !enabled }))
      toast.error(res.error ?? 'Failed to update visibility')
    }
  }

  function renderRow({ key, label, description }: { key: VisibilityKey; label: string; description: string }) {
    return (
      <div key={key} className="flex items-center justify-between gap-4 rounded-lg border border-(--color-border) dark:border-dark-border px-4 py-3">
        <div>
          <p className="text-sm font-medium text-text-primary dark:text-white">{label}</p>
          <p className="text-xs text-text-muted mt-0.5">{description}</p>
        </div>
        <Switch
          checked={visibility[key]}
          onCheckedChange={(checked) => handleToggle(key, checked)}
          className="cursor-pointer shrink-0"
        />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-[var(--color-text-primary)] dark:text-white">Pages</h2>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
            Hide pages from the public site. Content is still manageable in the admin while hidden.
          </p>
        </div>
        <div className="space-y-3">{PAGE_ITEMS.map(renderRow)}</div>
      </section>

      <hr className="border-[var(--color-border)] dark:border-[var(--color-dark-border)]" />

      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-[var(--color-text-primary)] dark:text-white">Home Sections</h2>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
            Show or hide individual sections on the home page.
          </p>
        </div>
        <div className="space-y-3">{HOME_ITEMS.map(renderRow)}</div>
      </section>
    </div>
  )
}
