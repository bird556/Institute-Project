import { SkeletonBox } from './SkeletonBox'

export function SkeletonReadingRow() {
  return (
    <div className="flex items-start gap-4 px-4 py-4">
      {/* Cover thumbnail — 64×85px portrait */}
      <SkeletonBox className="shrink-0 rounded-lg w-16 h-[85px]" />

      {/* Body */}
      <div className="flex-1 min-w-0 space-y-2 pt-1">
        <SkeletonBox className="h-5 w-3/4" />
        <SkeletonBox className="h-4 w-1/3" />
        <SkeletonBox className="h-3.5 w-full" />
        <SkeletonBox className="h-3.5 w-5/6" />
        <SkeletonBox className="h-3.5 w-1/4 mt-1" />
      </div>
    </div>
  )
}
