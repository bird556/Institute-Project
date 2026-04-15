export interface SiteVisibility {
  about_enabled:        boolean
  mission_enabled:      boolean
  blogs_enabled:        boolean
  events_enabled:       boolean
  reading_list_enabled: boolean
  partners_enabled:     boolean
  newsletter_enabled:   boolean
}

// Mock phase — returns all sections enabled
// TODO: replace with Supabase query (see Supabase swap notes in phase-9 spec)
export async function getSiteVisibility(): Promise<SiteVisibility> {
  return {
    about_enabled:        true,
    mission_enabled:      true,
    blogs_enabled:        true,
    events_enabled:       true,
    reading_list_enabled: true,
    partners_enabled:     true,
    newsletter_enabled:   true,
  }
}

// Supabase phase — wrap with unstable_cache (60s TTL) and query site_settings:
// import { unstable_cache } from 'next/cache'
// import { createClient } from '@/lib/supabase/server'
//
// export const getSiteVisibility = unstable_cache(
//   async (): Promise<SiteVisibility> => {
//     const supabase = await createClient()
//     const { data } = await supabase
//       .from('site_settings')
//       .select('key, value')
//       .in('key', [
//         'about_enabled', 'mission_enabled', 'blogs_enabled',
//         'events_enabled', 'reading_list_enabled',
//         'partners_enabled', 'newsletter_enabled',
//       ])
//     return Object.fromEntries(
//       (data ?? []).map(row => [row.key, row.value !== 'false'])
//     ) as SiteVisibility
//   },
//   ['site-visibility'],
//   { revalidate: 60 }
// )
