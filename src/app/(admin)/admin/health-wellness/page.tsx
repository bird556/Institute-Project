import { getAdminWellnessPosts } from '@/actions/wellness'
import WellnessListClient from './WellnessListClient'

export default async function AdminWellnessPage() {
  const { data: posts = [] } = await getAdminWellnessPosts()
  return <WellnessListClient posts={posts} />
}
