import { getPageContent } from '@/actions/page-content'

const MISSION_SECTIONS = ['statement', 'values', 'approach']

export default async function MissionPage() {
  const { data: sections } = await getPageContent('mission')

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {MISSION_SECTIONS.map(key => {
        const section = sections?.find(s => s.section === key)
        if (!section?.content) return null
        return (
          <section key={key}>
            <div
              className="tiptap-content"
              dangerouslySetInnerHTML={{ __html: section.content }}
            />
          </section>
        )
      })}
    </div>
  )
}
