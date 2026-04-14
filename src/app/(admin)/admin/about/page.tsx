import { getPageContent } from '@/actions/page-content'
import PageSectionEditor from '@/components/admin/PageSectionEditor'

const ABOUT_SECTIONS = [
  { key: 'intro',   label: 'Introduction' },
  { key: 'mission', label: 'Mission Statement' },
  { key: 'team',    label: 'Our Team' },
  { key: 'history', label: 'Our History' },
]

export default async function AdminAboutPage() {
  const { data: sections } = await getPageContent('about')

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] dark:text-white">
          About Page Content
        </h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          Changes here update the live about page.
        </p>
      </div>

      {ABOUT_SECTIONS.map(({ key, label }) => {
        const s = sections?.find(sec => sec.section === key)
        return (
          <PageSectionEditor
            key={key}
            label={label}
            page="about"
            section={key}
            initialContent={s?.content ?? ''}
            updatedAt={s?.updated_at}
          />
        )
      })}
    </div>
  )
}
