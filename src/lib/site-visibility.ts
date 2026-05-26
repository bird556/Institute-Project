export interface SiteVisibility {
  about_enabled:           boolean
  mission_enabled:         boolean
  blogs_enabled:           boolean
  events_enabled:          boolean
  reading_list_enabled:    boolean
  partners_enabled:        boolean
  newsletter_enabled:      boolean
  health_wellness_enabled: boolean
  intro_section_enabled:   boolean
  cta_section_enabled:     boolean
  goal_section_enabled:    boolean
  impact_section_enabled:  boolean
  mission_section_enabled:  boolean
  wellness_section_enabled: boolean
}

const VISIBILITY_KEYS: (keyof SiteVisibility)[] = [
  'about_enabled', 'mission_enabled', 'blogs_enabled',
  'events_enabled', 'reading_list_enabled', 'partners_enabled',
  'newsletter_enabled', 'health_wellness_enabled',
  'intro_section_enabled', 'cta_section_enabled',
  'goal_section_enabled', 'impact_section_enabled', 'mission_section_enabled',
  'wellness_section_enabled',
]

const ALL_ENABLED: SiteVisibility = {
  about_enabled:           true,
  mission_enabled:         true,
  blogs_enabled:           true,
  events_enabled:          true,
  reading_list_enabled:    true,
  partners_enabled:        true,
  newsletter_enabled:      true,
  health_wellness_enabled: true,
  intro_section_enabled:   true,
  cta_section_enabled:     true,
  goal_section_enabled:    true,
  impact_section_enabled:  true,
  mission_section_enabled: true,
  wellness_section_enabled: true,
}

import { unstable_cache } from 'next/cache'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export const getSiteVisibility = unstable_cache(
  async (): Promise<SiteVisibility> => {
    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
    const { data } = await supabase
      .from('site_settings')
      .select('key, value')
      .in('key', VISIBILITY_KEYS)
    const map = Object.fromEntries((data ?? []).map(row => [row.key, row.value !== 'false']))
    return { ...ALL_ENABLED, ...map } as SiteVisibility
  },
  ['site-visibility'],
  { revalidate: 60 },
)
