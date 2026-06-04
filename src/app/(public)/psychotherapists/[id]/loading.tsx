import { SkeletonBox } from '@/components/shared/skeletons/SkeletonBox'

export default function PsychotherapistDetailLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      <SkeletonBox className="h-4 w-40 rounded" />
      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-10">
        <div className="space-y-4">
          <SkeletonBox className="w-full aspect-square rounded-2xl" />
          <SkeletonBox className="h-10 w-full rounded-xl" />
        </div>
        <div className="space-y-4">
          <SkeletonBox className="h-8 w-3/4 rounded-lg" />
          <SkeletonBox className="h-5 w-1/2 rounded" />
          <SkeletonBox className="h-4 w-full rounded" />
          <SkeletonBox className="h-4 w-5/6 rounded" />
          <SkeletonBox className="h-4 w-4/5 rounded" />
        </div>
      </div>
    </div>
  )
}
