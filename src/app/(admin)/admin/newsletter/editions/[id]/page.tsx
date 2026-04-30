import { notFound } from 'next/navigation'
import { getEditionById, getEditionSubmissions, getAdminSubmissions } from '@/actions/newsletter'
import { createClient } from '@/lib/supabase/server'
import EditionEditor from './EditionEditor'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditionEditorPage({ params }: Props) {
  const { id } = await params

  const [{ data: edition }, { data: editionSubmissions = [] }, { data: allSubmissions = [] }, supabase] =
    await Promise.all([
      getEditionById(id),
      getEditionSubmissions(id),
      getAdminSubmissions({ status: 'approved' }),
      createClient(),
    ])

  if (!edition) notFound()

  const initialCoverUrl = edition.cover_path
    ? supabase.storage.from('institute-media').getPublicUrl(edition.cover_path).data.publicUrl
    : undefined

  const available = allSubmissions.filter((s) => s.edition_id === null)

  return (
    <EditionEditor
      edition={edition}
      editionSubmissions={editionSubmissions}
      availableSubmissions={available}
      initialCoverUrl={initialCoverUrl}
    />
  )
}
