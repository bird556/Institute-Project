import { getPageContent } from '@/actions/page-content'
import { getSiteSettings } from '@/actions/settings'
import PageSectionEditor from '@/components/admin/PageSectionEditor'
import HomeHeroImagePanels from '@/components/admin/HomeHeroImagePanels'

const HOME_SECTIONS = [
  { key: 'hero',  label: 'Hero Section' },
  { key: 'intro', label: 'Introduction Section' },
  { key: 'cta',   label: 'Call to Action Section' },
]

export default async function AdminHomePage() {
  const [{ data: sections }, { data: settings }] = await Promise.all([
    getPageContent('home'),
    getSiteSettings(),
  ])

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

      <div>
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)] dark:text-white mb-1">
          Hero Images
        </h2>
        <p className="text-sm text-[var(--color-text-muted)] mb-4">
          Optionally add a side image and background to the home hero section.
        </p>
        <HomeHeroImagePanels
          initialHeroImageUrl={settings?.home_hero_image_path ? undefined : undefined}
          initialBgImageUrl={settings?.home_hero_bg_path ? undefined : undefined}
        />
      </div>
    </div>
  )
}
