import { getPageContent } from '@/actions/page-content'
import PageHeroEditor from '@/components/admin/PageHeroEditor'
import ValuesPillarsEditor from '@/components/admin/ValuesPillarsEditor'
import { VALUES_LANGUAGES } from '@/types'

export default async function ValuesPageEditor() {
  const { data: sections } = await getPageContent('values')
  const title    = sections?.find((s) => s.section === 'hero_title')
  const subtitle = sections?.find((s) => s.section === 'hero_subtitle')

  const initialPillars: Record<string, string[]> = {}
  for (const { code } of VALUES_LANGUAGES) {
    const raw = sections?.find((s) => s.section === `pillars_${code}`)?.content
    try {
      initialPillars[code] = raw ? JSON.parse(raw) : []
    } catch {
      initialPillars[code] = []
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] dark:text-white">Values Page</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">Edit the heading, intro, and per-language pillar text shown on the public Values page.</p>
      </div>
      <PageHeroEditor
        page="values"
        initialTitle={title?.content ?? ''}
        initialSubtitle={subtitle?.content ?? ''}
        titleUpdatedAt={title?.updated_at}
        subtitleUpdatedAt={subtitle?.updated_at}
      />
      <ValuesPillarsEditor initialPillars={initialPillars} />
    </div>
  )
}
