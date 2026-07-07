'use client'

import { useState } from 'react'
import { VALUES_LANGUAGES } from '@/types'

const COURAGE_LETTERS = ['C', 'O', 'U', 'R', 'A', 'G', 'E']

interface Props {
  pillarsByLang: Record<string, string[]>
}

export default function ValuesLanguageTabs({ pillarsByLang }: Props) {
  const availableLanguages = VALUES_LANGUAGES.filter((l) => (pillarsByLang[l.code]?.length ?? 0) > 0)
  const [active, setActive] = useState(availableLanguages[0]?.code)

  if (availableLanguages.length === 0) return null

  const pillars = pillarsByLang[active] ?? []
  const isEnglish = active === 'en'

  return (
    <div className="space-y-6">
      <div className="flex gap-1 p-1 rounded-xl bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] w-fit flex-wrap">
        {availableLanguages.map(({ code, label }) => (
          <button
            key={code}
            onClick={() => setActive(code)}
            className={`px-4 py-2 text-sm font-medium rounded-lg cursor-pointer transition-colors ${
              active === code
                ? 'bg-[var(--color-brand-teal)] text-white'
                : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] dark:hover:bg-[var(--color-dark-surface-hover)]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {isEnglish && (
        <p className="font-display text-2xl font-bold text-[var(--color-brand-teal)] dark:text-white tracking-wide">
          COURAGE
        </p>
      )}

      <ol className="space-y-4">
        {pillars.map((pillar, i) => (
          <li key={i} className="flex gap-4 items-start">
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-[var(--color-brand-teal)]/10 dark:bg-[var(--color-brand-teal)]/20 text-[var(--color-brand-teal)] dark:text-white font-display font-bold shrink-0">
              {isEnglish ? COURAGE_LETTERS[i] : i + 1}
            </span>
            <p className="pt-1.5 text-[var(--color-text-primary)] dark:text-[#e8ecec]">{pillar}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}
