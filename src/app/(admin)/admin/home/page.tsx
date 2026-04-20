import { getPageContent } from '@/actions/page-content'
import { getSiteSettings } from '@/actions/settings'
import PageSectionEditor from '@/components/admin/PageSectionEditor'
import HomeHeroImagePanels from '@/components/admin/HomeHeroImagePanels'
import GoalEditor from './GoalEditor'
import ImpactEditor from './ImpactEditor'
import MissionEditor from './MissionEditor'
import type { GoalSectionContent, ImpactSectionContent, MissionSectionContent } from '@/types'

const HOME_SECTIONS = [
  { key: 'hero',  label: 'Hero Section' },
  { key: 'intro', label: 'Introduction Section' },
  { key: 'cta',   label: 'Call to Action Section' },
]

function parseSection<T>(content: string | undefined, fallback: T): T {
  if (!content) return fallback
  try { return JSON.parse(content) as T } catch { return fallback }
}

const GOAL_FALLBACK: GoalSectionContent = {
  label: 'Our Goal', title: 'Thriving With Purpose', description: '',
  pillars: [
    { num: '01', label: 'Engagement', desc: '' },
    { num: '02', label: 'Knowledge',  desc: '' },
    { num: '03', label: 'Research',   desc: '' },
  ],
}

const IMPACT_FALLBACK: ImpactSectionContent = {
  label: 'The Challenge', title: 'Addressing Hidden Crises', description: '', items: [],
}

const MISSION_FALLBACK: MissionSectionContent = {
  label: 'What We Do', title: 'Remembering Creative Power', description: '',
  pillars: [
    { icon_name: 'Heart',    title: 'Advocacy',      desc: '' },
    { icon_name: 'BookOpen', title: 'Education',     desc: '' },
    { icon_name: 'Shield',   title: 'Research',      desc: '' },
    { icon_name: 'Users',    title: 'Psychotherapy', desc: '' },
  ],
}

export default async function AdminHomePage() {
  const [{ data: sections }, { data: settings }] = await Promise.all([
    getPageContent('home'),
    getSiteSettings(),
  ])

  const goalContent    = sections?.find(s => s.section === 'goal_section')?.content
  const impactContent  = sections?.find(s => s.section === 'impact_section')?.content
  const missionContent = sections?.find(s => s.section === 'mission_section')?.content

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

      <GoalEditor initialData={parseSection(goalContent, GOAL_FALLBACK)} />
      <ImpactEditor initialData={parseSection(impactContent, IMPACT_FALLBACK)} />
      <MissionEditor initialData={parseSection(missionContent, MISSION_FALLBACK)} />
    </div>
  )
}
