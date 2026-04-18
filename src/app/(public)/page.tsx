import Link from 'next/link'
import Image from 'next/image'
import { getPageContent } from '@/actions/page-content'
import { getSiteSettings } from '@/actions/settings'
import { mockBlogs, mockEvents } from '@/lib/mock-data'
import { formatDate } from '@/lib/utils'

export default async function HomePage() {
  const [{ data: sections }, { data: settings }] = await Promise.all([
    getPageContent('home'),
    getSiteSettings(),
  ])

  const hero  = sections?.find(s => s.section === 'hero')
  const intro = sections?.find(s => s.section === 'intro')
  const cta   = sections?.find(s => s.section === 'cta')

  // TODO: reconstruct full URL via supabase.storage.from('institute-media').getPublicUrl(path)
  const heroImageUrl = settings?.home_hero_image_path || null
  const heroBgUrl    = settings?.home_hero_bg_path    || null

  const featuredBlogs = mockBlogs
    .filter(b => b.published && b.published_at)
    .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
    .slice(0, 3)

  const now = new Date()
  const upcomingEvents = mockEvents
    .filter(e => e.published && new Date(e.event_date) > now)
    .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime())
    .slice(0, 2)

  return (
    <div>
      {/* Hero */}
      {hero?.content && (
        <section className="relative bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Background image (independent of side image) */}
          {heroBgUrl && (
            <>
              <Image
                src={heroBgUrl}
                alt=""
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
              <div className="absolute inset-0 bg-black/50" />
            </>
          )}

          <div className="relative max-w-6xl mx-auto">
            {heroImageUrl ? (
              /* Two-column layout when side image is set */
              <div className="flex items-center gap-12">
                <div className="flex-1 tiptap-content" dangerouslySetInnerHTML={{ __html: hero.content }} />
                <div className="hidden md:block flex-shrink-0 w-80">
                  <div className="relative rounded-2xl overflow-hidden shadow-lg aspect-[4/5]">
                    <Image
                      src={heroImageUrl}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="320px"
                      priority
                    />
                  </div>
                </div>
              </div>
            ) : (
              /* Single-column layout (default) */
              <div className="max-w-4xl tiptap-content" dangerouslySetInnerHTML={{ __html: hero.content }} />
            )}
          </div>
        </section>
      )}

      {/* Intro */}
      {intro?.content && (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="tiptap-content" dangerouslySetInnerHTML={{ __html: intro.content }} />
          </div>
        </section>
      )}

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)]">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display text-3xl font-bold text-[var(--color-brand-teal)] dark:text-white mb-8">
              Upcoming Events
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {upcomingEvents.map(event => (
                <Link
                  key={event.id}
                  href={`/events/${event.id}`}
                  className="group block rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-background)] dark:bg-[var(--color-dark-background)] p-6 hover:border-[var(--color-brand-teal)] transition-colors"
                >
                  <p className="text-xs text-[var(--color-text-muted)] mb-2">
                    {formatDate(event.event_date)} · {event.location}
                  </p>
                  <h3 className="font-display text-lg font-bold text-[var(--color-text-primary)] dark:text-white group-hover:text-[var(--color-brand-teal)] transition-colors">
                    {event.title}
                  </h3>
                </Link>
              ))}
            </div>
            <div className="mt-8">
              <Link href="/events" className="text-sm font-medium text-[var(--color-brand-teal)] hover:underline">
                View all events →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Featured Blogs */}
      {featuredBlogs.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display text-3xl font-bold text-[var(--color-brand-teal)] dark:text-white mb-8">
              Latest from the Blog
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredBlogs.map(blog => (
                <Link
                  key={blog.id}
                  href={`/blogs/${blog.id}`}
                  className="group block rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-background)] dark:bg-[var(--color-dark-background)] p-6 hover:border-[var(--color-brand-teal)] transition-colors"
                >
                  <p className="text-xs text-[var(--color-text-muted)] mb-2">
                    {formatDate(blog.published_at)}
                  </p>
                  <h3 className="font-display text-lg font-bold text-[var(--color-text-primary)] dark:text-white group-hover:text-[var(--color-brand-teal)] transition-colors mb-2">
                    {blog.title}
                  </h3>
                  <p className="text-sm text-[var(--color-text-muted)] line-clamp-2">
                    {blog.excerpt}
                  </p>
                </Link>
              ))}
            </div>
            <div className="mt-8">
              <Link href="/blogs" className="text-sm font-medium text-[var(--color-brand-teal)] hover:underline">
                View all posts →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      {cta?.content && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)]">
          <div className="max-w-4xl mx-auto">
            <div className="tiptap-content" dangerouslySetInnerHTML={{ __html: cta.content }} />
          </div>
        </section>
      )}
    </div>
  )
}
