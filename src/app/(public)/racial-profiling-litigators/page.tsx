import type { Metadata } from 'next'
import { generateDirectoryMetadata, default as DirectoryListPage } from '@/components/directory/DirectoryListPage'

export async function generateMetadata(): Promise<Metadata> {
  return generateDirectoryMetadata('racial_profiling_litigator')
}

export default function RacialProfilingLitigatorsPage() {
  return <DirectoryListPage category="racial_profiling_litigator" pageSlug="racial-profiling-litigators" />
}
