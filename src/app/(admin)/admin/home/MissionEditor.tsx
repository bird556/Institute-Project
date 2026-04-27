'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Heart, BookOpen, Shield, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { updatePageSection } from '@/actions/page-content'
import SectionVisibilityToggle from '@/components/admin/SectionVisibilityToggle'
import type { MissionSectionContent, MissionPillar } from '@/types'

const ICON_MAP = {
  Heart,
  BookOpen,
  Shield,
  Users,
} satisfies Record<MissionPillar['icon_name'], React.ElementType>

interface MissionEditorProps {
  initialData: MissionSectionContent
  visibilityKey?: string
  initialVisible?: boolean
}

export default function MissionEditor({ initialData, visibilityKey, initialVisible = true }: MissionEditorProps) {
  const [data, setData] = useState<MissionSectionContent>(initialData)
  const [saved, setSaved] = useState(JSON.stringify(initialData))
  const [saving, setSaving] = useState(false)

  const isDirty = JSON.stringify(data) !== saved

  function setField<K extends keyof MissionSectionContent>(key: K, value: MissionSectionContent[K]) {
    setData(prev => ({ ...prev, [key]: value }))
  }

  function setPillarField(index: number, field: 'title' | 'desc', value: string) {
    setData(prev => {
      const pillars = [...prev.pillars]
      pillars[index] = { ...pillars[index], [field]: value }
      return { ...prev, pillars }
    })
  }

  async function handleSave() {
    setSaving(true)
    const res = await updatePageSection('home', 'mission_section', JSON.stringify(data))
    setSaving(false)
    if (res.success) {
      setSaved(JSON.stringify(data))
      toast.success('Mission section saved')
    } else {
      toast.error(res.error ?? 'Failed to save')
    }
  }

  return (
    <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] p-6 space-y-5">
      <div>
        <h2 className="text-base font-semibold text-[var(--color-text-primary)] dark:text-white">
          What We Do Section
        </h2>
        <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
          Structured content for the Mission section on the home page.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="mission-label">Label</Label>
          <Input
            id="mission-label"
            value={data.label}
            onChange={e => setField('label', e.target.value)}
            placeholder="What We Do"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="mission-title">Title</Label>
          <Input
            id="mission-title"
            value={data.title}
            onChange={e => setField('title', e.target.value)}
            placeholder="Remembering Creative Power"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="mission-description">Description</Label>
        <Textarea
          id="mission-description"
          rows={3}
          value={data.description}
          onChange={e => setField('description', e.target.value)}
        />
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-[var(--color-text-primary)] dark:text-white">Pillars</p>
        {data.pillars.map((pillar, i) => {
          const Icon = ICON_MAP[pillar.icon_name]
          return (
            <div key={pillar.icon_name} className="flex items-start gap-3 p-3 rounded-lg border border-[var(--color-border)] dark:border-[var(--color-dark-border)]">
              <div className="shrink-0 mt-1.5 flex items-center gap-1.5 text-xs font-medium text-[var(--color-text-muted)] bg-[var(--color-surface-hover)] dark:bg-[var(--color-dark-surface-hover)] rounded px-2 py-1">
                <Icon size={13} />
                {pillar.icon_name}
              </div>
              <div className="flex-1 grid sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Title</Label>
                  <Input
                    value={pillar.title}
                    onChange={e => setPillarField(i, 'title', e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Description</Label>
                  <Input
                    value={pillar.desc}
                    onChange={e => setPillarField(i, 'desc', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex items-center justify-end gap-3">
        {visibilityKey && (
          <SectionVisibilityToggle visibilityKey={visibilityKey} initialVisible={initialVisible} />
        )}
        <Button onClick={handleSave} disabled={saving || !isDirty} className="cursor-pointer">
          {saving ? 'Saving…' : 'Save'}
        </Button>
      </div>
    </div>
  )
}
