import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { getSiteVisibility, type SiteVisibility } from '@/lib/site-visibility'

const PUBLIC_ADMIN_ROUTES = [
  '/admin/forgot-password',
  '/admin/reset-password',
]

// Maps each public section route prefix → its visibility key
const SECTION_ROUTES: Record<string, keyof SiteVisibility> = {
  '/about':             'about_enabled',
  '/mission':           'mission_enabled',
  '/advocates':         'advocates_enabled',
  '/psychotherapists':  'psychotherapists_enabled',
  '/referral-agencies': 'referral_agencies_enabled',
  '/blogs':             'blogs_enabled',
  '/events':            'events_enabled',
  '/reading-list':      'reading_list_enabled',
  '/partners':          'partners_enabled',
  '/newsletter':        'newsletter_enabled',
  '/health-wellness':   'health_wellness_enabled',
  '/research':          'research_enabled',
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public admin routes (password recovery)
  if (PUBLIC_ADMIN_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  if (pathname.startsWith('/admin')) {
    const response = NextResponse.next()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll: (cookiesToSet) => {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            )
          },
        },
      }
    )
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      const loginUrl = new URL('/admin', request.url)
      return NextResponse.redirect(loginUrl)
    }
    return response
  }

  // Redirect to home if a public section is disabled
  for (const [routePrefix, visibilityKey] of Object.entries(SECTION_ROUTES)) {
    if (pathname === routePrefix || pathname.startsWith(routePrefix + '/')) {
      const visibility = await getSiteVisibility()
      if (!visibility[visibilityKey]) {
        return NextResponse.redirect(new URL('/', request.url))
      }
      break
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path+',
    '/about',
    '/mission',
    '/advocates/:path*',
    '/psychotherapists/:path*',
    '/referral-agencies/:path*',
    '/blogs/:path*',
    '/events/:path*',
    '/reading-list/:path*',
    '/partners',
    '/newsletter/:path*',
    '/health-wellness/:path*',
    '/research/:path*',
  ],
}
