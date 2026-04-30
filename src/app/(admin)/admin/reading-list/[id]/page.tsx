import { notFound } from 'next/navigation'
import { getReadingListItemById } from '@/actions/reading-list'
import { createClient } from '@/lib/supabase/server'
import ReadingListEditor from './ReadingListEditor'

interface Props {
  params: Promise<{ id: string }>
}

export default async function ReadingListEditorPage({ params }: Props) {
  const { id } = await params
  const [{ data: item }, supabase] = await Promise.all([getReadingListItemById(id), createClient()])
  if (!item) notFound()
  const initialCoverUrl = item.cover_path
    ? supabase.storage.from('institute-media').getPublicUrl(item.cover_path).data.publicUrl
    : undefined
  return <ReadingListEditor item={item} initialCoverUrl={initialCoverUrl} />
}
