import { getSiteSettings } from '@/actions/settings'
import SettingsClient from '@/components/admin/SettingsClient'

export default async function AdminSettingsPage() {
  const { data: settings } = await getSiteSettings()

  return (
    <div className="max-w-2xl mx-auto space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] dark:text-white">
          Settings
        </h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          Manage your site identity, contact details, and account security.
        </p>
      </div>

      <SettingsClient initialSettings={settings ?? null} />
    </div>
  )
}
