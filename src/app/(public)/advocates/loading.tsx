import { SkeletonBox } from '@/components/shared/skeletons/SkeletonBox'

export default function AdvocatesLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      <div className="space-y-3">
        <SkeletonBox className="h-10 w-56 rounded-lg" />
        <SkeletonBox className="h-5 w-96 rounded" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-2xl overflow-hidden border border-[var(--color-border)] dark:border-[var(--color-dark-border)]">
            <SkeletonBox className="w-full aspect-square" />
            <div className="p-4 space-y-2">
              <SkeletonBox className="h-4 w-3/4 rounded" />
              <SkeletonBox className="h-3 w-1/2 rounded" />
              <SkeletonBox className="h-3 w-full rounded" />
              <SkeletonBox className="h-3 w-5/6 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
