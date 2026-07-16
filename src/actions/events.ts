'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { slugify } from '@/lib/utils'
import type { Event, ActionResult } from '@/types'

export async function getAdminEvents(): Promise<ActionResult<Event[]>> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('event_date', { ascending: true })
  if (error) return { success: false, error: 'Failed to load events.' }
  return { success: true, data }
}

export async function getEventById(id: string): Promise<ActionResult<Event>> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single()
  if (error) return { success: false, error: 'Failed to load event.' }
  return { success: true, data }
}

export async function createEvent(): Promise<ActionResult<{ id: string }>> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('events')
    .insert({
      title: '',
      slug: `untitled-event-${Date.now()}`,
      description: '',
      event_date: new Date().toISOString(),
      external_url: null,
      event_type: 'kustawi',
    })
    .select('id')
    .single()
  if (error) return { success: false, error: 'Failed to create event.' }
  return { success: true, data: { id: data.id } }
}

export async function updateEvent(
  id: string,
  fields: Partial<Omit<Event, 'id' | 'created_at'>>,
): Promise<ActionResult> {
  const updatedFields = { ...fields }
  if (fields.title && !fields.slug) {
    updatedFields.slug = slugify(fields.title)
  }
  const supabase = await createClient()
  const { error } = await supabase
    .from('events')
    .update({ ...updatedFields, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) return { success: false, error: 'Failed to save event.' }
  revalidatePath('/events', 'layout')
  return { success: true }
}

export async function toggleEventPublished(
  id: string,
  published: boolean,
): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('events')
    .update({ published, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) return { success: false, error: 'Failed to update publish status.' }
  revalidatePath('/events', 'layout')
  revalidatePath('/', 'layout')
  return { success: true }
}

export async function deleteEvent(id: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.from('events').delete().eq('id', id)
  if (error) return { success: false, error: 'Failed to delete event.' }
  revalidatePath('/events', 'layout')
  revalidatePath('/', 'layout')
  return { success: true }
}
