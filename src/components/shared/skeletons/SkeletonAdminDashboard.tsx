import { SkeletonBox } from './SkeletonBox'

function SkeletonStatCard() {
  return (
    <div className="bg-[var(--color-background)] dark:bg-[var(--color-dark-surface)] border border-(--color-border) dark:border-dark-border rounded-xl p-5 flex items-center gap-4">
      <SkeletonBox className="w-10 h-10 rounded-lg shrink-0" />
      <div className="space-y-1.5 min-w-0">
        <SkeletonBox className="h-3 w-20" />
        <SkeletonBox className="h-7 w-10" />
        <SkeletonBox className="h-3 w-14" />
      </div>
    </div>
  )
}

function SkeletonActivityRow() {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-4 border-b last:border-b-0 border-(--color-border) dark:border-dark-border">
      <div className="flex items-center gap-3 min-w-0">
        <SkeletonBox className="h-5 w-16 rounded shrink-0" />
        <SkeletonBox className="h-4 w-48" />
      </div>
      <SkeletonBox className="h-3.5 w-20 shrink-0" />
    </div>
  )
}

export function SkeletonAdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="space-y-1.5">
        <SkeletonBox className="h-7 w-40" />
        <SkeletonBox className="h-4 w-64" />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonStatCard key={i} />
        ))}
      </div>

      {/* Quick actions */}
      <div className="space-y-3">
        <SkeletonBox className="h-3 w-28" />
        <div className="flex flex-wrap gap-3">
          <SkeletonBox className="h-9 w-28 rounded-lg" />
          <SkeletonBox className="h-9 w-28 rounded-lg" />
          <SkeletonBox className="h-9 w-32 rounded-lg" />
        </div>
      </div>

      {/* Recent activity */}
      <div className="space-y-3">
        <SkeletonBox className="h-3 w-32" />
        <div className="bg-[var(--color-background)] dark:bg-[var(--color-dark-surface)] border border-(--color-border) dark:border-dark-border rounded-xl overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonActivityRow key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
