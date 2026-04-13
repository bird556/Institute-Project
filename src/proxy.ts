import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_ADMIN_ROUTES = [
  '/admin/forgot-password',
  '/admin/reset-password',
]

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public admin routes (password recovery)
  if (PUBLIC_ADMIN_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // TODO: Re-enable auth guard once Supabase is wired up
  // if (pathname.startsWith('/admin')) {
  //   const response = NextResponse.next()
  //   const supabase = createServerClient(
  //     process.env.NEXT_PUBLIC_SUPABASE_URL!,
  //     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  //     {
  //       cookies: {
  //         getAll: () => request.cookies.getAll(),
  //         setAll: (cookiesToSet) => {
  //           cookiesToSet.forEach(({ name, value, options }) =>
  //             response.cookies.set(name, value, options)
  //           )
  //         },
  //       },
  //     }
  //   )
  //   const { data: { session } } = await supabase.auth.getSession()
  //   if (!session) {
  //     const loginUrl = new URL('/admin', request.url)
  //     return NextResponse.redirect(loginUrl)
  //   }
  //   return response
  // }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path+'],
}
