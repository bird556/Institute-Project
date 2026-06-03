'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { updatePageSection } from '@/actions/page-content'

interface Description {
  section: string
  label: string
  value: string
  updatedAt?: string
}

interface ResearchDescriptionsEditorProps {
  initialDescriptions: Description[]
}

function timeAgo(iso?: string): string | null {
  if (!iso) return null
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} minute${mins === 1 ? '' : 's'} ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} hour${hrs === 1 ? '' : 's'} ago`
  const days = Math.floor(hrs / 24)
  return `${days} day${days === 1 ? '' : 's'} ago`
}

export default function ResearchDescriptionsEditor({ initialDescriptions }: ResearchDescriptionsEditorProps) {
  const [descriptions, setDescriptions] = useState(initialDescriptions)
  const [savedDescriptions, setSavedDescriptions] = useState(initialDescriptions)
  const [isPending, startTransition] = useTransition()

  const isDirty = descriptions.some(
    (d, i) => d.value !== savedDescriptions[i]?.value,
  )

  function handleChange(section: string, value: string) {
    setDescriptions((prev) => prev.map((d) => d.section === section ? { ...d, value } : d))
  }

  function handleSave() {
    startTransition(async () => {
      const changed = descriptions.filter(
        (d, i) => d.value !== savedDescriptions[i]?.value,
      )
      const results = await Promise.all(
        changed.map((d) => updatePageSection('research', d.section, d.value)),
      )
      const failed = results.find((r) => !r.success)
      if (failed) {
        toast.error(failed.error ?? 'Failed to save.')
        return
      }
      const now = new Date().toISOString()
      setSavedDescriptions(descriptions.map((d) => ({ ...d, updatedAt: now })))
      setDescriptions((prev) => prev.map((d) => ({ ...d, updatedAt: now })))
      toast.success('Descriptions saved.')
    })
  }

  return (
    <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] divide-y divide-[var(--color-border)] dark:divide-[var(--color-dark-border)]">
      {descriptions.map((d) => (
        <div key={d.section} className="p-5 space-y-2">
          <label className="block text-sm font-semibold text-[var(--color-text-primary)] dark:text-white">
            {d.label}
          </label>
          <textarea
            rows={3}
            value={d.value}
            onChange={(e) => handleChange(d.section, e.target.value)}
            className="w-full rounded-lg border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-background)] dark:bg-[var(--color-dark-background)] px-3 py-2 text-sm text-[var(--color-text-primary)] dark:text-[#e8ecec] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-teal)] resize-none"
            placeholder={`Description shown on the ${d.label} card and category page…`}
          />
          {timeAgo(d.updatedAt) && (
            <p className="text-xs text-[var(--color-text-muted)]">Last saved: {timeAgo(d.updatedAt)}</p>
          )}
        </div>
      ))}

      <div className="px-5 py-4 flex justify-end">
        <button
          onClick={handleSave}
          disabled={!isDirty || isPending}
          className="px-4 py-2 rounded-lg bg-[var(--color-brand-teal)] text-white text-sm font-medium hover:bg-[var(--color-brand-teal-dark)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isPending ? 'Saving…' : 'Save Descriptions'}
        </button>
      </div>
    </div>
  )
}
