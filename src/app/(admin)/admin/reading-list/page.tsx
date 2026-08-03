import { createClient } from '@/lib/supabase/server'
import { getAdminReadingList } from '@/actions/reading-list'
import { getAdminBookstores } from '@/actions/bookstores'
import ReadingListClient from './ReadingListClient'

export default async function ReadingListPage() {
  const [{ data: items = [] }, { data: bookstoreItems = [] }, supabase] = await Promise.all([
    getAdminReadingList(),
    getAdminBookstores(),
    createClient(),
  ])
  const itemsWithUrls = items.map((item) => ({
    ...item,
    cover_url: item.cover_path
      ? supabase.storage.from('institute-media').getPublicUrl(item.cover_path).data.publicUrl
      : null,
  }))
  const bookstoresWithUrls = bookstoreItems.map((item) => ({
    ...item,
    photo_url: item.photo_path
      ? supabase.storage.from('institute-media').getPublicUrl(item.photo_path).data.publicUrl
      : null,
  }))
  return <ReadingListClient items={itemsWithUrls} bookstores={bookstoresWithUrls} />
}
