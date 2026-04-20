'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import ImageUpload from '@/components/shared/ImageUpload'
import { Switch } from '@/components/ui/switch'
import {
  updateSiteSetting,
  updateSiteSettings,
  changeAdminPassword,
  toggleSectionVisibility,
} from '@/actions/settings'
import type { SiteSettings } from '@/types'

interface SettingsClientProps {
  initialSettings: SiteSettings | null
}

const EMPTY: SiteSettings = {
  site_name: '',
  logo_path: '',
  contact_email: '',
  contact_phone: '',
  address: '',
  about_enabled: 'true',
  mission_enabled: 'true',
  blogs_enabled: 'true',
  events_enabled: 'true',
  reading_list_enabled: 'true',
  partners_enabled: 'true',
  newsletter_enabled: 'true',
  health_wellness_enabled: 'true',
  goal_section_enabled: 'true',
  impact_section_enabled: 'true',
  mission_section_enabled: 'true',
  home_hero_image_path: '',
  home_hero_bg_path: '',
}

export default function SettingsClient({ initialSettings }: SettingsClientProps) {
  const settings = initialSettings ?? EMPTY

  // ── Logo ────────────────────────────────────────────────────────────────────
  const [logoPath, setLogoPath] = useState(settings.logo_path)
  const [logoUrl, setLogoUrl] = useState<string | undefined>(
    settings.logo_path ? undefined : undefined,
    // TODO: reconstruct from Supabase Storage:
    // supabase.storage.from('institute-media').getPublicUrl(settings.logo_path).data.publicUrl
  )

  function handleLogoUpload(url: string, path: string) {
    setLogoUrl(url)
    setLogoPath(path)
    updateSiteSetting('logo_path', path).then(res => {
      if (res.success) {
        toast.success('Logo updated — changes are live on your site')
      } else {
        toast.error(res.error ?? 'Failed to save logo')
      }
    })
  }

  function handleLogoRemove() {
    setLogoUrl(undefined)
    setLogoPath('')
    updateSiteSetting('logo_path', '').then(res => {
      if (!res.success) toast.error(res.error ?? 'Failed to remove logo')
    })
  }

  // ── Site Name ───────────────────────────────────────────────────────────────
  const [siteName, setSiteName] = useState(settings.site_name)
  const [savingSiteName, setSavingSiteName] = useState(false)

  async function handleSaveSiteName() {
    if (!siteName.trim()) {
      toast.error('Site name cannot be empty')
      return
    }
    setSavingSiteName(true)
    const res = await updateSiteSetting('site_name', siteName.trim())
    setSavingSiteName(false)
    if (res.success) {
      toast.success('Site name updated')
    } else {
      toast.error(res.error ?? 'Failed to update site name')
    }
  }

  // ── Contact Info ────────────────────────────────────────────────────────────
  const [contactEmail, setContactEmail] = useState(settings.contact_email)
  const [contactPhone, setContactPhone] = useState(settings.contact_phone)
  const [address, setAddress] = useState(settings.address)
  const [savingContact, setSavingContact] = useState(false)

  async function handleSaveContact() {
    const emailTrimmed = contactEmail.trim()
    if (emailTrimmed && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
      toast.error('Please enter a valid email address')
      return
    }
    setSavingContact(true)
    const res = await updateSiteSettings({
      contact_email: emailTrimmed,
      contact_phone: contactPhone.trim(),
      address: address.trim(),
    })
    setSavingContact(false)
    if (res.success) {
      toast.success('Contact information updated')
    } else {
      toast.error(res.error ?? 'Failed to update contact information')
    }
  }

  // ── Page Visibility ─────────────────────────────────────────────────────────
  const [visibility, setVisibility] = useState({
    about_enabled:           settings.about_enabled           !== 'false',
    mission_enabled:         settings.mission_enabled         !== 'false',
    blogs_enabled:           settings.blogs_enabled           !== 'false',
    events_enabled:          settings.events_enabled          !== 'false',
    reading_list_enabled:    settings.reading_list_enabled    !== 'false',
    partners_enabled:        settings.partners_enabled        !== 'false',
    newsletter_enabled:      settings.newsletter_enabled      !== 'false',
    health_wellness_enabled: settings.health_wellness_enabled !== 'false',
    goal_section_enabled:    settings.goal_section_enabled    !== 'false',
    impact_section_enabled:  settings.impact_section_enabled  !== 'false',
    mission_section_enabled: settings.mission_section_enabled !== 'false',
  })

  async function handleToggleVisibility(key: keyof typeof visibility, enabled: boolean) {
    setVisibility(prev => ({ ...prev, [key]: enabled }))
    const res = await toggleSectionVisibility(key, enabled)
    if (!res.success) {
      setVisibility(prev => ({ ...prev, [key]: !enabled }))
      toast.error(res.error ?? 'Failed to update visibility')
    }
  }

  // ── Change Password ─────────────────────────────────────────────────────────
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [savingPassword, setSavingPassword] = useState(false)

  async function handleChangePassword() {
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }
    setSavingPassword(true)
    const res = await changeAdminPassword('', newPassword)
    setSavingPassword(false)
    if (res.success) {
      toast.success('Password updated successfully')
      setNewPassword('')
      setConfirmPassword('')
    } else {
      toast.error(res.error ?? 'Failed to update password')
    }
  }

  return (
    <div className="space-y-8">

      {/* ── Section 1: Brand Logo ─────────────────────────────────────────── */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-[var(--color-text-primary)] dark:text-white">
            Brand Logo
          </h2>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
            Displayed in the public site header. Accepts PNG, SVG, WebP, JPEG — max 5 MB.
          </p>
        </div>

        <div className="max-w-xs">
          <ImageUpload
            currentUrl={logoUrl}
            folder="logos"
            onUpload={handleLogoUpload}
            onRemove={handleLogoRemove}
            label={logoPath ? 'Current logo' : 'No logo set'}
            accept="image/png"
          />
        </div>

        {logoPath && (
          <p className="text-xs text-[var(--color-text-muted)]">
            Saved path: <span className="font-mono">{logoPath}</span>
          </p>
        )}
      </section>

      <hr className="border-[var(--color-border)] dark:border-[var(--color-dark-border)]" />

      {/* ── Section 2: Site Name ──────────────────────────────────────────── */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-[var(--color-text-primary)] dark:text-white">
            Site Name
          </h2>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
            Used in page titles, the footer, and email templates.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="site-name">Name</Label>
          <Input
            id="site-name"
            value={siteName}
            onChange={e => setSiteName(e.target.value)}
            maxLength={100}
            placeholder="e.g. The Institute"
          />
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSaveSiteName} disabled={savingSiteName} className="cursor-pointer">
            {savingSiteName ? 'Saving…' : 'Save'}
          </Button>
        </div>
      </section>

      <hr className="border-[var(--color-border)] dark:border-[var(--color-dark-border)]" />

      {/* ── Section 3: Contact Information ───────────────────────────────── */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-[var(--color-text-primary)] dark:text-white">
            Contact Information
          </h2>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
            Displayed in the public footer. Leave any field blank to hide it from the site.
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="contact-email">Email</Label>
            <Input
              id="contact-email"
              type="email"
              value={contactEmail}
              onChange={e => setContactEmail(e.target.value)}
              placeholder="info@institute.ca"
            />
            <p className="text-xs text-[var(--color-text-muted)]">
              Leave blank to hide from the footer.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-phone">Phone</Label>
            <Input
              id="contact-phone"
              type="tel"
              value={contactPhone}
              onChange={e => setContactPhone(e.target.value)}
              placeholder="+1 (416) 555-0100"
            />
            <p className="text-xs text-[var(--color-text-muted)]">
              Leave blank to hide from the footer.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              rows={3}
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="123 Education Ave, Toronto, ON M5V 1A1"
            />
            <p className="text-xs text-[var(--color-text-muted)]">
              Leave blank to hide from the footer.
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSaveContact} disabled={savingContact} className="cursor-pointer">
            {savingContact ? 'Saving…' : 'Save'}
          </Button>
        </div>
      </section>

      <hr className="border-[var(--color-border)] dark:border-[var(--color-dark-border)]" />

      {/* ── Section 4: Change Password ────────────────────────────────────── */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-[var(--color-text-primary)] dark:text-white">
            Change Password
          </h2>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
            Update your admin account password. Minimum 8 characters.
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-password">New password</Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              autoComplete="new-password"
            />
            {newPassword.length > 0 && newPassword.length < 8 && (
              <p className="text-xs text-[var(--color-text-muted)]">
                Use at least 8 characters.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm new password</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />
            {confirmPassword.length > 0 && newPassword !== confirmPassword && (
              <p className="text-xs text-red-500 dark:text-red-400">
                Passwords do not match.
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={handleChangePassword}
            disabled={savingPassword || !newPassword || !confirmPassword}
            className="cursor-pointer"
          >
            {savingPassword ? 'Updating…' : 'Update Password'}
          </Button>
        </div>
      </section>

      <hr className="border-[var(--color-border)] dark:border-[var(--color-dark-border)]" />

      {/* ── Section 5: Page Visibility ────────────────────────────────── */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-[var(--color-text-primary)] dark:text-white">
            Page Visibility
          </h2>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
            Hide sections from the public site. Content is still manageable in the admin while hidden.
          </p>
        </div>

        <div className="space-y-3">
          {([
            { key: 'about_enabled',        label: 'About',        description: 'When hidden, /about redirects to home' },
            { key: 'mission_enabled',      label: 'Mission',      description: 'When hidden, /mission redirects to home' },
            { key: 'blogs_enabled',        label: 'Blog',         description: 'When hidden, /blogs and all blog posts redirect to home' },
            { key: 'events_enabled',       label: 'Events',       description: 'When hidden, /events and all event pages redirect to home' },
            { key: 'reading_list_enabled', label: 'Reading List', description: 'When hidden, /reading-list and all items redirect to home' },
            { key: 'partners_enabled',     label: 'Partners',     description: 'When hidden, /partners redirects to home' },
            { key: 'newsletter_enabled',      label: 'Newsletter',       description: 'When hidden, /newsletter and all edition pages redirect to home' },
            { key: 'health_wellness_enabled', label: 'Health & Wellness', description: 'When hidden, /health-wellness and all posts redirect to home' },
            { key: 'goal_section_enabled',    label: 'Home — Our Goal',      description: 'Show/hide the Our Goal section on the home page' },
            { key: 'impact_section_enabled',  label: 'Home — The Challenge', description: 'Show/hide the Addressing Hidden Crises section on the home page' },
            { key: 'mission_section_enabled', label: 'Home — What We Do',    description: 'Show/hide the Remembering Creative Power section on the home page' },
          ] as const).map(({ key, label, description }) => (
            <div key={key} className="flex items-center justify-between gap-4 rounded-lg border border-(--color-border) dark:border-dark-border px-4 py-3">
              <div>
                <p className="text-sm font-medium text-text-primary dark:text-white">{label}</p>
                <p className="text-xs text-text-muted mt-0.5">{description}</p>
              </div>
              <Switch
                checked={visibility[key]}
                onCheckedChange={(checked) => handleToggleVisibility(key, checked)}
                className="cursor-pointer shrink-0"
              />
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
