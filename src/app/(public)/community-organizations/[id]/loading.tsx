import { SkeletonBox } from '@/components/shared/skeletons/SkeletonBox'

export default function CommunityOrganizationDetailLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      <SkeletonBox className="h-4 w-32 rounded" />
      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-10">
        <SkeletonBox className="w-full aspect-square rounded-2xl" />
        <div className="space-y-4">
          <SkeletonBox className="h-10 w-3/4 rounded" />
          <SkeletonBox className="h-5 w-1/2 rounded" />
          <SkeletonBox className="h-4 w-full rounded" />
          <SkeletonBox className="h-4 w-full rounded" />
          <SkeletonBox className="h-4 w-2/3 rounded" />
        </div>
      </div>
    </div>
  )
}
