import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { getSiteVisibility, type SiteVisibility } from '@/lib/site-visibility'
import { getSiteGate, signGatePassword } from '@/lib/site-gate'

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
  '/values':            'values_page_enabled',
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public admin routes (password recovery)
  if (PUBLIC_ADMIN_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Bare /admin renders its own LoginForm/Dashboard based on session state —
  // it must never be redirected to itself (that's an infinite loop). Only
  // sub-routes (/admin/blogs, etc.) need the redirect-if-no-session guard.
  if (pathname === '/admin') {
    return NextResponse.next()
  }

  if (pathname.startsWith('/admin/')) {
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

  // The unlock page itself must never be gated (would redirect-loop). If the
  // gate is off there's nothing to unlock, so send visitors back to home.
  if (pathname === '/access') {
    const { enabled } = await getSiteGate()
    if (!enabled) return NextResponse.redirect(new URL('/', request.url))
    return NextResponse.next()
  }

  // Sitewide password gate — checked before per-section visibility so a
  // locked-out visitor never learns which sections exist. This runs on every
  // request, so any failure here (e.g. a missing SITE_ACCESS_SECRET) must
  // fail open rather than 500 the entire site.
  try {
    const gate = await getSiteGate()
    if (gate.enabled) {
      const token = request.cookies.get('site_access_token')?.value
      const expected = await signGatePassword(gate.password)
      if (token !== expected) {
        const url = new URL('/access', request.url)
        url.searchParams.set('next', pathname)
        return NextResponse.redirect(url)
      }
    }
  } catch (err) {
    console.error('Site access gate check failed, allowing request through:', err)
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
  // Catch-all: everything except Next internals, API routes, and static files
  // (the sitewide access gate needs to cover every public route, not just the
  // hand-picked list of sections that existed before that feature).
  matcher: ['/((?!_next|api|favicon.ico|.*\\..*).*)'],
}
