import type { Metadata } from 'next'
import { getPageContent } from '@/actions/page-content'
import { buildMetadata } from '@/lib/metadata'
import { VALUES_LANGUAGES } from '@/types'
import ValuesLanguageTabs from '@/components/values/ValuesLanguageTabs'

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ title: 'Values' })
}

export default async function ValuesPage() {
  const { data: sections } = await getPageContent('values')

  const heroTitle    = sections?.find((s) => s.section === 'hero_title')?.content    ?? 'Our Values'
  const heroSubtitle = sections?.find((s) => s.section === 'hero_subtitle')?.content ?? ''

  const pillarsByLang: Record<string, string[]> = {}
  for (const { code } of VALUES_LANGUAGES) {
    const raw = sections?.find((s) => s.section === `pillars_${code}`)?.content
    try {
      pillarsByLang[code] = raw ? JSON.parse(raw) : []
    } catch {
      pillarsByLang[code] = []
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      <header className="space-y-3">
        <h1 className="font-display text-4xl font-bold text-[var(--color-brand-teal)] dark:text-white">
          {heroTitle}
        </h1>
        {heroSubtitle && (
          <p className="text-lg text-[var(--color-text-muted)] max-w-2xl">{heroSubtitle}</p>
        )}
      </header>

      <ValuesLanguageTabs pillarsByLang={pillarsByLang} />
    </div>
  )
}
