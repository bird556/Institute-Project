import type { Metadata } from 'next'
import { generateDirectoryMetadata, default as DirectoryListPage } from '@/components/directory/DirectoryListPage'

export async function generateMetadata(): Promise<Metadata> {
  return generateDirectoryMetadata('psychotherapist')
}

export default function PsychotherapistsPage() {
  return <DirectoryListPage category="psychotherapist" pageSlug="psychotherapists" />
}
