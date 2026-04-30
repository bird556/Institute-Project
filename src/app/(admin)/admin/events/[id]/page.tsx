import { notFound } from 'next/navigation'
import { getEventById } from '@/actions/events'
import { createClient } from '@/lib/supabase/server'
import EventEditor from './EventEditor'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EventEditorPage({ params }: Props) {
  const { id } = await params
  const [{ data: event }, supabase] = await Promise.all([getEventById(id), createClient()])
  if (!event) notFound()
  const initialCoverUrl = event.cover_path
    ? supabase.storage.from('institute-media').getPublicUrl(event.cover_path).data.publicUrl
    : undefined
  return <EventEditor event={event} initialCoverUrl={initialCoverUrl} />
}
