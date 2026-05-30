import { notFound } from 'next/navigation'
import { getResearchById } from '@/actions/research'
import { createClient } from '@/lib/supabase/server'
import ResearchEditor from './ResearchEditor'

interface Props {
  params: Promise<{ id: string }>
}

export default async function ResearchEditorPage({ params }: Props) {
  const { id } = await params
  const [{ data: post }, supabase] = await Promise.all([getResearchById(id), createClient()])
  if (!post) notFound()
  const initialCoverUrl = post.cover_path
    ? supabase.storage.from('institute-media').getPublicUrl(post.cover_path).data.publicUrl
    : undefined
  return <ResearchEditor post={post} initialCoverUrl={initialCoverUrl} />
}
