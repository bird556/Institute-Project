import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getBookstoreById } from '@/actions/bookstores'
import BookstoreEditor from './BookstoreEditor'

interface Props { params: Promise<{ id: string }> }

export default async function AdminBookstoreEditorPage({ params }: Props) {
  const { id } = await params
  const [{ data: bookstore }, supabase] = await Promise.all([
    getBookstoreById(id),
    createClient(),
  ])
  if (!bookstore) notFound()

  const initialPhotoUrl = bookstore.photo_path
    ? supabase.storage.from('institute-media').getPublicUrl(bookstore.photo_path).data.publicUrl
    : undefined

  return <BookstoreEditor bookstore={bookstore} initialPhotoUrl={initialPhotoUrl} />
}
