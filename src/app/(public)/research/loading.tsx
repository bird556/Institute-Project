import { SkeletonBox } from '@/components/shared/skeletons/SkeletonBox'

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <header className="space-y-3">
        <SkeletonBox className="h-10 w-48" />
        <SkeletonBox className="h-5 w-72" />
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] p-8 space-y-4">
            <SkeletonBox className="h-8 w-40" />
            <SkeletonBox className="h-4 w-full" />
            <SkeletonBox className="h-4 w-3/4" />
            <div className="pt-4 border-t border-[var(--color-border)] dark:border-[var(--color-dark-border)] flex justify-between">
              <SkeletonBox className="h-4 w-12" />
              <SkeletonBox className="h-4 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
