'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { updateSiteSettings, toggleSectionVisibility } from '@/actions/settings'
import type { SiteSettings } from '@/types'

type FooterVisKey =
  | 'admin_name_visible' | 'admin_title_visible' | 'admin_email_visible'
  | 'contact_phone_visible' | 'address_visible' | 'upcoming_events_section_enabled'

const INPUT_CLASS =
  'w-full rounded-lg border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-background)] dark:bg-[var(--color-dark-background)] px-3 py-2 text-sm text-[var(--color-text-primary)] dark:text-[#e8ecec] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-teal)]'

export default function FooterSettingsClient({ initialSettings }: { initialSettings: SiteSettings | null }) {
  const s = initialSettings

  // ── Site Description ──────────────────────────────────────────────────────
  const [siteDescription, setSiteDescription] = useState(s?.site_description ?? '')
  const [savingDescription, setSavingDescription] = useState(false)

  async function handleSaveDescription() {
    setSavingDescription(true)
    const res = await updateSiteSettings({
      site_description: siteDescription.trim(),
    })
    setSavingDescription(false)
    if (res.success) toast.success('Site description updated')
    else toast.error(res.error ?? 'Failed to save')
  }

  // ── Footer Info ────────────────────────────────────────────────────────────
  const [adminName,     setAdminName]     = useState(s?.admin_name     ?? '')
  const [adminTitle,    setAdminTitle]    = useState(s?.admin_title    ?? '')
  const [adminEmail,    setAdminEmail]    = useState(s?.admin_email    ?? '')
  const [contactPhone,  setContactPhone]  = useState(s?.contact_phone  ?? '')
  const [address,       setAddress]       = useState(s?.address        ?? '')
  const [savingFooter,  setSavingFooter]  = useState(false)

  const [footerVis, setFooterVis] = useState<Record<FooterVisKey, boolean>>({
    admin_name_visible:              s?.admin_name_visible              !== 'false',
    admin_title_visible:             s?.admin_title_visible             !== 'false',
    admin_email_visible:             s?.admin_email_visible             !== 'false',
    contact_phone_visible:           s?.contact_phone_visible           !== 'false',
    address_visible:                 s?.address_visible                 !== 'false',
    upcoming_events_section_enabled: s?.upcoming_events_section_enabled !== 'false',
  })

  async function handleToggleVis(key: FooterVisKey, enabled: boolean) {
    setFooterVis(prev => ({ ...prev, [key]: enabled }))
    const res = await toggleSectionVisibility(key, enabled)
    if (!res.success) {
      setFooterVis(prev => ({ ...prev, [key]: !enabled }))
      toast.error(res.error ?? 'Failed to update')
    }
  }

  async function handleSaveFooter() {
    setSavingFooter(true)
    const res = await updateSiteSettings({
      admin_name:    adminName.trim(),
      admin_title:   adminTitle.trim(),
      admin_email:   adminEmail.trim(),
      contact_phone: contactPhone.trim(),
      address:       address.trim(),
    })
    setSavingFooter(false)
    if (res.success) toast.success('Footer information updated')
    else toast.error(res.error ?? 'Failed to update footer information')
  }

  // ── Social Media ───────────────────────────────────────────────────────────
  const [socialFacebook,  setSocialFacebook]  = useState(s?.social_facebook  ?? '')
  const [socialInstagram, setSocialInstagram] = useState(s?.social_instagram ?? '')
  const [socialTwitter,   setSocialTwitter]   = useState(s?.social_twitter   ?? '')
  const [socialLinkedin,  setSocialLinkedin]  = useState(s?.social_linkedin  ?? '')
  const [socialYoutube,   setSocialYoutube]   = useState(s?.social_youtube   ?? '')
  const [savingSocial,    setSavingSocial]    = useState(false)

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

  // ── Footer Labels ──────────────────────────────────────────────────────────
  const [footerNavHeading,     setFooterNavHeading]     = useState(s?.footer_nav_heading      ?? 'Navigate')
  const [footerContactHeading, setFooterContactHeading] = useState(s?.footer_contact_heading  ?? 'Contact')
  const [footerCopyright,      setFooterCopyright]      = useState(s?.footer_copyright_suffix ?? 'All rights reserved.')
  const [savingFooterMeta,     setSavingFooterMeta]     = useState(false)

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

  // ── Upcoming Events ────────────────────────────────────────────────────────
  const [upcomingHeading,  setUpcomingHeading]  = useState(s?.upcoming_events_heading   ?? 'Upcoming Events')
  const [upcomingMaxCount, setUpcomingMaxCount] = useState(s?.upcoming_events_max_count ?? '2')
  const [savingUpcoming,   setSavingUpcoming]   = useState(false)

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

  return (
    <div className="space-y-8">

      {/* ── Site Description ─────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-[var(--color-text-primary)] dark:text-white">Site Description</h2>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">A short tagline shown under the site name in the footer.</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="site-description">Description</Label>
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
          <Button onClick={handleSaveDescription} disabled={savingDescription} className="cursor-pointer">
            {savingDescription ? 'Saving…' : 'Save'}
          </Button>
        </div>
      </section>

      <hr className="border-[var(--color-border)] dark:border-[var(--color-dark-border)]" />

      {/* ── Footer Information ──────────────────────────────────────────────── */}
      <section className="space-y-6">
        <div>
          <h2 className="text-base font-semibold text-[var(--color-text-primary)] dark:text-white">Footer Information</h2>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">Contact details displayed in the public footer.</p>
        </div>

        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
            Administrator — toggle visibility to show or hide each field
          </p>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="admin-name">Name</Label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[var(--color-text-muted)]">Visible</span>
                <Switch checked={footerVis.admin_name_visible} onCheckedChange={v => handleToggleVis('admin_name_visible', v)} className="cursor-pointer" />
              </div>
            </div>
            <Input id="admin-name" value={adminName} onChange={e => setAdminName(e.target.value)} placeholder="e.g. Tamari of Kitossa" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="admin-title">Professional Title</Label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[var(--color-text-muted)]">Visible</span>
                <Switch checked={footerVis.admin_title_visible} onCheckedChange={v => handleToggleVis('admin_title_visible', v)} className="cursor-pointer" />
              </div>
            </div>
            <Input id="admin-title" value={adminTitle} onChange={e => setAdminTitle(e.target.value)} placeholder="e.g. Professor, Sociology — Brock University" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="admin-email">Email</Label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[var(--color-text-muted)]">Visible</span>
                <Switch checked={footerVis.admin_email_visible} onCheckedChange={v => handleToggleVis('admin_email_visible', v)} className="cursor-pointer" />
              </div>
            </div>
            <Input id="admin-email" type="email" value={adminEmail} onChange={e => setAdminEmail(e.target.value)} placeholder="e.g. name@university.ca" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="contact-phone">Phone</Label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[var(--color-text-muted)]">Visible</span>
                <Switch checked={footerVis.contact_phone_visible} onCheckedChange={v => handleToggleVis('contact_phone_visible', v)} className="cursor-pointer" />
              </div>
            </div>
            <Input id="contact-phone" type="tel" value={contactPhone} onChange={e => setContactPhone(e.target.value)} placeholder="+1 (416) 555-0100" />
            <p className="text-xs text-[var(--color-text-muted)]">Leave blank to hide from the footer.</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="address">Address</Label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[var(--color-text-muted)]">Visible</span>
                <Switch checked={footerVis.address_visible} onCheckedChange={v => handleToggleVis('address_visible', v)} className="cursor-pointer" />
              </div>
            </div>
            <Textarea id="address" rows={3} value={address} onChange={e => setAddress(e.target.value)} placeholder="123 Education Ave, Toronto, ON M5V 1A1" />
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

      {/* ── Social Media ────────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-[var(--color-text-primary)] dark:text-white">Social Media</h2>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">Links appear as icons in the footer. Leave blank to hide.</p>
        </div>
        <div className="space-y-3">
          {[
            { key: 'facebook',  label: 'Facebook',    val: socialFacebook,  set: setSocialFacebook },
            { key: 'instagram', label: 'Instagram',   val: socialInstagram, set: setSocialInstagram },
            { key: 'twitter',   label: 'Twitter / X', val: socialTwitter,   set: setSocialTwitter },
            { key: 'linkedin',  label: 'LinkedIn',    val: socialLinkedin,  set: setSocialLinkedin },
            { key: 'youtube',   label: 'YouTube',     val: socialYoutube,   set: setSocialYoutube },
          ].map(({ key, label, val, set }) => (
            <div key={key} className="space-y-1">
              <label className="text-sm font-medium text-[var(--color-text-primary)] dark:text-white">{label}</label>
              <input type="url" value={val} onChange={e => set(e.target.value)} placeholder="https://" className={INPUT_CLASS} />
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSaveSocial} disabled={savingSocial} className="cursor-pointer">
            {savingSocial ? 'Saving…' : 'Save Social Links'}
          </Button>
        </div>
      </section>

      <hr className="border-[var(--color-border)] dark:border-[var(--color-dark-border)]" />

      {/* ── Footer Labels ────────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-[var(--color-text-primary)] dark:text-white">Footer Labels</h2>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">Edit the column headings and copyright line in the footer.</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[var(--color-text-primary)] dark:text-white">Navigate Column Heading</label>
            <input type="text" value={footerNavHeading} onChange={e => setFooterNavHeading(e.target.value)} placeholder="Navigate" className={INPUT_CLASS} />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[var(--color-text-primary)] dark:text-white">Contact Column Heading</label>
            <input type="text" value={footerContactHeading} onChange={e => setFooterContactHeading(e.target.value)} placeholder="Contact" className={INPUT_CLASS} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-sm font-medium text-[var(--color-text-primary)] dark:text-white">Copyright Suffix</label>
            <input type="text" value={footerCopyright} onChange={e => setFooterCopyright(e.target.value)} placeholder="All rights reserved." className={INPUT_CLASS} />
            <p className="text-xs text-[var(--color-text-muted)]">Shown after © {new Date().getFullYear()} {'{Site Name}'}.</p>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSaveFooterMeta} disabled={savingFooterMeta} className="cursor-pointer">
            {savingFooterMeta ? 'Saving…' : 'Save Footer Labels'}
          </Button>
        </div>
      </section>

      <hr className="border-[var(--color-border)] dark:border-[var(--color-dark-border)]" />

      {/* ── Upcoming Events Section ──────────────────────────────────────────── */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-[var(--color-text-primary)] dark:text-white">Upcoming Events Section</h2>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">Controls the Upcoming Events block on the home page.</p>
        </div>
        <div className="flex items-center justify-between gap-4 rounded-lg border border-(--color-border) dark:border-dark-border px-4 py-3">
          <div>
            <p className="text-sm font-medium text-text-primary dark:text-white">Show Upcoming Events on Home</p>
            <p className="text-xs text-text-muted mt-0.5">When off, the section is hidden even if events exist</p>
          </div>
          <Switch
            checked={footerVis.upcoming_events_section_enabled}
            onCheckedChange={v => handleToggleVis('upcoming_events_section_enabled', v)}
            className="cursor-pointer shrink-0"
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[var(--color-text-primary)] dark:text-white">Section Heading</label>
            <input type="text" value={upcomingHeading} onChange={e => setUpcomingHeading(e.target.value)} placeholder="Upcoming Events" className={INPUT_CLASS} />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[var(--color-text-primary)] dark:text-white">Events to Show</label>
            <select value={upcomingMaxCount} onChange={e => setUpcomingMaxCount(e.target.value)} className={INPUT_CLASS + ' cursor-pointer'}>
              <option value="2">2 events</option>
              <option value="4">4 events</option>
              <option value="6">6 events</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSaveUpcoming} disabled={savingUpcoming} className="cursor-pointer">
            {savingUpcoming ? 'Saving…' : 'Save'}
          </Button>
        </div>
      </section>

    </div>
  )
}
