import { getPageContent } from '@/actions/page-content'
import PageSectionEditor from '@/components/admin/PageSectionEditor'

const ABOUT_SECTIONS = [
  { key: 'intro', label: 'About Us' },
]

const DIRECTORY_INTRO_SECTIONS = [
  { key: 'directory_heading', label: 'Services Section — Heading' },
  { key: 'directory_intro',   label: 'Services Section — Description' },
]

const DIRECTORY_SECTIONS = [
  { key: 'advocates_description',          label: 'Advocates — Card Description' },
  { key: 'psychotherapists_description',  label: 'Psychotherapists — Card Description' },
  { key: 'referral_agencies_description', label: 'Referral Agencies — Card Description' },
  { key: 'black_mens_groups_description', label: "Black Men's Groups — Card Description" },
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
          <PageSectionEditor key={key} label={label} page="about" section={key}
            initialContent={s?.content ?? ''} updatedAt={s?.updated_at} />
        )
      })}

      <div className="pt-6 border-t border-[var(--color-border)] dark:border-[var(--color-dark-border)] space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)] dark:text-white">
            Services Section
          </h2>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            Optional heading and description shown above the Advocates, Psychotherapists, and Referral Agencies cards on the About page. Leave blank to hide.
          </p>
        </div>
        {DIRECTORY_INTRO_SECTIONS.map(({ key, label }) => {
          const s = sections?.find(sec => sec.section === key)
          return (
            <PageSectionEditor key={key} label={label} page="about" section={key}
              initialContent={s?.content ?? ''} updatedAt={s?.updated_at} />
          )
        })}
      </div>

      <div className="pt-6 border-t border-[var(--color-border)] dark:border-[var(--color-dark-border)] space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)] dark:text-white">
            Services Cards
          </h2>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            Description text shown inside each service card on the About page. Leave blank to hide that card.
          </p>
        </div>
        {DIRECTORY_SECTIONS.map(({ key, label }) => {
          const s = sections?.find(sec => sec.section === key)
          return (
            <PageSectionEditor key={key} label={label} page="about" section={key}
              initialContent={s?.content ?? ''} updatedAt={s?.updated_at} />
          )
        })}
      </div>
    </div>
  )
}
