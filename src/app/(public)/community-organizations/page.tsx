import type { Metadata } from 'next'
import { generateDirectoryMetadata, default as DirectoryListPage } from '@/components/directory/DirectoryListPage'

export async function generateMetadata(): Promise<Metadata> {
  return generateDirectoryMetadata('community_organization')
}

export default function CommunityOrganizationsPage() {
  return <DirectoryListPage category="community_organization" pageSlug="community-organizations" />
}
