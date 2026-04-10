import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function proxy(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request)

  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin/')

  if (isAdminRoute && !user) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/admin'
    return NextResponse.redirect(loginUrl)
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/admin/:path+'],
}
