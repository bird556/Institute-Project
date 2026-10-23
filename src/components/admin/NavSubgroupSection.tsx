'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  NAV_LINK_BASE, NAV_LINK_ACTIVE, NAV_LINK_INACTIVE,
  type NavItem,
  type NavSubgroup,
} from './admin-nav'

interface Props {
  subgroup: NavSubgroup
  isActive: (item: NavItem) => boolean
  onNavigate?: () => void
  defaultOpen?: boolean
}

// Collapsible run of related links. Starts open when the current page is inside it.
export function NavSubgroupSection({ subgroup, isActive, onNavigate, defaultOpen = false }: Props) {
  const containsActive = subgroup.items.some(isActive)
  const [open, setOpen] = useState(containsActive || defaultOpen)
  const Icon = subgroup.icon

  return (
    <li>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={cn(NAV_LINK_BASE, 'w-full cursor-pointer', containsActive && !open ? 'text-[var(--color-brand-teal)] dark:text-white' : NAV_LINK_INACTIVE)}
      >
        <Icon className="shrink-0" size={18} />
        <span className="truncate flex-1 text-left">{subgroup.label}</span>
        <span className="text-xs text-[var(--color-text-muted)]">{subgroup.items.length}</span>
        <ChevronDown size={16} className={cn('shrink-0 transition-transform duration-200', open && 'rotate-180')} />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden ml-4 pl-2 border-l border-[var(--color-border)] dark:border-[var(--color-dark-border)] space-y-0.5 mt-0.5"
          >
            {subgroup.items.map((item) => {
              const ItemIcon = item.icon
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    title={item.label}
                    className={cn(NAV_LINK_BASE, isActive(item) ? NAV_LINK_ACTIVE : NAV_LINK_INACTIVE)}
                  >
                    <ItemIcon className="shrink-0" size={16} />
                    <span className="truncate">{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  )
}
