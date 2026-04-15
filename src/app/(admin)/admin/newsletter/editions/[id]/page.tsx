import { notFound } from 'next/navigation'
import { getEditionById, getEditionSubmissions, getAdminSubmissions } from '@/actions/newsletter'
import EditionEditor from './EditionEditor'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditionEditorPage({ params }: Props) {
  const { id } = await params

  const [{ data: edition }, { data: editionSubmissions = [] }, { data: allSubmissions = [] }] =
    await Promise.all([
      getEditionById(id),
      getEditionSubmissions(id),
      getAdminSubmissions({ status: 'approved' }),
    ])

  if (!edition) notFound()

  // Approved submissions not yet assigned to any edition (available to add)
  const available = allSubmissions.filter((s) => s.edition_id === null)

  return (
    <EditionEditor
      edition={edition}
      editionSubmissions={editionSubmissions}
      availableSubmissions={available}
    />
  )
}
