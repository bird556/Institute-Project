'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )
}

// ── Login ────────────────────────────────────────────
export async function loginAction(formData: FormData) {
  const email    = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { success: false, error: 'Invalid email or password.' }
  }

  redirect('/admin')
}

// ── Logout ───────────────────────────────────────────
export async function logoutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/admin')
}

// ── Forgot password ───────────────────────────────────
export async function forgotPasswordAction(formData: FormData) {
  const email    = formData.get('email') as string
  const supabase = await createClient()

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/admin/reset-password`,
  })

  if (error) {
    return { success: false, error: 'Something went wrong. Please try again.' }
  }

  return { success: true }
}

// ── Reset password ────────────────────────────────────
export async function resetPasswordAction(formData: FormData) {
  const password = formData.get('password') as string
  const supabase = await createClient()

  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    return { success: false, error: 'Could not update password. The link may have expired.' }
  }

  redirect('/admin')
}
