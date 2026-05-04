import { cn } from '@/lib/utils'

export function SkeletonBox({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-surface-hover dark:bg-dark-surface-hover',
        className,
      )}
    />
  )
}
