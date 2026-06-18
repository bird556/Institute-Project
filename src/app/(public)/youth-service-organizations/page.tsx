import type { Metadata } from 'next'
import { generateDirectoryMetadata, default as DirectoryListPage } from '@/components/directory/DirectoryListPage'

export async function generateMetadata(): Promise<Metadata> {
  return generateDirectoryMetadata('youth_service_organization')
}

export default function YouthServiceOrganizationsPage() {
  return <DirectoryListPage category="youth_service_organization" pageSlug="youth-service-organizations" />
}
