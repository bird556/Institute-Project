import type { Metadata } from 'next'
import { generateDirectoryMetadata, default as DirectoryListPage } from '@/components/directory/DirectoryListPage'

export async function generateMetadata(): Promise<Metadata> {
  return generateDirectoryMetadata('advocate')
}

export default function AdvocatesPage() {
  return <DirectoryListPage category="advocate" pageSlug="advocates" />
}
