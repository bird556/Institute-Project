'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  updateSiteSetting,
  updateSiteSettings,
  toggleSectionVisibility,
} from '@/actions/settings'
import type { SiteSettings } from '@/types'

interface Props {
  initialSettings: SiteSettings | null
  subscriberCount: number | null
  listName: string
  listUrl: string
  configured: boolean
}

export default function NewsletterSettingsClient({
  initialSettings: s,
  subscriberCount,
  listName,
  listUrl,
  configured,
}: Props) {
  const [popupEnabled,        setPopupEnabled]        = useState(s?.klaviyo_popup_enabled === 'true')
  const [companyId,           setCompanyId]           = useState(s?.klaviyo_company_id ?? '')
  const [savingCompanyId,     setSavingCompanyId]     = useState(false)

  const [signupEnabled,       setSignupEnabled]       = useState(s?.signup_section_enabled !== 'false')
  const [heading,             setHeading]             = useState(s?.newsletter_heading         ?? 'Stay Connected')
  const [subtext,             setSubtext]             = useState(s?.newsletter_subtext         ?? 'Join our community and be the first to hear about events, publications, and resources from the Kustawi Institute.')
  const [successMessage,      setSuccessMessage]      = useState(s?.newsletter_success_message ?? "Thank you! You're now subscribed.")
  const [consentText,         setConsentText]         = useState(s?.newsletter_consent_text    ?? 'By subscribing you agree to receive email communications from the Kustawi Institute. Unsubscribe at any time.')

  const [savingCopy,          setSavingCopy]          = useState(false)
  const [savingSuccessMsg,    setSavingSuccessMsg]     = useState(false)
  const [savingConsentText,   setSavingConsentText]    = useState(false)

  async function handleTogglePopup(enabled: boolean) {
    setPopupEnabled(enabled)
    const res = await toggleSectionVisibility('klaviyo_popup_enabled', enabled)
    if (!res.success) {
      setPopupEnabled(!enabled)
      toast.error(res.error ?? 'Failed to update')
    }
  }

  async function handleSaveCompanyId() {
    setSavingCompanyId(true)
    const res = await updateSiteSetting('klaviyo_company_id', companyId.trim())
    setSavingCompanyId(false)
    if (res.success) toast.success('Company ID updated')
    else toast.error(res.error ?? 'Failed to save')
  }

  async function handleToggleSignup(enabled: boolean) {
    setSignupEnabled(enabled)
    const res = await toggleSectionVisibility('signup_section_enabled', enabled)
    if (!res.success) {
      setSignupEnabled(!enabled)
      toast.error(res.error ?? 'Failed to update visibility')
    }
  }

  async function handleSaveCopy() {
    if (!heading.trim()) { toast.error('Heading cannot be empty'); return }
    setSavingCopy(true)
    const res = await updateSiteSettings({
      newsletter_heading: heading.trim(),
      newsletter_subtext: subtext.trim(),
    })
    setSavingCopy(false)
    if (res.success) toast.success('Section copy updated')
    else toast.error(res.error ?? 'Failed to save')
  }

  async function handleSaveSuccessMessage() {
    if (!successMessage.trim()) { toast.error('Success message cannot be empty'); return }
    setSavingSuccessMsg(true)
    const res = await updateSiteSetting('newsletter_success_message', successMessage.trim())
    setSavingSuccessMsg(false)
    if (res.success) toast.success('Success message updated')
    else toast.error(res.error ?? 'Failed to save')
  }

  async function handleSaveConsentText() {
    if (!consentText.trim()) { toast.error('Consent text cannot be empty'); return }
    setSavingConsentText(true)
    const res = await updateSiteSetting('newsletter_consent_text', consentText.trim())
    setSavingConsentText(false)
    if (res.success) toast.success('Consent text updated')
    else toast.error(res.error ?? 'Failed to save')
  }

  return (
    <div className="space-y-8">

      {/* ── Klaviyo Status Card ───────────────────────────────────────────── */}
      <section className="rounded-xl border border-(--color-border) dark:border-dark-border bg-surface dark:bg-dark-surface p-6 space-y-4">
        <h2 className="text-base font-semibold text-text-primary dark:text-white">
          Klaviyo Connection
        </h2>

        {!configured ? (
          <p className="text-sm text-text-muted">
            Add <code className="font-mono text-xs bg-surface-hover dark:bg-dark-surface-hover px-1.5 py-0.5 rounded">KLAVIYO_PRIVATE_API_KEY</code> and{' '}
            <code className="font-mono text-xs bg-surface-hover dark:bg-dark-surface-hover px-1.5 py-0.5 rounded">KLAVIYO_LIST_ID</code> to your environment variables to enable the signup form.
          </p>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-text-primary dark:text-white">{listName}</p>
              <p className="text-xs text-text-muted">
                {subscriberCount !== null
                  ? `${subscriberCount.toLocaleString()} subscriber${subscriberCount === 1 ? '' : 's'}`
                  : 'Subscriber count unavailable'}
              </p>
            </div>
            <a
              href={listUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-brand-teal)] hover:underline"
            >
              View list in Klaviyo
              <ExternalLink size={14} />
            </a>
          </div>
        )}
      </section>

      <hr className="border-(--color-border) dark:border-dark-border" />

      {/* ── Popup Form (Klaviyo) ─────────────────────────────────────────── */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-text-primary dark:text-white">Popup Form (Klaviyo)</h2>
          <p className="text-sm text-text-muted mt-0.5">
            Surfaces the Sign-Up Form popup you designed inside Klaviyo&apos;s own dashboard. Its design, timing, and targeting are all controlled there — this just turns the connection on or off.
          </p>
        </div>

        <div className="flex items-center justify-between gap-4 rounded-lg border border-(--color-border) dark:border-dark-border px-4 py-3">
          <div>
            <p className="text-sm font-medium text-text-primary dark:text-white">Show the Klaviyo popup on the site</p>
            <p className="text-xs text-text-muted mt-0.5">When off, the popup script is not loaded anywhere on the public site.</p>
          </div>
          <Switch
            checked={popupEnabled}
            onCheckedChange={handleTogglePopup}
            className="cursor-pointer shrink-0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="klaviyo-company-id">Company ID</Label>
          <Input
            id="klaviyo-company-id"
            value={companyId}
            onChange={e => setCompanyId(e.target.value)}
            placeholder="e.g. YxT5RY"
          />
          <p className="text-xs text-text-muted">
            Find this under Klaviyo → Account → Settings → API Keys → Public API Key (Company ID).
          </p>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSaveCompanyId} disabled={savingCompanyId} className="cursor-pointer">
            {savingCompanyId ? 'Saving…' : 'Save'}
          </Button>
        </div>
      </section>

      <hr className="border-(--color-border) dark:border-dark-border" />

      {/* ── Visibility ───────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-text-primary dark:text-white">Visibility</h2>
          <p className="text-sm text-text-muted mt-0.5">Show or hide the signup section on the home page.</p>
        </div>

        <div className="flex items-center justify-between gap-4 rounded-lg border border-(--color-border) dark:border-dark-border px-4 py-3">
          <div>
            <p className="text-sm font-medium text-text-primary dark:text-white">Show signup section</p>
            <p className="text-xs text-text-muted mt-0.5">When off, the signup band is hidden from the public site.</p>
          </div>
          <Switch
            checked={signupEnabled}
            onCheckedChange={handleToggleSignup}
            className="cursor-pointer shrink-0"
          />
        </div>
      </section>

      <hr className="border-(--color-border) dark:border-dark-border" />

      {/* ── Section Copy ─────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-text-primary dark:text-white">Section Copy</h2>
          <p className="text-sm text-text-muted mt-0.5">The heading and supporting text shown in the signup band.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="newsletter-heading">Heading</Label>
          <Input
            id="newsletter-heading"
            value={heading}
            onChange={e => setHeading(e.target.value)}
            maxLength={100}
            placeholder="Stay Connected"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="newsletter-subtext">Subtext</Label>
          <Textarea
            id="newsletter-subtext"
            rows={2}
            value={subtext}
            onChange={e => setSubtext(e.target.value)}
            maxLength={300}
            placeholder="Join our community and be the first to hear about events..."
          />
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSaveCopy} disabled={savingCopy} className="cursor-pointer">
            {savingCopy ? 'Saving…' : 'Save'}
          </Button>
        </div>
      </section>

      <hr className="border-(--color-border) dark:border-dark-border" />

      {/* ── Success Message ───────────────────────────────────────────────── */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-text-primary dark:text-white">Success Message</h2>
          <p className="text-sm text-text-muted mt-0.5">Shown after a visitor successfully subscribes.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="success-message">Message</Label>
          <Input
            id="success-message"
            value={successMessage}
            onChange={e => setSuccessMessage(e.target.value)}
            maxLength={200}
            placeholder="Thank you! You're now subscribed."
          />
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSaveSuccessMessage} disabled={savingSuccessMsg} className="cursor-pointer">
            {savingSuccessMsg ? 'Saving…' : 'Save'}
          </Button>
        </div>
      </section>

      <hr className="border-(--color-border) dark:border-dark-border" />

      {/* ── Consent Text ─────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-text-primary dark:text-white">Consent Text</h2>
          <p className="text-sm text-text-muted mt-0.5">Small print shown below the subscribe button (required for CASL compliance).</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="consent-text">Text</Label>
          <Textarea
            id="consent-text"
            rows={2}
            value={consentText}
            onChange={e => setConsentText(e.target.value)}
            maxLength={300}
            placeholder="By subscribing you agree to receive email communications from the Kustawi Institute. Unsubscribe at any time."
          />
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSaveConsentText} disabled={savingConsentText} className="cursor-pointer">
            {savingConsentText ? 'Saving…' : 'Save'}
          </Button>
        </div>
      </section>

    </div>
  )
}
