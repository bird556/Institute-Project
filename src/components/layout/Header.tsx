'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, Search, ChevronDown } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { SearchBar } from './SearchBar'
import { cn } from '@/lib/utils'
import type { SiteVisibility } from '@/lib/site-visibility'

interface HeaderProps {
  visibility: SiteVisibility
  logoUrl?: string
  siteName?: string
}

export function Header({ visibility, logoUrl, siteName = 'Institute' }: HeaderProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)

  const primaryLinks = [
    { href: '/',           label: 'Home',        show: true },
    { href: '/about',      label: 'About',       show: visibility.about_enabled },
    { href: '/mission',    label: 'Mission',     show: visibility.mission_enabled },
    { href: '/newsletter', label: 'Newsletter',  show: visibility.newsletter_enabled },
  ].filter(link => link.show)

  const moreLinks = [
    { href: '/events',          label: 'Events',           show: visibility.events_enabled },
    { href: '/blogs',           label: 'Blogs',            show: visibility.blogs_enabled },
    { href: '/reading-list',    label: 'Reading List',     show: visibility.reading_list_enabled },
    { href: '/partners',        label: 'Partners',         show: visibility.partners_enabled },
    { href: '/health-wellness', label: 'Health & Wellness', show: visibility.health_wellness_enabled },
  ].filter(link => link.show)

  const moreActive = moreLinks.some(link => pathname === link.href || pathname.startsWith(link.href + '/'))

  return (
    <header className="sticky top-0 z-50 bg-background dark:bg-dark-background border-b border-border dark:border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-display font-700 text-xl text-brand-teal dark:text-white shrink-0"
          >
            {logoUrl && (
              <Image src={logoUrl} alt={siteName} width={32} height={32} className="h-8 w-auto" />
            )}
            <span>{siteName}</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {primaryLinks.map(({ href, label }) => (
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

            {/* More dropdown */}
            {moreLinks.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setMoreOpen(v => !v)}
                  onBlur={() => setTimeout(() => setMoreOpen(false), 150)}
                  className={cn(
                    'flex items-center gap-1 text-sm font-medium transition-colors cursor-pointer',
                    moreActive
                      ? 'text-brand-teal dark:text-white'
                      : 'text-text-muted hover:text-brand-teal dark:hover:text-white'
                  )}
                >
                  More
                  <ChevronDown size={14} className={cn('transition-transform', moreOpen && 'rotate-180')} />
                </button>

                {moreOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-border dark:border-dark-border bg-background dark:bg-dark-surface shadow-lg overflow-hidden z-50">
                    {moreLinks.map(({ href, label }) => (
                      <Link
                        key={href}
                        href={href}
                        onClick={() => setMoreOpen(false)}
                        className={cn(
                          'block px-4 py-2.5 text-sm transition-colors',
                          pathname === href || pathname.startsWith(href + '/')
                            ? 'text-brand-teal dark:text-white bg-surface dark:bg-dark-surface-hover'
                            : 'text-text-muted hover:text-brand-teal dark:hover:text-white hover:bg-surface dark:hover:bg-dark-surface-hover'
                        )}
                      >
                        {label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
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
            {[...primaryLinks, ...moreLinks].map(({ href, label }) => (
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
