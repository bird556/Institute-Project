import { getAdminBlogs } from '@/actions/blogs'
import BlogListClient from './BlogListClient'

export default async function BlogsPage() {
  const { data: blogs = [] } = await getAdminBlogs()
  return <BlogListClient blogs={blogs} />
}
