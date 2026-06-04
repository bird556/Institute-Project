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
  initialLogoUrl?: string
}

export default function SettingsClient({ initialSettings, initialLogoUrl }: SettingsClientProps) {
  const s = initialSettings

  // ── Logo ────────────────────────────────────────────────────────────────────
  const [logoPath, setLogoPath] = useState(s?.logo_path ?? '')
  const [logoUrl,  setLogoUrl]  = useState<string | undefined>(initialLogoUrl)
  const [logoVisible, setLogoVisible] = useState(s?.logo_visible !== 'false')

  function handleLogoUpload(url: string, path: string) {
    setLogoUrl(url)
    setLogoPath(path)
    updateSiteSetting('logo_path', path).then(res => {
      if (res.success) toast.success('Logo updated — changes are live on your site')
      else toast.error(res.error ?? 'Failed to save logo')
    })
  }

  function handleLogoRemove() {
    setLogoUrl(undefined)
    setLogoPath('')
    updateSiteSetting('logo_path', '').then(res => {
      if (!res.success) toast.error(res.error ?? 'Failed to remove logo')
    })
  }

  async function handleToggleLogoVisible(enabled: boolean) {
    setLogoVisible(enabled)
    const res = await toggleSectionVisibility('logo_visible', enabled)
    if (!res.success) {
      setLogoVisible(!enabled)
      toast.error(res.error ?? 'Failed to update visibility')
    }
  }

  // ── Site Name + Description ─────────────────────────────────────────────────
  const [siteName,        setSiteName]        = useState(s?.site_name        ?? '')
  const [siteDescription, setSiteDescription] = useState(s?.site_description ?? '')
  const [savingSiteName,  setSavingSiteName]  = useState(false)

  async function handleSaveSiteName() {
    if (!siteName.trim()) {
      toast.error('Site name cannot be empty')
      return
    }
    setSavingSiteName(true)
    const res = await updateSiteSettings({
      site_name:        siteName.trim(),
      site_description: siteDescription.trim(),
    })
    setSavingSiteName(false)
    if (res.success) toast.success('Site name updated')
    else toast.error(res.error ?? 'Failed to update site name')
  }

  // ── Change Password ─────────────────────────────────────────────────────────
  const [newPassword,     setNewPassword]     = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [savingPassword,  setSavingPassword]  = useState(false)

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
          <>
            <div className="flex items-center justify-between gap-4 rounded-lg border border-(--color-border) dark:border-dark-border px-4 py-3">
              <div>
                <p className="text-sm font-medium text-text-primary dark:text-white">Show logo on public site</p>
                <p className="text-xs text-text-muted mt-0.5">When off, only the site name appears in the navbar.</p>
              </div>
              <Switch
                checked={logoVisible}
                onCheckedChange={handleToggleLogoVisible}
                className="cursor-pointer shrink-0"
              />
            </div>
            <p className="text-xs text-[var(--color-text-muted)]">
              Saved path: <span className="font-mono">{logoPath}</span>
            </p>
          </>
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

        <div className="space-y-2">
          <Label htmlFor="site-description">Footer Description</Label>
          <Textarea
            id="site-description"
            rows={2}
            value={siteDescription}
            onChange={e => setSiteDescription(e.target.value)}
            placeholder="A short tagline shown under the site name in the footer."
            maxLength={200}
          />
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSaveSiteName} disabled={savingSiteName} className="cursor-pointer">
            {savingSiteName ? 'Saving…' : 'Save'}
          </Button>
        </div>
      </section>

      <hr className="border-[var(--color-border)] dark:border-[var(--color-dark-border)]" />

      {/* ── Section 3: Change Password ───────────────────────────────────── */}
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
              <p className="text-xs text-[var(--color-text-muted)]">Use at least 8 characters.</p>
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
              <p className="text-xs text-red-500 dark:text-red-400">Passwords do not match.</p>
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
