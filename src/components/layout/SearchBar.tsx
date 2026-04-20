'use client'

import { useState, useEffect, useRef, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { BookOpen, Calendar, FileText, Heart, Loader2 } from 'lucide-react'
import { useDebounce } from '@/hooks/useDebounce'
import { searchContent } from '@/actions/search'
import type { SearchResult } from '@/types'

interface SearchBarProps {
  onClose?: () => void
}

const TYPE_ICON = {
  blog:         FileText,
  event:        Calendar,
  reading_list: BookOpen,
  wellness:     Heart,
} as const

const TYPE_LABEL = {
  blog:         'Blog',
  event:        'Event',
  reading_list: 'Reading',
  wellness:     'Health & Wellness',
} as const

const TYPE_HREF = {
  blog:         (id: string) => `/blogs/${id}`,
  event:        (id: string) => `/events/${id}`,
  reading_list: (id: string) => `/reading-list/${id}`,
  wellness:     (id: string) => `/health-wellness/${id}`,
} as const

const MAX_INLINE = 5

export function SearchBar({ onClose }: SearchBarProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [total, setTotal] = useState(0)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const debouncedQuery = useDebounce(query, 300)
  const containerRef = useRef<HTMLDivElement>(null)

  // Fetch results whenever the debounced query changes
  useEffect(() => {
    const q = debouncedQuery.trim()
    if (q.length < 2) {
      setResults([])
      setTotal(0)
      setDropdownOpen(false)
      return
    }

    startTransition(async () => {
      const { data = [] } = await searchContent(q)
      setTotal(data.length)
      setResults(data.slice(0, MAX_INLINE))
      setDropdownOpen(true)
    })
  }, [debouncedQuery])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault()
    const q = query.trim()
    if (q.length >= 2) {
      setDropdownOpen(false)
      router.push(`/search?q=${encodeURIComponent(q)}`)
      onClose?.()
    }
  }

  function handleResultClick(href: string) {
    setDropdownOpen(false)
    onClose?.()
    router.push(href)
  }

  function handleViewAll() {
    setDropdownOpen(false)
    router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    onClose?.()
  }

  const showDropdown = dropdownOpen && query.trim().length >= 2

  return (
    <div ref={containerRef} className="relative">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => { if (results.length > 0) setDropdownOpen(true) }}
            placeholder="Search blogs, events, reading list…"
            className="w-full px-4 py-2 pr-9 rounded-lg border border-border dark:border-dark-border bg-surface dark:bg-dark-surface text-text-primary dark:text-white placeholder:text-text-muted text-sm outline-none focus:ring-2 focus:ring-brand-teal"
          />
          {isPending && (
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
              <Loader2 size={14} className="animate-spin text-text-muted" />
            </div>
          )}
        </div>
      </form>

      {/* Inline dropdown */}
      {showDropdown && (
        <div className="absolute left-0 right-0 top-full mt-1 z-50 rounded-xl border border-border dark:border-dark-border bg-background dark:bg-dark-surface shadow-lg overflow-hidden">
          {results.length === 0 ? (
            <div className="px-4 py-3 text-sm text-text-muted">
              No results for &ldquo;{query.trim()}&rdquo;
            </div>
          ) : (
            <>
              <ul>
                {results.map((result) => {
                  const Icon = TYPE_ICON[result.type]
                  const href = TYPE_HREF[result.type](result.id)
                  return (
                    <li key={`${result.type}-${result.id}`}>
                      <button
                        type="button"
                        onClick={() => handleResultClick(href)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface dark:hover:bg-dark-surface-hover transition-colors text-left cursor-pointer"
                      >
                        <Icon size={14} className="shrink-0 text-brand-teal" />
                        <span className="flex-1 min-w-0">
                          <span className="block text-sm text-text-primary dark:text-white truncate leading-snug">
                            {result.title}
                          </span>
                          <span className="text-xs text-text-muted">
                            {TYPE_LABEL[result.type]}
                          </span>
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>

              {/* View all footer */}
              <div className="border-t border-border dark:border-dark-border">
                <button
                  type="button"
                  onClick={handleViewAll}
                  className="w-full px-4 py-2.5 text-sm font-medium text-brand-teal hover:bg-surface dark:hover:bg-dark-surface-hover transition-colors text-left cursor-pointer"
                >
                  View all {total} result{total !== 1 ? 's' : ''} for &ldquo;{query.trim()}&rdquo; →
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
