import { cn } from '@/lib/utils'

// Small entry-count pill shown inside admin tabs and filter buttons
export function CountBadge({ count, active }: { count: number; active: boolean }) {
  return (
    <span
      className={cn(
        'ml-2 inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-xs font-medium tabular-nums',
        active
          ? 'bg-white/20 text-white'
          : 'bg-[var(--color-background)] dark:bg-[var(--color-dark-surface-hover)] text-[var(--color-text-muted)]',
      )}
    >
      {count}
    </span>
  )
}

type Counts<K extends string> = Record<K, number>

// Count items per key, always including 'all'
export function countBy<T, K extends string>(items: T[], keys: readonly K[], match: (item: T, key: K) => boolean): Counts<K> {
  return Object.fromEntries(
    keys.map((k) => [k, k === 'all' ? items.length : items.filter((i) => match(i, k)).length]),
  ) as Counts<K>
}

// Counts for the common All / Published / Drafts filter
export function countStatus<T extends { published: boolean }>(items: T[]) {
  return countBy(items, ['all', 'published', 'drafts'] as const, (i, k) => (k === 'published' ? i.published : !i.published))
}
