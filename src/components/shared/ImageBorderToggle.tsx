'use client'

interface ImageBorderToggleProps {
  value: boolean
  onChange: (value: boolean) => void
}

export default function ImageBorderToggle({ value, onChange }: ImageBorderToggleProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-[var(--color-text-primary)] dark:text-[#e8ecec]">
        Image Background
      </p>
      <div className="flex rounded-lg border border-[var(--color-border)] dark:border-[var(--color-dark-border)] overflow-hidden">
        <button
          type="button"
          onClick={() => onChange(true)}
          className={`flex-1 py-1.5 text-sm font-medium cursor-pointer transition-colors ${
            value
              ? 'bg-[var(--color-brand-teal)] text-white'
              : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] dark:hover:bg-[var(--color-dark-surface-hover)]'
          }`}
        >
          Show
        </button>
        <button
          type="button"
          onClick={() => onChange(false)}
          className={`flex-1 py-1.5 text-sm font-medium cursor-pointer transition-colors border-l border-[var(--color-border)] dark:border-[var(--color-dark-border)] ${
            !value
              ? 'bg-[var(--color-brand-teal)] text-white'
              : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] dark:hover:bg-[var(--color-dark-surface-hover)]'
          }`}
        >
          Hide
        </button>
      </div>
      <p className="text-xs text-[var(--color-text-muted)]">
        Only matters in <strong className="text-[var(--color-text-primary)] dark:text-[#e8ecec]">Contain</strong> mode, where empty space can appear around the image.{' '}
        <strong className="text-[var(--color-text-primary)] dark:text-[#e8ecec]">Show</strong> fills it with a light background. <strong className="text-[var(--color-text-primary)] dark:text-[#e8ecec]">Hide</strong> leaves it transparent.
      </p>
    </div>
  )
}
