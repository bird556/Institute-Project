'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, Search } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { SearchBar } from './SearchBar'
import { cn } from '@/lib/utils'
import type { SiteVisibility } from '@/lib/site-visibility'

interface HeaderProps {
  visibility: SiteVisibility
}

export function Header({ visibility }: HeaderProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const navLinks = [
    { href: '/',             label: 'Home',         show: true },
    { href: '/about',        label: 'About',        show: visibility.about_enabled },
    { href: '/mission',      label: 'Mission',      show: visibility.mission_enabled },
    { href: '/events',       label: 'Events',       show: visibility.events_enabled },
    { href: '/blogs',        label: 'Blogs',        show: visibility.blogs_enabled },
    { href: '/reading-list', label: 'Reading List', show: visibility.reading_list_enabled },
    { href: '/newsletter',   label: 'Newsletter',   show: visibility.newsletter_enabled },
    { href: '/partners',     label: 'Partners',     show: visibility.partners_enabled },
  ].filter(link => link.show)

  return (
    <header className="sticky top-0 z-50 bg-background dark:bg-dark-background border-b border-border dark:border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link
            href="/"
            className="font-display font-700 text-xl text-brand-teal dark:text-white shrink-0"
          >
            Kustawi Institute
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'text-sm font-medium transition-colors',
                  pathname === href
                    ? 'text-brand-teal dark:text-white'
                    : 'text-text-muted hover:text-brand-teal dark:hover:text-white'
                )}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {/* Search toggle */}
            <button
              onClick={() => setSearchOpen((v) => !v)}
              className="p-2 rounded-md text-text-muted hover:text-brand-teal dark:hover:text-white transition-colors cursor-pointer"
              aria-label="Toggle search"
            >
              <Search size={18} />
            </button>

            <ThemeToggle />

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden p-2 rounded-md text-text-muted hover:text-brand-teal dark:hover:text-white transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Search bar (expandable) */}
        {searchOpen && (
          <div className="pb-3">
            <SearchBar onClose={() => setSearchOpen(false)} />
          </div>
        )}

        {/* Mobile Nav */}
        {mobileOpen && (
          <nav className="lg:hidden pb-4 flex flex-col gap-1">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  pathname === href
                    ? 'bg-surface dark:bg-dark-surface text-brand-teal dark:text-white'
                    : 'text-text-muted hover:text-brand-teal dark:hover:text-white'
                )}
              >
                {label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}
