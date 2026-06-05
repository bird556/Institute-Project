import type { Metadata } from 'next'
import Link from 'next/link'
import { Scale, Brain, Network, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { getPageContent } from '@/actions/page-content'
import { buildMetadata } from '@/lib/metadata'
import { FadeUp } from '@/components/shared/FadeUp'
import { stripHtml } from '@/lib/utils'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ title: 'About' })
}

const ABOUT_SECTIONS = ['intro', 'mission', 'team', 'history']

const DIRECTORY_SECTIONS: {
  section: string
  title: string
  href: string
  label: string
  icon: LucideIcon
}[] = [
  { section: 'advocates_description',          title: 'Advocates',           href: '/advocates',          label: 'Browse All Advocates',           icon: Scale   },
  { section: 'psychotherapists_description',  title: 'Psychotherapists',    href: '/psychotherapists',   label: 'Browse All Psychotherapists',    icon: Brain   },
  { section: 'referral_agencies_description', title: 'Referral Agencies',   href: '/referral-agencies',  label: 'Browse All Referral Agencies',   icon: Network },
  { section: 'black_mens_groups_description', title: "Black Men's Groups",  href: '/black-mens-groups',  label: "Browse All Black Men's Groups",  icon: Users   },
]

function DirectoryCard({ section, title, href, label, Icon, content }: {
  section: string
  title: string
  href: string
  label: string
  Icon: LucideIcon
  content: string
}) {
  return (
    <div className="flex flex-col gap-5 h-full rounded-2xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] p-6 hover:shadow-md hover:border-[var(--color-brand-teal-light)] dark:hover:border-[var(--color-brand-teal)] transition-all duration-300">
      <div className="w-11 h-11 rounded-xl bg-[var(--color-brand-teal)]/10 dark:bg-[var(--color-brand-teal)]/20 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-[var(--color-brand-teal)] dark:text-white" strokeWidth={1.5} />
      </div>
      <div className="flex flex-col flex-1 gap-3">
        <h3 className="font-display text-xl font-bold text-[var(--color-brand-teal)] dark:text-white">
          {title}
        </h3>
        <div
          className="tiptap-content text-[var(--color-text-muted)] text-sm flex-1"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
      <Link
        href={href}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--color-brand-teal)] hover:bg-[var(--color-brand-teal-dark)] text-white text-sm font-medium whitespace-nowrap transition-colors self-start"
      >
        {label} →
      </Link>
    </div>
  )
}

export default async function AboutPage() {
  const { data: sections } = await getPageContent('about')

  const directoryHeading = sections?.find((s) => s.section === 'directory_heading')?.content
  const directoryIntro   = sections?.find((s) => s.section === 'directory_intro')?.content

  const hasDirectoryContent = DIRECTORY_SECTIONS.some(
    ({ section }) => sections?.find((s) => s.section === section)?.content,
  )

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {ABOUT_SECTIONS.map(key => {
        const section = sections?.find(s => s.section === key)
        if (!section?.content) return null
        return (
          <FadeUp key={key}>
            <section>
              <div className="tiptap-content" dangerouslySetInnerHTML={{ __html: section.content }} />
            </section>
          </FadeUp>
        )
      })}

      {hasDirectoryContent && (
        <FadeUp>
          <div className="pt-4 border-t border-[var(--color-border)] dark:border-[var(--color-dark-border)] space-y-10">

            {/* Optional heading + intro above the cards */}
            {(directoryHeading || directoryIntro) && (
              <div className="space-y-3">
                {directoryHeading && (
                  <div
                    className="tiptap-content font-display text-3xl font-bold text-[var(--color-brand-teal)] dark:text-white"
                    dangerouslySetInnerHTML={{ __html: directoryHeading }}
                  />
                )}
                {directoryIntro && (
                  <div
                    className="tiptap-content text-[var(--color-text-muted)]"
                    dangerouslySetInnerHTML={{ __html: directoryIntro }}
                  />
                )}
              </div>
            )}

            {/* Directory cards — 2×2 grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {DIRECTORY_SECTIONS.map(({ section, title, href, label, icon: Icon }) => {
                const content = sections?.find((s) => s.section === section)?.content
                if (!content) return null
                return (
                  <DirectoryCard key={section} section={section} title={title} href={href} label={label} Icon={Icon} content={content} />
                )
              })}
            </div>
          </div>
        </FadeUp>
      )}
    </div>
  )
}
