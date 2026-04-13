import { notFound } from 'next/navigation'
import { getBlogById } from '@/actions/blogs'
import BlogEditor from './BlogEditor'

interface Props {
  params: Promise<{ id: string }>
}

export default async function BlogEditorPage({ params }: Props) {
  const { id } = await params
  const { data: post } = await getBlogById(id)
  if (!post) notFound()
  return <BlogEditor post={post} />
}
