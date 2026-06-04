'use client'

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

interface VisibilityPillProps {
  visible: boolean
  onClick: () => void
}

export default function VisibilityPill({ visible, onClick }: VisibilityPillProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onClick}
          className="flex items-center gap-1.5 text-xs font-medium shrink-0 cursor-pointer px-2 py-1 rounded-full transition-colors"
          style={
            visible
              ? { color: 'var(--color-brand-teal)', background: 'color-mix(in srgb, var(--color-brand-teal) 12%, transparent)' }
              : { color: 'var(--color-text-muted)', background: 'var(--color-surface)' }
          }
        >
          <span
            className="h-1.5 w-1.5 rounded-full shrink-0"
            style={{ background: visible ? 'var(--color-brand-teal)' : 'var(--color-text-muted)' }}
          />
          {visible ? 'Visible' : 'Hidden'}
        </button>
      </TooltipTrigger>
      <TooltipContent side="left">
        <p>{visible ? 'Click to hide from the public site' : 'Click to show on the public site'}</p>
      </TooltipContent>
    </Tooltip>
  )
}
