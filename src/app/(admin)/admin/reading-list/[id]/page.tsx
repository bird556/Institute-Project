import { notFound } from 'next/navigation'
import { getReadingListItemById } from '@/actions/reading-list'
import ReadingListEditor from './ReadingListEditor'

interface Props {
  params: Promise<{ id: string }>
}

export default async function ReadingListEditorPage({ params }: Props) {
  const { id } = await params
  const { data: item } = await getReadingListItemById(id)
  if (!item) notFound()
  return <ReadingListEditor item={item} />
}
