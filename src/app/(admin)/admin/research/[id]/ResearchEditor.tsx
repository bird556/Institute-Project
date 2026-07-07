'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { ArrowLeft, MoreVertical, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import PublishToggle from '@/components/shared/PublishToggle'
import ImageUpload from '@/components/shared/ImageUpload'
import RichTextEditor from '@/components/shared/RichTextEditor'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import { updateResearchPost, toggleResearchPublished, deleteResearchPost } from '@/actions/research'
import { slugify, formatDate } from '@/lib/utils'
import { RESEARCH_CATEGORIES, RESEARCH_CATEGORY_LABELS, ITEM_TYPE_LABELS } from '@/types'
import type { ResearchPost, ResearchCategory, ResearchItemType } from '@/types'

const EXCERPT_MAX = 300
const AUTOSAVE_MS = 2000

interface ResearchEditorProps {
  post: ResearchPost
  initialCoverUrl?: string
}

export default function ResearchEditor({ post, initialCoverUrl }: ResearchEditorProps) {
  const router = useRouter()

  const [title, setTitle]         = useState(post.title)
  const [slug, setSlug]           = useState(post.slug)
  const [excerpt, setExcerpt]     = useState(post.excerpt ?? '')
  const [content, setContent]     = useState(post.content)
  const [category, setCategory]       = useState<ResearchCategory>(post.category)
  const [externalUrl, setExternalUrl] = useState(post.external_url ?? '')
  const [region, setRegion]           = useState<'canadian' | 'world' | ''>(post.region ?? '')
  const [author, setAuthor]           = useState(post.author ?? '')
  const [itemType, setItemType]       = useState<ResearchItemType | ''>(post.item_type ?? '')
  const [coverPath, setCoverPath]     = useState<string | null>(post.cover_path)
  const [coverUrl, setCoverUrl]       = useState<string | undefined>(initialCoverUrl)
  const [published, setPublished]     = useState(post.published)

  const [saving, setSaving]         = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [deleting, setDeleting]     = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [slugManual, setSlugManual]   = useState(false)

  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isDirty = useRef(false)

  const adminHref = `/admin/research?tab=${post.category}`

  function scheduleAutosave() {
    isDirty.current = true
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current)
    autosaveTimer.current = setTimeout(async () => {
      if (!isDirty.current) return
      await updateResearchPost(post.id, { title, slug, excerpt: excerpt || null, content, cover_path: coverPath, category, external_url: externalUrl.trim() || null, region: region || null, author: author.trim() || null, item_type: itemType || null })
      isDirty.current = false
    }, AUTOSAVE_MS)
  }

  useEffect(() => () => { if (autosaveTimer.current) clearTimeout(autosaveTimer.current) }, [])

  function handleTitleChange(val: string) {
    setTitle(val)
    if (!slugManual) setSlug(slugify(val))
    scheduleAutosave()
  }

  function handleSlugChange(val: string) {
    setSlugManual(true)
    setSlug(val)
    scheduleAutosave()
  }

  function handleCategoryChange(val: ResearchCategory) {
    setCategory(val)
    updateResearchPost(post.id, { category: val })
  }

  const handleContentChange = useCallback((html: string) => {
    setContent(html)
    scheduleAutosave()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleCoverUpload(url: string, path: string) {
    setCoverUrl(url)
    setCoverPath(path)
    updateResearchPost(post.id, { cover_path: path }).then((r) => {
      if (!r.success) toast.error(r.error ?? 'Failed to save cover image.')
    })
  }

  async function handleSave() {
    setSaving(true)
    const result = await updateResearchPost(post.id, { title, slug, excerpt: excerpt || null, content, cover_path: coverPath, category, external_url: externalUrl.trim() || null, region: region || null, author: author.trim() || null, item_type: itemType || null })
    setSaving(false)
    if (!result.success) { toast.error(result.error ?? 'Save failed.'); return }
    isDirty.current = false
    toast.success('Saved.')
  }

  async function handleTogglePublish() {
    setPublishing(true)
    const next = !published
    const result = await toggleResearchPublished(post.id, next)
    setPublishing(false)
    if (!result.success) { toast.error(result.error ?? 'Failed to update publish state.'); return }
    setPublished(next)
    toast.success(next ? 'Post published.' : 'Post unpublished.')
  }

  async function handleDelete() {
    setDeleting(true)
    const result = await deleteResearchPost(post.id)
    setDeleting(false)
    if (!result.success) { toast.error(result.error ?? 'Delete failed.'); return }
    toast.success('Post deleted.')
    router.push(adminHref)
  }

  return (
    <>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-3">
          <Link
            href={adminHref}
            className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-brand-teal)] transition-colors"
          >
            <ArrowLeft size={15} /> All Posts
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleSave} disabled={saving} className="cursor-pointer">
              {saving ? 'Saving…' : 'Save'}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger className="p-2 rounded-md border border-[var(--color-border)] dark:border-[var(--color-dark-border)] hover:bg-[var(--color-surface-hover)] dark:hover:bg-[var(--color-dark-surface-hover)] transition-colors cursor-pointer">
                <MoreVertical size={16} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="cursor-pointer gap-2 text-destructive focus:text-destructive"
                  onClick={() => setConfirmOpen(true)}
                >
                  <Trash2 size={14} /> Delete post
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Post title"
                className="text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="post-slug"
                className="font-mono text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">
                Excerpt{' '}
                <span className="text-[var(--color-text-muted)] font-normal text-xs">
                  ({excerpt.length}/{EXCERPT_MAX})
                </span>
              </Label>
              <Textarea
                id="excerpt"
                rows={3}
                maxLength={EXCERPT_MAX}
                value={excerpt}
                onChange={(e) => { setExcerpt(e.target.value); scheduleAutosave() }}
                placeholder="Short description shown on the list page…"
              />
            </div>

            <div className="space-y-2">
              <Label>Body</Label>
              <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] overflow-hidden">
                <RichTextEditor
                  content={content}
                  onChange={handleContentChange}
                  folder="research/inline"
                  placeholder="Start writing…"
                />
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] p-4 space-y-3">
              <p className="text-sm font-semibold text-[var(--color-text-primary)] dark:text-white">
                Cover Image
              </p>
              <ImageUpload
                currentUrl={coverUrl}
                folder="research/covers"
                onUpload={handleCoverUpload}
                onRemove={() => { setCoverUrl(undefined); setCoverPath(null); updateResearchPost(post.id, { cover_path: null }) }}
                accept="image/jpeg,image/png,image/webp,image/svg+xml,image/avif"
              />
            </div>

            <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] p-4 space-y-3">
              <p className="text-sm font-semibold text-[var(--color-text-primary)] dark:text-white">
                Status
              </p>
              <PublishToggle
                published={published}
                loading={publishing}
                onChange={handleTogglePublish}
              />
              {post.published_at && (
                <p className="text-xs text-[var(--color-text-muted)]">
                  Published {formatDate(post.published_at)}
                </p>
              )}
            </div>

            <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] p-4 space-y-3">
              <p className="text-sm font-semibold text-[var(--color-text-primary)] dark:text-white">
                Category
              </p>
              <select
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value as ResearchCategory)}
                className="w-full h-9 px-3 text-sm rounded-lg border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-background)] dark:bg-[var(--color-dark-surface)] text-[var(--color-text-primary)] dark:text-[#e8ecec] focus:outline-none focus:border-[var(--color-brand-teal)] transition-colors cursor-pointer"
              >
                {RESEARCH_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{RESEARCH_CATEGORY_LABELS[cat]}</option>
                ))}
              </select>
            </div>

            {/* External URL */}
            <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] p-4 space-y-3">
              <p className="text-sm font-semibold text-[var(--color-text-primary)] dark:text-white">
                External URL
              </p>
              <Input
                type="url"
                value={externalUrl}
                onChange={(e) => { setExternalUrl(e.target.value); scheduleAutosave() }}
                placeholder="https://..."
                className="text-sm border-[var(--color-border)] dark:border-[var(--color-dark-border)]"
              />
              <p className="text-xs text-[var(--color-text-muted)]">
                Link to an external website, paper, or call announcement.
              </p>
            </div>

            {/* Region */}
            <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] p-4 space-y-3">
              <p className="text-sm font-semibold text-[var(--color-text-primary)] dark:text-white">
                Region
              </p>
              <select
                value={region}
                onChange={(e) => { setRegion(e.target.value as 'canadian' | 'world' | ''); scheduleAutosave() }}
                className="w-full h-9 px-3 text-sm rounded-lg border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-background)] dark:bg-[var(--color-dark-surface)] text-[var(--color-text-primary)] dark:text-[#e8ecec] focus:outline-none focus:border-[var(--color-brand-teal)] transition-colors cursor-pointer"
              >
                <option value="">— None —</option>
                <option value="canadian">Canadian</option>
                <option value="world">International</option>
              </select>
            </div>

            {/* Author */}
            <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] p-4 space-y-3">
              <p className="text-sm font-semibold text-[var(--color-text-primary)] dark:text-white">
                Author
              </p>
              <Input
                value={author}
                onChange={(e) => { setAuthor(e.target.value); scheduleAutosave() }}
                placeholder="Author name"
                className="text-sm border-[var(--color-border)] dark:border-[var(--color-dark-border)]"
              />
            </div>

            {/* Item Type */}
            <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] p-4 space-y-3">
              <p className="text-sm font-semibold text-[var(--color-text-primary)] dark:text-white">
                Item Type
              </p>
              <select
                value={itemType}
                onChange={(e) => { setItemType(e.target.value as ResearchItemType | ''); scheduleAutosave() }}
                className="w-full h-9 px-3 text-sm rounded-lg border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-background)] dark:bg-[var(--color-dark-surface)] text-[var(--color-text-primary)] dark:text-[#e8ecec] focus:outline-none focus:border-[var(--color-brand-teal)] transition-colors cursor-pointer"
              >
                <option value="">— None —</option>
                {(Object.entries(ITEM_TYPE_LABELS) as [ResearchItemType, string][]).map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
              {category === 'sexual-abuse-boys-men' && (
                <p className="text-xs text-[var(--color-text-muted)]">
                  Link to the full paper, book listing, or video using External URL above.
                </p>
              )}
            </div>

          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete this post?"
        description="This action cannot be undone. The post and its content will be permanently removed."
        loading={deleting}
        onConfirm={handleDelete}
      />
    </>
  )
}
