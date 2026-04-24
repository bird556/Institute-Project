'use server'

// import { createClient } from '@/lib/supabase/server'
import { mockEvents } from '@/lib/mock-data'
import { slugify } from '@/lib/utils'
import type { Event, ActionResult } from '@/types'

// ─── In-memory mock store ────────────────────────────────────────────────────
// TODO: Remove this store and all mock imports once Supabase is wired up.
let store: Event[] = mockEvents.map((e) => ({
  id: e.id,
  title: e.title,
  slug: e.slug,
  description: e.description,
  cover_path: null,           // mock uses cover_url, not a storage path
  location: e.location,
  event_date: e.event_date,
  external_url: e.external_url,
  published: e.published,
  created_at: e.created_at,
  updated_at: e.updated_at,
}))

// ─── Get all events (admin — includes drafts) ─────────────────────────────────
export async function getAdminEvents(): Promise<ActionResult<Event[]>> {
  try {
    // TODO: Supabase swap ↓
    // const supabase = await createClient()
    // const { data, error } = await supabase
    //   .from('events')
    //   .select('*')
    //   .order('event_date', { ascending: true })
    // if (error) throw error
    // return { success: true, data }

    const sorted = [...store].sort(
      (a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
    )
    return { success: true, data: sorted }
  } catch (err) {
    console.error('[getAdminEvents]', err)
    return { success: false, error: 'Failed to load events.' }
  }
}

// ─── Get single event by id ───────────────────────────────────────────────────
export async function getEventById(id: string): Promise<ActionResult<Event>> {
  try {
    // TODO: Supabase swap ↓
    // const supabase = await createClient()
    // const { data, error } = await supabase
    //   .from('events')
    //   .select('*')
    //   .eq('id', id)
    //   .single()
    // if (error) throw error
    // return { success: true, data }

    const event = store.find((e) => e.id === id)
    if (!event) return { success: false, error: 'Event not found.' }
    return { success: true, data: event }
  } catch (err) {
    console.error('[getEventById]', err)
    return { success: false, error: 'Failed to load event.' }
  }
}

// ─── Create blank draft ──────────────────────────────────────────────────────
export async function createEvent(): Promise<ActionResult<{ id: string }>> {
  try {
    // TODO: Supabase swap ↓
    // const supabase = await createClient()
    // const { data, error } = await supabase
    //   .from('events')
    //   .insert({
    //     title: 'Untitled Event',
    //     slug: `untitled-event-${Date.now()}`,
    //     description: '',
    //     event_date: new Date().toISOString(),
    //     external_url: null,
    //   })
    //   .select('id')
    //   .single()
    // if (error) throw error
    // return { success: true, data: { id: data.id } }

    const now = new Date().toISOString()
    const id = crypto.randomUUID()
    const newEvent: Event = {
      id,
      title: 'Untitled Event',
      slug: `untitled-event-${Date.now()}`,
      description: '',
      cover_path: null,
      location: null,
      event_date: now,
      external_url: null,
      published: false,
      created_at: now,
      updated_at: now,
    }
    store = [newEvent, ...store]
    return { success: true, data: { id } }
  } catch (err) {
    console.error('[createEvent]', err)
    return { success: false, error: 'Failed to create event.' }
  }
}

// ─── Update event ────────────────────────────────────────────────────────────
export async function updateEvent(
  id: string,
  fields: Partial<Omit<Event, 'id' | 'created_at'>>
): Promise<ActionResult> {
  try {
    // TODO: Supabase swap ↓
    // const supabase = await createClient()
    // const { error } = await supabase
    //   .from('events')
    //   .update({ ...fields, updated_at: new Date().toISOString() })
    //   .eq('id', id)
    // if (error) throw error
    // return { success: true }

    const idx = store.findIndex((e) => e.id === id)
    if (idx === -1) return { success: false, error: 'Event not found.' }

    const updatedFields = { ...fields }
    if (fields.title && !fields.slug) {
      updatedFields.slug = slugify(fields.title)
    }

    store[idx] = { ...store[idx], ...updatedFields, updated_at: new Date().toISOString() }
    return { success: true }
  } catch (err) {
    console.error('[updateEvent]', err)
    return { success: false, error: 'Failed to save event.' }
  }
}

// ─── Toggle published status ─────────────────────────────────────────────────
export async function toggleEventPublished(
  id: string,
  published: boolean
): Promise<ActionResult> {
  try {
    // TODO: Supabase swap ↓
    // const supabase = await createClient()
    // const { error } = await supabase
    //   .from('events')
    //   .update({ published, updated_at: new Date().toISOString() })
    //   .eq('id', id)
    // if (error) throw error
    // return { success: true }

    const idx = store.findIndex((e) => e.id === id)
    if (idx === -1) return { success: false, error: 'Event not found.' }

    store[idx] = {
      ...store[idx],
      published,
      updated_at: new Date().toISOString(),
    }
    return { success: true }
  } catch (err) {
    console.error('[toggleEventPublished]', err)
    return { success: false, error: 'Failed to update publish status.' }
  }
}

// ─── Delete event ─────────────────────────────────────────────────────────────
export async function deleteEvent(id: string): Promise<ActionResult> {
  try {
    // TODO: Supabase swap ↓
    // const supabase = await createClient()
    // const { error } = await supabase
    //   .from('events')
    //   .delete()
    //   .eq('id', id)
    // if (error) throw error
    // return { success: true }

    const idx = store.findIndex((e) => e.id === id)
    if (idx === -1) return { success: false, error: 'Event not found.' }
    store = store.filter((e) => e.id !== id)
    return { success: true }
  } catch (err) {
    console.error('[deleteEvent]', err)
    return { success: false, error: 'Failed to delete event.' }
  }
}
