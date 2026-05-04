import { SkeletonBox } from '@/components/shared/skeletons/SkeletonBox'

function SkeletonSearchRow() {
  return (
    <div className="flex items-start gap-4 p-5 rounded-xl border border-(--color-border) dark:border-dark-border bg-surface dark:bg-dark-surface">
      <SkeletonBox className="shrink-0 mt-0.5 w-9 h-9 rounded-lg" />
      <div className="flex-1 space-y-2">
        <div className="flex gap-2">
          <SkeletonBox className="h-4 w-16 rounded-full" />
          <SkeletonBox className="h-4 w-24" />
        </div>
        <SkeletonBox className="h-5 w-3/4" />
        <SkeletonBox className="h-4 w-full" />
        <SkeletonBox className="h-4 w-4/5" />
      </div>
      <SkeletonBox className="shrink-0 h-4 w-4 self-center" />
    </div>
  )
}

export default function Loading() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      <header className="space-y-3">
        <SkeletonBox className="h-10 w-36" />
        <SkeletonBox className="h-5 w-80" />
      </header>

      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonSearchRow key={i} />
        ))}
      </div>
    </div>
  )
}
