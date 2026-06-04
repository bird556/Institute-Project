import { getSiteSettings } from '@/actions/settings'
import FooterSettingsClient from '@/components/admin/FooterSettingsClient'

export default async function AdminFooterPage() {
  const { data: settings } = await getSiteSettings()

  return (
    <div className="max-w-2xl mx-auto space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] dark:text-white">
          Footer
        </h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          Manage everything that appears in the public footer.
        </p>
      </div>
      <FooterSettingsClient initialSettings={settings ?? null} />
    </div>
  )
}
