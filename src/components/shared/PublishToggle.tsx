'use client'

import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

interface PublishToggleProps {
  published: boolean
  onChange: (published: boolean) => void
  loading?: boolean
}

export default function PublishToggle({ published, onChange, loading = false }: PublishToggleProps) {
  return (
    <div className="flex items-center gap-2">
      <Switch
        id="publish-toggle"
        checked={published}
        onCheckedChange={onChange}
        disabled={loading}
        className="cursor-pointer"
      />
      <Label
        htmlFor="publish-toggle"
        className="cursor-pointer text-sm font-medium text-[var(--color-text-primary)] dark:text-[#e8ecec]"
      >
        {published ? 'Published' : 'Draft'}
      </Label>
    </div>
  )
}
