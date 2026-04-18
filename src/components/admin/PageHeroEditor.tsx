'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { updatePageSection } from '@/actions/page-content'

interface PageHeroEditorProps {
  page: string
  initialTitle: string
  initialSubtitle: string
  titleUpdatedAt?: string
  subtitleUpdatedAt?: string
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

export default function PageHeroEditor({
  page,
  initialTitle,
  initialSubtitle,
  titleUpdatedAt,
  subtitleUpdatedAt,
}: PageHeroEditorProps) {
  const [title, setTitle]               = useState(initialTitle)
  const [subtitle, setSubtitle]         = useState(initialSubtitle)
  const [savedTitle, setSavedTitle]     = useState(initialTitle)
  const [savedSubtitle, setSavedSubtitle] = useState(initialSubtitle)
  const [titleTs, setTitleTs]           = useState(titleUpdatedAt)
  const [subtitleTs, setSubtitleTs]     = useState(subtitleUpdatedAt)
  const [isPending, startTransition]    = useTransition()

  const isDirty = title !== savedTitle || subtitle !== savedSubtitle

  function handleSave() {
    startTransition(async () => {
      const ops: Promise<{ success: boolean; error?: string }>[] = []

      if (title !== savedTitle)
        ops.push(updatePageSection(page, 'hero_title', title))
      if (subtitle !== savedSubtitle)
        ops.push(updatePageSection(page, 'hero_subtitle', subtitle))

      const results = await Promise.all(ops)
      const failed = results.find((r) => !r.success)
      if (failed) {
        toast.error(failed.error ?? 'Failed to save.')
        return
      }

      const now = new Date().toISOString()
      setSavedTitle(title)
      setSavedSubtitle(subtitle)
      setTitleTs(now)
      setSubtitleTs(now)
      toast.success('Hero content saved.')
    })
  }

  return (
    <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] divide-y divide-[var(--color-border)] dark:divide-[var(--color-dark-border)]">
      {/* Title field */}
      <div className="p-5 space-y-2">
        <label className="block text-sm font-semibold text-[var(--color-text-primary)] dark:text-white">
          Page Heading (h1)
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-background)] dark:bg-[var(--color-dark-background)] px-3 py-2 text-sm text-[var(--color-text-primary)] dark:text-[#e8ecec] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-teal)]"
          placeholder="Page heading..."
        />
        {timeAgo(titleTs) && (
          <p className="text-xs text-[var(--color-text-muted)]">
            Last saved: {timeAgo(titleTs)}
          </p>
        )}
      </div>

      {/* Subtitle field */}
      <div className="p-5 space-y-2">
        <label className="block text-sm font-semibold text-[var(--color-text-primary)] dark:text-white">
          Subtitle (p)
        </label>
        <textarea
          rows={3}
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          className="w-full rounded-lg border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-background)] dark:bg-[var(--color-dark-background)] px-3 py-2 text-sm text-[var(--color-text-primary)] dark:text-[#e8ecec] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-teal)] resize-none"
          placeholder="Short subtitle shown beneath the heading..."
        />
        {timeAgo(subtitleTs) && (
          <p className="text-xs text-[var(--color-text-muted)]">
            Last saved: {timeAgo(subtitleTs)}
          </p>
        )}
      </div>

      {/* Save */}
      <div className="px-5 py-4 flex justify-end">
        <button
          onClick={handleSave}
          disabled={!isDirty || isPending}
          className="px-4 py-2 rounded-lg bg-[var(--color-brand-teal)] text-white text-sm font-medium hover:bg-[var(--color-brand-teal-dark)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isPending ? 'Saving…' : 'Save All'}
        </button>
      </div>
    </div>
  )
}
