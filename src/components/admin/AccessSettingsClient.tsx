'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { updateSiteSetting, toggleSectionVisibility } from '@/actions/settings'
import type { SiteSettings } from '@/types'

export default function AccessSettingsClient({ initialSettings: s }: { initialSettings: SiteSettings | null }) {
  const [enabled, setEnabled] = useState(s?.site_gate_enabled === 'true')
  const [password, setPassword] = useState(s?.site_gate_password ?? 'Brock University')
  const [saving, setSaving] = useState(false)

  async function handleToggle(checked: boolean) {
    setEnabled(checked)
    const res = await toggleSectionVisibility('site_gate_enabled', checked)
    if (!res.success) {
      setEnabled(!checked)
      toast.error(res.error ?? 'Failed to update')
    }
  }

  async function handleSavePassword() {
    if (!password.trim()) { toast.error('Password cannot be empty'); return }
    setSaving(true)
    const res = await updateSiteSetting('site_gate_password', password.trim())
    setSaving(false)
    if (res.success) toast.success('Password updated')
    else toast.error(res.error ?? 'Failed to save')
  }

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4 rounded-lg border border-(--color-border) dark:border-dark-border px-4 py-3">
          <div>
            <p className="text-sm font-medium text-text-primary dark:text-white">Restrict the site to a shared password</p>
            <p className="text-xs text-text-muted mt-0.5">
              When on, every visitor must enter the password below before browsing the public site. Your admin login is never affected.
            </p>
          </div>
          <Switch
            checked={enabled}
            onCheckedChange={handleToggle}
            className="cursor-pointer shrink-0"
          />
        </div>
      </section>

      <hr className="border-(--color-border) dark:border-dark-border" />

      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-text-primary dark:text-white">Password</h2>
          <p className="text-sm text-text-muted mt-0.5">
            Changing this immediately signs out everyone currently using the old password — they&apos;ll need the new one to get back in.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="gate-password">Password</Label>
          <Input
            id="gate-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Brock University"
          />
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSavePassword} disabled={saving} className="cursor-pointer">
            {saving ? 'Saving…' : 'Save'}
          </Button>
        </div>
      </section>
    </div>
  )
}
