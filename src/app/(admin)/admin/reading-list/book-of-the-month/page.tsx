import { createClient } from '@/lib/supabase/server'
import { getSiteSettings } from '@/actions/settings'
import BookOfMonthClient from './BookOfMonthClient'

export default async function BookOfMonthPage() {
  const [{ data: settings }, supabase] = await Promise.all([
    getSiteSettings(),
    createClient(),
  ])

  const currentId = settings?.book_of_the_month_id || null

  const { data: items = [] } = await supabase
    .from('reading_list')
    .select('id, title, author, cover_path')
    .eq('published', true)
    .order('created_at', { ascending: false })

  const itemsWithUrls = (items ?? []).map((item) => ({
    id: item.id as string,
    title: item.title as string,
    author: (item.author ?? null) as string | null,
    cover_url: item.cover_path
      ? supabase.storage.from('institute-media').getPublicUrl(item.cover_path as string).data.publicUrl
      : null,
  }))

  return <BookOfMonthClient items={itemsWithUrls} currentId={currentId} />
}
