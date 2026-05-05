import type { Metadata } from 'next'
import { getPageContent } from '@/actions/page-content'
import { buildMetadata } from '@/lib/metadata'
import { FadeUp } from '@/components/shared/FadeUp'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ title: 'About' })
}

const ABOUT_SECTIONS = ['intro', 'mission', 'team', 'history']

export default async function AboutPage() {
  const { data: sections } = await getPageContent('about')

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {ABOUT_SECTIONS.map(key => {
        const section = sections?.find(s => s.section === key)
        if (!section?.content) return null
        return (
          <FadeUp key={key}>
            <section>
              <div
                className="tiptap-content"
                dangerouslySetInnerHTML={{ __html: section.content }}
              />
            </section>
          </FadeUp>
        )
      })}
    </div>
  )
}
