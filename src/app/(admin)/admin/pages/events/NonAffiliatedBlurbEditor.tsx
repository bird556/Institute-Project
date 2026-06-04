'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { updateSiteSetting } from '@/actions/settings'

interface Props {
  settingKey: string
  label: string
  description: string
  initialBlurb: string
}

export default function EventBlurbEditor({ settingKey, label, description, initialBlurb }: Props) {
  const [blurb, setBlurb]             = useState(initialBlurb)
  const [saved, setSaved]             = useState(initialBlurb)
  const [isPending, startTransition]  = useTransition()

  const isDirty = blurb !== saved

  function handleSave() {
    startTransition(async () => {
      const result = await updateSiteSetting(settingKey, blurb)
      if (!result.success) {
        toast.error(result.error ?? 'Failed to save.')
        return
      }
      setSaved(blurb)
      toast.success('Blurb saved.')
    })
  }

  return (
    <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] divide-y divide-[var(--color-border)] dark:divide-[var(--color-dark-border)]">
      <div className="p-5 space-y-2">
        <label className="block text-sm font-semibold text-[var(--color-text-primary)] dark:text-white">
          {label}
        </label>
        <p className="text-xs text-[var(--color-text-muted)]">{description}</p>
        <textarea
          rows={4}
          value={blurb}
          onChange={(e) => setBlurb(e.target.value)}
          className="w-full rounded-lg border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-background)] dark:bg-[var(--color-dark-background)] px-3 py-2 text-sm text-[var(--color-text-primary)] dark:text-[#e8ecec] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-teal)] resize-none"
          placeholder="Short description shown on the public events page…"
        />
      </div>
      <div className="px-5 py-4 flex justify-end">
        <button
          onClick={handleSave}
          disabled={!isDirty || isPending}
          className="px-4 py-2 rounded-lg bg-[var(--color-brand-teal)] text-white text-sm font-medium hover:bg-[var(--color-brand-teal-dark)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isPending ? 'Saving…' : 'Save Blurb'}
        </button>
      </div>
    </div>
  )
}
