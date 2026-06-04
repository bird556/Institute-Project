import { getPageContent } from '@/actions/page-content'
import { getSiteSettings } from '@/actions/settings'
import PageHeroEditor from '@/components/admin/PageHeroEditor'
import EventBlurbEditor from './NonAffiliatedBlurbEditor'

export default async function EventsPageHeroEditor() {
  const [{ data: sections }, { data: settings }] = await Promise.all([
    getPageContent('events'),
    getSiteSettings(),
  ])

  const title    = sections?.find((s) => s.section === 'hero_title')
  const subtitle = sections?.find((s) => s.section === 'hero_subtitle')

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] dark:text-white">
          Events Page
        </h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          Edit the heading, subtitle, and section blurbs shown on the public Events page.
        </p>
      </div>
      <PageHeroEditor
        page="events"
        initialTitle={title?.content ?? ''}
        initialSubtitle={subtitle?.content ?? ''}
        titleUpdatedAt={title?.updated_at}
        subtitleUpdatedAt={subtitle?.updated_at}
      />
      <EventBlurbEditor
        settingKey="kustawi_blurb"
        label="Kustawi Events Blurb"
        description='Shown in italics below the filter pills when "Kustawi Events" is selected. Leave empty to hide.'
        initialBlurb={settings?.kustawi_blurb ?? ''}
      />
      <EventBlurbEditor
        settingKey="non_affiliated_blurb"
        label="Other Events Blurb"
        description='Shown in italics below the filter pills when "Other Events" is selected. Leave empty to hide.'
        initialBlurb={settings?.non_affiliated_blurb ?? ''}
      />
    </div>
  )
}
