import { SkeletonBox } from './SkeletonBox'

export function SkeletonDetailPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <SkeletonBox className="h-4 w-24" />
      <SkeletonBox className="h-10 w-3/4" />
      <SkeletonBox className="h-10 w-2/4" />
      <SkeletonBox className="h-4 w-1/3" />
      <SkeletonBox className="h-72 w-full" />
      <div className="space-y-3 pt-4">
        <SkeletonBox className="h-4 w-full" />
        <SkeletonBox className="h-4 w-full" />
        <SkeletonBox className="h-4 w-5/6" />
        <SkeletonBox className="h-4 w-full" />
        <SkeletonBox className="h-4 w-3/4" />
      </div>
    </div>
  )
}
