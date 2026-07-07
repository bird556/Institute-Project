'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, Search, ChevronDown, ChevronUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { ThemeToggle } from './ThemeToggle'
import { SearchBar } from './SearchBar'
import { cn } from '@/lib/utils'
import type { NavItem } from '@/lib/nav-config'
import { RESEARCH_CATEGORIES, RESEARCH_CATEGORY_LABELS } from '@/types'
import type { ResearchCategory } from '@/types'

interface HeaderProps {
  navItems: NavItem[]
  logoUrl?: string
  siteName?: string
  showReferralAgencies?: boolean
  showBlackMensGroups?: boolean
  showYouthServiceOrganizations?: boolean
  showCommunityOrganizations?: boolean
  showResearchInstitutes?: boolean
  showCallForPapers?: boolean
  showSexualAbuseBoysMen?: boolean
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

export function Header({ navItems, logoUrl, siteName = 'Institute', showReferralAgencies = true, showBlackMensGroups = true, showYouthServiceOrganizations = true, showCommunityOrganizations = true, showResearchInstitutes = true, showCallForPapers = true, showSexualAbuseBoysMen = true }: HeaderProps) {
  const researchGates: Partial<Record<ResearchCategory, boolean>> = {
    'research-institutes':   showResearchInstitutes,
    'call-for-papers':       showCallForPapers,
    'sexual-abuse-boys-men': showSexualAbuseBoysMen,
  }
  const visibleResearchCategories = RESEARCH_CATEGORIES.filter((cat) => researchGates[cat] !== false)
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [eventsDropdownOpen, setEventsDropdownOpen] = useState(false)
  const [eventsAccordionOpen, setEventsAccordionOpen] = useState(false)
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false)
  const [servicesAccordionOpen, setServicesAccordionOpen] = useState(false)
  const [researchDropdownOpen, setResearchDropdownOpen] = useState(false)
  const [researchAccordionOpen, setResearchAccordionOpen] = useState(false)

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
            {visibleLinks.map(({ href, label, slug }) => {
              const isActive = pathname === href || (href !== '/' && pathname.startsWith(href + '/'))
              const linkClass = cn(
                'text-sm font-medium transition-colors',
                isActive ? 'text-brand-teal dark:text-white' : 'text-text-muted hover:text-brand-teal dark:hover:text-white'
              )

              if (slug === 'services') {
                return (
                  <div
                    key={href}
                    className="relative"
                    onMouseEnter={() => setServicesDropdownOpen(true)}
                    onMouseLeave={() => setServicesDropdownOpen(false)}
                  >
                    <button className={cn(linkClass, 'flex items-center gap-1 cursor-pointer')}>
                      {label}
                      <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                    </button>
                    <AnimatePresence>
                      {servicesDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.15, ease: 'easeOut' }}
                          className="absolute top-full left-0 mt-2 w-52 rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-background)] dark:bg-[var(--color-dark-surface)] shadow-lg overflow-hidden z-50"
                        >
                          <Link
                            href="/advocates"
                            className="block px-4 py-3 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-brand-teal)] dark:hover:text-white hover:bg-[var(--color-surface)] dark:hover:bg-[var(--color-dark-surface-hover)] transition-colors"
                            onClick={() => setServicesDropdownOpen(false)}
                          >
                            Advocates
                          </Link>
                          <Link
                            href="/psychotherapists"
                            className="block px-4 py-3 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-brand-teal)] dark:hover:text-white hover:bg-[var(--color-surface)] dark:hover:bg-[var(--color-dark-surface-hover)] transition-colors border-t border-[var(--color-border)] dark:border-[var(--color-dark-border)]"
                            onClick={() => setServicesDropdownOpen(false)}
                          >
                            Psychotherapists
                          </Link>
                          {showReferralAgencies && (
                            <Link
                              href="/referral-agencies"
                              className="block px-4 py-3 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-brand-teal)] dark:hover:text-white hover:bg-[var(--color-surface)] dark:hover:bg-[var(--color-dark-surface-hover)] transition-colors border-t border-[var(--color-border)] dark:border-[var(--color-dark-border)]"
                              onClick={() => setServicesDropdownOpen(false)}
                            >
                              Referral Agencies
                            </Link>
                          )}
                          {showBlackMensGroups && (
                            <Link
                              href="/black-mens-groups"
                              className="block px-4 py-3 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-brand-teal)] dark:hover:text-white hover:bg-[var(--color-surface)] dark:hover:bg-[var(--color-dark-surface-hover)] transition-colors border-t border-[var(--color-border)] dark:border-[var(--color-dark-border)]"
                              onClick={() => setServicesDropdownOpen(false)}
                            >
                              Black Men&#39;s Groups
                            </Link>
                          )}
                          {showYouthServiceOrganizations && (
                            <Link
                              href="/youth-service-organizations"
                              className="block px-4 py-3 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-brand-teal)] dark:hover:text-white hover:bg-[var(--color-surface)] dark:hover:bg-[var(--color-dark-surface-hover)] transition-colors border-t border-[var(--color-border)] dark:border-[var(--color-dark-border)]"
                              onClick={() => setServicesDropdownOpen(false)}
                            >
                              Youth Service Organizations
                            </Link>
                          )}
                          {showCommunityOrganizations && (
                            <Link
                              href="/community-organizations"
                              className="block px-4 py-3 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-brand-teal)] dark:hover:text-white hover:bg-[var(--color-surface)] dark:hover:bg-[var(--color-dark-surface-hover)] transition-colors border-t border-[var(--color-border)] dark:border-[var(--color-dark-border)]"
                              onClick={() => setServicesDropdownOpen(false)}
                            >
                              Community and Professional Organizations
                            </Link>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              }

              if (slug === 'events') {
                return (
                  <div
                    key={href}
                    className="relative"
                    onMouseEnter={() => setEventsDropdownOpen(true)}
                    onMouseLeave={() => setEventsDropdownOpen(false)}
                  >
                    <button className={cn(linkClass, 'flex items-center gap-1 cursor-pointer')}>
                      {label}
                      <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                    </button>
                    <AnimatePresence>
                      {eventsDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.15, ease: 'easeOut' }}
                          className="absolute top-full left-0 mt-2 w-52 rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-background)] dark:bg-[var(--color-dark-surface)] shadow-lg overflow-hidden z-50"
                        >
                          <Link
                            href="/events?filter=kustawi"
                            className="block px-4 py-3 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-brand-teal)] dark:hover:text-white hover:bg-[var(--color-surface)] dark:hover:bg-[var(--color-dark-surface-hover)] transition-colors"
                            onClick={() => setEventsDropdownOpen(false)}
                          >
                            Kustawi Events
                          </Link>
                          <Link
                            href="/events?filter=other"
                            className="block px-4 py-3 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-brand-teal)] dark:hover:text-white hover:bg-[var(--color-surface)] dark:hover:bg-[var(--color-dark-surface-hover)] transition-colors border-t border-[var(--color-border)] dark:border-[var(--color-dark-border)]"
                            onClick={() => setEventsDropdownOpen(false)}
                          >
                            Other Events
                          </Link>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              }

              if (slug === 'research') {
                return (
                  <div
                    key={href}
                    className="relative"
                    onMouseEnter={() => setResearchDropdownOpen(true)}
                    onMouseLeave={() => setResearchDropdownOpen(false)}
                  >
                    <button className={cn(linkClass, 'flex items-center gap-1 cursor-pointer')}>
                      {label}
                      <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                    </button>
                    <AnimatePresence>
                      {researchDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.15, ease: 'easeOut' }}
                          className="absolute top-full left-0 mt-2 w-56 rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-background)] dark:bg-[var(--color-dark-surface)] shadow-lg overflow-hidden z-50"
                        >
                          {visibleResearchCategories.map((cat, i) => (
                            <Link
                              key={cat}
                              href={`/research/${cat}`}
                              className={`block px-4 py-3 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-brand-teal)] dark:hover:text-white hover:bg-[var(--color-surface)] dark:hover:bg-[var(--color-dark-surface-hover)] transition-colors ${i > 0 ? 'border-t border-[var(--color-border)] dark:border-[var(--color-dark-border)]' : ''}`}
                              onClick={() => setResearchDropdownOpen(false)}
                            >
                              {RESEARCH_CATEGORY_LABELS[cat]}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              }

              return (
                <Link key={href} href={href} className={linkClass}>
                  {label}
                </Link>
              )
            })}
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
              {visibleLinks.map(({ href, label, slug }) => {
                const isActive = pathname === href || (href !== '/' && pathname.startsWith(href + '/'))

                if (slug === 'services') {
                  return (
                    <div key={href}>
                      <button
                        onClick={() => setServicesAccordionOpen((v) => !v)}
                        className={cn(
                          'w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer',
                          isActive
                            ? 'bg-surface dark:bg-dark-surface text-brand-teal dark:text-white'
                            : 'text-text-muted hover:text-brand-teal dark:hover:text-white'
                        )}
                      >
                        {label}
                        {servicesAccordionOpen
                          ? <ChevronUp className="h-3.5 w-3.5 opacity-60" />
                          : <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                        }
                      </button>
                      <AnimatePresence>
                        {servicesAccordionOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.15, ease: 'easeOut' }}
                            className="overflow-hidden pl-4 flex flex-col gap-0.5 mt-0.5"
                          >
                            <Link href="/advocates" onClick={() => { setMobileOpen(false); setServicesAccordionOpen(false) }} className="px-3 py-2 rounded-md text-sm text-text-muted hover:text-brand-teal dark:hover:text-white transition-colors">
                              Advocates
                            </Link>
                            <Link href="/psychotherapists" onClick={() => { setMobileOpen(false); setServicesAccordionOpen(false) }} className="px-3 py-2 rounded-md text-sm text-text-muted hover:text-brand-teal dark:hover:text-white transition-colors">
                              Psychotherapists
                            </Link>
                            {showReferralAgencies && (
                              <Link href="/referral-agencies" onClick={() => { setMobileOpen(false); setServicesAccordionOpen(false) }} className="px-3 py-2 rounded-md text-sm text-text-muted hover:text-brand-teal dark:hover:text-white transition-colors">
                                Referral Agencies
                              </Link>
                            )}
                            {showBlackMensGroups && (
                              <Link href="/black-mens-groups" onClick={() => { setMobileOpen(false); setServicesAccordionOpen(false) }} className="px-3 py-2 rounded-md text-sm text-text-muted hover:text-brand-teal dark:hover:text-white transition-colors">
                                Black Men&#39;s Groups
                              </Link>
                            )}
                            {showYouthServiceOrganizations && (
                              <Link href="/youth-service-organizations" onClick={() => { setMobileOpen(false); setServicesAccordionOpen(false) }} className="px-3 py-2 rounded-md text-sm text-text-muted hover:text-brand-teal dark:hover:text-white transition-colors">
                                Youth Service Organizations
                              </Link>
                            )}
                            {showCommunityOrganizations && (
                              <Link href="/community-organizations" onClick={() => { setMobileOpen(false); setServicesAccordionOpen(false) }} className="px-3 py-2 rounded-md text-sm text-text-muted hover:text-brand-teal dark:hover:text-white transition-colors">
                                Community and Professional Organizations
                              </Link>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                }

                if (slug === 'research') {
                  return (
                    <div key={href}>
                      <button
                        onClick={() => setResearchAccordionOpen((v) => !v)}
                        className={cn(
                          'w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer',
                          isActive
                            ? 'bg-surface dark:bg-dark-surface text-brand-teal dark:text-white'
                            : 'text-text-muted hover:text-brand-teal dark:hover:text-white'
                        )}
                      >
                        {label}
                        {researchAccordionOpen
                          ? <ChevronUp className="h-3.5 w-3.5 opacity-60" />
                          : <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                        }
                      </button>
                      <AnimatePresence>
                        {researchAccordionOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.15, ease: 'easeOut' }}
                            className="overflow-hidden pl-4 flex flex-col gap-0.5 mt-0.5"
                          >
                            {visibleResearchCategories.map((cat) => (
                              <Link
                                key={cat}
                                href={`/research/${cat}`}
                                onClick={() => { setMobileOpen(false); setResearchAccordionOpen(false) }}
                                className="px-3 py-2 rounded-md text-sm text-text-muted hover:text-brand-teal dark:hover:text-white transition-colors"
                              >
                                {RESEARCH_CATEGORY_LABELS[cat]}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                }

                if (slug === 'events') {
                  return (
                    <div key={href}>
                      <button
                        onClick={() => setEventsAccordionOpen((v) => !v)}
                        className={cn(
                          'w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer',
                          isActive
                            ? 'bg-surface dark:bg-dark-surface text-brand-teal dark:text-white'
                            : 'text-text-muted hover:text-brand-teal dark:hover:text-white'
                        )}
                      >
                        {label}
                        {eventsAccordionOpen
                          ? <ChevronUp className="h-3.5 w-3.5 opacity-60" />
                          : <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                        }
                      </button>
                      <AnimatePresence>
                        {eventsAccordionOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.15, ease: 'easeOut' }}
                            className="overflow-hidden pl-4 flex flex-col gap-0.5 mt-0.5"
                          >
                            <Link
                              href="/events?filter=kustawi"
                              onClick={() => { setMobileOpen(false); setEventsAccordionOpen(false) }}
                              className="px-3 py-2 rounded-md text-sm text-text-muted hover:text-brand-teal dark:hover:text-white transition-colors"
                            >
                              Kustawi Events
                            </Link>
                            <Link
                              href="/events?filter=other"
                              onClick={() => { setMobileOpen(false); setEventsAccordionOpen(false) }}
                              className="px-3 py-2 rounded-md text-sm text-text-muted hover:text-brand-teal dark:hover:text-white transition-colors"
                            >
                              Other Events
                            </Link>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                }

                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-surface dark:bg-dark-surface text-brand-teal dark:text-white'
                        : 'text-text-muted hover:text-brand-teal dark:hover:text-white'
                    )}
                  >
                    {label}
                  </Link>
                )
              })}
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
