'use client'

import { useState, useMemo } from 'react'
import DirectoryGrid from './DirectoryGrid'
import Pagination from '@/components/shared/Pagination'
import type { DirectoryCardProps } from './DirectoryCard'
import { DIRECTORY_HIDE_MODE, DIRECTORY_LANGUAGE_OPTIONS, DIRECTORY_MODE_LABELS, type DirectoryMode } from '@/types'

const PAGE_SIZE = 16
const FREE_CONSULTATION = 'Free Consultation'

type ModeFilter    = 'all' | DirectoryMode
type DirSortOption = 'name_az' | 'name_za' | 'newest' | 'oldest' | 'province'

const SORT_LABELS: Record<DirSortOption, string> = {
  name_az:  'Name A → Z',
  name_za:  'Name Z → A',
  newest:   'Date Added: Newest',
  oldest:   'Date Added: Oldest',
  province: 'Province A → Z',
}

interface Filters {
  mode: ModeFilter
  province: string   // '' = any
  language: string   // '' = any
  freeConsultation: boolean
}

const NO_FILTERS: Filters = { mode: 'all', province: '', language: '', freeConsultation: false }

const selectClass =
  'text-sm rounded-lg border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-background)] dark:bg-[var(--color-dark-surface)] text-[var(--color-text-primary)] dark:text-[#e8ecec] px-3 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-teal)]'
const labelClass = 'text-sm text-[var(--color-text-muted)] font-medium whitespace-nowrap'

// Only offer options that at least one entry actually has
const offeredLanguages = (e: DirectoryCardProps) =>
  (e.languages ?? []).filter((l) => (DIRECTORY_LANGUAGE_OPTIONS as readonly string[]).includes(l))
const hasFreeConsultation = (e: DirectoryCardProps) => (e.fee_options ?? []).includes(FREE_CONSULTATION)

function matches(e: DirectoryCardProps, f: Filters) {
  return (f.mode === 'all' || e.mode === f.mode)
    && (!f.province || e.province === f.province)
    && (!f.language || offeredLanguages(e).includes(f.language))
    && (!f.freeConsultation || hasFreeConsultation(e))
}

function compare(a: DirectoryCardProps, b: DirectoryCardProps, sort: DirSortOption) {
  switch (sort) {
    case 'name_az':  return a.name.localeCompare(b.name)
    case 'name_za':  return b.name.localeCompare(a.name)
    case 'newest':   return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    case 'oldest':   return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    case 'province': return (a.province ?? '￿').localeCompare(b.province ?? '￿')
      || (a.city ?? '￿').localeCompare(b.city ?? '￿')
      || a.name.localeCompare(b.name)
  }
}

function FilterSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-2">
      <label className={labelClass}>{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={selectClass}>
        <option value="">All</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )
}

function useFilterOptions(entries: DirectoryCardProps[]) {
  return useMemo(() => ({
    hasModes:  entries.some((e) => e.mode && !DIRECTORY_HIDE_MODE.includes(e.category)),
    provinces: [...new Set(entries.map((e) => e.province).filter((p): p is string => !!p))].sort(),
    languages: DIRECTORY_LANGUAGE_OPTIONS.filter((l) => entries.some((e) => offeredLanguages(e).includes(l))),
    hasFree:   entries.some(hasFreeConsultation),
  }), [entries])
}

export default function DirectoryListClient({ entries }: { entries: DirectoryCardProps[] }) {
  const [filters, setFilters] = useState<Filters>(NO_FILTERS)
  const [sort, setSort]       = useState<DirSortOption>('name_az')
  const [page, setPage]       = useState(1)
  const options = useFilterOptions(entries)

  const displayed = useMemo(
    () => entries.filter((e) => matches(e, filters)).sort((a, b) => compare(a, b, sort)),
    [entries, filters, sort],
  )

  const totalPages = Math.ceil(displayed.length / PAGE_SIZE)
  const paginated  = displayed.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const isFiltered = JSON.stringify(filters) !== JSON.stringify(NO_FILTERS)
  const sortKeys   = (Object.keys(SORT_LABELS) as DirSortOption[]).filter((k) => k !== 'province' || options.provinces.length > 0)

  function update(patch: Partial<Filters>) {
    setFilters((f) => ({ ...f, ...patch }))
    setPage(1)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label className={labelClass}>Sort by</label>
          <select value={sort} onChange={(e) => { setSort(e.target.value as DirSortOption); setPage(1) }} className={selectClass}>
            {sortKeys.map((key) => <option key={key} value={key}>{SORT_LABELS[key]}</option>)}
          </select>
        </div>

        {options.hasModes && (
          <div className="flex items-center gap-2">
            <label className={labelClass}>Mode</label>
            <select value={filters.mode} onChange={(e) => update({ mode: e.target.value as ModeFilter })} className={selectClass}>
              <option value="all">All</option>
              {(Object.keys(DIRECTORY_MODE_LABELS) as DirectoryMode[]).map((m) => (
                <option key={m} value={m}>{DIRECTORY_MODE_LABELS[m]}</option>
              ))}
            </select>
          </div>
        )}

        {options.provinces.length > 0 && (
          <FilterSelect label="Province" value={filters.province} options={options.provinces} onChange={(province) => update({ province })} />
        )}

        {options.languages.length > 0 && (
          <FilterSelect label="Language" value={filters.language} options={options.languages} onChange={(language) => update({ language })} />
        )}

        {options.hasFree && (
          <label className="flex items-center gap-2 text-sm text-[var(--color-text-primary)] dark:text-[#e8ecec] cursor-pointer">
            <input
              type="checkbox"
              checked={filters.freeConsultation}
              onChange={(e) => update({ freeConsultation: e.target.checked })}
              className="h-4 w-4 accent-[var(--color-brand-teal)] cursor-pointer"
            />
            Free consultation only
          </label>
        )}

        {isFiltered && (
          <button type="button" onClick={() => update(NO_FILTERS)} className="text-sm text-[var(--color-brand-teal)] dark:text-white hover:underline cursor-pointer">
            Clear filters
          </button>
        )}

        <span className="ml-auto text-sm text-[var(--color-text-muted)]">
          {isFiltered
            ? `${displayed.length} of ${entries.length} entries`
            : `${entries.length} ${entries.length === 1 ? 'entry' : 'entries'}`}
        </span>
      </div>

      {displayed.length === 0 ? (
        <p className="text-[var(--color-text-muted)] py-8">No entries match your filters.</p>
      ) : (
        <>
          <DirectoryGrid entries={paginated} />
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  )
}
