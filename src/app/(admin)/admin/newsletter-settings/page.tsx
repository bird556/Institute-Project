import { getSiteSettings } from '@/actions/settings'
import { getKlaviyoListStats } from '@/actions/klaviyo'
import NewsletterSettingsClient from '@/components/admin/NewsletterSettingsClient'

export default async function NewsletterSettingsPage() {
  const [{ data: settings }, stats] = await Promise.all([
    getSiteSettings(),
    getKlaviyoListStats(),
  ])

  return (
    <div className="max-w-2xl mx-auto space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] dark:text-white">
          Newsletter Signup
        </h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          Manage the email signup section on the home page and its Klaviyo connection.
        </p>
      </div>

      <NewsletterSettingsClient
        initialSettings={settings ?? null}
        subscriberCount={stats.profileCount ?? null}
        listName={stats.name ?? ''}
        listUrl={stats.listUrl ?? ''}
        configured={stats.success}
      />
    </div>
  )
}
