'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CANADIAN_CITIES } from '@/lib/canadian-cities'
import { DIRECTORY_FEE_OPTIONS, DIRECTORY_LANGUAGE_OPTIONS, type CanadianProvince } from '@/types'

export const FIELD_BOX =
  'rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] p-4 bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] space-y-2'
const LABEL = 'text-[var(--color-text-muted)] text-xs uppercase tracking-wide'
const INPUT = 'text-sm border-[var(--color-border)] dark:border-[var(--color-dark-border)]'

// "Toronto, Ontario" → ['Toronto', 'Ontario'] — the province is included so same-named towns stay distinct
const CITY_OPTIONS = new Map(CANADIAN_CITIES.map(([city, prov]) => [`${city}, ${prov}`, [city, prov] as const]))

// ─── Phone ──────────────────────────────────────────────────────────────────

export function PhoneField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className={FIELD_BOX}>
      <Label className={LABEL}>Phone Number</Label>
      <Input type="tel" value={value} onChange={(e) => onChange(e.target.value)} placeholder="(416) 555-0123" className={INPUT} />
    </div>
  )
}

// ─── City (picking a listed city also sets the province) ─────────────────────

export function CityField({ value, onChange }: { value: string; onChange: (city: string, province?: CanadianProvince) => void }) {
  const [text, setText] = useState(value)

  function handleChange(next: string) {
    const match = CITY_OPTIONS.get(next)
    if (match) {
      setText(match[0])
      onChange(match[0], match[1])
    } else {
      setText(next)
      onChange(next)
    }
  }

  return (
    <div className={FIELD_BOX}>
      <Label className={LABEL}>City</Label>
      <Input list="canadian-cities" value={text} onChange={(e) => handleChange(e.target.value)} placeholder="Start typing a city…" className={INPUT} />
      <datalist id="canadian-cities">
        {[...CITY_OPTIONS.keys()].map((label) => <option key={label} value={label} />)}
      </datalist>
      <p className="text-xs text-[var(--color-text-muted)]">Pick from the list to fill in Jurisdiction / Province automatically.</p>
    </div>
  )
}

// ─── Checkbox list (shared by fees + languages) ──────────────────────────────

function CheckboxList({ options, value, onChange }: { options: readonly string[]; value: string[]; onChange: (v: string[]) => void }) {
  function toggle(option: string) {
    onChange(value.includes(option) ? value.filter((v) => v !== option) : [...value, option])
  }
  return (
    <div className="grid grid-cols-1 gap-1.5">
      {options.map((option) => (
        <label key={option} className="flex items-center gap-2 text-sm text-[var(--color-text-primary)] dark:text-[#e8ecec] cursor-pointer">
          <input type="checkbox" checked={value.includes(option)} onChange={() => toggle(option)} className="h-4 w-4 accent-[var(--color-brand-teal)] cursor-pointer" />
          {option}
        </label>
      ))}
    </div>
  )
}

export function FeeOptionsField({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  return (
    <div className={FIELD_BOX}>
      <Label className={LABEL}>Fee Options</Label>
      <CheckboxList options={DIRECTORY_FEE_OPTIONS} value={value} onChange={onChange} />
    </div>
  )
}

// ─── Languages (tick as many as apply) ───────────────────────────────────────

export function LanguagesField({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  return (
    <div className={FIELD_BOX}>
      <Label className={LABEL}>Languages Spoken</Label>
      <CheckboxList options={DIRECTORY_LANGUAGE_OPTIONS} value={value} onChange={onChange} />
    </div>
  )
}
