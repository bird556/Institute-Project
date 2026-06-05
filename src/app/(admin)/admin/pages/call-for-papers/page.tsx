import { getPageContent } from '@/actions/page-content'
import ResearchDescriptionsEditor from '@/components/admin/ResearchDescriptionsEditor'

export default async function CallForPapersPageEditor() {
  const { data: sections } = await getPageContent('research')
  const descriptions = [
    {
      section:   'call_for_papers_description',
      label:     'Call for Papers — Description',
      value:     sections?.find((s) => s.section === 'call_for_papers_description')?.content ?? '',
      updatedAt: sections?.find((s) => s.section === 'call_for_papers_description')?.updated_at,
    },
  ]
  return (
    <div className="max-w-2xl mx-auto space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] dark:text-white">Call for Papers Page</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">Edit the description shown on the Call for Papers card and listing page.</p>
      </div>
      <ResearchDescriptionsEditor initialDescriptions={descriptions} />
    </div>
  )
}
