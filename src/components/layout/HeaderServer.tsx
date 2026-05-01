import { getSiteVisibility } from '@/lib/site-visibility'
import { getSiteSettings } from '@/actions/settings'
import { createClient } from '@/lib/supabase/server'
import { Header } from './Header'

export async function HeaderServer() {
  const [visibility, { data: settings }, supabase] = await Promise.all([
    getSiteVisibility(),
    getSiteSettings(),
    createClient(),
  ])

  const logoVisible = settings?.logo_visible !== 'false'
  const logoUrl = settings?.logo_path && logoVisible
    ? supabase.storage.from('institute-media').getPublicUrl(settings.logo_path).data.publicUrl
    : undefined
  const siteName = settings?.site_name || 'Institute'

  return <Header visibility={visibility} logoUrl={logoUrl} siteName={siteName} />
}
