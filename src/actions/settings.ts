'use server'

import { mockSiteSettings } from '@/lib/mock-data'
import type { SiteSettings } from '@/types'

export async function getSiteSettings(): Promise<{ success: boolean; data?: SiteSettings; error?: string }> {
  // TODO: replace with Supabase query
  // const supabase = await createClient()
  // const { data, error } = await supabase.from('site_settings').select('key, value')
  // if (error) return { success: false, error: error.message }
  // const settings = Object.fromEntries(data.map(row => [row.key, row.value])) as SiteSettings
  // return { success: true, data: settings }
  try {
    const data: SiteSettings = { ...mockSiteSettings }
    return { success: true, data }
  } catch (err) {
    return { success: false, error: (err as Error).message }
  }
}

export async function updateSiteSetting(
  key: string,
  value: string,
): Promise<{ success: boolean; error?: string }> {
  // TODO: replace with Supabase query
  // const supabase = await createClient()
  // const { error } = await supabase
  //   .from('site_settings')
  //   .update({ value, updated_at: new Date().toISOString() })
  //   .eq('key', key)
  // if (error) return { success: false, error: error.message }
  // return { success: true }
  try {
    (mockSiteSettings as unknown as Record<string, string>)[key] = value
    return { success: true }
  } catch (err) {
    return { success: false, error: (err as Error).message }
  }
}

export async function updateSiteSettings(
  updates: Record<string, string>,
): Promise<{ success: boolean; error?: string }> {
  // TODO: replace with Supabase query
  // const supabase = await createClient()
  // for (const [key, value] of Object.entries(updates)) {
  //   const { error } = await supabase.from('site_settings').update({ value }).eq('key', key)
  //   if (error) return { success: false, error: error.message }
  // }
  // return { success: true }
  try {
    for (const [key, value] of Object.entries(updates)) {
      (mockSiteSettings as unknown as Record<string, string>)[key] = value
    }
    return { success: true }
  } catch (err) {
    return { success: false, error: (err as Error).message }
  }
}

export async function toggleSectionVisibility(
  key: string,
  enabled: boolean,
): Promise<{ success: boolean; error?: string }> {
  // TODO: replace with Supabase query + revalidateTag('site-visibility')
  // const supabase = await createClient()
  // const { error } = await supabase
  //   .from('site_settings')
  //   .update({ value: enabled ? 'true' : 'false' })
  //   .eq('key', key)
  // if (error) return { success: false, error: error.message }
  // revalidateTag('site-visibility')
  // return { success: true }
  try {
    (mockSiteSettings as unknown as Record<string, string>)[key] = enabled ? 'true' : 'false'
    return { success: true }
  } catch (err) {
    return { success: false, error: (err as Error).message }
  }
}

export async function changeAdminPassword(
  _currentPassword: string,
  _newPassword: string,
): Promise<{ success: boolean; error?: string }> {
  // TODO: replace with Supabase Auth
  // const supabase = await createClient()
  // const { error } = await supabase.auth.updateUser({ password: newPassword })
  // if (error) return { success: false, error: error.message }
  // return { success: true }
  return { success: true }
}
