import { getAdminReadingList } from '@/actions/reading-list'
import ReadingListClient from './ReadingListClient'

export default async function ReadingListPage() {
  const { data: items = [] } = await getAdminReadingList()
  return <ReadingListClient items={items} />
}
