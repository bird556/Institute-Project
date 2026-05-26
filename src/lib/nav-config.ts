export interface NavItem {
  slug: string
  label: string
  href: string
  visible: boolean
}

export const ALL_NAV_DEFINITIONS: Omit<NavItem, 'visible'>[] = [
  { slug: 'home',            label: 'Home',             href: '/'               },
  { slug: 'events',          label: 'Events',           href: '/events'         },
  { slug: 'health-wellness', label: 'Health & Wellness', href: '/health-wellness' },
  { slug: 'reading-list',   label: 'Reading List',     href: '/reading-list'   },
  { slug: 'about',           label: 'About',            href: '/about'          },
  { slug: 'partners',        label: 'Partners',         href: '/partners'       },
  { slug: 'mission',         label: 'Mission',          href: '/mission'        },
  { slug: 'newsletter',      label: 'Newsletter',       href: '/newsletter'     },
  { slug: 'blogs',           label: 'Blogs',            href: '/blogs'          },
]

export const DEFAULT_NAV_CONFIG: NavItem[] = [
  { slug: 'home',            label: 'Home',             href: '/',                visible: true  },
  { slug: 'events',          label: 'Events',           href: '/events',          visible: true  },
  { slug: 'health-wellness', label: 'Health & Wellness', href: '/health-wellness', visible: true  },
  { slug: 'reading-list',   label: 'Reading List',     href: '/reading-list',    visible: true  },
  { slug: 'about',           label: 'About',            href: '/about',           visible: true  },
  { slug: 'partners',        label: 'Partners',         href: '/partners',        visible: false },
  { slug: 'mission',         label: 'Mission',          href: '/mission',         visible: false },
  { slug: 'newsletter',      label: 'Newsletter',       href: '/newsletter',      visible: false },
  { slug: 'blogs',           label: 'Blogs',            href: '/blogs',           visible: false },
]

export function parseNavConfig(json: string | undefined): NavItem[] {
  if (!json) return DEFAULT_NAV_CONFIG
  try {
    const parsed = JSON.parse(json) as NavItem[]
    if (!Array.isArray(parsed)) return DEFAULT_NAV_CONFIG
    // Merge in any new slugs added after the initial save
    const existing = new Set(parsed.map((i) => i.slug))
    const missing = ALL_NAV_DEFINITIONS
      .filter((d) => !existing.has(d.slug))
      .map((d) => ({ ...d, visible: false }))
    return [...parsed, ...missing]
  } catch {
    return DEFAULT_NAV_CONFIG
  }
}
