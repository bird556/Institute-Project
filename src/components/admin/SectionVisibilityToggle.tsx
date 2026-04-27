'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Eye, EyeOff } from 'lucide-react'
import { toggleSectionVisibility } from '@/actions/settings'

interface Props {
  visibilityKey: string
  initialVisible: boolean
}

export default function SectionVisibilityToggle({ visibilityKey, initialVisible }: Props) {
  const [visible, setVisible] = useState(initialVisible)
  const [toggling, setToggling] = useState(false)

  async function handleToggle() {
    setToggling(true)
    const result = await toggleSectionVisibility(visibilityKey, !visible)
    setToggling(false)
    if (result.success) {
      setVisible(v => !v)
      toast.success(visible ? 'Section hidden on public site.' : 'Section visible on public site.')
    } else {
      toast.error(result.error ?? 'Failed to update visibility.')
    }
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={toggling}
      className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-full border transition-colors cursor-pointer disabled:opacity-50 ${
        visible
          ? 'border-[var(--color-brand-teal)] text-[var(--color-brand-teal)]'
          : 'border-[var(--color-border)] dark:border-[var(--color-dark-border)] text-[var(--color-text-muted)]'
      }`}
    >
      {visible ? <Eye size={12} /> : <EyeOff size={12} />}
      {visible ? 'Visible' : 'Hidden'}
    </button>
  )
}
