'use client'

interface ImageFitToggleProps {
  value: 'cover' | 'contain'
  onChange: (value: 'cover' | 'contain') => void
}

export default function ImageFitToggle({ value, onChange }: ImageFitToggleProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-[var(--color-text-primary)] dark:text-[#e8ecec]">
        Image Fit
      </p>
      <div className="flex rounded-lg border border-[var(--color-border)] dark:border-[var(--color-dark-border)] overflow-hidden">
        <button
          type="button"
          onClick={() => onChange('cover')}
          className={`flex-1 py-1.5 text-sm font-medium cursor-pointer transition-colors ${
            value === 'cover'
              ? 'bg-[var(--color-brand-teal)] text-white'
              : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] dark:hover:bg-[var(--color-dark-surface-hover)]'
          }`}
        >
          Cover
        </button>
        <button
          type="button"
          onClick={() => onChange('contain')}
          className={`flex-1 py-1.5 text-sm font-medium cursor-pointer transition-colors border-l border-[var(--color-border)] dark:border-[var(--color-dark-border)] ${
            value === 'contain'
              ? 'bg-[var(--color-brand-teal)] text-white'
              : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] dark:hover:bg-[var(--color-dark-surface-hover)]'
          }`}
        >
          Contain
        </button>
      </div>
      <p className="text-xs text-[var(--color-text-muted)]">
        <strong className="text-[var(--color-text-primary)] dark:text-[#e8ecec]">Cover</strong> fills the frame and crops the edges — best for photos.{' '}
        <strong className="text-[var(--color-text-primary)] dark:text-[#e8ecec]">Contain</strong> shows the whole image with no cropping — best for flyers or posters with text near the edges.
      </p>
    </div>
  )
}
