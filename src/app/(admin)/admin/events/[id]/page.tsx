import { notFound } from 'next/navigation'
import { getEventById } from '@/actions/events'
import EventEditor from './EventEditor'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EventEditorPage({ params }: Props) {
  const { id } = await params
  const { data: event } = await getEventById(id)
  if (!event) notFound()
  return <EventEditor event={event} />
}
