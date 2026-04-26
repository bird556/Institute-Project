'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { slugify } from '@/lib/utils'
import type { BlogPost, ActionResult } from '@/types'

export async function getAdminBlogs(): Promise<ActionResult<BlogPost[]>> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) return { success: false, error: 'Failed to load blog posts.' }
  return { success: true, data }
}

export async function getBlogById(id: string): Promise<ActionResult<BlogPost>> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single()
  if (error) return { success: false, error: 'Failed to load blog post.' }
  return { success: true, data }
}

export async function createBlog(): Promise<ActionResult<{ id: string }>> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('blog_posts')
    .insert({ title: 'Untitled', slug: `untitled-${Date.now()}`, content: '' })
    .select('id')
    .single()
  if (error) return { success: false, error: 'Failed to create blog post.' }
  return { success: true, data: { id: data.id } }
}

export async function updateBlog(
  id: string,
  fields: Partial<Omit<BlogPost, 'id' | 'created_at'>>,
): Promise<ActionResult> {
  const updatedFields = { ...fields }
  if (fields.title && !fields.slug) {
    updatedFields.slug = slugify(fields.title)
  }
  const supabase = await createClient()
  const { error } = await supabase
    .from('blog_posts')
    .update({ ...updatedFields, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) return { success: false, error: 'Failed to save blog post.' }
  revalidatePath('/blogs', 'layout')
  return { success: true }
}

export async function toggleBlogPublished(
  id: string,
  published: boolean,
): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('blog_posts')
    .update({
      published,
      published_at: published ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
  if (error) return { success: false, error: 'Failed to update publish status.' }
  revalidatePath('/blogs', 'layout')
  revalidatePath('/', 'layout')
  return { success: true }
}

export async function deleteBlog(id: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.from('blog_posts').delete().eq('id', id)
  if (error) return { success: false, error: 'Failed to delete blog post.' }
  revalidatePath('/blogs', 'layout')
  revalidatePath('/', 'layout')
  return { success: true }
}
