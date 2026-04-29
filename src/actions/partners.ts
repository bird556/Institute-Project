'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { Partner, ActionResult } from '@/types'

export async function getAdminPartners(): Promise<ActionResult<Partner[]>> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('partners')
    .select('*')
    .order('sort_order', { ascending: true })
  if (error) return { success: false, error: 'Failed to load partners.' }
  return { success: true, data }
}

export async function getPartnerById(id: string): Promise<ActionResult<Partner>> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('partners')
    .select('*')
    .eq('id', id)
    .single()
  if (error) return { success: false, error: 'Failed to load partner.' }
  return { success: true, data }
}

export async function getPublicPartnerById(id: string): Promise<ActionResult<Partner>> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('partners')
    .select('*')
    .eq('id', id)
    .eq('published', true)
    .single()
  if (error) return { success: false, error: 'Partner not found.' }
  return { success: true, data }
}

export async function createPartner(): Promise<ActionResult<{ id: string }>> {
  const supabase = await createClient()
  const { data: maxRow } = await supabase
    .from('partners')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)
    .single()
  const nextOrder = (maxRow?.sort_order ?? 0) + 1
  const { data, error } = await supabase
    .from('partners')
    .insert({ name: 'New Partner', sort_order: nextOrder })
    .select('id')
    .single()
  if (error) return { success: false, error: 'Failed to create partner.' }
  return { success: true, data: { id: data.id } }
}

export async function updatePartner(
  id: string,
  fields: Partial<Omit<Partner, 'id' | 'created_at'>>,
): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.from('partners').update(fields).eq('id', id)
  if (error) return { success: false, error: 'Failed to save partner.' }
  revalidatePath('/partners')
  return { success: true }
}

export async function updatePartnerSortOrder(
  updates: { id: string; sort_order: number }[],
): Promise<ActionResult> {
  const supabase = await createClient()
  const results = await Promise.all(
    updates.map(({ id, sort_order }) =>
      supabase.from('partners').update({ sort_order }).eq('id', id),
    ),
  )
  const failed = results.find((r) => r.error)
  if (failed?.error) return { success: false, error: 'Failed to save order.' }
  revalidatePath('/partners')
  return { success: true }
}

export async function togglePartnerPublished(
  id: string,
  published: boolean,
): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.from('partners').update({ published }).eq('id', id)
  if (error) return { success: false, error: 'Failed to update visibility.' }
  revalidatePath('/partners')
  return { success: true }
}

export async function deletePartner(id: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.from('partners').delete().eq('id', id)
  if (error) return { success: false, error: 'Failed to delete partner.' }
  revalidatePath('/partners')
  return { success: true }
}
