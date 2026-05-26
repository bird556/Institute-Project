import Link from 'next/link'
import Image from 'next/image'
import { Star, BookOpen } from 'lucide-react'

interface BookOfMonthCardProps {
  id: string
  title: string
  author: string | null
  description_excerpt: string | null
  cover_url: string | null
}

export default function BookOfMonthCard({ id, title, author, description_excerpt, cover_url }: BookOfMonthCardProps) {
  return (
    <div className="rounded-2xl border border-[hsl(35_60%_50%/0.35)] bg-[hsl(35_60%_50%/0.05)] dark:bg-[var(--color-dark-surface)] overflow-hidden">
      <div className="flex flex-col sm:flex-row gap-6 p-6">
        {/* Cover */}
        <div
          className="relative shrink-0 self-start w-full sm:w-36 rounded-xl overflow-hidden bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface-hover)] shadow-md"
          style={{ aspectRatio: '3/4' }}
        >
          {cover_url ? (
            <Image
              src={cover_url}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 90vw, 144px"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <BookOpen className="h-10 w-10 text-[var(--color-text-muted)] opacity-40" />
            </div>
          )}
        </div>

        {/* Text */}
        <div className="flex flex-col justify-center gap-3 min-w-0">
          {/* Badge */}
          <div className="flex items-center gap-1.5 w-fit">
            <Star className="h-3.5 w-3.5 fill-[hsl(35_60%_50%)] text-[hsl(35_60%_50%)]" />
            <span className="text-xs font-semibold uppercase tracking-widest text-[hsl(35_60%_40%)] dark:text-[hsl(35_60%_70%)]">
              Book of the Month
            </span>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)] dark:text-white leading-snug">
            {title}
          </h2>

          {author && (
            <p className="text-[var(--color-text-muted)] font-medium">{author}</p>
          )}

          {description_excerpt && (
            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed line-clamp-3">
              {description_excerpt}
            </p>
          )}

          <div className="mt-1">
            <Link
              href={`/reading-list/${id}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[hsl(35_60%_50%)] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              View Book →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
