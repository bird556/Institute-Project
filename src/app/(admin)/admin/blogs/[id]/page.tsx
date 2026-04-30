import { notFound } from 'next/navigation'
import { getBlogById } from '@/actions/blogs'
import { createClient } from '@/lib/supabase/server'
import BlogEditor from './BlogEditor'

interface Props {
  params: Promise<{ id: string }>
}

export default async function BlogEditorPage({ params }: Props) {
  const { id } = await params
  const [{ data: post }, supabase] = await Promise.all([getBlogById(id), createClient()])
  if (!post) notFound()
  const initialCoverUrl = post.cover_path
    ? supabase.storage.from('institute-media').getPublicUrl(post.cover_path).data.publicUrl
    : undefined
  return <BlogEditor post={post} initialCoverUrl={initialCoverUrl} />
}
