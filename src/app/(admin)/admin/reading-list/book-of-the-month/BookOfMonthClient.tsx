'use client'

import { useState } from 'react'
import Image from 'next/image'
import { toast } from 'sonner'
import { BookOpen, Check, Star, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { setBookOfTheMonth } from '@/actions/reading-list'

interface PickerItem {
  id: string
  title: string
  author: string | null
  cover_url: string | null
}

interface BookOfMonthClientProps {
  items: PickerItem[]
  currentId: string | null
}

export default function BookOfMonthClient({ items, currentId }: BookOfMonthClientProps) {
  const [selectedId, setSelectedId] = useState<string | null>(currentId)
  const [saving, setSaving] = useState(false)

  async function handleSelect(id: string) {
    const next = selectedId === id ? null : id
    setSaving(true)
    const result = await setBookOfTheMonth(next)
    setSaving(false)
    if (!result.success) {
      toast.error(result.error ?? 'Failed to update.')
      return
    }
    setSelectedId(next)
    toast.success(next ? 'Book of the Month updated.' : 'Book of the Month cleared.')
  }

  async function handleClear() {
    setSaving(true)
    const result = await setBookOfTheMonth(null)
    setSaving(false)
    if (!result.success) {
      toast.error(result.error ?? 'Failed to clear.')
      return
    }
    setSelectedId(null)
    toast.success('Book of the Month cleared.')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-[var(--color-brand-teal)] dark:text-white flex items-center gap-2">
            <Star className="h-6 w-6 fill-[hsl(35_60%_50%)] text-[hsl(35_60%_50%)]" />
            Book of the Month
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            Select one published item to feature prominently at the top of the public Reading List page.
          </p>
        </div>
        {selectedId && (
          <Button
            variant="outline"
            onClick={handleClear}
            disabled={saving}
            className="cursor-pointer gap-1.5 text-[var(--color-text-muted)] border-[var(--color-border)] dark:border-[var(--color-dark-border)]"
          >
            <X className="h-4 w-4" />
            Clear selection
          </Button>
        )}
      </div>

      {/* Current selection banner */}
      {selectedId && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-[hsl(35_60%_50%/0.1)] border border-[hsl(35_60%_50%/0.3)] text-sm text-[hsl(35_60%_40%)] dark:text-[hsl(35_60%_70%)]">
          <Star className="h-4 w-4 fill-current shrink-0" />
          <span>
            <strong>{items.find((i) => i.id === selectedId)?.title ?? 'Selected item'}</strong> is currently featured as Book of the Month.
          </span>
        </div>
      )}

      {/* Empty state */}
      {items.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center rounded-xl border border-dashed border-[var(--color-border)] dark:border-[var(--color-dark-border)]">
          <BookOpen className="h-8 w-8 text-[var(--color-text-muted)]" />
          <div>
            <p className="font-medium text-[var(--color-text-primary)] dark:text-[#e8ecec]">No published items yet</p>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">Publish at least one reading list item to set a Book of the Month.</p>
          </div>
        </div>
      )}

      {/* Grid picker */}
      {items.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {items.map((item) => {
            const selected = selectedId === item.id
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                disabled={saving}
                className={`group relative text-left rounded-xl overflow-hidden border-2 transition-all cursor-pointer focus:outline-none ${
                  selected
                    ? 'border-[hsl(35_60%_50%)] shadow-md ring-2 ring-[hsl(35_60%_50%/0.3)]'
                    : 'border-[var(--color-border)] dark:border-[var(--color-dark-border)] hover:border-[var(--color-brand-teal)] hover:shadow-sm'
                }`}
              >
                {/* Cover */}
                <div className="relative w-full bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface-hover)]" style={{ aspectRatio: '3/4' }}>
                  {item.cover_url ? (
                    <Image
                      src={item.cover_url}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <BookOpen className="h-8 w-8 text-[var(--color-text-muted)] opacity-40" />
                    </div>
                  )}

                  {/* Selected checkmark overlay */}
                  {selected && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className="h-10 w-10 rounded-full bg-[hsl(35_60%_50%)] flex items-center justify-center shadow-lg">
                        <Check className="h-5 w-5 text-white" strokeWidth={3} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-2.5 bg-[var(--color-background)] dark:bg-[var(--color-dark-surface)]">
                  <p className="text-xs font-semibold text-[var(--color-text-primary)] dark:text-[#e8ecec] line-clamp-2 leading-snug">
                    {item.title}
                  </p>
                  {item.author && (
                    <p className="text-xs text-[var(--color-text-muted)] mt-0.5 truncate">{item.author}</p>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
