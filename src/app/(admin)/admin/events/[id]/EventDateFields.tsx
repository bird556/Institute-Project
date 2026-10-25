'use client'

import { X } from 'lucide-react'
import { Label } from '@/components/ui/label'

export interface EventDateValues {
  tbd: boolean
  startDate: string   // YYYY-MM-DD
  startTime: string   // HH:MM
  endDate: string
  endTime: string
}

interface EventDateFieldsProps {
  values: EventDateValues
  error: string
  onChange: (patch: Partial<EventDateValues>) => void
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/
const TIME_RE = /^\d{2}:\d{2}$/

/** Split an ISO timestamptz into date + time strings for the inputs (times are stored as UTC wall-clock) */
function splitDateTime(iso: string | null): { date: string; time: string } {
  if (!iso) return { date: '', time: '' }
  const s = new Date(iso).toISOString()
  return { date: s.slice(0, 10), time: s.slice(11, 16) }
}

/** Combine date + time into an ISO string, or null if either part is missing/invalid */
function toIso(date: string, time: string): string | null {
  if (!DATE_RE.test(date) || !TIME_RE.test(time)) return null
  const iso = `${date}T${time}:00.000Z`
  return Number.isNaN(new Date(iso).getTime()) ? null : iso
}

export function initialDateValues(start: string | null, end: string | null): EventDateValues {
  const s = splitDateTime(start)
  const e = splitDateTime(end)
  return { tbd: start === null, startDate: s.date, startTime: s.time, endDate: e.date, endTime: e.time }
}

/** DB fields for an autosave/save. Incomplete inputs are left out so a half-typed date never overwrites a good one. */
export function buildDateFields(v: EventDateValues): { event_date?: string | null; event_end_date?: string | null } {
  if (v.tbd) return { event_date: null, event_end_date: null }
  const start = toIso(v.startDate, v.startTime)
  const end = toIso(v.endDate, v.endTime)
  const hasEnd = v.endDate !== '' || v.endTime !== ''
  return {
    ...(start ? { event_date: start } : {}),
    ...(!hasEnd ? { event_end_date: null } : end ? { event_end_date: end } : {}),
  }
}

/** Returns an error message, or '' when the dates are valid */
export function validateDates(v: EventDateValues): string {
  if (v.tbd) return ''
  if (!v.startDate || !v.startTime) return 'Start date and time are required — or tick "Date to be announced".'
  const start = toIso(v.startDate, v.startTime)
  if (!start) return 'Start date or time is invalid.'
  if (!v.endDate && !v.endTime) return ''
  const end = toIso(v.endDate, v.endTime)
  if (!end) return 'Finish needs both a date and a time.'
  if (end <= start) return 'Finish must be after the start.'
  return ''
}

const inputClass =
  'w-full h-9 rounded-md border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-background)] dark:bg-[var(--color-dark-surface-hover)] text-[var(--color-text-primary)] dark:text-[#e8ecec] text-sm px-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-teal)] cursor-pointer'

function DateTimeRow({ id, label, date, time, onDate, onTime }: {
  id: string
  label: string
  date: string
  time: string
  onDate: (v: string) => void
  onTime: (v: string) => void
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={`${id}-date`} className="text-[var(--color-text-muted)] text-xs">{label}</Label>
      <div className="grid grid-cols-[3fr_2fr] gap-2">
        <input id={`${id}-date`} type="date" value={date} onChange={(e) => onDate(e.target.value)} className={inputClass} aria-label={`${label} date`} />
        <input id={`${id}-time`} type="time" value={time} onChange={(e) => onTime(e.target.value)} className={inputClass} aria-label={`${label} time`} />
      </div>
    </div>
  )
}

export default function EventDateFields({ values, error, onChange }: EventDateFieldsProps) {
  const hasEnd = values.endDate !== '' || values.endTime !== ''

  function handleEndDate(v: string) {
    // Pre-fill the finish time with the start time so a one-field edit is enough
    onChange(values.endTime ? { endDate: v } : { endDate: v, endTime: values.startTime })
  }

  return (
    <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] p-4 bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] space-y-3">
      <p className="text-xs uppercase tracking-wide text-[var(--color-text-muted)] font-medium">Date &amp; Time</p>

      <label className="flex items-center gap-2 text-sm text-[var(--color-text-primary)] dark:text-[#e8ecec] cursor-pointer">
        <input
          type="checkbox"
          checked={values.tbd}
          onChange={(e) => onChange({ tbd: e.target.checked })}
          className="cursor-pointer accent-[var(--color-brand-teal)]"
        />
        Date to be announced (TBD)
      </label>

      {values.tbd ? (
        <p className="text-xs text-[var(--color-text-muted)]">
          The event shows &quot;Date TBD&quot; on the site and is listed after dated upcoming events. Untick this once the date is set.
        </p>
      ) : (
        <>
          <DateTimeRow
            id="event-start" label="Start" date={values.startDate} time={values.startTime}
            onDate={(v) => onChange({ startDate: v })} onTime={(v) => onChange({ startTime: v })}
          />
          <DateTimeRow
            id="event-end" label="Finish (optional)" date={values.endDate} time={values.endTime}
            onDate={handleEndDate} onTime={(v) => onChange({ endTime: v })}
          />
          {hasEnd && (
            <button
              type="button"
              onClick={() => onChange({ endDate: '', endTime: '' })}
              className="inline-flex items-center gap-1 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] dark:hover:text-white cursor-pointer"
            >
              <X size={12} /> Remove finish date
            </button>
          )}
        </>
      )}

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
