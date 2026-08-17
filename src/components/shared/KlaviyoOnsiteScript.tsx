import { getSiteSettings } from '@/actions/settings'
import { KlaviyoPopupLoader } from '@/components/shared/KlaviyoPopupLoader'

export async function KlaviyoOnsiteScript() {
  const { data: settings } = await getSiteSettings()
  const enabled = settings?.klaviyo_popup_enabled === 'true'
  const companyId = settings?.klaviyo_company_id?.trim()
  if (!enabled || !companyId) return null

  return (
    <KlaviyoPopupLoader
      companyId={companyId}
      heading={settings?.newsletter_heading || 'Stay Connected'}
      successMessage={settings?.newsletter_success_message || "Thank you! You're now subscribed."}
      consentText={settings?.newsletter_consent_text || 'By subscribing you agree to receive email communications from the Kustawi Institute. Unsubscribe at any time.'}
    />
  )
}
