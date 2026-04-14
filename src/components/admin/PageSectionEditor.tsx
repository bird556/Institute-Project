'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import RichTextEditor from '@/components/shared/RichTextEditor'
import { updatePageSection } from '@/actions/page-content'
import { formatDate } from '@/lib/utils'

interface PageSectionEditorProps {
  label: string
  page: string
  section: string
  initialContent: string
  updatedAt?: string
}

function relativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diffMs / 60_000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} minute${mins === 1 ? '' : 's'} ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days} day${days === 1 ? '' : 's'} ago`
  return formatDate(iso)
}

export default function PageSectionEditor({
  label,
  page,
  section,
  initialContent,
  updatedAt,
}: PageSectionEditorProps) {
  const [content, setContent] = useState(initialContent)
  const [savedContent, setSavedContent] = useState(initialContent)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState(updatedAt)

  const isDirty = content !== savedContent

  async function handleSave() {
    setIsSaving(true)
    const result = await updatePageSection(page, section, content)
    setIsSaving(false)
    if (result.success) {
      setSavedContent(content)
      setLastSaved(new Date().toISOString())
      toast.success(`${label} saved.`)
    } else {
      toast.error(result.error ?? 'Failed to save.')
    }
  }

  return (
    <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-background)] dark:bg-[var(--color-dark-background)] p-6 space-y-4">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
        {label}
      </h2>
      <RichTextEditor
        content={content}
        onChange={setContent}
        folder="page_content/inline"
        placeholder={`Write ${label.toLowerCase()} content…`}
        minHeight={220}
      />
      <div className="flex items-center justify-between pt-1">
        {lastSaved ? (
          <p className="text-xs text-[var(--color-text-muted)]">
            Last saved: {relativeTime(lastSaved)}
          </p>
        ) : (
          <span />
        )}
        <button
          type="button"
          onClick={handleSave}
          disabled={!isDirty || isSaving}
          className="px-4 py-1.5 rounded-lg text-sm font-medium bg-[var(--color-brand-teal)] text-white hover:bg-[var(--color-brand-teal-dark)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {isSaving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </div>
  )
}
