import type { Metadata } from 'next'
import { generateDirectoryMetadata, default as DirectoryListPage } from '@/components/directory/DirectoryListPage'

export async function generateMetadata(): Promise<Metadata> {
  return generateDirectoryMetadata('black_mens_group')
}

export default function BlackMensGroupsPage() {
  return <DirectoryListPage category="black_mens_group" pageSlug="black-mens-groups" />
}
