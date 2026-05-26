import { createClient } from '@/lib/supabase/server'
import { getAdminBlogs } from '@/actions/blogs'
import BlogListClient from './BlogListClient'

export default async function BlogsPage() {
  const [{ data: blogs = [] }, supabase] = await Promise.all([
    getAdminBlogs(),
    createClient(),
  ])
  const items = blogs.map((b) => ({
    ...b,
    cover_url: b.cover_path
      ? supabase.storage.from('institute-media').getPublicUrl(b.cover_path).data.publicUrl
      : null,
  }))
  return <BlogListClient blogs={items} />
}
