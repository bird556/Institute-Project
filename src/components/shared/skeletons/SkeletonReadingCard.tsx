import { SkeletonBox } from './SkeletonBox'

export function SkeletonReadingCard() {
  return (
    <div className="flex flex-col h-full rounded-2xl overflow-hidden bg-surface dark:bg-dark-surface border border-(--color-border) dark:border-dark-border">
      {/* Cover — portrait 3:4 */}
      <div className="relative w-full" style={{ aspectRatio: '3/4' }}>
        <SkeletonBox className="absolute inset-0 rounded-none" />
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4 space-y-2">
        <SkeletonBox className="h-5 w-4/5" />
        <SkeletonBox className="h-5 w-3/5" />
        <SkeletonBox className="h-3.5 w-1/3" />
        <SkeletonBox className="h-4 w-full" />
        <SkeletonBox className="h-4 w-full" />
        <SkeletonBox className="h-4 w-3/4" />
        <SkeletonBox className="h-3.5 w-1/4 mt-auto" />
      </div>
    </div>
  )
}
