'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { DirectoryEntry, DirectoryCategory, ActionResult } from '@/types'

export async function getAdminDirectoryEntries(
  category?: DirectoryCategory,
): Promise<ActionResult<DirectoryEntry[]>> {
  const supabase = await createClient()
  let query = supabase.from('directory_entries').select('*').order('sort_order', { ascending: true })
  if (category) query = query.eq('category', category)
  const { data, error } = await query
  if (error) return { success: false, error: 'Failed to load directory entries.' }
  return { success: true, data }
}

export async function getDirectoryEntryById(id: string): Promise<ActionResult<DirectoryEntry>> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('directory_entries')
    .select('*')
    .eq('id', id)
    .single()
  if (error) return { success: false, error: 'Failed to load entry.' }
  return { success: true, data }
}

export async function createDirectoryEntry(
  category: DirectoryCategory,
): Promise<ActionResult<{ id: string }>> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('directory_entries')
    .insert({ name: 'Untitled Entry', category, description: '', published: false })
    .select('id')
    .single()
  if (error) return { success: false, error: 'Failed to create entry.' }
  return { success: true, data: { id: data.id } }
}

export async function updateDirectoryEntry(
  id: string,
  fields: Partial<Omit<DirectoryEntry, 'id' | 'created_at'>>,
): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('directory_entries')
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) return { success: false, error: 'Failed to save entry.' }
  revalidatePath('/advocates', 'layout')
  revalidatePath('/psychotherapists', 'layout')
  revalidatePath('/referral-agencies', 'layout')
  revalidatePath('/black-mens-groups', 'layout')
  revalidatePath('/youth-service-organizations', 'layout')
  revalidatePath('/community-organizations', 'layout')
  revalidatePath('/about', 'layout')
  return { success: true }
}

export async function toggleDirectoryEntryPublished(
  id: string,
  published: boolean,
): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('directory_entries')
    .update({ published, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) return { success: false, error: 'Failed to update status.' }
  revalidatePath('/advocates', 'layout')
  revalidatePath('/psychotherapists', 'layout')
  revalidatePath('/referral-agencies', 'layout')
  revalidatePath('/black-mens-groups', 'layout')
  revalidatePath('/youth-service-organizations', 'layout')
  revalidatePath('/community-organizations', 'layout')
  return { success: true }
}

export async function deleteDirectoryEntry(id: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.from('directory_entries').delete().eq('id', id)
  if (error) return { success: false, error: 'Failed to delete entry.' }
  revalidatePath('/advocates', 'layout')
  revalidatePath('/psychotherapists', 'layout')
  revalidatePath('/referral-agencies', 'layout')
  revalidatePath('/black-mens-groups', 'layout')
  revalidatePath('/youth-service-organizations', 'layout')
  revalidatePath('/community-organizations', 'layout')
  return { success: true }
}

export async function getPublishedDirectoryEntries(
  category: DirectoryCategory,
): Promise<ActionResult<DirectoryEntry[]>> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('directory_entries')
    .select('*')
    .eq('category', category)
    .eq('published', true)
    .order('sort_order', { ascending: true })
  if (error) return { success: false, error: 'Failed to load entries.' }
  return { success: true, data }
}

export async function getPublicDirectoryEntryById(id: string): Promise<ActionResult<DirectoryEntry>> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('directory_entries')
    .select('*')
    .eq('id', id)
    .eq('published', true)
    .single()
  if (error) return { success: false, error: 'Entry not found.' }
  return { success: true, data }
}
