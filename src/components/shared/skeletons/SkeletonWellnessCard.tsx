import { SkeletonBox } from './SkeletonBox'

export function SkeletonWellnessCard() {
  return (
    <div className="flex flex-col h-full rounded-2xl overflow-hidden bg-surface dark:bg-dark-surface border border-(--color-border) dark:border-dark-border">
      {/* Cover — 16/9 */}
      <SkeletonBox className="aspect-video w-full rounded-none" />

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Tags */}
        <div className="flex gap-1.5">
          <SkeletonBox className="h-5 w-16 rounded-full" />
          <SkeletonBox className="h-5 w-12 rounded-full" />
        </div>
        <SkeletonBox className="h-5 w-4/5" />
        <SkeletonBox className="h-5 w-3/5" />
        <SkeletonBox className="h-4 w-full" />
        <SkeletonBox className="h-4 w-full" />
        <SkeletonBox className="h-4 w-2/3" />
        <SkeletonBox className="h-3 w-1/4 mt-auto" />
      </div>
    </div>
  )
}
