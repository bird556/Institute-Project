import Link from 'next/link'
import Image from 'next/image'
import { Star, BookOpen } from 'lucide-react'
import { FadeUp } from '@/components/shared/FadeUp'

interface BookOfMonthItem {
  id: string
  title: string
  author: string | null
  description: string | null
  cover_url: string | null
  external_url: string | null
}

interface Props {
  item: BookOfMonthItem
}

export default function BookOfMonthSection({ item }: Props) {
  return (
    <section className="py-20 bg-[var(--color-background)] dark:bg-[var(--color-dark-background)]">
      <div className="max-w-6xl mx-auto px-6">
        <FadeUp>
          <div className="flex items-center gap-2 justify-center mb-3">
            <Star className="h-4 w-4 fill-[hsl(35_60%_50%)] text-[hsl(35_60%_50%)]" />
            <p className="text-[hsl(35_60%_50%)] font-medium tracking-widest uppercase text-sm">
              Book of the Month
            </p>
            <Star className="h-4 w-4 fill-[hsl(35_60%_50%)] text-[hsl(35_60%_50%)]" />
          </div>
        </FadeUp>

        <FadeUp delay={0.08}>
          <div className="mt-6 flex flex-col sm:flex-row gap-8 items-center sm:items-start max-w-3xl mx-auto rounded-2xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] p-6 sm:p-8 shadow-sm">
            {/* Cover */}
            <div className="shrink-0 w-32 h-44 relative rounded-lg overflow-hidden shadow-md border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-surface-hover)] dark:bg-[var(--color-dark-surface-hover)]">
              {item.cover_url ? (
                <Image
                  src={item.cover_url}
                  alt={item.title}
                  fill
                  className="object-cover object-top"
                  sizes="128px"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <BookOpen className="h-10 w-10 text-[var(--color-text-muted)] opacity-40" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <h2 className="font-display text-2xl font-bold text-[var(--color-text-primary)] dark:text-white leading-snug">
                {item.title}
              </h2>
              {item.author && (
                <p className="mt-1 text-sm text-[var(--color-text-muted)] font-medium">
                  by {item.author}
                </p>
              )}
              {item.description && (
                <p className="mt-3 text-sm text-[var(--color-text-muted)] leading-relaxed line-clamp-3">
                  {item.description.replace(/<[^>]*>/g, '')}
                </p>
              )}
              <div className="mt-5 flex flex-wrap gap-3 justify-center sm:justify-start">
                <Link
                  href={`/reading-list/${item.id}`}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-[var(--color-brand-teal)] text-white text-sm font-semibold hover:bg-[var(--color-brand-teal-dark)] transition-colors"
                >
                  View Details →
                </Link>
                {item.external_url && (
                  <a
                    href={item.external_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg border border-[var(--color-brand-teal)] text-[var(--color-brand-teal)] dark:text-white dark:border-white text-sm font-semibold hover:bg-[var(--color-brand-teal)] hover:text-white dark:hover:bg-white dark:hover:text-[var(--color-dark-background)] transition-colors"
                  >
                    Find this Book
                  </a>
                )}
              </div>
            </div>
          </div>
        </FadeUp>

        <FadeUp delay={0.15}>
          <div className="mt-6 text-center">
            <Link
              href="/reading-list"
              className="text-sm font-medium text-[var(--color-brand-teal)] dark:text-white hover:underline"
            >
              Browse the full reading list →
            </Link>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}
