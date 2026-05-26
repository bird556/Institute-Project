'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { ReadingListItem, ActionResult } from '@/types'

export async function getAdminReadingList(): Promise<ActionResult<ReadingListItem[]>> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('reading_list')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) return { success: false, error: 'Failed to load reading list.' }
  return { success: true, data }
}

export async function getReadingListItemById(id: string): Promise<ActionResult<ReadingListItem>> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('reading_list')
    .select('*')
    .eq('id', id)
    .single()
  if (error) return { success: false, error: 'Failed to load reading list item.' }
  return { success: true, data }
}

export async function createReadingListItem(): Promise<ActionResult<{ id: string }>> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('reading_list')
    .insert({ title: 'Untitled', description: '' })
    .select('id')
    .single()
  if (error) return { success: false, error: 'Failed to create reading list item.' }
  return { success: true, data: { id: data.id } }
}

export async function updateReadingListItem(
  id: string,
  fields: Partial<Omit<ReadingListItem, 'id' | 'created_at'>>,
): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('reading_list')
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) return { success: false, error: 'Failed to save reading list item.' }
  revalidatePath('/reading-list', 'layout')
  return { success: true }
}

export async function toggleReadingListPublished(
  id: string,
  published: boolean,
): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('reading_list')
    .update({ published, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) return { success: false, error: 'Failed to update publish status.' }
  revalidatePath('/reading-list', 'layout')
  return { success: true }
}

export async function deleteReadingListItem(id: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.from('reading_list').delete().eq('id', id)
  if (error) return { success: false, error: 'Failed to delete reading list item.' }
  revalidatePath('/reading-list', 'layout')
  return { success: true }
}

export async function setBookOfTheMonth(id: string | null): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('site_settings')
    .update({ value: id ?? '' })
    .eq('key', 'book_of_the_month_id')
  if (error) return { success: false, error: 'Failed to update Book of the Month.' }
  revalidatePath('/reading-list', 'layout')
  return { success: true }
}
