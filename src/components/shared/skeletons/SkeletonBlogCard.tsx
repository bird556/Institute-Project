import { SkeletonBox } from './SkeletonBox'

export function SkeletonBlogCard() {
  return (
    <div className="flex flex-col h-full rounded-2xl overflow-hidden bg-surface dark:bg-dark-surface border border-(--color-border) dark:border-dark-border">
      {/* Cover — aspect-video */}
      <SkeletonBox className="aspect-video w-full rounded-none" />

      {/* Body */}
      <div className="flex flex-col flex-1 p-5 space-y-3">
        <SkeletonBox className="h-3.5 w-1/3" />
        <SkeletonBox className="h-5 w-4/5" />
        <SkeletonBox className="h-5 w-3/5" />
        <SkeletonBox className="h-4 w-full" />
        <SkeletonBox className="h-4 w-full" />
        <SkeletonBox className="h-4 w-2/3" />
        <SkeletonBox className="h-3.5 w-1/4 mt-auto" />
      </div>
    </div>
  )
}
