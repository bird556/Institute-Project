'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { PageContent } from '@/types'

export async function getPageContent(
  page: string,
): Promise<{ success: boolean; data?: PageContent[]; error?: string }> {
  const supabase = await createClient()
  const { data, error } = await supabase.from('page_content').select('*').eq('page', page)
  if (error) return { success: false, error: error.message }
  return { success: true, data }
}

export async function getPageSection(
  page: string,
  section: string,
): Promise<{ success: boolean; data?: PageContent; error?: string }> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('page_content')
    .select('*')
    .eq('page', page)
    .eq('section', section)
    .single()
  if (error) return { success: false, error: error.message }
  return { success: true, data }
}

export async function updatePageSection(
  page: string,
  section: string,
  content: string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { error } = await supabase.from('page_content').upsert(
    { page, section, content, updated_at: new Date().toISOString() },
    { onConflict: 'page,section' },
  )
  if (error) return { success: false, error: error.message }
  revalidatePath(`/${page}`)
  return { success: true }
}
