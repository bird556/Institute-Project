import { getAdminSubmissions } from '@/actions/newsletter'
import { getAdminEditions } from '@/actions/newsletter'
import NewsletterClient from './NewsletterClient'

export default async function NewsletterPage() {
  const [{ data: submissions = [] }, { data: editions = [] }] = await Promise.all([
    getAdminSubmissions(),
    getAdminEditions(),
  ])

  return <NewsletterClient submissions={submissions} editions={editions} />
}
