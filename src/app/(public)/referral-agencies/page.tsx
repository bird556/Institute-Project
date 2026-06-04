import type { Metadata } from 'next'
import { generateDirectoryMetadata, default as DirectoryListPage } from '@/components/directory/DirectoryListPage'

export async function generateMetadata(): Promise<Metadata> {
  return generateDirectoryMetadata('referral_agency')
}

export default function ReferralAgenciesPage() {
  return <DirectoryListPage category="referral_agency" pageSlug="referral-agencies" />
}
