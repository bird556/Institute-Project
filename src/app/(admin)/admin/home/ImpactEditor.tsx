'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Trash2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { updatePageSection } from '@/actions/page-content'
import SectionVisibilityToggle from '@/components/admin/SectionVisibilityToggle'
import type { ImpactSectionContent } from '@/types'

interface ImpactEditorProps {
  initialData: ImpactSectionContent
  visibilityKey?: string
  initialVisible?: boolean
}

export default function ImpactEditor({ initialData, visibilityKey, initialVisible = true }: ImpactEditorProps) {
  const [data, setData] = useState<ImpactSectionContent>(initialData)
  const [saved, setSaved] = useState(JSON.stringify(initialData))
  const [saving, setSaving] = useState(false)

  const isDirty = JSON.stringify(data) !== saved

  function setField<K extends keyof ImpactSectionContent>(key: K, value: ImpactSectionContent[K]) {
    setData(prev => ({ ...prev, [key]: value }))
  }

  function setItem(index: number, value: string) {
    setData(prev => {
      const items = [...prev.items]
      items[index] = value
      return { ...prev, items }
    })
  }

  function addItem() {
    setData(prev => ({ ...prev, items: [...prev.items, ''] }))
  }

  function removeItem(index: number) {
    setData(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }))
  }

  async function handleSave() {
    setSaving(true)
    const res = await updatePageSection('home', 'impact_section', JSON.stringify(data))
    setSaving(false)
    if (res.success) {
      setSaved(JSON.stringify(data))
      toast.success('Impact section saved')
    } else {
      toast.error(res.error ?? 'Failed to save')
    }
  }

  return (
    <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] p-6 space-y-5">
      <div>
        <h2 className="text-base font-semibold text-[var(--color-text-primary)] dark:text-white">
          The Challenge Section
        </h2>
        <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
          Structured content for the Impact section on the home page.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="impact-label">Label</Label>
          <Input
            id="impact-label"
            value={data.label}
            onChange={e => setField('label', e.target.value)}
            placeholder="The Challenge"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="impact-title">Title</Label>
          <Input
            id="impact-title"
            value={data.title}
            onChange={e => setField('title', e.target.value)}
            placeholder="Addressing Hidden Crises"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="impact-description">Description</Label>
        <Textarea
          id="impact-description"
          rows={3}
          value={data.description}
          onChange={e => setField('description', e.target.value)}
        />
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-[var(--color-text-primary)] dark:text-white">Impact Items</p>
        {data.items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <Input
              value={item}
              onChange={e => setItem(i, e.target.value)}
              placeholder={`Item ${i + 1}`}
            />
            <button
              onClick={() => removeItem(i)}
              className="p-2 text-[var(--color-text-muted)] hover:text-red-500 transition-colors cursor-pointer"
              aria-label="Remove item"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={addItem} className="cursor-pointer">
          <Plus size={14} className="mr-1.5" /> Add item
        </Button>
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
