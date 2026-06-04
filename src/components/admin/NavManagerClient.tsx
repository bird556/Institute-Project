'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { updateSiteSetting } from '@/actions/settings'
import { parseNavConfig } from '@/lib/nav-config'
import type { NavItem } from '@/lib/nav-config'

interface SortableRowProps {
  item: NavItem
  onToggle: (slug: string) => void
  onLabelChange: (slug: string, label: string) => void
}

function SortableRow({ item, onToggle, onLabelChange }: SortableRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.slug })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 rounded-lg border border-[var(--color-border)] dark:border-[var(--color-dark-border)] px-3 py-2 bg-[var(--color-background)] dark:bg-[var(--color-dark-surface)]"
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] shrink-0"
        aria-label="Drag to reorder"
      >
        <GripVertical size={16} />
      </button>

      <input
        type="text"
        value={item.label}
        onChange={(e) => onLabelChange(item.slug, e.target.value)}
        disabled={item.slug === 'home'}
        className={`flex-1 text-sm font-medium bg-transparent border-none outline-none focus:ring-0 ${
          item.visible ? 'text-[var(--color-text-primary)] dark:text-white' : 'text-[var(--color-text-muted)]'
        } disabled:cursor-default`}
      />

      <button
        onClick={() => onToggle(item.slug)}
        className="shrink-0 text-[var(--color-text-muted)] hover:text-[var(--color-brand-teal)] transition-colors cursor-pointer"
        aria-label={item.visible ? 'Hide from nav' : 'Show in nav'}
        title={item.visible ? 'Visible in nav' : 'Hidden from nav'}
      >
        {item.visible ? <Eye size={16} /> : <EyeOff size={16} />}
      </button>
    </div>
  )
}

interface NavManagerClientProps {
  initialNavConfig: string
}

export default function NavManagerClient({ initialNavConfig }: NavManagerClientProps) {
  const [items, setItems] = useState<NavItem[]>(() => parseNavConfig(initialNavConfig))
  const [saving, setSaving] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    setItems((prev) => {
      const oldIdx = prev.findIndex((i) => i.slug === active.id)
      const newIdx = prev.findIndex((i) => i.slug === over.id)
      return arrayMove(prev, oldIdx, newIdx)
    })
  }

  function handleToggle(slug: string) {
    if (slug === 'home') return
    setItems((prev) =>
      prev.map((i) => (i.slug === slug ? { ...i, visible: !i.visible } : i))
    )
  }

  function handleLabelChange(slug: string, label: string) {
    setItems((prev) =>
      prev.map((i) => (i.slug === slug ? { ...i, label } : i))
    )
  }

  async function handleSave() {
    setSaving(true)
    const res = await updateSiteSetting('nav_config', JSON.stringify(items))
    setSaving(false)
    if (res.success) {
      toast.success('Navigation updated — changes are live on your site')
    } else {
      toast.error(res.error ?? 'Failed to save navigation')
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-[var(--color-text-muted)]">
        Click a label to rename it. Drag to reorder. Toggle the eye icon to show or hide.
      </p>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items.map((i) => i.slug)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {items.map((item) => (
              <SortableRow key={item.slug} item={item} onToggle={handleToggle} onLabelChange={handleLabelChange} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} className="cursor-pointer">
          {saving ? 'Saving…' : 'Save Navigation'}
        </Button>
      </div>
    </div>
  )
}
