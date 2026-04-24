'use server'

// import { createClient } from '@/lib/supabase/server'
import { mockWellnessPosts } from '@/lib/mock-data'
import type { WellnessPost, ActionResult } from '@/types'

// ─── In-memory mock store ────────────────────────────────────────────────────
// TODO: Remove this store and all mock imports once Supabase is wired up.
let store: WellnessPost[] = mockWellnessPosts.map((w) => ({
  id: w.id,
  title: w.title,
  slug: w.slug,
  excerpt: w.excerpt,
  content: w.content,
  cover_path: null,
  doc_path: null,
  tags: w.tags,
  published: w.published,
  published_at: w.published_at || null,
  created_at: w.created_at,
  updated_at: w.updated_at,
}))

// ─── Get all posts (admin — includes drafts) ──────────────────────────────────
export async function getAdminWellnessPosts(): Promise<ActionResult<WellnessPost[]>> {
  try {
    // TODO: Supabase swap ↓
    // const supabase = await createClient()
    // const { data, error } = await supabase
    //   .from('wellness_posts')
    //   .select('*')
    //   .order('created_at', { ascending: false })
    // if (error) throw error
    // return { success: true, data }

    const sorted = [...store].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    return { success: true, data: sorted }
  } catch (err) {
    console.error('[getAdminWellnessPosts]', err)
    return { success: false, error: 'Failed to load wellness posts.' }
  }
}

// ─── Get single post by id ────────────────────────────────────────────────────
export async function getWellnessById(id: string): Promise<ActionResult<WellnessPost>> {
  try {
    // TODO: Supabase swap ↓
    // const supabase = await createClient()
    // const { data, error } = await supabase
    //   .from('wellness_posts')
    //   .select('*')
    //   .eq('id', id)
    //   .single()
    // if (error) throw error
    // return { success: true, data }

    const post = store.find((w) => w.id === id)
    if (!post) return { success: false, error: 'Wellness post not found.' }
    return { success: true, data: post }
  } catch (err) {
    console.error('[getWellnessById]', err)
    return { success: false, error: 'Failed to load wellness post.' }
  }
}

// ─── Create blank draft ───────────────────────────────────────────────────────
export async function createWellnessPost(): Promise<ActionResult<{ id: string }>> {
  try {
    // TODO: Supabase swap ↓
    // const supabase = await createClient()
    // const { data, error } = await supabase
    //   .from('wellness_posts')
    //   .insert({ title: 'Untitled', slug: `untitled-${Date.now()}`, content: '', tags: [] })
    //   .select('id')
    //   .single()
    // if (error) throw error
    // return { success: true, data: { id: data.id } }

    const now = new Date().toISOString()
    const id = crypto.randomUUID()
    const newPost: WellnessPost = {
      id,
      title: 'Untitled',
      slug: `untitled-${Date.now()}`,
      excerpt: null,
      content: '',
      cover_path: null,
      doc_path: null,
      tags: [],
      published: false,
      published_at: null,
      created_at: now,
      updated_at: now,
    }
    store = [newPost, ...store]
    return { success: true, data: { id } }
  } catch (err) {
    console.error('[createWellnessPost]', err)
    return { success: false, error: 'Failed to create wellness post.' }
  }
}

// ─── Update post fields ───────────────────────────────────────────────────────
export async function updateWellnessPost(
  id: string,
  data: Partial<Pick<WellnessPost, 'title' | 'slug' | 'excerpt' | 'content' | 'cover_path' | 'doc_path' | 'tags'>>
): Promise<ActionResult<WellnessPost>> {
  try {
    // TODO: Supabase swap ↓
    // const supabase = await createClient()
    // const { data: updated, error } = await supabase
    //   .from('wellness_posts')
    //   .update({ ...data, updated_at: new Date().toISOString() })
    //   .eq('id', id)
    //   .select()
    //   .single()
    // if (error) throw error
    // return { success: true, data: updated }

    const idx = store.findIndex((w) => w.id === id)
    if (idx === -1) return { success: false, error: 'Wellness post not found.' }
    store[idx] = { ...store[idx], ...data, updated_at: new Date().toISOString() }
    return { success: true, data: store[idx] }
  } catch (err) {
    console.error('[updateWellnessPost]', err)
    return { success: false, error: 'Failed to update wellness post.' }
  }
}

// ─── Toggle published state ───────────────────────────────────────────────────
export async function toggleWellnessPublished(
  id: string,
  published: boolean
): Promise<ActionResult<WellnessPost>> {
  try {
    // TODO: Supabase swap ↓
    // const supabase = await createClient()
    // const now = published ? new Date().toISOString() : null
    // const { data, error } = await supabase
    //   .from('wellness_posts')
    //   .update({ published, published_at: now, updated_at: new Date().toISOString() })
    //   .eq('id', id)
    //   .select()
    //   .single()
    // if (error) throw error
    // return { success: true, data }

    const idx = store.findIndex((w) => w.id === id)
    if (idx === -1) return { success: false, error: 'Wellness post not found.' }
    const now = new Date().toISOString()
    store[idx] = {
      ...store[idx],
      published,
      published_at: published ? (store[idx].published_at ?? now) : null,
      updated_at: now,
    }
    return { success: true, data: store[idx] }
  } catch (err) {
    console.error('[toggleWellnessPublished]', err)
    return { success: false, error: 'Failed to update publish state.' }
  }
}

// ─── Delete post ──────────────────────────────────────────────────────────────
export async function deleteWellnessPost(id: string): Promise<ActionResult> {
  try {
    // TODO: Supabase swap ↓
    // const supabase = await createClient()
    // const { error } = await supabase
    //   .from('wellness_posts')
    //   .delete()
    //   .eq('id', id)
    // if (error) throw error
    // return { success: true }

    const exists = store.some((w) => w.id === id)
    if (!exists) return { success: false, error: 'Wellness post not found.' }
    store = store.filter((w) => w.id !== id)
    return { success: true }
  } catch (err) {
    console.error('[deleteWellnessPost]', err)
    return { success: false, error: 'Failed to delete wellness post.' }
  }
}
