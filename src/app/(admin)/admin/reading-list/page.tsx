import { createClient } from '@/lib/supabase/server'
import { getAdminReadingList } from '@/actions/reading-list'
import ReadingListClient from './ReadingListClient'

export default async function ReadingListPage() {
  const [{ data: items = [] }, supabase] = await Promise.all([
    getAdminReadingList(),
    createClient(),
  ])
  const itemsWithUrls = items.map((item) => ({
    ...item,
    cover_url: item.cover_path
      ? supabase.storage.from('institute-media').getPublicUrl(item.cover_path).data.publicUrl
      : null,
  }))
  return <ReadingListClient items={itemsWithUrls} />
}
