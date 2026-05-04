import { SkeletonBox } from '@/components/shared/skeletons/SkeletonBox'

function SkeletonEditionRow() {
  return (
    <div className="flex gap-6 rounded-2xl border border-(--color-border) dark:border-dark-border bg-surface dark:bg-dark-surface p-6">
      <div className="flex-1 space-y-3">
        <SkeletonBox className="h-5 w-1/2" />
        <SkeletonBox className="h-3.5 w-1/4" />
        <div className="flex gap-2 pt-1">
          <SkeletonBox className="h-5 w-16 rounded-full" />
          <SkeletonBox className="h-5 w-12 rounded-full" />
        </div>
        <SkeletonBox className="h-3.5 w-28" />
      </div>
    </div>
  )
}

export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <header className="space-y-3">
        <SkeletonBox className="h-10 w-48" />
        <SkeletonBox className="h-5 w-80" />
        <SkeletonBox className="h-10 w-48 rounded-lg mt-2" />
      </header>

      <div className="space-y-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonEditionRow key={i} />
        ))}
      </div>
    </div>
  )
}
