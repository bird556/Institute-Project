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
    .order('event_date', { ascending: true, nullsFirst: false })
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

function saveErrorMessage(code: string | undefined): string {
  switch (code) {
    case '23505':
      return 'That slug is already used by another event. Choose a different one.'
    case 'PGRST204': // column missing from the schema cache
    case '42703':    // undefined column
      return 'The database is missing a new event column — run the latest event migration in Supabase.'
    case '23502':    // not-null violation
      return 'The database still requires a start date — run the latest event migration in Supabase to allow TBD dates.'
    default:
      return 'Failed to save event.'
  }
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

  if (updatedFields.slug) {
    const { data: conflict } = await supabase
      .from('events')
      .select('id')
      .eq('slug', updatedFields.slug)
      .neq('id', id)
      .maybeSingle()
    if (conflict) {
      return { success: false, error: 'That slug is already used by another event. Choose a different one.' }
    }
  }

  const { error } = await supabase
    .from('events')
    .update({ ...updatedFields, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) {
    console.error('updateEvent failed:', error.code, error.message)
    return { success: false, error: saveErrorMessage(error.code) }
  }
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
