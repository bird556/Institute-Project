'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getSiteGate, signGatePassword } from '@/lib/site-gate'

export async function unlockSite(password: string, next?: string): Promise<{ success: boolean; error?: string }> {
  const { password: correct } = await getSiteGate()
  if (password.trim() !== correct) {
    return { success: false, error: 'Incorrect password.' }
  }

  const token = await signGatePassword(correct)
  const cookieStore = await cookies()
  cookieStore.set('site_access_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 60,
    path: '/',
  })

  redirect(next && next.startsWith('/') ? next : '/')
}
