import { notFound } from 'next/navigation'
import { getSubmissionById, getAdminEditions } from '@/actions/newsletter'
import SubmissionReviewer from './SubmissionReviewer'

interface Props {
  params: Promise<{ id: string }>
}

export default async function SubmissionReviewPage({ params }: Props) {
  const { id } = await params

  const [{ data: submission }, { data: editions = [] }] = await Promise.all([
    getSubmissionById(id),
    getAdminEditions(),
  ])

  if (!submission) notFound()

  return <SubmissionReviewer submission={submission} editions={editions} />
}
