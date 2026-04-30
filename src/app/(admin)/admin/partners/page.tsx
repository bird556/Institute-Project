import { getAdminPartners } from '@/actions/partners'
import { createClient } from '@/lib/supabase/server'
import PartnersClient from './PartnersClient'

export default async function PartnersPage() {
  const [{ data: partners = [] }, supabase] = await Promise.all([
    getAdminPartners(),
    createClient(),
  ])

  const logoUrls: Record<string, string> = {}
  for (const p of partners) {
    if (p.logo_path) {
      logoUrls[p.id] = supabase.storage.from('institute-media').getPublicUrl(p.logo_path).data.publicUrl
    }
  }

  return <PartnersClient partners={partners} logoUrls={logoUrls} />
}
