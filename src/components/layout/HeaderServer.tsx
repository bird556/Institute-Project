import { getSiteVisibility } from '@/lib/site-visibility'
import { getSiteSettings } from '@/actions/settings'
import { Header } from './Header'

export async function HeaderServer() {
  const [visibility, { data: settings }] = await Promise.all([
    getSiteVisibility(),
    getSiteSettings(),
  ])

  // TODO: reconstruct via supabase.storage.from('institute-media').getPublicUrl(path)
  const logoUrl  = settings?.logo_path  || undefined
  const siteName = settings?.site_name  || 'Institute'

  return <Header visibility={visibility} logoUrl={logoUrl} siteName={siteName} />
}
