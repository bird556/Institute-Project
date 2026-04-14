import { getPageContent } from '@/actions/page-content'
import PageSectionEditor from '@/components/admin/PageSectionEditor'

const HOME_SECTIONS = [
  { key: 'hero',  label: 'Hero Section' },
  { key: 'intro', label: 'Introduction Section' },
  { key: 'cta',   label: 'Call to Action Section' },
]

export default async function AdminHomePage() {
  const { data: sections } = await getPageContent('home')

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] dark:text-white">
          Home Page Content
        </h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          Changes here update the live home page.
        </p>
      </div>

      {HOME_SECTIONS.map(({ key, label }) => {
        const s = sections?.find(sec => sec.section === key)
        return (
          <PageSectionEditor
            key={key}
            label={label}
            page="home"
            section={key}
            initialContent={s?.content ?? ''}
            updatedAt={s?.updated_at}
          />
        )
      })}
    </div>
  )
}
