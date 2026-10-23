import {
  LayoutDashboard, CalendarDays, BookOpen, Handshake, Home, Info, Settings,
  Newspaper, Calendar, List, Mail, Heart, Star, Microscope, Building2, Send,
  ShieldAlert, Users, Navigation2, Eye, PanelBottom, Download, Lock, Compass,
  GraduationCap, Store, Scale, FolderOpen,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
  exact?: boolean
  // Not highlighted while a ?tab= is selected (a tab-specific link is highlighted instead)
  inactiveWithTab?: boolean
}

// A collapsible run of related links inside a group (e.g. all Services pages)
export interface NavSubgroup {
  label: string
  icon: LucideIcon
  items: NavItem[]
}

export interface NavGroup {
  label: string
  items: NavItem[]
  subgroups?: NavSubgroup[]
}

// Shared by the desktop Sidebar and the MobileNav drawer
export const ADMIN_NAV_GROUPS: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard', href: '/admin', icon: LayoutDashboard, exact: true },
    ],
  },
  {
    label: 'Content',
    items: [
      { label: 'Events',             href: '/admin/events',                         icon: CalendarDays },
      { label: 'Reading List',       href: '/admin/reading-list',                   icon: BookOpen },
      { label: 'Book of the Month',  href: '/admin/reading-list/book-of-the-month', icon: Star },
      { label: 'Partners',           href: '/admin/partners',                       icon: Handshake },
      { label: 'Newsletter',         href: '/admin/newsletter',                     icon: Newspaper },
      { label: 'Healing & Wellness', href: '/admin/health-wellness',                icon: Heart },
      { label: 'Research',           href: '/admin/research',                       icon: Microscope },
    ],
  },
  {
    label: 'Directory',
    items: [
      { label: 'All Entries', href: '/admin/directory', icon: Users, inactiveWithTab: true },
    ],
    subgroups: [
      {
        label: 'Categories',
        icon: FolderOpen,
        items: [
          { label: 'Advocates',                   href: '/admin/directory?tab=advocate',                   icon: Users },
          { label: 'Psychotherapists',            href: '/admin/directory?tab=psychotherapist',            icon: Users },
          { label: 'Referral Agencies',           href: '/admin/directory?tab=referral_agency',            icon: Building2 },
          { label: "Black Men's Groups",          href: '/admin/directory?tab=black_mens_group',           icon: Users },
          { label: 'Youth Service Organizations', href: '/admin/directory?tab=youth_service_organization', icon: Users },
          { label: 'Community & Professional',    href: '/admin/directory?tab=community_organization',     icon: Users },
          { label: 'Racial Profiling Litigators', href: '/admin/directory?tab=racial_profiling_litigator', icon: Scale },
        ],
      },
    ],
  },
  {
    label: 'Pages',
    items: [
      { label: 'Home',                    href: '/admin/home',                 icon: Home },
      { label: 'About',                   href: '/admin/about',                icon: Info },
      { label: 'Events Page',             href: '/admin/pages/events',         icon: Calendar },
      { label: 'Newsletter Page',         href: '/admin/pages/newsletter',     icon: Mail },
      { label: 'Partners Page',           href: '/admin/pages/partners',       icon: Handshake },
      { label: 'Healing & Wellness Page', href: '/admin/pages/health-wellness', icon: Heart },
      { label: 'Values Page',             href: '/admin/pages/values',         icon: Compass },
    ],
    subgroups: [
      {
        label: 'Reading List Pages',
        icon: List,
        items: [
          { label: 'Reading List',      href: '/admin/pages/reading-list', icon: List },
          { label: 'Bibliography',      href: '/admin/pages/bibliography', icon: BookOpen },
          { label: 'MA and PhD Theses', href: '/admin/pages/theses',       icon: GraduationCap },
          { label: 'Bookstores',        href: '/admin/pages/bookstores',   icon: Store },
        ],
      },
      {
        label: 'Research Pages',
        icon: Microscope,
        items: [
          { label: 'Research',                            href: '/admin/pages/research',              icon: Microscope },
          { label: 'Research Institutes and Initiatives', href: '/admin/pages/research-institutes',   icon: Building2 },
          { label: 'Call for Papers',                     href: '/admin/pages/call-for-papers',       icon: Send },
          { label: 'Sexual Abuse of Boys and Men',        href: '/admin/pages/sexual-abuse-boys-men', icon: ShieldAlert },
        ],
      },
      {
        label: 'Services Pages',
        icon: Users,
        items: [
          { label: 'Access to Services',                       href: '/admin/pages/access-to-services',          icon: Users },
          { label: 'Advocates',                                href: '/admin/pages/advocates',                   icon: Users },
          { label: 'Psychotherapists',                         href: '/admin/pages/psychotherapists',            icon: Users },
          { label: 'Referral Agencies',                        href: '/admin/pages/referral-agencies',           icon: Users },
          { label: "Black Men's Groups",                       href: '/admin/pages/black-mens-groups',           icon: Users },
          { label: 'Youth Service Organizations',              href: '/admin/pages/youth-service-organizations', icon: Users },
          { label: 'Community and Professional Organizations', href: '/admin/pages/community-organizations',     icon: Users },
          { label: 'Racial Profiling Litigator Database',      href: '/admin/pages/racial-profiling-litigators', icon: Scale },
        ],
      },
    ],
  },
  {
    label: 'Settings',
    items: [
      { label: 'Settings',          href: '/admin/settings',            icon: Settings },
      { label: 'Newsletter Signup', href: '/admin/newsletter-settings', icon: Mail },
      { label: 'Navigation',        href: '/admin/navigation',          icon: Navigation2 },
      { label: 'Visibility',        href: '/admin/visibility',          icon: Eye },
      { label: 'Footer',            href: '/admin/footer',              icon: PanelBottom },
      { label: 'Site Access',       href: '/admin/access',              icon: Lock },
      { label: 'Export',            href: '/admin/export',              icon: Download },
    ],
  },
]

export const NAV_LINK_BASE =
  'flex items-center gap-3 px-2 py-2 rounded-lg text-sm font-medium transition-colors'
export const NAV_LINK_ACTIVE = 'bg-[var(--color-brand-teal)] text-white'
export const NAV_LINK_INACTIVE =
  'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)] dark:hover:bg-[var(--color-dark-surface-hover)] dark:hover:text-[#e8ecec]'

// `tab` is the current ?tab= value — links that carry a ?tab= match on it too
export function isNavActive(pathname: string, item: NavItem, tab: string | null) {
  const [path, query] = item.href.split('?')
  if (query) return pathname === path && tab === new URLSearchParams(query).get('tab')
  if (item.inactiveWithTab && pathname === path && tab) return false
  if (item.exact) return pathname === path
  return pathname === path || pathname.startsWith(path + '/')
}
