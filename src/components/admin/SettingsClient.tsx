'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import ImageUpload from '@/components/shared/ImageUpload'
import { Switch } from '@/components/ui/switch'
import NavManagerClient from './NavManagerClient'
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

const EMPTY: SiteSettings = {
  site_name: '',
  site_description: '',
  logo_path: '',
  contact_email: '',
  contact_phone: '',
  address: '',
  admin_name: '',
  admin_title: '',
  admin_email: '',
  admin_name_visible: 'true',
  admin_title_visible: 'true',
  admin_email_visible: 'true',
  contact_phone_visible: 'true',
  address_visible: 'true',
  about_enabled: 'true',
  mission_enabled: 'true',
  blogs_enabled: 'true',
  events_enabled: 'true',
  reading_list_enabled: 'true',
  partners_enabled: 'true',
  newsletter_enabled: 'true',
  health_wellness_enabled: 'true',
  research_enabled: 'true',
  advocates_enabled: 'true',
  psychotherapists_enabled: 'true',
  referral_agencies_enabled: 'true',
  goal_section_enabled: 'true',
  impact_section_enabled: 'true',
  mission_section_enabled: 'true',
  logo_visible: 'true',
  home_hero_image_path: '',
  home_hero_bg_path: '',
  intro_section_enabled: 'true',
  cta_section_enabled:   'true',
  wellness_section_enabled: 'true',
  wellness_section_blurb: '',
  wellness_featured_mode: 'latest',
  wellness_featured_ids: '[]',
  nav_config: '',
  book_of_the_month_id: '',
  kustawi_blurb: '',
  non_affiliated_blurb: '',
  social_facebook: '',
  social_instagram: '',
  social_twitter: '',
  social_linkedin: '',
  social_youtube: '',
  footer_copyright_suffix: 'All rights reserved.',
  footer_nav_heading: 'Navigate',
  footer_contact_heading: 'Contact',
  upcoming_events_section_enabled: 'true',
  upcoming_events_max_count: '2',
  upcoming_events_heading: 'Upcoming Events',
}

