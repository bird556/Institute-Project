'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import ImageUpload from '@/components/shared/ImageUpload'
import {
  updateSiteSetting,
  updateSiteSettings,
  changeAdminPassword,
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

    </div>
  )
}
