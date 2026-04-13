import { getAdminEvents } from '@/actions/events'
import EventListClient from './EventListClient'

export default async function EventsPage() {
  const { data: events = [] } = await getAdminEvents()
  return <EventListClient events={events} />
}
