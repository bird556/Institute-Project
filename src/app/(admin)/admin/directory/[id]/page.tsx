import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getDirectoryEntryById } from '@/actions/directory'
import DirectoryEntryEditor from './DirectoryEntryEditor'

interface Props { params: Promise<{ id: string }> }

export default async function AdminDirectoryEntryPage({ params }: Props) {
  const { id } = await params
  const [{ data: entry }, supabase] = await Promise.all([
    getDirectoryEntryById(id),
    createClient(),
  ])
  if (!entry) notFound()

  const initialPhotoUrl = entry.photo_path
    ? supabase.storage.from('institute-media').getPublicUrl(entry.photo_path).data.publicUrl
    : undefined

  return <DirectoryEntryEditor entry={entry} initialPhotoUrl={initialPhotoUrl} />
}
