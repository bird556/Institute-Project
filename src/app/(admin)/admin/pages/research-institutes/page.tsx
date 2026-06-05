import { getPageContent } from '@/actions/page-content'
import ResearchDescriptionsEditor from '@/components/admin/ResearchDescriptionsEditor'

export default async function ResearchInstitutesPageEditor() {
  const { data: sections } = await getPageContent('research')
  const descriptions = [
    {
      section:   'research_institutes_description',
      label:     'Research Institutes — Description',
      value:     sections?.find((s) => s.section === 'research_institutes_description')?.content ?? '',
      updatedAt: sections?.find((s) => s.section === 'research_institutes_description')?.updated_at,
    },
  ]
  return (
    <div className="max-w-2xl mx-auto space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] dark:text-white">Research Institutes Page</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">Edit the description shown on the Research Institutes card and listing page.</p>
      </div>
      <ResearchDescriptionsEditor initialDescriptions={descriptions} />
    </div>
  )
}
