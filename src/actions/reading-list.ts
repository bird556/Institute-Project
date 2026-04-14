'use server'

import { mockReadingList } from '@/lib/mock-data'
import type { ReadingListItem, ActionResult } from '@/types'

// ─── In-memory mock store ────────────────────────────────────────────────────
// TODO: Remove this store and all mock imports once Supabase is wired up.
let store: ReadingListItem[] = mockReadingList.map((r) => ({
  id: r.id,
  title: r.title,
  author: r.author,
  description: r.description,
  cover_path: null,           // mock uses cover_url, not a storage path
  external_url: r.external_url,
  published: r.published,
  created_at: r.created_at,
  updated_at: r.updated_at,
}))

// ─── Get all reading list items (admin — includes drafts) ────────────────────
export async function getAdminReadingList(): Promise<ActionResult<ReadingListItem[]>> {
  try {
    // TODO: Supabase swap ↓
    // const supabase = createServerClient()
    // const { data, error } = await supabase
    //   .from('reading_list')
    //   .select('*')
    //   .order('created_at', { ascending: false })
    // if (error) throw error
    // return { success: true, data }

    const sorted = [...store].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    return { success: true, data: sorted }
  } catch (err) {
    console.error('[getAdminReadingList]', err)
    return { success: false, error: 'Failed to load reading list.' }
  }
}

// ─── Get single item by id ───────────────────────────────────────────────────
export async function getReadingListItemById(id: string): Promise<ActionResult<ReadingListItem>> {
  try {
    // TODO: Supabase swap ↓
    // const supabase = createServerClient()
    // const { data, error } = await supabase
    //   .from('reading_list')
    //   .select('*')
    //   .eq('id', id)
    //   .single()
    // if (error) throw error
    // return { success: true, data }

    const item = store.find((r) => r.id === id)
    if (!item) return { success: false, error: 'Reading list item not found.' }
    return { success: true, data: item }
  } catch (err) {
    console.error('[getReadingListItemById]', err)
    return { success: false, error: 'Failed to load reading list item.' }
  }
}

// ─── Create blank draft ──────────────────────────────────────────────────────
export async function createReadingListItem(): Promise<ActionResult<{ id: string }>> {
  try {
    // TODO: Supabase swap ↓
    // const supabase = createServerClient()
    // const { data, error } = await supabase
    //   .from('reading_list')
    //   .insert({ title: 'Untitled', description: '' })
    //   .select('id')
    //   .single()
    // if (error) throw error
    // return { success: true, data: { id: data.id } }

    const now = new Date().toISOString()
    const id = crypto.randomUUID()
    const newItem: ReadingListItem = {
      id,
      title: 'Untitled',
      author: null,
      description: null,
      cover_path: null,
      external_url: null,
      published: false,
      created_at: now,
      updated_at: now,
    }
    store = [newItem, ...store]
    return { success: true, data: { id } }
  } catch (err) {
    console.error('[createReadingListItem]', err)
    return { success: false, error: 'Failed to create reading list item.' }
  }
}

// ─── Update reading list item ────────────────────────────────────────────────
export async function updateReadingListItem(
  id: string,
  fields: Partial<Omit<ReadingListItem, 'id' | 'created_at'>>
): Promise<ActionResult> {
  try {
    // TODO: Supabase swap ↓
    // const supabase = createServerClient()
    // const { error } = await supabase
    //   .from('reading_list')
    //   .update({ ...fields, updated_at: new Date().toISOString() })
    //   .eq('id', id)
    // if (error) throw error
    // return { success: true }

    const idx = store.findIndex((r) => r.id === id)
    if (idx === -1) return { success: false, error: 'Reading list item not found.' }

    store[idx] = { ...store[idx], ...fields, updated_at: new Date().toISOString() }
    return { success: true }
  } catch (err) {
    console.error('[updateReadingListItem]', err)
    return { success: false, error: 'Failed to save reading list item.' }
  }
}

// ─── Toggle published status ─────────────────────────────────────────────────
export async function toggleReadingListPublished(
  id: string,
  published: boolean
): Promise<ActionResult> {
  try {
    // TODO: Supabase swap ↓
    // const supabase = createServerClient()
    // const { error } = await supabase
    //   .from('reading_list')
    //   .update({ published, updated_at: new Date().toISOString() })
    //   .eq('id', id)
    // if (error) throw error
    // return { success: true }

    const idx = store.findIndex((r) => r.id === id)
    if (idx === -1) return { success: false, error: 'Reading list item not found.' }

    store[idx] = {
      ...store[idx],
      published,
      updated_at: new Date().toISOString(),
    }
    return { success: true }
  } catch (err) {
    console.error('[toggleReadingListPublished]', err)
    return { success: false, error: 'Failed to update publish status.' }
  }
}

// ─── Delete reading list item ─────────────────────────────────────────────────
export async function deleteReadingListItem(id: string): Promise<ActionResult> {
  try {
    // TODO: Supabase swap ↓
    // const supabase = createServerClient()
    // const { error } = await supabase
    //   .from('reading_list')
    //   .delete()
    //   .eq('id', id)
    // if (error) throw error
    // return { success: true }

    const idx = store.findIndex((r) => r.id === id)
    if (idx === -1) return { success: false, error: 'Reading list item not found.' }
    store = store.filter((r) => r.id !== id)
    return { success: true }
  } catch (err) {
    console.error('[deleteReadingListItem]', err)
    return { success: false, error: 'Failed to delete reading list item.' }
  }
}
