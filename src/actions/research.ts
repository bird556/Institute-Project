'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { ResearchPost, ResearchCategory, ActionResult } from '@/types'

export async function getAdminResearchPosts(): Promise<ActionResult<ResearchPost[]>> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('research_posts')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) return { success: false, error: 'Failed to load research posts.' }
  return { success: true, data }
}

export async function getResearchById(id: string): Promise<ActionResult<ResearchPost>> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('research_posts')
    .select('*')
    .eq('id', id)
    .single()
  if (error) return { success: false, error: 'Failed to load research post.' }
  return { success: true, data }
}

export async function getPublishedResearchByCategory(category: ResearchCategory): Promise<ActionResult<ResearchPost[]>> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('research_posts')
    .select('*')
    .eq('published', true)
    .eq('category', category)
    .order('published_at', { ascending: false })
  if (error) return { success: false, error: 'Failed to load research posts.' }
  return { success: true, data }
}

export async function getPublishedResearchCounts(): Promise<ActionResult<Record<ResearchCategory, number>>> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('research_posts')
    .select('category')
    .eq('published', true)
  if (error) return { success: false, error: 'Failed to load counts.' }
  const counts: Record<ResearchCategory, number> = {
    'announcements': 0,
    'call-for-papers': 0,
    'recent-publications': 0,
    'reports': 0,
    'research-institutes': 0,
    'sexual-abuse-boys-men': 0,
  }
  for (const row of data ?? []) {
    counts[row.category as ResearchCategory] = (counts[row.category as ResearchCategory] ?? 0) + 1
  }
  return { success: true, data: counts }
}

export async function createResearchPost(category: ResearchCategory = 'announcements'): Promise<ActionResult<{ id: string }>> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('research_posts')
    .insert({ title: 'Untitled', slug: `untitled-${Date.now()}`, content: '', category })
    .select('id')
    .single()
  if (error) return { success: false, error: 'Failed to create research post.' }
  return { success: true, data: { id: data.id } }
}

export async function updateResearchPost(
  id: string,
  fields: Partial<Pick<ResearchPost, 'title' | 'slug' | 'excerpt' | 'content' | 'cover_path' | 'category' | 'external_url' | 'region' | 'author' | 'item_type'>>,
): Promise<ActionResult<ResearchPost>> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('research_posts')
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) return { success: false, error: 'Failed to update research post.' }
  revalidatePath('/research', 'layout')
  return { success: true, data }
}

export async function toggleResearchPublished(
  id: string,
  published: boolean,
): Promise<ActionResult<ResearchPost>> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('research_posts')
    .update({
      published,
      published_at: published ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()
  if (error) return { success: false, error: 'Failed to update publish state.' }
  revalidatePath('/research', 'layout')
  return { success: true, data }
}

export async function deleteResearchPost(id: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.from('research_posts').delete().eq('id', id)
  if (error) return { success: false, error: 'Failed to delete research post.' }
  revalidatePath('/research', 'layout')
  return { success: true }
}
