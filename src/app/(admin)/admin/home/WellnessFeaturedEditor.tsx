'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import SectionVisibilityToggle from '@/components/admin/SectionVisibilityToggle'
import { updateSiteSettings } from '@/actions/settings'

interface WellnessPickPost {
  id: string
  title: string
  cover_url: string | null
}

interface WellnessFeaturedEditorProps {
  initialBlurb: string
  initialMode: string
  initialIds: string
  visibilityKey: string
  initialVisible: boolean
  publishedPosts: WellnessPickPost[]
}

export default function WellnessFeaturedEditor({
  initialBlurb,
  initialMode,
  initialIds,
  visibilityKey,
  initialVisible,
  publishedPosts,
}: WellnessFeaturedEditorProps) {
  const [blurb, setBlurb] = useState(initialBlurb)
  const [mode, setMode]   = useState<'latest' | 'manual'>(
    initialMode === 'manual' ? 'manual' : 'latest'
  )
  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    try { return JSON.parse(initialIds) as string[] } catch { return [] }
  })
  const [saving, setSaving] = useState(false)

  function togglePost(id: string) {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id)
      if (prev.length >= 3) {
        toast.error('You can feature at most 3 posts.')
        return prev
      }
      return [...prev, id]
    })
  }

  async function handleSave() {
    setSaving(true)
    const res = await updateSiteSettings({
      wellness_section_blurb:  blurb.trim(),
      wellness_featured_mode:  mode,
      wellness_featured_ids:   JSON.stringify(selectedIds),
    })
    setSaving(false)
    if (res.success) {
      toast.success('Health & Wellness section saved.')
    } else {
      toast.error(res.error ?? 'Failed to save.')
    }
  }

  return (
    <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-background)] dark:bg-[var(--color-dark-background)] p-6 space-y-5">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
        Health &amp; Wellness Section
      </h2>
      <p className="text-sm text-[var(--color-text-muted)] -mt-2">
        Featured wellness posts shown on the home page below &ldquo;What We Do&rdquo;.
      </p>

      <div className="space-y-2">
        <Label htmlFor="hw-blurb">Section Blurb</Label>
        <Textarea
          id="hw-blurb"
          rows={2}
          maxLength={200}
          value={blurb}
          onChange={(e) => setBlurb(e.target.value)}
          placeholder="One sentence describing who Health & Wellness is for…"
        />
        <p className="text-xs text-[var(--color-text-muted)]">{blurb.length}/200</p>
      </div>

      <div className="space-y-2">
        <Label>Featured Posts</Label>
        <div className="flex gap-3">
          <button
            onClick={() => setMode('latest')}
            className={`flex-1 py-2 text-sm rounded-lg border transition-colors cursor-pointer ${
              mode === 'latest'
                ? 'bg-[var(--color-brand-teal)] text-white border-[var(--color-brand-teal)]'
                : 'border-[var(--color-border)] dark:border-[var(--color-dark-border)] text-[var(--color-text-muted)] hover:border-[var(--color-brand-teal)]'
            }`}
          >
            Latest 3 (automatic)
          </button>
          <button
            onClick={() => setMode('manual')}
            className={`flex-1 py-2 text-sm rounded-lg border transition-colors cursor-pointer ${
              mode === 'manual'
                ? 'bg-[var(--color-brand-teal)] text-white border-[var(--color-brand-teal)]'
                : 'border-[var(--color-border)] dark:border-[var(--color-dark-border)] text-[var(--color-text-muted)] hover:border-[var(--color-brand-teal)]'
            }`}
          >
            Hand-pick (up to 3)
          </button>
        </div>
      </div>

      {mode === 'manual' && (
        <div className="space-y-2">
          <p className="text-xs text-[var(--color-text-muted)]">
            Select up to 3 published posts ({selectedIds.length}/3 selected).
          </p>
          {publishedPosts.length === 0 ? (
            <p className="text-sm text-[var(--color-text-muted)]">No published posts yet.</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {publishedPosts.map((post) => {
                const selected = selectedIds.includes(post.id)
                return (
                  <button
                    key={post.id}
                    onClick={() => togglePost(post.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg border text-left transition-colors cursor-pointer ${
                      selected
                        ? 'border-[var(--color-brand-teal)] bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)]'
                        : 'border-[var(--color-border)] dark:border-[var(--color-dark-border)] hover:border-[var(--color-brand-teal)]'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center text-xs ${
                      selected
                        ? 'bg-[var(--color-brand-teal)] border-[var(--color-brand-teal)] text-white'
                        : 'border-[var(--color-border)] dark:border-[var(--color-dark-border)]'
                    }`}>
                      {selected && '✓'}
                    </span>
                    <span className="text-sm text-[var(--color-text-primary)] dark:text-white truncate">
                      {post.title}
                    </span>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between pt-2">
        <SectionVisibilityToggle
          visibilityKey={visibilityKey}
          initialVisible={initialVisible}
        />
        <Button onClick={handleSave} disabled={saving} className="cursor-pointer">
          {saving ? 'Saving…' : 'Save'}
        </Button>
      </div>
    </div>
  )
}
