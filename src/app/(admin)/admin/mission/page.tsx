import { getPageContent } from '@/actions/page-content'
import PageSectionEditor from '@/components/admin/PageSectionEditor'

const MISSION_SECTIONS = [
  { key: 'statement', label: 'Mission Statement' },
  { key: 'values',    label: 'Our Values' },
  { key: 'approach',  label: 'Our Approach' },
]

export default async function AdminMissionPage() {
  const { data: sections } = await getPageContent('mission')

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] dark:text-white">
          Mission Page Content
        </h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          Changes here update the live mission page.
        </p>
      </div>

      {MISSION_SECTIONS.map(({ key, label }) => {
        const s = sections?.find(sec => sec.section === key)
        return (
          <PageSectionEditor
            key={key}
            label={label}
            page="mission"
            section={key}
            initialContent={s?.content ?? ''}
            updatedAt={s?.updated_at}
          />
        )
      })}
    </div>
  )
}
