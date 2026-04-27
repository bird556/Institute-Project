'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { SiteSettings } from '@/types'

export async function getSiteSettings(): Promise<{ success: boolean; data?: SiteSettings; error?: string }> {
  const supabase = await createClient()
  const { data, error } = await supabase.from('site_settings').select('key, value')
  if (error) return { success: false, error: error.message }
  const settings = Object.fromEntries(data.map(row => [row.key, row.value])) as SiteSettings
  return { success: true, data: settings }
}

export async function updateSiteSetting(
  key: string,
  value: string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('site_settings')
    .update({ value })
    .eq('key', key)
  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function updateSiteSettings(
  updates: Record<string, string>,
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const results = await Promise.all(
    Object.entries(updates).map(([key, value]) =>
      supabase.from('site_settings').update({ value }).eq('key', key),
    ),
  )
  const failed = results.find((r) => r.error)
  if (failed?.error) return { success: false, error: failed.error.message }
  return { success: true }
}

export async function toggleSectionVisibility(
  key: string,
  enabled: boolean,
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('site_settings')
    .update({ value: enabled ? 'true' : 'false' })
    .eq('key', key)
  if (error) return { success: false, error: error.message }
  revalidatePath('/', 'layout')
  return { success: true }
}

export async function changeAdminPassword(
  _currentPassword: string,
  newPassword: string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ password: newPassword })
  if (error) return { success: false, error: error.message }
  return { success: true }
}
