import { getSiteSettings } from '@/actions/settings'
import AccessSettingsClient from '@/components/admin/AccessSettingsClient'

export default async function AdminAccessPage() {
  const { data: settings } = await getSiteSettings()

  return (
    <div className="max-w-2xl mx-auto space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] dark:text-white">
          Site Access
        </h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          Restrict the entire public site behind a single shared password.
        </p>
      </div>
      <AccessSettingsClient initialSettings={settings ?? null} />
    </div>
  )
}
