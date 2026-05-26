import Link from 'next/link'
import Image from 'next/image'
import { FadeUp } from '@/components/shared/FadeUp'

interface WellnessFeaturedPost {
  id: string
  title: string
  excerpt: string | null
  cover_url: string | null
}

interface WellnessFeaturedSectionProps {
  blurb: string
  posts: WellnessFeaturedPost[]
}

export default function WellnessFeaturedSection({ blurb, posts }: WellnessFeaturedSectionProps) {
  if (posts.length === 0) return null

  return (
    <section className="py-24 bg-surface dark:bg-dark-background">
      <div className="max-w-6xl mx-auto px-6">
        <FadeUp>
          <p className="text-secondary dark:text-primary font-medium tracking-widest uppercase text-sm mb-3 text-center">
            Featured
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground text-center mb-4">
            Health &amp; Wellness
          </h2>
          {blurb && (
            <p className="text-muted-foreground text-lg leading-relaxed text-center max-w-2xl mx-auto mb-12">
              {blurb}
            </p>
          )}
        </FadeUp>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, i) => (
            <FadeUp key={post.id} delay={i * 0.1}>
              <Link
                href={`/health-wellness/${post.id}`}
                className="group relative rounded-2xl overflow-hidden bg-background dark:bg-dark-surface border border-[var(--color-border)] dark:border-[var(--color-dark-border)] shadow-sm hover:shadow-md transition-shadow cursor-pointer block"
              >
                {/* Cover image */}
                <div className="relative aspect-[16/9] overflow-hidden bg-surface dark:bg-dark-surface-hover">
                  {post.cover_url ? (
                    <Image
                      src={post.cover_url}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-brand-teal)] to-[hsl(35_60%_50%)] opacity-20" />
                  )}
                  {/* Read Now overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                    <span className="px-5 py-2 rounded-lg bg-white text-[var(--color-brand-teal)] text-sm font-semibold shadow-md">
                      Read Now
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-serif text-lg font-semibold text-foreground mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-4">
                      {post.excerpt}
                    </p>
                  )}
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-brand-teal)] dark:text-white">
                    Read Now →
                  </span>
                </div>
              </Link>
            </FadeUp>
          ))}
        </div>

        <FadeUp delay={0.3}>
          <div className="mt-12 text-center">
            <Link
              href="/health-wellness"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-[var(--color-brand-teal)] text-[var(--color-brand-teal)] dark:text-white dark:border-white text-sm font-semibold hover:bg-[var(--color-brand-teal)] hover:text-white dark:hover:bg-white dark:hover:text-[var(--color-dark-background)] transition-colors"
            >
              View All Posts
            </Link>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}
