import { notFound } from 'next/navigation'
import { getWellnessById } from '@/actions/wellness'
import { createClient } from '@/lib/supabase/server'
import WellnessEditor from './WellnessEditor'

interface Props {
  params: Promise<{ id: string }>
}

export default async function WellnessEditorPage({ params }: Props) {
  const { id } = await params
  const [{ data: post }, supabase] = await Promise.all([getWellnessById(id), createClient()])
  if (!post) notFound()
  const initialCoverUrl = post.cover_path
    ? supabase.storage.from('institute-media').getPublicUrl(post.cover_path).data.publicUrl
    : undefined
  return <WellnessEditor post={post} initialCoverUrl={initialCoverUrl} />
}
