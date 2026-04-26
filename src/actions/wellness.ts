'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { WellnessPost, ActionResult } from '@/types'

export async function getAdminWellnessPosts(): Promise<ActionResult<WellnessPost[]>> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('wellness_posts')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) return { success: false, error: 'Failed to load wellness posts.' }
  return { success: true, data }
}

export async function getWellnessById(id: string): Promise<ActionResult<WellnessPost>> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('wellness_posts')
    .select('*')
    .eq('id', id)
    .single()
  if (error) return { success: false, error: 'Failed to load wellness post.' }
  return { success: true, data }
}

export async function createWellnessPost(): Promise<ActionResult<{ id: string }>> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('wellness_posts')
    .insert({ title: 'Untitled', slug: `untitled-${Date.now()}`, content: '', tags: [] })
    .select('id')
    .single()
  if (error) return { success: false, error: 'Failed to create wellness post.' }
  return { success: true, data: { id: data.id } }
}

export async function updateWellnessPost(
  id: string,
  fields: Partial<Pick<WellnessPost, 'title' | 'slug' | 'excerpt' | 'content' | 'cover_path' | 'doc_path' | 'tags'>>,
): Promise<ActionResult<WellnessPost>> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('wellness_posts')
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) return { success: false, error: 'Failed to update wellness post.' }
  revalidatePath('/health-wellness', 'layout')
  return { success: true, data }
}

export async function toggleWellnessPublished(
  id: string,
  published: boolean,
): Promise<ActionResult<WellnessPost>> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('wellness_posts')
    .update({
      published,
      published_at: published ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()
  if (error) return { success: false, error: 'Failed to update publish state.' }
  revalidatePath('/health-wellness', 'layout')
  return { success: true, data }
}

export async function deleteWellnessPost(id: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.from('wellness_posts').delete().eq('id', id)
  if (error) return { success: false, error: 'Failed to delete wellness post.' }
  revalidatePath('/health-wellness', 'layout')
  return { success: true }
}
