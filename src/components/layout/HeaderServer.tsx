import { getSiteVisibility } from '@/lib/site-visibility'
import { Header } from './Header'

export async function HeaderServer() {
  const visibility = await getSiteVisibility()
  return <Header visibility={visibility} />
}
