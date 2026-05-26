import { createClient } from '@/lib/supabase/server'
import { getAdminEvents } from '@/actions/events'
import EventListClient from './EventListClient'

export default async function EventsPage() {
  const [{ data: events = [] }, supabase] = await Promise.all([
    getAdminEvents(),
    createClient(),
  ])
  const items = events.map((e) => ({
    ...e,
    cover_url: e.cover_path
      ? supabase.storage.from('institute-media').getPublicUrl(e.cover_path).data.publicUrl
      : null,
  }))
  return <EventListClient events={items} />
}
