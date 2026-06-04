import { createClient } from '@/lib/supabase/server'
import { getAdminDirectoryEntries } from '@/actions/directory'
import AdminDirectoryClient from './AdminDirectoryClient'

export default async function AdminDirectoryPage() {
  const [{ data: entries }, supabase] = await Promise.all([
    getAdminDirectoryEntries(),
    createClient(),
  ])

  const enriched = (entries ?? []).map((e) => ({
    ...e,
    photo_url: e.photo_path
      ? supabase.storage.from('institute-media').getPublicUrl(e.photo_path).data.publicUrl
      : null,
  }))

  return <AdminDirectoryClient entries={enriched} />
}
