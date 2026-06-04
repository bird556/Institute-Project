'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { MoreVertical, PenLine, Trash2, Plus, User, Search, X } from 'lucide-react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import PublishPill from '@/components/admin/PublishPill'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { createDirectoryEntry, deleteDirectoryEntry, toggleDirectoryEntryPublished } from '@/actions/directory'
import { DIRECTORY_CATEGORY_LABELS, DIRECTORY_MODE_LABELS, type DirectoryCategory, type DirectoryEntry } from '@/types'

interface DirectoryListItem extends DirectoryEntry {
  photo_url: string | null
}

interface Props {
  entries: DirectoryListItem[]
}

const TABS: { category: DirectoryCategory; label: string }[] = [
  { category: 'advocate',        label: 'Advocates' },
  { category: 'psychotherapist', label: 'Psychotherapists' },
  { category: 'referral_agency', label: 'Referral Agencies' },
]

export default function AdminDirectoryClient({ entries: initial }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [entries, setEntries] = useState(initial)
  const [activeTab, setActiveTab] = useState<DirectoryCategory>('advocate')
  const [query, setQuery] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  const tabEntries = entries.filter((e) => e.category === activeTab)
  const filtered = tabEntries.filter((e) => {
    const q = query.toLowerCase()
    return !q || e.name.toLowerCase().includes(q) || (e.organization ?? '').toLowerCase().includes(q)
  })

  function handleNew() {
    startTransition(async () => {
      const result = await createDirectoryEntry(activeTab)
      if (!result.success || !result.data) {
        toast.error(result.error ?? 'Could not create entry.')
        return
      }
      router.push(`/admin/directory/${result.data.id}`)
    })
  }

  async function handleDelete() {
    if (!deleteId) return
    setDeleting(true)
    const result = await deleteDirectoryEntry(deleteId)
    setDeleting(false)
    setDeleteId(null)
    if (!result.success) { toast.error(result.error ?? 'Could not delete.'); return }
    setEntries((prev) => prev.filter((e) => e.id !== deleteId))
    toast.success('Entry deleted.')
  }

  async function handleToggle(id: string, current: boolean) {
    setTogglingId(id)
    setEntries((prev) => prev.map((e) => e.id === id ? { ...e, published: !current } : e))
    const result = await toggleDirectoryEntryPublished(id, !current)
    setTogglingId(null)
    if (!result.success) {
      setEntries((prev) => prev.map((e) => e.id === id ? { ...e, published: current } : e))
      toast.error(result.error ?? 'Failed to update status.')
    }
  }

  const tabClass = (active: boolean) =>
    `px-4 py-2 text-sm font-medium rounded-lg cursor-pointer transition-colors ${
      active
        ? 'bg-[var(--color-brand-teal)] text-white'
        : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] dark:hover:bg-[var(--color-dark-surface-hover)]'
    }`

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold text-[var(--color-brand-teal)] dark:text-white">
            Directory
          </h1>
          <Button
            onClick={handleNew}
            disabled={isPending}
            className="cursor-pointer bg-[var(--color-brand-teal)] hover:bg-[var(--color-brand-teal-dark)] text-white gap-1.5"
          >
            <Plus className="h-4 w-4" />
            New {DIRECTORY_CATEGORY_LABELS[activeTab].slice(0, -1)}
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] w-fit">
          {TABS.map(({ category, label }) => (
            <button key={category} onClick={() => { setActiveTab(category); setQuery('') }} className={tabClass(activeTab === category)}>
              {label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)] pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or organisation…"
            className="w-full pl-9 pr-8 h-9 text-sm rounded-lg border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-background)] dark:bg-[var(--color-dark-surface)] text-[var(--color-text-primary)] dark:text-[#e8ecec] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-teal)] transition-colors"
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {query && (
          <p className="text-sm text-[var(--color-text-muted)] -mt-2">
            Showing {filtered.length} of {tabEntries.length} entries
          </p>
        )}

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 rounded-xl border border-dashed border-[var(--color-border)] dark:border-[var(--color-dark-border)]">
            <div className="h-12 w-12 rounded-full bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] flex items-center justify-center">
              <User className="h-6 w-6 text-[var(--color-text-muted)]" />
            </div>
            <div className="text-center">
              <p className="font-medium text-[var(--color-text-primary)] dark:text-[#e8ecec]">
                {query ? `No results for "${query}"` : `No ${DIRECTORY_CATEGORY_LABELS[activeTab].toLowerCase()} yet`}
              </p>
              {!query && (
                <p className="text-sm text-[var(--color-text-muted)] mt-1">Add your first entry to get started.</p>
              )}
            </div>
            {!query && (
              <Button onClick={handleNew} disabled={isPending} className="cursor-pointer bg-[var(--color-brand-teal)] hover:bg-[var(--color-brand-teal-dark)] text-white gap-1.5">
                <Plus className="h-4 w-4" />
                Add entry
              </Button>
            )}
          </div>
        ) : (
          <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] overflow-hidden">
            {filtered.map((entry, i) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03, duration: 0.2 }}
                className="flex items-center gap-4 px-4 py-3 border-b last:border-b-0 border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-background)] dark:bg-[var(--color-dark-surface)] hover:bg-[var(--color-surface)] dark:hover:bg-[var(--color-dark-surface-hover)] transition-colors"
              >
                {entry.photo_url ? (
                  <div className="h-10 w-10 rounded-full overflow-hidden relative shrink-0">
                    <Image src={entry.photo_url} alt={entry.name} fill className="object-cover object-top" sizes="40px" />
                  </div>
                ) : (
                  <div className="h-10 w-10 rounded-full bg-[var(--color-brand-teal)] flex items-center justify-center shrink-0">
                    <span className="text-white text-xs font-bold uppercase">
                      {entry.name.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join('')}
                    </span>
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[var(--color-text-primary)] dark:text-[#e8ecec] truncate">{entry.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {entry.organization && (
                      <span className="text-sm text-[var(--color-text-muted)] truncate">{entry.organization}</span>
                    )}
                    {entry.mode && (
                      <span className="hidden sm:inline text-xs text-[var(--color-text-muted)]">· {DIRECTORY_MODE_LABELS[entry.mode]}</span>
                    )}
                  </div>
                </div>

                <PublishPill
                  published={entry.published}
                  toggling={togglingId === entry.id}
                  onClick={() => handleToggle(entry.id, entry.published)}
                />

                <DropdownMenu>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenuTrigger className="p-1 rounded cursor-pointer text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] dark:hover:text-[#e8ecec] hover:bg-[var(--color-surface-hover)] dark:hover:bg-[var(--color-dark-surface-hover)] transition-colors">
                        <MoreVertical className="h-4 w-4" />
                      </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="left"><p>More actions</p></TooltipContent>
                  </Tooltip>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => router.push(`/admin/directory/${entry.id}`)} className="cursor-pointer gap-2">
                      <PenLine className="h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setDeleteId(entry.id)} className="cursor-pointer gap-2 text-red-600 focus:text-red-600">
                      <Trash2 className="h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Entry"
        description="This action cannot be undone. The entry will be permanently removed."
        onConfirm={handleDelete}
        loading={deleting}
      />
    </>
  )
}
