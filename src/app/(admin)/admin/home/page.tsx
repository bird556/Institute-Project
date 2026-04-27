import { getPageContent } from '@/actions/page-content'
import { getSiteSettings } from '@/actions/settings'
import PageSectionEditor from '@/components/admin/PageSectionEditor'
import HomeHeroImagePanels from '@/components/admin/HomeHeroImagePanels'
import GoalEditor from './GoalEditor'
import ImpactEditor from './ImpactEditor'
import MissionEditor from './MissionEditor'
import type { GoalSectionContent, ImpactSectionContent, MissionSectionContent } from '@/types'

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

  const s = (key: string) => sections?.find(sec => sec.section === key)

  const goalContent    = s('goal_section')?.content
  const impactContent  = s('impact_section')?.content
  const missionContent = s('mission_section')?.content

  // Visibility flags — default to enabled if key not yet in DB
  const vis = {
    intro:   settings?.intro_section_enabled   !== 'false',
    cta:     settings?.cta_section_enabled     !== 'false',
    goal:    settings?.goal_section_enabled    !== 'false',
    impact:  settings?.impact_section_enabled  !== 'false',
    mission: settings?.mission_section_enabled !== 'false',
  }

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

      {/* 1. Hero Section */}
      <PageSectionEditor
        label="Hero Section"
        page="home"
        section="hero"
        initialContent={s('hero')?.content ?? ''}
        updatedAt={s('hero')?.updated_at}
      />

      {/* 2. Hero Images — right after hero */}
      <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-background)] dark:bg-[var(--color-dark-background)] p-6 space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
          Hero Images
        </h2>
        <p className="text-sm text-[var(--color-text-muted)]">
          Optionally add a side image and background to the home hero section.
        </p>
        <HomeHeroImagePanels
          initialHeroImageUrl={undefined}
          initialBgImageUrl={undefined}
        />
      </div>

      {/* 3. Introduction Section */}
      <PageSectionEditor
        label="Introduction Section"
        page="home"
        section="intro"
        initialContent={s('intro')?.content ?? ''}
        updatedAt={s('intro')?.updated_at}
        visibilityKey="intro_section_enabled"
        initialVisible={vis.intro}
      />

      {/* 4. Our Goal Section */}
      <GoalEditor
        initialData={parseSection(goalContent, GOAL_FALLBACK)}
        visibilityKey="goal_section_enabled"
        initialVisible={vis.goal}
      />

      {/* 5. The Challenge Section */}
      <ImpactEditor
        initialData={parseSection(impactContent, IMPACT_FALLBACK)}
        visibilityKey="impact_section_enabled"
        initialVisible={vis.impact}
      />

      {/* 6. What We Do Section */}
      <MissionEditor
        initialData={parseSection(missionContent, MISSION_FALLBACK)}
        visibilityKey="mission_section_enabled"
        initialVisible={vis.mission}
      />

      {/* 7. Call to Action Section */}
      <PageSectionEditor
        label="Call to Action Section"
        page="home"
        section="cta"
        initialContent={s('cta')?.content ?? ''}
        updatedAt={s('cta')?.updated_at}
        visibilityKey="cta_section_enabled"
        initialVisible={vis.cta}
      />
    </div>
  )
}
