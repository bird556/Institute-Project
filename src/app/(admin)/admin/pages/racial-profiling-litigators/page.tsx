import { getPageContent } from '@/actions/page-content'
import PageHeroEditor from '@/components/admin/PageHeroEditor'

export default async function RacialProfilingLitigatorsPageEditor() {
  const { data: sections } = await getPageContent('racial-profiling-litigators')
  const title    = sections?.find((s) => s.section === 'hero_title')
  const subtitle = sections?.find((s) => s.section === 'hero_subtitle')
  const align    = sections?.find((s) => s.section === 'hero_title_align')?.content === 'left' ? 'left' : 'center'
  return (
    <div className="max-w-2xl mx-auto space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] dark:text-white">Racial Profiling Litigator Database Page</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">Edit the heading and subtitle shown at the top of the public National Racial Profiling Litigator Database page.</p>
      </div>
      <PageHeroEditor page="racial-profiling-litigators" multilineTitle initialTitleAlign={align} initialTitle={title?.content ?? ''} initialSubtitle={subtitle?.content ?? ''} titleUpdatedAt={title?.updated_at} subtitleUpdatedAt={subtitle?.updated_at} />
    </div>
  )
}
