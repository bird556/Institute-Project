'use server'

import { mockBlogs } from '@/lib/mock-data'
import { slugify } from '@/lib/utils'
import type { BlogPost, ActionResult } from '@/types'

// ─── In-memory mock store ────────────────────────────────────────────────────
// TODO: Remove this store and all mock imports once Supabase is wired up.
let store: BlogPost[] = mockBlogs.map((b) => ({
  id: b.id,
  title: b.title,
  slug: b.slug,
  excerpt: b.excerpt,
  content: b.content,
  cover_path: null,           // mock uses cover_url, not a storage path
  published: b.published,
  published_at: b.published_at || null,
  created_at: b.created_at,
  updated_at: b.updated_at,
}))

// ─── Get all blogs (admin — includes drafts) ─────────────────────────────────
export async function getAdminBlogs(): Promise<ActionResult<BlogPost[]>> {
  try {
    // TODO: Supabase swap ↓
    // const supabase = createServerClient()
    // const { data, error } = await supabase
    //   .from('blog_posts')
    //   .select('*')
    //   .order('created_at', { ascending: false })
    // if (error) throw error
    // return { success: true, data }

    const sorted = [...store].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    return { success: true, data: sorted }
  } catch (err) {
    console.error('[getAdminBlogs]', err)
    return { success: false, error: 'Failed to load blog posts.' }
  }
}

// ─── Get single blog by id ───────────────────────────────────────────────────
export async function getBlogById(id: string): Promise<ActionResult<BlogPost>> {
  try {
    // TODO: Supabase swap ↓
    // const supabase = createServerClient()
    // const { data, error } = await supabase
    //   .from('blog_posts')
    //   .select('*')
    //   .eq('id', id)
    //   .single()
    // if (error) throw error
    // return { success: true, data }

    const post = store.find((b) => b.id === id)
    if (!post) return { success: false, error: 'Blog post not found.' }
    return { success: true, data: post }
  } catch (err) {
    console.error('[getBlogById]', err)
    return { success: false, error: 'Failed to load blog post.' }
  }
}

// ─── Create blank draft ──────────────────────────────────────────────────────
export async function createBlog(): Promise<ActionResult<{ id: string }>> {
  try {
    // TODO: Supabase swap ↓
    // const supabase = createServerClient()
    // const { data, error } = await supabase
    //   .from('blog_posts')
    //   .insert({ title: 'Untitled', slug: `untitled-${Date.now()}`, content: '' })
    //   .select('id')
    //   .single()
    // if (error) throw error
    // return { success: true, data: { id: data.id } }

    const now = new Date().toISOString()
    const id = crypto.randomUUID()
    const newPost: BlogPost = {
      id,
      title: 'Untitled',
      slug: `untitled-${Date.now()}`,
      excerpt: null,
      content: '',
      cover_path: null,
      published: false,
      published_at: null,
      created_at: now,
      updated_at: now,
    }
    store = [newPost, ...store]
    return { success: true, data: { id } }
  } catch (err) {
    console.error('[createBlog]', err)
    return { success: false, error: 'Failed to create blog post.' }
  }
}

// ─── Update blog post ────────────────────────────────────────────────────────
export async function updateBlog(
  id: string,
  fields: Partial<Omit<BlogPost, 'id' | 'created_at'>>
): Promise<ActionResult> {
  try {
    // TODO: Supabase swap ↓
    // const supabase = createServerClient()
    // const { error } = await supabase
    //   .from('blog_posts')
    //   .update({ ...fields, updated_at: new Date().toISOString() })
    //   .eq('id', id)
    // if (error) throw error
    // return { success: true }

    const idx = store.findIndex((b) => b.id === id)
    if (idx === -1) return { success: false, error: 'Blog post not found.' }

    // If title changed and slug not explicitly provided, auto-regenerate slug
    const updatedFields = { ...fields }
    if (fields.title && !fields.slug) {
      updatedFields.slug = slugify(fields.title)
    }

    store[idx] = { ...store[idx], ...updatedFields, updated_at: new Date().toISOString() }
    return { success: true }
  } catch (err) {
    console.error('[updateBlog]', err)
    return { success: false, error: 'Failed to save blog post.' }
  }
}

// ─── Toggle published status ─────────────────────────────────────────────────
export async function toggleBlogPublished(
  id: string,
  published: boolean
): Promise<ActionResult> {
  try {
    // TODO: Supabase swap ↓
    // const supabase = createServerClient()
    // const { error } = await supabase
    //   .from('blog_posts')
    //   .update({
    //     published,
    //     published_at: published ? new Date().toISOString() : null,
    //     updated_at: new Date().toISOString(),
    //   })
    //   .eq('id', id)
    // if (error) throw error
    // return { success: true }

    const idx = store.findIndex((b) => b.id === id)
    if (idx === -1) return { success: false, error: 'Blog post not found.' }

    store[idx] = {
      ...store[idx],
      published,
      published_at: published ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    }
    return { success: true }
  } catch (err) {
    console.error('[toggleBlogPublished]', err)
    return { success: false, error: 'Failed to update publish status.' }
  }
}

// ─── Delete blog post ─────────────────────────────────────────────────────────
export async function deleteBlog(id: string): Promise<ActionResult> {
  try {
    // TODO: Supabase swap ↓
    // const supabase = createServerClient()
    // const { error } = await supabase
    //   .from('blog_posts')
    //   .delete()
    //   .eq('id', id)
    // if (error) throw error
    // return { success: true }

    const idx = store.findIndex((b) => b.id === id)
    if (idx === -1) return { success: false, error: 'Blog post not found.' }
    store = store.filter((b) => b.id !== id)
    return { success: true }
  } catch (err) {
    console.error('[deleteBlog]', err)
    return { success: false, error: 'Failed to delete blog post.' }
  }
}
