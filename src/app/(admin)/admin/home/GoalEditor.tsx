'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { updatePageSection } from '@/actions/page-content'
import SectionVisibilityToggle from '@/components/admin/SectionVisibilityToggle'
import type { GoalSectionContent } from '@/types'

interface GoalEditorProps {
  initialData: GoalSectionContent
  visibilityKey?: string
  initialVisible?: boolean
}

export default function GoalEditor({ initialData, visibilityKey, initialVisible = true }: GoalEditorProps) {
  const [data, setData] = useState<GoalSectionContent>(initialData)
  const [saved, setSaved] = useState(JSON.stringify(initialData))
  const [saving, setSaving] = useState(false)

  const isDirty = JSON.stringify(data) !== saved

  function setField<K extends keyof GoalSectionContent>(key: K, value: GoalSectionContent[K]) {
    setData(prev => ({ ...prev, [key]: value }))
  }

  function setPillarField(index: number, field: 'label' | 'desc', value: string) {
    setData(prev => {
      const pillars = [...prev.pillars]
      pillars[index] = { ...pillars[index], [field]: value }
      return { ...prev, pillars }
    })
  }

  async function handleSave() {
    setSaving(true)
    const res = await updatePageSection('home', 'goal_section', JSON.stringify(data))
    setSaving(false)
    if (res.success) {
      setSaved(JSON.stringify(data))
      toast.success('Goal section saved')
    } else {
      toast.error(res.error ?? 'Failed to save')
    }
  }

  return (
    <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] p-6 space-y-5">
      <div>
        <h2 className="text-base font-semibold text-[var(--color-text-primary)] dark:text-white">
          Our Goal Section
        </h2>
        <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
          Structured content for the Goal section on the home page.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="goal-label">Label</Label>
          <Input
            id="goal-label"
            value={data.label}
            onChange={e => setField('label', e.target.value)}
            placeholder="Our Goal"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="goal-title">Title</Label>
          <Input
            id="goal-title"
            value={data.title}
            onChange={e => setField('title', e.target.value)}
            placeholder="Thriving With Purpose"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="goal-description">Description</Label>
        <Textarea
          id="goal-description"
          rows={3}
          value={data.description}
          onChange={e => setField('description', e.target.value)}
        />
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-[var(--color-text-primary)] dark:text-white">Pillars</p>
        {data.pillars.map((pillar, i) => (
          <div key={pillar.num} className="flex items-start gap-3 p-3 rounded-lg border border-[var(--color-border)] dark:border-[var(--color-dark-border)]">
            <span className="shrink-0 mt-2 w-8 text-center text-sm font-bold font-mono text-[var(--color-text-muted)] bg-[var(--color-surface-hover)] dark:bg-[var(--color-dark-surface-hover)] rounded px-1.5 py-0.5">
              {pillar.num}
            </span>
            <div className="flex-1 grid sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Label</Label>
                <Input
                  value={pillar.label}
                  onChange={e => setPillarField(i, 'label', e.target.value)}
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
        ))}
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
