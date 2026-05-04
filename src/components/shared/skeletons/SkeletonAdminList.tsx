import { SkeletonBox } from './SkeletonBox'

function SkeletonAdminListRow() {
  return (
    <div className="flex items-center gap-4 px-4 py-3 border-b last:border-b-0 border-(--color-border) dark:border-dark-border bg-[var(--color-background)] dark:bg-[var(--color-dark-surface)]">
      <SkeletonBox className="h-10 w-10 rounded-md shrink-0" />
      <div className="flex-1 min-w-0 space-y-1.5">
        <SkeletonBox className="h-4 w-3/5" />
        <SkeletonBox className="h-3.5 w-2/5" />
      </div>
      <SkeletonBox className="h-5 w-16 rounded-full shrink-0" />
      <SkeletonBox className="h-3.5 w-20 shrink-0 hidden sm:block" />
      <SkeletonBox className="h-6 w-6 rounded shrink-0" />
    </div>
  )
}

interface SkeletonAdminListProps {
  title: string
  rows?: number
}

export function SkeletonAdminList({ title, rows = 8 }: SkeletonAdminListProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <SkeletonBox className="h-8 w-40" />
        <SkeletonBox className="h-9 w-28 rounded-lg" />
      </div>

      {/* Search + filter bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <SkeletonBox className="h-9 w-full sm:w-80 rounded-lg" />
        <SkeletonBox className="h-9 w-48 rounded-lg" />
      </div>

      {/* List */}
      <div className="rounded-xl border border-(--color-border) dark:border-dark-border overflow-hidden">
        {Array.from({ length: rows }).map((_, i) => (
          <SkeletonAdminListRow key={i} />
        ))}
      </div>
    </div>
  )
}
