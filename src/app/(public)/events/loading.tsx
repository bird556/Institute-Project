import { SkeletonEventCard } from '@/components/shared/skeletons/SkeletonEventCard'
import { SkeletonBox } from '@/components/shared/skeletons/SkeletonBox'

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <header className="space-y-3">
        <SkeletonBox className="h-10 w-40" />
        <SkeletonBox className="h-5 w-80" />
      </header>

      <section className="space-y-6">
        <SkeletonBox className="h-3 w-32" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonEventCard key={i} />
          ))}
        </div>
      </section>
    </div>
  )
}
