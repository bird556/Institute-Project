import { unstable_cache } from 'next/cache'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export const getSiteGate = unstable_cache(
  async (): Promise<{ enabled: boolean; password: string }> => {
    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
    const { data } = await supabase
      .from('site_settings')
      .select('key, value')
      .in('key', ['site_gate_enabled', 'site_gate_password'])
    const map = Object.fromEntries((data ?? []).map(row => [row.key, row.value]))
    return {
      enabled: map.site_gate_enabled === 'true',
      password: map.site_gate_password ?? 'Brock University',
    }
  },
  ['site-gate'],
  { revalidate: 60 },
)

export async function signGatePassword(password: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(process.env.SITE_ACCESS_SECRET!),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(password))
  return [...new Uint8Array(sig)].map(b => b.toString(16).padStart(2, '0')).join('')
}
