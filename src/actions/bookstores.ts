'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { Bookstore, ActionResult } from '@/types'

export async function getAdminBookstores(): Promise<ActionResult<Bookstore[]>> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('bookstores')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) return { success: false, error: 'Failed to load bookstores.' }
  return { success: true, data }
}

export async function getBookstoreById(id: string): Promise<ActionResult<Bookstore>> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('bookstores')
    .select('*')
    .eq('id', id)
    .single()
  if (error) return { success: false, error: 'Failed to load bookstore.' }
  return { success: true, data }
}

export async function createBookstore(): Promise<ActionResult<{ id: string }>> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('bookstores')
    .insert({ name: '' })
    .select('id')
    .single()
  if (error) return { success: false, error: 'Failed to create bookstore.' }
  return { success: true, data: { id: data.id } }
}

const TEXT_FIELDS = ['name', 'description', 'email', 'province', 'address', 'phone_number', 'website_url'] as const

export async function updateBookstore(
  id: string,
  fields: Partial<Omit<Bookstore, 'id' | 'created_at'>>,
): Promise<ActionResult> {
  const supabase = await createClient()

  const sanitized = { ...fields }
  for (const key of TEXT_FIELDS) {
    if (typeof sanitized[key] === 'string') {
      sanitized[key] = (sanitized[key] as string).trim() as never
    }
  }

  const { error } = await supabase
    .from('bookstores')
    .update({ ...sanitized, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) return { success: false, error: 'Failed to save bookstore.' }
  revalidatePath('/reading-list', 'layout')
  return { success: true }
}

export async function toggleBookstorePublished(
  id: string,
  published: boolean,
): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('bookstores')
    .update({ published, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) return { success: false, error: 'Failed to update publish status.' }
  revalidatePath('/reading-list', 'layout')
  return { success: true }
}

export async function deleteBookstore(id: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.from('bookstores').delete().eq('id', id)
  if (error) return { success: false, error: 'Failed to delete bookstore.' }
  revalidatePath('/reading-list', 'layout')
  return { success: true }
}
