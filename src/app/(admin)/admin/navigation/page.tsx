import { getSiteSettings } from '@/actions/settings'
import NavManagerClient from '@/components/admin/NavManagerClient'

export default async function AdminNavigationPage() {
  const { data: settings } = await getSiteSettings()

  return (
    <div className="max-w-2xl mx-auto space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] dark:text-white">
          Navigation
        </h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          Control which links appear in the public site menu and in what order.
          Order is reflected on the public header and footer nav column.
        </p>
      </div>
      <NavManagerClient initialNavConfig={settings?.nav_config ?? ''} />
    </div>
  )
}
