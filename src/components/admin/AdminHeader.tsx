'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Moon, Sun, LogOut, Menu } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { logoutAction } from '@/actions/auth'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-/i

const EDITOR_TITLES: Record<string, string> = {
  blogs: 'Blog Post',
  events: 'Event',
  'reading-list': 'Reading List Item',
  partners: 'Partner',
}

function getPageTitle(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean)
  const last = segments[segments.length - 1]
  if (!last || last === 'admin') return 'Dashboard'

  // UUID/ID segment — derive title from the parent route
  if (UUID_RE.test(last) && segments.length >= 2) {
    const parent = segments[segments.length - 2]
    return EDITOR_TITLES[parent] ?? 'Edit'
  }

  return last
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export function AdminHeader({ adminInitial = 'A' }: { adminInitial?: string }) {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  function openMobileNav() {
    window.dispatchEvent(new CustomEvent('open-mobile-nav'))
  }

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between h-14 px-4 md:px-6 bg-background border-b border-border shrink-0">
      {/* Left: mobile menu + page title */}
      <div className="flex items-center gap-3">
        <button
          onClick={openMobileNav}
          className="lg:hidden p-1.5 rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] dark:hover:bg-[var(--color-dark-surface-hover)] transition-colors cursor-pointer"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <h1 className="font-display font-bold text-[var(--color-text-primary)] dark:text-[#e8ecec] text-lg leading-none">
          {getPageTitle(pathname)}
        </h1>
      </div>

      {/* Right: theme toggle + admin avatar */}
      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label="Toggle theme"
          className="cursor-pointer"
        >
          {mounted && (theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />)}
        </Button>

        {/* Admin avatar dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger
            className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--color-brand-teal)] text-white text-xs font-bold shrink-0 outline-none cursor-pointer"
            aria-label="Admin menu"
          >
            {adminInitial}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem
              onClick={() => window.open('/', '_blank')}
              className="gap-2 cursor-pointer"
            >
              View Site
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => logoutAction()}
              className="gap-2 cursor-pointer"
            >
              <LogOut size={15} />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
