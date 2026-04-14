import { notFound } from 'next/navigation'
import { getPartnerById } from '@/actions/partners'
import PartnerEditor from './PartnerEditor'

interface Props {
  params: Promise<{ id: string }>
}

export default async function PartnerEditorPage({ params }: Props) {
  const { id } = await params
  const { data: partner } = await getPartnerById(id)
  if (!partner) notFound()
  return <PartnerEditor partner={partner} />
}
