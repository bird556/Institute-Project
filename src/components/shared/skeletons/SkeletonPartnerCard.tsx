import { SkeletonBox } from './SkeletonBox'

export function SkeletonPartnerCard() {
  return (
    <div className="flex flex-col h-full rounded-2xl bg-surface dark:bg-dark-surface border border-(--color-border) dark:border-dark-border p-6 space-y-4">
      {/* Logo area */}
      <div className="flex items-center justify-center h-16">
        <SkeletonBox className="h-14 w-32" />
      </div>

      {/* Name */}
      <SkeletonBox className="h-5 w-3/5 mx-auto" />

      {/* Description */}
      <SkeletonBox className="h-4 w-full" />
      <SkeletonBox className="h-4 w-full" />
      <SkeletonBox className="h-4 w-4/5" />
      <SkeletonBox className="h-4 w-3/4" />

      {/* Learn more */}
      <SkeletonBox className="h-3 w-1/4 mt-auto" />
    </div>
  )
}
