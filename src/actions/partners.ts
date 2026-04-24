'use server'

// import { createClient } from '@/lib/supabase/server'
import { mockPartners } from '@/lib/mock-data'
import type { Partner, ActionResult } from '@/types'

// ─── In-memory mock store ────────────────────────────────────────────────────
// TODO: Remove this store and all mock imports once Supabase is wired up.
let store: Partner[] = mockPartners.map((p) => ({
  id: p.id,
  name: p.name,
  logo_path: null,            // mock uses logo_url, not a storage path
  description: p.description,
  website_url: p.website_url,
  sort_order: p.sort_order,
  published: p.published,
  created_at: p.created_at,
}))

// ─── Get all partners (admin — sorted by sort_order) ─────────────────────────
export async function getAdminPartners(): Promise<ActionResult<Partner[]>> {
  try {
    // TODO: Supabase swap ↓
    // const supabase = await createClient()
    // const { data, error } = await supabase
    //   .from('partners')
    //   .select('*')
    //   .order('sort_order', { ascending: true })
    // if (error) throw error
    // return { success: true, data }

    const sorted = [...store].sort((a, b) => a.sort_order - b.sort_order)
    return { success: true, data: sorted }
  } catch (err) {
    console.error('[getAdminPartners]', err)
    return { success: false, error: 'Failed to load partners.' }
  }
}

// ─── Get single partner by id ─────────────────────────────────────────────────
export async function getPartnerById(id: string): Promise<ActionResult<Partner>> {
  try {
    // TODO: Supabase swap ↓
    // const supabase = await createClient()
    // const { data, error } = await supabase
    //   .from('partners')
    //   .select('*')
    //   .eq('id', id)
    //   .single()
    // if (error) throw error
    // return { success: true, data }

    const partner = store.find((p) => p.id === id)
    if (!partner) return { success: false, error: 'Partner not found.' }
    return { success: true, data: partner }
  } catch (err) {
    console.error('[getPartnerById]', err)
    return { success: false, error: 'Failed to load partner.' }
  }
}

// ─── Create blank partner ─────────────────────────────────────────────────────
export async function createPartner(): Promise<ActionResult<{ id: string }>> {
  try {
    // TODO: Supabase swap ↓
    // const supabase = await createClient()
    // const maxOrder = await supabase
    //   .from('partners')
    //   .select('sort_order')
    //   .order('sort_order', { ascending: false })
    //   .limit(1)
    //   .single()
    // const nextOrder = (maxOrder.data?.sort_order ?? 0) + 1
    // const { data, error } = await supabase
    //   .from('partners')
    //   .insert({ name: 'New Partner', sort_order: nextOrder })
    //   .select('id')
    //   .single()
    // if (error) throw error
    // return { success: true, data: { id: data.id } }

    const maxOrder = store.reduce((max, p) => Math.max(max, p.sort_order), 0)
    const id = crypto.randomUUID()
    const newPartner: Partner = {
      id,
      name: 'New Partner',
      logo_path: null,
      description: null,
      website_url: null,
      sort_order: maxOrder + 1,
      published: true,
      created_at: new Date().toISOString(),
    }
    store = [...store, newPartner]
    return { success: true, data: { id } }
  } catch (err) {
    console.error('[createPartner]', err)
    return { success: false, error: 'Failed to create partner.' }
  }
}

// ─── Update partner ───────────────────────────────────────────────────────────
export async function updatePartner(
  id: string,
  fields: Partial<Omit<Partner, 'id' | 'created_at'>>
): Promise<ActionResult> {
  try {
    // TODO: Supabase swap ↓
    // const supabase = await createClient()
    // const { error } = await supabase
    //   .from('partners')
    //   .update(fields)
    //   .eq('id', id)
    // if (error) throw error
    // return { success: true }

    const idx = store.findIndex((p) => p.id === id)
    if (idx === -1) return { success: false, error: 'Partner not found.' }
    store[idx] = { ...store[idx], ...fields }
    return { success: true }
  } catch (err) {
    console.error('[updatePartner]', err)
    return { success: false, error: 'Failed to save partner.' }
  }
}

// ─── Batch update sort order after drag-to-reorder ───────────────────────────
export async function updatePartnerSortOrder(
  updates: { id: string; sort_order: number }[]
): Promise<ActionResult> {
  try {
    // TODO: Supabase swap ↓
    // const supabase = await createClient()
    // await Promise.all(
    //   updates.map(({ id, sort_order }) =>
    //     supabase.from('partners').update({ sort_order }).eq('id', id)
    //   )
    // )
    // return { success: true }

    for (const { id, sort_order } of updates) {
      const idx = store.findIndex((p) => p.id === id)
      if (idx !== -1) store[idx] = { ...store[idx], sort_order }
    }
    return { success: true }
  } catch (err) {
    console.error('[updatePartnerSortOrder]', err)
    return { success: false, error: 'Failed to save order.' }
  }
}

// ─── Toggle visibility ────────────────────────────────────────────────────────
export async function togglePartnerPublished(
  id: string,
  published: boolean
): Promise<ActionResult> {
  try {
    // TODO: Supabase swap ↓
    // const supabase = await createClient()
    // const { error } = await supabase
    //   .from('partners')
    //   .update({ published })
    //   .eq('id', id)
    // if (error) throw error
    // return { success: true }

    const idx = store.findIndex((p) => p.id === id)
    if (idx === -1) return { success: false, error: 'Partner not found.' }
    store[idx] = { ...store[idx], published }
    return { success: true }
  } catch (err) {
    console.error('[togglePartnerPublished]', err)
    return { success: false, error: 'Failed to update visibility.' }
  }
}

// ─── Delete partner ───────────────────────────────────────────────────────────
export async function deletePartner(id: string): Promise<ActionResult> {
  try {
    // TODO: Supabase swap ↓
    // const supabase = await createClient()
    // const { error } = await supabase
    //   .from('partners')
    //   .delete()
    //   .eq('id', id)
    // if (error) throw error
    // return { success: true }

    const idx = store.findIndex((p) => p.id === id)
    if (idx === -1) return { success: false, error: 'Partner not found.' }
    store = store.filter((p) => p.id !== id)
    return { success: true }
  } catch (err) {
    console.error('[deletePartner]', err)
    return { success: false, error: 'Failed to delete partner.' }
  }
}
