'use client'

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

interface PublishPillProps {
  published: boolean
  toggling: boolean
  onClick: () => void
}

export default function PublishPill({ published, toggling, onClick }: PublishPillProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onClick}
          disabled={toggling}
          className={`text-xs px-2.5 py-1 rounded-full font-medium cursor-pointer transition-colors shrink-0 ${
            published
              ? 'bg-[var(--color-brand-teal)] text-white hover:opacity-80'
              : 'bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface-hover)] text-[var(--color-text-muted)] border border-[var(--color-border)] dark:border-[var(--color-dark-border)] hover:bg-[var(--color-surface-hover)]'
          }`}
        >
          {toggling ? '…' : published ? 'Published' : 'Draft'}
        </button>
      </TooltipTrigger>
      <TooltipContent side="left">
        <p>{published ? 'Click to set back to Draft' : 'Click to Publish'}</p>
      </TooltipContent>
    </Tooltip>
  )
}
