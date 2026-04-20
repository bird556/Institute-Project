import { notFound } from 'next/navigation'
import { getWellnessById } from '@/actions/wellness'
import WellnessEditor from './WellnessEditor'

interface Props {
  params: Promise<{ id: string }>
}

export default async function WellnessEditorPage({ params }: Props) {
  const { id } = await params
  const { data: post } = await getWellnessById(id)
  if (!post) notFound()
  return <WellnessEditor post={post} />
}
