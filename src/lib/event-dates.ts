import { formatDate, formatTime } from './utils'

/** Start/finish of an event. A null start means the date is TBD. */
export interface EventDateRange {
  event_date: string | null
  event_end_date?: string | null
}

export const DATE_TBD_LABEL = 'Date TBD'

/** An event is past once its finish (or start, if no finish) has gone by. TBD events are never past. */
export function isEventPast({ event_date, event_end_date }: EventDateRange, now = new Date()): boolean {
  const last = event_end_date ?? event_date
  if (!last) return false
  return new Date(last) < now
}

function sameDay(a: string, b: string): boolean {
  return formatDate(a) === formatDate(b)
}

/** Full label, e.g. "March 3, 2026 · 9:00 a.m. – 5:00 p.m." or "Date TBD". */
export function formatEventWhen({ event_date, event_end_date }: EventDateRange): string {
  if (!event_date) return DATE_TBD_LABEL
  const start = `${formatDate(event_date)} · ${formatTime(event_date)}`
  if (!event_end_date) return start
  if (sameDay(event_date, event_end_date)) return `${start} – ${formatTime(event_end_date)}`
  return `${start} – ${formatDate(event_end_date)} · ${formatTime(event_end_date)}`
}

/** Date-only label, e.g. "March 3, 2026 – March 5, 2026" or "Date TBD". */
export function formatEventDay({ event_date, event_end_date }: EventDateRange): string {
  if (!event_date) return DATE_TBD_LABEL
  if (!event_end_date || sameDay(event_date, event_end_date)) return formatDate(event_date)
  return `${formatDate(event_date)} – ${formatDate(event_end_date)}`
}

/** Upcoming order: soonest first, TBD events last. */
export function compareUpcoming(a: EventDateRange, b: EventDateRange): number {
  if (!a.event_date || !b.event_date) return (a.event_date ? 0 : 1) - (b.event_date ? 0 : 1)
  return new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
}

/** Past order: most recently finished first. */
export function comparePast(a: EventDateRange, b: EventDateRange): number {
  const end = (e: EventDateRange) => new Date(e.event_end_date ?? e.event_date ?? 0).getTime()
  return end(b) - end(a)
}

/** PostgREST `or` filter for events that haven't finished yet (includes TBD). */
export function notFinishedFilter(nowIso: string): string {
  return `event_date.is.null,event_date.gt.${nowIso},event_end_date.gt.${nowIso}`
}
