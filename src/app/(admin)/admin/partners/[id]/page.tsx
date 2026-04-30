import { notFound } from 'next/navigation'
import { getPartnerById } from '@/actions/partners'
import { createClient } from '@/lib/supabase/server'
import PartnerEditor from './PartnerEditor'

interface Props {
  params: Promise<{ id: string }>
}

export default async function PartnerEditorPage({ params }: Props) {
  const { id } = await params
  const [{ data: partner }, supabase] = await Promise.all([getPartnerById(id), createClient()])
  if (!partner) notFound()
  const initialLogoUrl = partner.logo_path
    ? supabase.storage.from('institute-media').getPublicUrl(partner.logo_path).data.publicUrl
    : undefined
  return <PartnerEditor partner={partner} initialLogoUrl={initialLogoUrl} />
}
