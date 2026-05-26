import { createClient } from '@/lib/supabase/server'
import { getAdminWellnessPosts } from '@/actions/wellness'
import WellnessListClient from './WellnessListClient'

export default async function AdminWellnessPage() {
  const [{ data: posts = [] }, supabase] = await Promise.all([
    getAdminWellnessPosts(),
    createClient(),
  ])
  const items = posts.map((p) => ({
    ...p,
    cover_url: p.cover_path
      ? supabase.storage.from('institute-media').getPublicUrl(p.cover_path).data.publicUrl
      : null,
  }))
  return <WellnessListClient posts={items} />
}
