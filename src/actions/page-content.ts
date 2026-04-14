'use server'

import { getMockPageContent, getMockSection, mockPageContent } from '@/lib/mock-data'
import type { PageContent } from '@/types'

export async function getPageContent(
  page: string,
): Promise<{ success: boolean; data?: PageContent[]; error?: string }> {
  // TODO: replace with Supabase query
  // const supabase = await createClient()
  // const { data, error } = await supabase.from('page_content').select('*').eq('page', page)
  // if (error) return { success: false, error: error.message }
  // return { success: true, data }
  try {
    const data = getMockPageContent(page) as PageContent[]
    return { success: true, data }
  } catch (err) {
    return { success: false, error: (err as Error).message }
  }
}

export async function getPageSection(
  page: string,
  section: string,
): Promise<{ success: boolean; data?: PageContent; error?: string }> {
  // TODO: replace with Supabase query
  // const supabase = await createClient()
  // const { data, error } = await supabase
  //   .from('page_content').select('*').eq('page', page).eq('section', section).single()
  // if (error) return { success: false, error: error.message }
  // return { success: true, data }
  try {
    const data = getMockSection(page, section) as PageContent | undefined
    if (!data) return { success: false, error: 'Section not found' }
    return { success: true, data }
  } catch (err) {
    return { success: false, error: (err as Error).message }
  }
}

export async function updatePageSection(
  page: string,
  section: string,
  content: string,
): Promise<{ success: boolean; error?: string }> {
  // TODO: replace with Supabase query
  // const supabase = await createClient()
  // const { error } = await supabase.from('page_content').upsert(
  //   { page, section, content, updated_at: new Date().toISOString() },
  //   { onConflict: 'page,section' },
  // )
  // if (error) return { success: false, error: error.message }
  // return { success: true }
  try {
    const item = mockPageContent.find(i => i.page === page && i.section === section)
    if (item) {
      item.content = content
      item.updated_at = new Date().toISOString()
    }
    return { success: true }
  } catch (err) {
    return { success: false, error: (err as Error).message }
  }
}
