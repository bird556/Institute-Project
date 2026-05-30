import { createClient } from '@/lib/supabase/server'
import { getAdminResearchPosts } from '@/actions/research'
import ResearchListClient from './ResearchListClient'

export default async function AdminResearchPage() {
  const [{ data: posts = [] }, supabase] = await Promise.all([
    getAdminResearchPosts(),
    createClient(),
  ])
  const items = posts.map((p) => ({
    ...p,
    cover_url: p.cover_path
      ? supabase.storage.from('institute-media').getPublicUrl(p.cover_path).data.publicUrl
      : null,
  }))
  return <ResearchListClient posts={items} />
}
