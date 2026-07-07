'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { updatePageSection } from '@/actions/page-content'
import { VALUES_LANGUAGES } from '@/types'

interface Props {
  initialPillars: Record<string, string[]>
}

export default function ValuesPillarsEditor({ initialPillars }: Props) {
  const [active, setActive] = useState(VALUES_LANGUAGES[0].code)
  const [pillars, setPillars] = useState<Record<string, string[]>>(() => {
    const map: Record<string, string[]> = {}
    for (const { code } of VALUES_LANGUAGES) {
      map[code] = initialPillars[code]?.length === 7 ? initialPillars[code] : Array(7).fill('')
    }
    return map
  })
  const [isPending, startTransition] = useTransition()

  function handleChange(index: number, value: string) {
    setPillars((prev) => {
      const next = { ...prev, [active]: [...prev[active]] }
      next[active][index] = value
      return next
    })
  }

  function handleSave() {
    startTransition(async () => {
      const res = await updatePageSection('values', `pillars_${active}`, JSON.stringify(pillars[active]))
      if (res.success) toast.success('Pillars saved.')
      else toast.error(res.error ?? 'Failed to save.')
    })
  }

  const activeLabel = VALUES_LANGUAGES.find((l) => l.code === active)?.label ?? active

  return (
    <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] p-5 space-y-4">
      <div>
        <h2 className="text-base font-semibold text-[var(--color-text-primary)] dark:text-white">Seven Pillars — Per Language</h2>
        <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
          Edit the 7 pillar labels shown on the public Values page for each language.
        </p>
      </div>

      <div className="flex gap-1 p-1 rounded-xl bg-[var(--color-background)] dark:bg-[var(--color-dark-background)] w-fit flex-wrap">
        {VALUES_LANGUAGES.map(({ code, label }) => (
          <button
            key={code}
            onClick={() => setActive(code)}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg cursor-pointer transition-colors ${
              active === code
                ? 'bg-[var(--color-brand-teal)] text-white'
                : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] dark:hover:bg-[var(--color-dark-surface-hover)]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {pillars[active].map((value, i) => (
          <div key={i} className="space-y-1">
            <label className="text-xs uppercase tracking-wide text-[var(--color-text-muted)]">Pillar {i + 1}</label>
            <input
              type="text"
              value={value}
              onChange={(e) => handleChange(i, e.target.value)}
              className="w-full rounded-lg border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-background)] dark:bg-[var(--color-dark-background)] px-3 py-2 text-sm text-[var(--color-text-primary)] dark:text-[#e8ecec] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-teal)]"
            />
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isPending}
          className="px-4 py-2 rounded-lg bg-[var(--color-brand-teal)] text-white text-sm font-medium hover:bg-[var(--color-brand-teal-dark)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          {isPending ? 'Saving…' : `Save ${activeLabel}`}
        </button>
      </div>
    </div>
  )
}
