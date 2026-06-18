import type { Metadata } from 'next'
import { generateDirectoryDetailMetadata, default as DirectoryDetailPage } from '@/components/directory/DirectoryDetailPage'

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  return generateDirectoryDetailMetadata(id)
}

export default async function CommunityOrganizationDetailPage({ params }: Props) {
  const { id } = await params
  return <DirectoryDetailPage id={id} />
}
