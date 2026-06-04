import { getSiteSettings } from '@/actions/settings'
import VisibilitySettingsClient from '@/components/admin/VisibilitySettingsClient'

export default async function AdminVisibilityPage() {
  const { data: settings } = await getSiteSettings()

  return (
    <div className="max-w-2xl mx-auto space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] dark:text-white">
          Visibility
        </h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          Hide pages or home sections from the public site. Content remains manageable in the admin while hidden.
        </p>
      </div>
      <VisibilitySettingsClient initialSettings={settings ?? null} />
    </div>
  )
}