export default function SettingsClient({ initialSettings, initialLogoUrl }: SettingsClientProps) {
  const settings = initialSettings ?? EMPTY

  // ── Logo ────────────────────────────────────────────────────────────────────
  const [logoPath, setLogoPath] = useState(settings.logo_path)
  const [logoUrl, setLogoUrl] = useState<string | undefined>(initialLogoUrl)

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

  // ── Site Name + Description ─────────────────────────────────────────────────
  const [siteName, setSiteName] = useState(settings.site_name)
  const [siteDescription, setSiteDescription] = useState(settings.site_description)
  const [savingSiteName, setSavingSiteName] = useState(false)

  async function handleSaveSiteName() {
    if (!siteName.trim()) {
      toast.error('Site name cannot be empty')
      return
    }
    setSavingSiteName(true)
    const res = await updateSiteSettings({
      site_name: siteName.trim(),
      site_description: siteDescription.trim(),
    })
    setSavingSiteName(false)
    if (res.success) {
      toast.success('Site name updated')
    } else {
      toast.error(res.error ?? 'Failed to update site name')
    }
  }

  // ── Footer Info ─────────────────────────────────────────────────────────────
  const [adminName, setAdminName] = useState(settings.admin_name)
  const [adminTitle, setAdminTitle] = useState(settings.admin_title)
  const [adminEmail, setAdminEmail] = useState(settings.admin_email)
  const [contactPhone, setContactPhone] = useState(settings.contact_phone)
  const [address, setAddress] = useState(settings.address)
  const [savingFooter, setSavingFooter] = useState(false)

  async function handleSaveFooter() {
    setSavingFooter(true)
    const res = await updateSiteSettings({
      admin_name: adminName.trim(),
      admin_title: adminTitle.trim(),
      admin_email: adminEmail.trim(),
      contact_phone: contactPhone.trim(),
      address: address.trim(),
    })
    setSavingFooter(false)
    if (res.success) {
      toast.success('Footer information updated')
    } else {
      toast.error(res.error ?? 'Failed to update footer information')
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
    research_enabled:            settings.research_enabled            !== 'false',
    advocates_enabled:           settings.advocates_enabled           !== 'false',
    psychotherapists_enabled:    settings.psychotherapists_enabled    !== 'false',
    referral_agencies_enabled:   settings.referral_agencies_enabled   !== 'false',
    intro_section_enabled:   settings.intro_section_enabled   !== 'false',
    cta_section_enabled:     settings.cta_section_enabled     !== 'false',
    goal_section_enabled:    settings.goal_section_enabled    !== 'false',
    impact_section_enabled:  settings.impact_section_enabled  !== 'false',
    mission_section_enabled:  settings.mission_section_enabled  !== 'false',
    wellness_section_enabled:          settings.wellness_section_enabled          !== 'false',
    upcoming_events_section_enabled:   settings.upcoming_events_section_enabled   !== 'false',
    logo_visible:             settings.logo_visible             !== 'false',
    admin_name_visible:      settings.admin_name_visible      !== 'false',
    admin_title_visible:     settings.admin_title_visible     !== 'false',
    admin_email_visible:     settings.admin_email_visible     !== 'false',
    contact_phone_visible:   settings.contact_phone_visible   !== 'false',
    address_visible:         settings.address_visible         !== 'false',
  })

  async function handleToggleVisibility(key: keyof typeof visibility, enabled: boolean) {
    setVisibility(prev => ({ ...prev, [key]: enabled }))
    const res = await toggleSectionVisibility(key, enabled)
    if (!res.success) {
      setVisibility(prev => ({ ...prev, [key]: !enabled }))
      toast.error(res.error ?? 'Failed to update visibility')
    }
  }

  // ── Export Data ─────────────────────────────────────────────────────────────
  const [exporting, setExporting] = useState(false)

  async function handleExport() {
    setExporting(true)
    try {
      const res = await fetch('/api/export')
      if (!res.ok) throw new Error()
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `institute-export-${new Date().toISOString().slice(0, 10)}.zip`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      toast.error('Export failed. Please try again.')
    } finally {
      setExporting(false)
    }
  }

  // ── Social Media ─────────────────────────────────────────────────────────────
  const [socialFacebook,  setSocialFacebook]  = useState(settings.social_facebook  ?? '')
  const [socialInstagram, setSocialInstagram] = useState(settings.social_instagram ?? '')
  const [socialTwitter,   setSocialTwitter]   = useState(settings.social_twitter   ?? '')
  const [socialLinkedin,  setSocialLinkedin]  = useState(settings.social_linkedin  ?? '')
  const [socialYoutube,   setSocialYoutube]   = useState(settings.social_youtube   ?? '')
  const [savingSocial, setSavingSocial] = useState(false)

  async function handleSaveSocial() {
    setSavingSocial(true)
    const res = await updateSiteSettings({
      social_facebook:  socialFacebook.trim(),
      social_instagram: socialInstagram.trim(),
      social_twitter:   socialTwitter.trim(),
      social_linkedin:  socialLinkedin.trim(),
      social_youtube:   socialYoutube.trim(),
    })
    setSavingSocial(false)
    if (res.success) toast.success('Social links updated')
    else toast.error(res.error ?? 'Failed to save')
  }

  // ── Footer Headings & Copyright ───────────────────────────────────────────────
  const [footerNavHeading,     setFooterNavHeading]     = useState(settings.footer_nav_heading     ?? 'Navigate')
  const [footerContactHeading, setFooterContactHeading] = useState(settings.footer_contact_heading ?? 'Contact')
  const [footerCopyright,      setFooterCopyright]      = useState(settings.footer_copyright_suffix ?? 'All rights reserved.')
  const [savingFooterMeta, setSavingFooterMeta] = useState(false)

  async function handleSaveFooterMeta() {
    setSavingFooterMeta(true)
    const res = await updateSiteSettings({
      footer_nav_heading:      footerNavHeading.trim(),
      footer_contact_heading:  footerContactHeading.trim(),
      footer_copyright_suffix: footerCopyright.trim(),
    })
    setSavingFooterMeta(false)
    if (res.success) toast.success('Footer settings updated')
    else toast.error(res.error ?? 'Failed to save')
  }

  // ── Upcoming Events Section ───────────────────────────────────────────────────
  const [upcomingHeading,  setUpcomingHeading]  = useState(settings.upcoming_events_heading  ?? 'Upcoming Events')
  const [upcomingMaxCount, setUpcomingMaxCount] = useState(settings.upcoming_events_max_count ?? '2')
  const [savingUpcoming, setSavingUpcoming] = useState(false)

  async function handleSaveUpcoming() {
    setSavingUpcoming(true)
    const res = await updateSiteSettings({
      upcoming_events_heading:   upcomingHeading.trim(),
      upcoming_events_max_count: upcomingMaxCount,
    })
    setSavingUpcoming(false)
    if (res.success) toast.success('Upcoming events settings updated')
    else toast.error(res.error ?? 'Failed to save')
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
          <>
            <div className="flex items-center justify-between gap-4 rounded-lg border border-(--color-border) dark:border-dark-border px-4 py-3">
              <div>
                <p className="text-sm font-medium text-text-primary dark:text-white">Show logo on public site</p>
                <p className="text-xs text-text-muted mt-0.5">When off, only the site name appears in the navbar.</p>
              </div>
              <Switch
                checked={visibility.logo_visible}
                onCheckedChange={(checked) => handleToggleVisibility('logo_visible', checked)}
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

      {/* ── Section 3: Footer Information ────────────────────────────────── */}
      <section className="space-y-6">
        <div>
          <h2 className="text-base font-semibold text-[var(--color-text-primary)] dark:text-white">
            Footer Information
          </h2>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
            All content displayed in the public footer.
          </p>
        </div>

        {/* Administrator sub-group */}
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
            Administrator — toggle visibility to show or hide each field
          </p>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="admin-name">Name</Label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[var(--color-text-muted)]">Visible</span>
                <Switch
                  checked={visibility.admin_name_visible}
                  onCheckedChange={(checked) => handleToggleVisibility('admin_name_visible', checked)}
                  className="cursor-pointer"
                />
              </div>
            </div>
            <Input
              id="admin-name"
              value={adminName}
              onChange={e => setAdminName(e.target.value)}
              placeholder="e.g. Tamari of Kitossa"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="admin-title">Professional Title</Label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[var(--color-text-muted)]">Visible</span>
                <Switch
                  checked={visibility.admin_title_visible}
                  onCheckedChange={(checked) => handleToggleVisibility('admin_title_visible', checked)}
                  className="cursor-pointer"
                />
              </div>
            </div>
            <Input
              id="admin-title"
              value={adminTitle}
              onChange={e => setAdminTitle(e.target.value)}
              placeholder="e.g. Professor, Sociology — Brock University"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="admin-email">Email</Label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[var(--color-text-muted)]">Visible</span>
                <Switch
                  checked={visibility.admin_email_visible}
                  onCheckedChange={(checked) => handleToggleVisibility('admin_email_visible', checked)}
                  className="cursor-pointer"
                />
              </div>
            </div>
            <Input
              id="admin-email"
              type="email"
              value={adminEmail}
              onChange={e => setAdminEmail(e.target.value)}
              placeholder="e.g. name@university.ca"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="contact-phone">Phone</Label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[var(--color-text-muted)]">Visible</span>
                <Switch
                  checked={visibility.contact_phone_visible}
                  onCheckedChange={(checked) => handleToggleVisibility('contact_phone_visible', checked)}
                  className="cursor-pointer"
                />
              </div>
            </div>
            <Input
              id="contact-phone"
              type="tel"
              value={contactPhone}
              onChange={e => setContactPhone(e.target.value)}
              placeholder="+1 (416) 555-0100"
            />
            <p className="text-xs text-[var(--color-text-muted)]">Leave blank to hide from the footer.</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="address">Address</Label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[var(--color-text-muted)]">Visible</span>
                <Switch
                  checked={visibility.address_visible}
                  onCheckedChange={(checked) => handleToggleVisibility('address_visible', checked)}
                  className="cursor-pointer"
                />
              </div>
            </div>
            <Textarea
              id="address"
              rows={3}
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="123 Education Ave, Toronto, ON M5V 1A1"
            />
            <p className="text-xs text-[var(--color-text-muted)]">Leave blank to hide from the footer.</p>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSaveFooter} disabled={savingFooter} className="cursor-pointer">
              {savingFooter ? 'Saving…' : 'Save'}
            </Button>
          </div>
        </div>
      </section>

      <hr className="border-[var(--color-border)] dark:border-[var(--color-dark-border)]" />

      {/* ── Section 4: Change Password ───────────────────────────────────── */}
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

      {/* ── Section 5: Export Data ───────────────────────────────────── */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-[var(--color-text-primary)] dark:text-white">
            Export Data
          </h2>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
            Download a complete backup of all your site content and media as a ZIP archive.
            Includes all posts, events, partners, reading list, wellness, research, directory entries,
            newsletter, page content, settings, and all uploaded images and documents.
          </p>
        </div>

        <Button
          onClick={handleExport}
          disabled={exporting}
          className="cursor-pointer"
        >
          {exporting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Preparing export…
            </>
          ) : (
            'Download Export'
          )}
        </Button>
      </section>

      <hr className="border-[var(--color-border)] dark:border-[var(--color-dark-border)]" />

      {/* ── Section 6: Navigation ────────────────────────────────────── */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-[var(--color-text-primary)] dark:text-white">
            Navigation
          </h2>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
            Control which links appear in the public site menu and in what order.
          </p>
        </div>
        <NavManagerClient initialNavConfig={settings.nav_config} />
      </section>

      <hr className="border-[var(--color-border)] dark:border-[var(--color-dark-border)]" />

      {/* ── Section 7: Page Visibility ────────────────────────────────── */}
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
            { key: 'about_enabled',            label: 'About',              description: 'When hidden, /about redirects to home' },
            { key: 'advocates_enabled',        label: 'Advocates',          description: 'When hidden, /advocates and all profile pages redirect to home' },
            { key: 'psychotherapists_enabled', label: 'Psychotherapists',   description: 'When hidden, /psychotherapists and all profile pages redirect to home' },
            { key: 'referral_agencies_enabled', label: 'Referral Agencies', description: 'When hidden, /referral-agencies and all profile pages redirect to home' },
            { key: 'blogs_enabled',            label: 'Blog',               description: 'When hidden, /blogs and all blog posts redirect to home' },
            { key: 'events_enabled',           label: 'Events',             description: 'When hidden, /events and all event pages redirect to home' },
            { key: 'reading_list_enabled',     label: 'Reading List',       description: 'When hidden, /reading-list and all items redirect to home' },
            { key: 'partners_enabled',         label: 'Partners',           description: 'When hidden, /partners redirects to home' },
            { key: 'newsletter_enabled',       label: 'Newsletter',         description: 'When hidden, /newsletter and all edition pages redirect to home' },
            { key: 'health_wellness_enabled',  label: 'Health & Wellness',  description: 'When hidden, /health-wellness and all posts redirect to home' },
            { key: 'research_enabled',         label: 'Research',           description: 'When hidden, /research and all research posts redirect to home' },
            { key: 'intro_section_enabled',   label: 'Home — Introduction',  description: 'Show/hide the Introduction section on the home page' },
            { key: 'goal_section_enabled',    label: 'Home — Our Goal',      description: 'Show/hide the Our Goal section on the home page' },
            { key: 'impact_section_enabled',  label: 'Home — The Challenge', description: 'Show/hide the Addressing Hidden Crises section on the home page' },
            { key: 'mission_section_enabled', label: 'Home — What We Do',    description: 'Show/hide the Remembering Creative Power section on the home page' },
            { key: 'cta_section_enabled',     label: 'Home — Call to Action',description: 'Show/hide the Call to Action section on the home page' },
            { key: 'wellness_section_enabled', label: 'Home — Health & Wellness', description: 'Show/hide the Health & Wellness featured section on the home page' },
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

      <hr className="border-[var(--color-border)] dark:border-[var(--color-dark-border)]" />

      {/* ── Section 8: Social Media ───────────────────────────────────── */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-[var(--color-text-primary)] dark:text-white">
            Social Media
          </h2>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
            Links appear as icons in the footer. Leave blank to hide.
          </p>
        </div>
        <div className="space-y-3">
          {([
            { key: 'facebook',  label: 'Facebook',     val: socialFacebook,  set: setSocialFacebook },
            { key: 'instagram', label: 'Instagram',    val: socialInstagram, set: setSocialInstagram },
            { key: 'twitter',   label: 'Twitter / X',  val: socialTwitter,   set: setSocialTwitter },
            { key: 'linkedin',  label: 'LinkedIn',     val: socialLinkedin,  set: setSocialLinkedin },
            { key: 'youtube',   label: 'YouTube',      val: socialYoutube,   set: setSocialYoutube },
          ] as const).map(({ key, label, val, set }) => (
            <div key={key} className="space-y-1">
              <label className="text-sm font-medium text-[var(--color-text-primary)] dark:text-white">{label}</label>
              <input
                type="url"
                value={val}
                onChange={(e) => set(e.target.value)}
                placeholder="https://"
                className="w-full rounded-lg border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-background)] dark:bg-[var(--color-dark-background)] px-3 py-2 text-sm text-[var(--color-text-primary)] dark:text-[#e8ecec] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-teal)]"
              />
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleSaveSocial}
            disabled={savingSocial}
            className="px-4 py-2 rounded-lg bg-[var(--color-brand-teal)] text-white text-sm font-medium hover:bg-[var(--color-brand-teal-dark)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {savingSocial ? 'Saving…' : 'Save Social Links'}
          </button>
        </div>
      </section>

      <hr className="border-[var(--color-border)] dark:border-[var(--color-dark-border)]" />

      {/* ── Section 9: Footer Settings ───────────────────────────────────── */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-[var(--color-text-primary)] dark:text-white">
            Footer Labels
          </h2>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
            Edit the column headings and copyright line in the footer.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[var(--color-text-primary)] dark:text-white">Navigate Column Heading</label>
            <input
              type="text"
              value={footerNavHeading}
              onChange={(e) => setFooterNavHeading(e.target.value)}
              placeholder="Navigate"
              className="w-full rounded-lg border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-background)] dark:bg-[var(--color-dark-background)] px-3 py-2 text-sm text-[var(--color-text-primary)] dark:text-[#e8ecec] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-teal)]"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[var(--color-text-primary)] dark:text-white">Contact Column Heading</label>
            <input
              type="text"
              value={footerContactHeading}
              onChange={(e) => setFooterContactHeading(e.target.value)}
              placeholder="Contact"
              className="w-full rounded-lg border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-background)] dark:bg-[var(--color-dark-background)] px-3 py-2 text-sm text-[var(--color-text-primary)] dark:text-[#e8ecec] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-teal)]"
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-sm font-medium text-[var(--color-text-primary)] dark:text-white">Copyright Suffix</label>
            <input
              type="text"
              value={footerCopyright}
              onChange={(e) => setFooterCopyright(e.target.value)}
              placeholder="All rights reserved."
              className="w-full rounded-lg border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-background)] dark:bg-[var(--color-dark-background)] px-3 py-2 text-sm text-[var(--color-text-primary)] dark:text-[#e8ecec] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-teal)]"
            />
            <p className="text-xs text-[var(--color-text-muted)]">Shown after © {new Date().getFullYear()} {'{Site Name}'}.</p>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleSaveFooterMeta}
            disabled={savingFooterMeta}
            className="px-4 py-2 rounded-lg bg-[var(--color-brand-teal)] text-white text-sm font-medium hover:bg-[var(--color-brand-teal-dark)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {savingFooterMeta ? 'Saving…' : 'Save Footer Labels'}
          </button>
        </div>
      </section>

      <hr className="border-[var(--color-border)] dark:border-[var(--color-dark-border)]" />

      {/* ── Section 10: Upcoming Events ───────────────────────────────────── */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-[var(--color-text-primary)] dark:text-white">
            Upcoming Events Section
          </h2>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
            Controls the Upcoming Events block on the home page.
          </p>
        </div>
        <div className="flex items-center justify-between gap-4 rounded-lg border border-(--color-border) dark:border-dark-border px-4 py-3">
          <div>
            <p className="text-sm font-medium text-text-primary dark:text-white">Show Upcoming Events on Home</p>
            <p className="text-xs text-text-muted mt-0.5">When off, the section is hidden even if events exist</p>
          </div>
          <Switch
            checked={visibility.upcoming_events_section_enabled ?? true}
            onCheckedChange={(checked) => handleToggleVisibility('upcoming_events_section_enabled' as keyof typeof visibility, checked)}
            className="cursor-pointer shrink-0"
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[var(--color-text-primary)] dark:text-white">Section Heading</label>
            <input
              type="text"
              value={upcomingHeading}
              onChange={(e) => setUpcomingHeading(e.target.value)}
              placeholder="Upcoming Events"
              className="w-full rounded-lg border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-background)] dark:bg-[var(--color-dark-background)] px-3 py-2 text-sm text-[var(--color-text-primary)] dark:text-[#e8ecec] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-teal)]"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[var(--color-text-primary)] dark:text-white">Events to Show</label>
            <select
              value={upcomingMaxCount}
              onChange={(e) => setUpcomingMaxCount(e.target.value)}
              className="w-full rounded-lg border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-background)] dark:bg-[var(--color-dark-background)] px-3 py-2 text-sm text-[var(--color-text-primary)] dark:text-[#e8ecec] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-teal)] cursor-pointer"
            >
              <option value="2">2 events</option>
              <option value="4">4 events</option>
              <option value="6">6 events</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleSaveUpcoming}
            disabled={savingUpcoming}
            className="px-4 py-2 rounded-lg bg-[var(--color-brand-teal)] text-white text-sm font-medium hover:bg-[var(--color-brand-teal-dark)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {savingUpcoming ? 'Saving…' : 'Save'}
          </button>
        </div>
      </section>

    </div>
  )
}
