'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { ArrowLeft, MoreVertical, Trash2, FileText, X } from 'lucide-react'
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
import { updateWellnessPost, toggleWellnessPublished, deleteWellnessPost } from '@/actions/wellness'
import { slugify, formatDate } from '@/lib/utils'
import { WELLNESS_TAGS } from '@/types'
import type { WellnessPost } from '@/types'

const EXCERPT_MAX = 300
const AUTOSAVE_MS = 2000

function toTitleCase(str: string): string {
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase())
}

interface WellnessEditorProps {
  post: WellnessPost
  initialCoverUrl?: string
}

export default function WellnessEditor({ post, initialCoverUrl }: WellnessEditorProps) {
  const router = useRouter()

  const [title, setTitle]         = useState(post.title)
  const [slug, setSlug]           = useState(post.slug)
  const [excerpt, setExcerpt]     = useState(post.excerpt ?? '')
  const [content, setContent]     = useState(post.content)
  const [coverPath, setCoverPath] = useState<string | null>(post.cover_path)
  const [coverUrl, setCoverUrl]   = useState<string | undefined>(initialCoverUrl)
  const [docPath, setDocPath]     = useState<string | null>(post.doc_path)
  const [docName, setDocName]     = useState<string>('')
  const [docUploading, setDocUploading] = useState(false)
  const [tags, setTags]           = useState<string[]>(post.tags)
  const [customTagInput, setCustomTagInput] = useState('')
  const [published, setPublished] = useState(post.published)

  const [saving, setSaving]       = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [deleting, setDeleting]   = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [slugManual, setSlugManual]   = useState(false)

  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isDirty = useRef(false)

  function scheduleAutosave() {
    isDirty.current = true
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current)
    autosaveTimer.current = setTimeout(async () => {
      if (!isDirty.current) return
      await updateWellnessPost(post.id, { title, slug, excerpt: excerpt || null, content, cover_path: coverPath, doc_path: docPath, tags })
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

  const handleContentChange = useCallback((html: string) => {
    setContent(html)
    scheduleAutosave()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleCoverUpload(url: string, path: string) {
    setCoverUrl(url)
    setCoverPath(path)
    updateWellnessPost(post.id, { cover_path: path }).then((r) => {
      if (!r.success) toast.error(r.error ?? 'Failed to save cover image.')
    })
  }

  async function handleDocUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setDocUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'wellness/docs')
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const json = await res.json()
      if (!res.ok) { toast.error(json.error ?? 'Upload failed.'); return }
      setDocPath(json.path)
      setDocName(file.name)
      await updateWellnessPost(post.id, { doc_path: json.path })
      toast.success('Document uploaded.')
    } catch {
      toast.error('Upload failed.')
    } finally {
      setDocUploading(false)
      e.target.value = ''
    }
  }

  async function handleDocRemove() {
    setDocPath(null)
    setDocName('')
    await updateWellnessPost(post.id, { doc_path: null })
    toast.success('Document removed.')
  }

  function toggleTag(tag: string) {
    const next = tags.includes(tag) ? tags.filter((t) => t !== tag) : [...tags, tag]
    setTags(next)
    updateWellnessPost(post.id, { tags: next })
  }

  function handleAddCustomTag() {
    const tag = toTitleCase(customTagInput.trim())
    if (!tag || tags.includes(tag)) { setCustomTagInput(''); return }
    const next = [...tags, tag]
    setTags(next)
    updateWellnessPost(post.id, { tags: next })
    setCustomTagInput('')
  }

  function handleCustomTagKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') { e.preventDefault(); handleAddCustomTag() }
  }

  function removeCustomTag(tag: string) {
    const next = tags.filter((t) => t !== tag)
    setTags(next)
    updateWellnessPost(post.id, { tags: next })
  }

  async function handleSave() {
    setSaving(true)
    const result = await updateWellnessPost(post.id, { title, slug, excerpt: excerpt || null, content, cover_path: coverPath, doc_path: docPath, tags })
    setSaving(false)
    if (!result.success) { toast.error(result.error ?? 'Save failed.'); return }
    isDirty.current = false
    toast.success('Saved.')
  }

  async function handleTogglePublish() {
    setPublishing(true)
    const next = !published
    const result = await toggleWellnessPublished(post.id, next)
    setPublishing(false)
    if (!result.success) { toast.error(result.error ?? 'Failed to update publish state.'); return }
    setPublished(next)
    toast.success(next ? 'Post published.' : 'Post unpublished.')
  }

  async function handleDelete() {
    setDeleting(true)
    const result = await deleteWellnessPost(post.id)
    setDeleting(false)
    if (!result.success) { toast.error(result.error ?? 'Delete failed.'); return }
    toast.success('Post deleted.')
    router.push('/admin/health-wellness')
  }

  return (
    <>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/admin/health-wellness"
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
          {/* ── Main column ─────────────────────────────────────── */}
          <div className="space-y-6">
            {/* Title */}
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

            {/* Slug */}
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

            {/* Excerpt */}
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

            {/* Body */}
            <div className="space-y-2">
              <Label>Body</Label>
              <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] overflow-hidden">
                <RichTextEditor
                  content={content}
                  onChange={handleContentChange}
                  folder="wellness/inline"
                  placeholder="Start writing…"
                />
              </div>
            </div>
          </div>

          {/* ── Sidebar ──────────────────────────────────────────── */}
          <div className="space-y-5">
            {/* Publish toggle */}
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

            {/* Tags */}
            <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] p-4 space-y-3">
              <p className="text-sm font-semibold text-[var(--color-text-primary)] dark:text-white">
                Tags
              </p>
              <div className="flex flex-wrap gap-2">
                {WELLNESS_TAGS.map((tag) => {
                  const active = tags.includes(tag)
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer border ${
                        active
                          ? 'bg-[var(--color-brand-teal)] text-white border-[var(--color-brand-teal)]'
                          : 'bg-transparent text-[var(--color-text-muted)] border-[var(--color-border)] dark:border-[var(--color-dark-border)] hover:border-[var(--color-brand-teal)] hover:text-[var(--color-brand-teal)]'
                      }`}
                    >
                      {tag}
                    </button>
                  )
                })}
                {tags.filter((t) => !(WELLNESS_TAGS as readonly string[]).includes(t)).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-[var(--color-brand-teal)] text-white border border-[var(--color-brand-teal)]"
                  >
                    {tag}
                    <button
                      onClick={() => removeCustomTag(tag)}
                      className="hover:opacity-70 transition-opacity cursor-pointer"
                      aria-label={`Remove ${tag}`}
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
              {tags.length === 0 && (
                <p className="text-xs text-[var(--color-text-muted)]">No tags selected.</p>
              )}
              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={customTagInput}
                  onChange={(e) => setCustomTagInput(toTitleCase(e.target.value))}
                  onKeyDown={handleCustomTagKeyDown}
                  placeholder="Add custom tag…"
                  className="flex-1 h-8 px-3 text-xs rounded-md border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-background)] dark:bg-[var(--color-dark-surface)] text-[var(--color-text-primary)] dark:text-white placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-teal)]"
                />
                <button
                  onClick={handleAddCustomTag}
                  disabled={!customTagInput.trim()}
                  className="h-8 px-3 text-xs rounded-md bg-[var(--color-brand-teal)] text-white font-medium cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Cover image */}
            <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] p-4 space-y-3">
              <p className="text-sm font-semibold text-[var(--color-text-primary)] dark:text-white">
                Cover Image
              </p>
              <ImageUpload
                currentUrl={coverUrl}
                folder="wellness/covers"
                onUpload={handleCoverUpload}
                onRemove={() => { setCoverUrl(undefined); setCoverPath(null); updateWellnessPost(post.id, { cover_path: null }) }}
                accept="image/jpeg,image/png,image/webp,image/svg+xml"
              />
            </div>

            {/* Document download */}
            <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] p-4 space-y-3">
              <p className="text-sm font-semibold text-[var(--color-text-primary)] dark:text-white">
                Downloadable Document
              </p>
              <p className="text-xs text-[var(--color-text-muted)]">
                Optional PDF, DOC, or DOCX that visitors can download from this post. Max 20 MB.
              </p>

              {docPath ? (
                <div className="flex items-center gap-2 rounded-lg bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] px-3 py-2">
                  <FileText size={16} className="text-[var(--color-brand-teal)] shrink-0" />
                  <span className="text-xs text-[var(--color-text-primary)] dark:text-white truncate flex-1">
                    {docName || docPath.split('/').pop()}
                  </span>
                  <button
                    onClick={handleDocRemove}
                    className="text-[var(--color-text-muted)] hover:text-destructive transition-colors cursor-pointer shrink-0"
                    aria-label="Remove document"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[var(--color-border)] dark:border-[var(--color-dark-border)] p-4 cursor-pointer hover:border-[var(--color-brand-teal)] transition-colors">
                  <FileText size={20} className="text-[var(--color-text-muted)]" />
                  <span className="text-xs text-[var(--color-text-muted)]">
                    {docUploading ? 'Uploading…' : 'Click to upload PDF, DOC, or DOCX'}
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    className="sr-only"
                    onChange={handleDocUpload}
                    disabled={docUploading}
                  />
                </label>
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
