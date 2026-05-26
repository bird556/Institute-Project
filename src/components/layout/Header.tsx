'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, Search } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { ThemeToggle } from './ThemeToggle'
import { SearchBar } from './SearchBar'
import { cn } from '@/lib/utils'
import type { NavItem } from '@/lib/nav-config'

interface HeaderProps {
  navItems: NavItem[]
  logoUrl?: string
  siteName?: string
}

function renderSiteName(name: string) {
  const idx = name.indexOf('Institute')
  if (idx === -1) return <>{name}</>
  return (
    <>
      {name.slice(0, idx)}
      <span className="text-[hsl(35_60%_50%)]">Institute</span>
      {name.slice(idx + 'Institute'.length)}
    </>
  )
}

export function Header({ navItems, logoUrl, siteName = 'Institute' }: HeaderProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const visibleLinks = navItems.filter((i) => i.visible)

  return (
    <header className="sticky top-0 z-50 bg-background dark:bg-dark-background border-b border-border dark:border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            {logoUrl && (
              <Image src={logoUrl} alt={siteName} width={32} height={32} className="h-8 w-auto" />
            )}
            <span className="font-serif text-xl font-bold tracking-tight text-text-primary dark:text-white">
              {renderSiteName(siteName)}
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {visibleLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'text-sm font-medium transition-colors',
                  pathname === href || (href !== '/' && pathname.startsWith(href + '/'))
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
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="pb-3"
            >
              <SearchBar onClose={() => setSearchOpen(false)} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Nav */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="lg:hidden overflow-hidden pb-4 flex flex-col gap-1"
            >
              {visibleLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    pathname === href || (href !== '/' && pathname.startsWith(href + '/'))
                      ? 'bg-surface dark:bg-dark-surface text-brand-teal dark:text-white'
                      : 'text-text-muted hover:text-brand-teal dark:hover:text-white'
                  )}
                >
                  {label}
                </Link>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
