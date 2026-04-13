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
import { updateBlog, toggleBlogPublished, deleteBlog } from '@/actions/blogs'
import { slugify, formatDate } from '@/lib/utils'
import type { BlogPost } from '@/types'

const EXCERPT_MAX = 300
const AUTOSAVE_MS = 2000

interface BlogEditorProps {
  post: BlogPost
}

export default function BlogEditor({ post }: BlogEditorProps) {
  const router = useRouter()

  const [title, setTitle] = useState(post.title)
  const [slug, setSlug] = useState(post.slug)
  const [excerpt, setExcerpt] = useState(post.excerpt ?? '')
  const [content, setContent] = useState(post.content)
  const [coverPath, setCoverPath] = useState<string | null>(post.cover_path)
  const [coverUrl, setCoverUrl] = useState<string | undefined>(undefined)
  const [published, setPublished] = useState(post.published)

  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [slugManual, setSlugManual] = useState(false)

  // Auto-save ref
  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isDirty = useRef(false)

  function scheduleAutosave() {
    isDirty.current = true
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current)
    autosaveTimer.current = setTimeout(async () => {
      if (!isDirty.current) return
      await updateBlog(post.id, { title, slug, excerpt: excerpt || null, content, cover_path: coverPath })
      isDirty.current = false
    }, AUTOSAVE_MS)
  }

  // Clear timer on unmount
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
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSave() {
    setSaving(true)
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current)
    const result = await updateBlog(post.id, {
      title,
      slug,
      excerpt: excerpt || null,
      content,
      cover_path: coverPath,
    })
    setSaving(false)
    isDirty.current = false
    if (!result.success) {
      toast.error(result.error ?? 'Failed to save.')
    } else {
      toast.success('Saved.')
    }
  }

  async function handlePublishToggle(val: boolean) {
    setPublishing(true)
    const result = await toggleBlogPublished(post.id, val)
    setPublishing(false)
    if (!result.success) {
      toast.error(result.error ?? 'Failed to update status.')
    } else {
      setPublished(val)
      toast.success(val ? 'Post published.' : 'Post set to draft.')
    }
  }

  async function handleDelete() {
    setDeleting(true)
    const result = await deleteBlog(post.id)
    setDeleting(false)
    setConfirmOpen(false)
    if (!result.success) {
      toast.error(result.error ?? 'Failed to delete.')
      return
    }
    toast.success('Blog post deleted.')
    router.push('/admin/blogs')
  }

  return (
    <>
      <div className="space-y-6 pb-12">
        {/* Top bar */}
        <div className="flex flex-wrap items-center gap-3 justify-between">
          <Link
            href="/admin/blogs"
            className="flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] dark:hover:text-[#e8ecec] transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blogs
          </Link>

          <div className="flex items-center gap-3">
            <PublishToggle
              published={published}
              onChange={handlePublishToggle}
              loading={publishing}
            />
            <Button
              onClick={handleSave}
              disabled={saving}
              className="cursor-pointer bg-[var(--color-brand-teal)] hover:bg-[var(--color-brand-teal-dark)] text-white"
            >
              {saving ? 'Saving…' : 'Save'}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger className="p-2 rounded cursor-pointer text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] dark:hover:text-[#e8ecec] hover:bg-[var(--color-surface-hover)] dark:hover:bg-[var(--color-dark-surface-hover)] transition-colors">
                <MoreVertical className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => setConfirmOpen(true)}
                  className="cursor-pointer gap-2 text-red-600 focus:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Post
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">
          {/* Main editor column */}
          <div className="space-y-4">
            {/* Title */}
            <div className="space-y-1.5">
              <Label htmlFor="title" className="text-[var(--color-text-muted)] text-xs uppercase tracking-wide">
                Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Post title"
                className="font-display text-lg border-[var(--color-border)] dark:border-[var(--color-dark-border)]"
              />
            </div>

            {/* Slug */}
            <div className="space-y-1.5">
              <Label htmlFor="slug" className="text-[var(--color-text-muted)] text-xs uppercase tracking-wide">
                Slug
              </Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="post-slug"
                className="font-mono text-sm border-[var(--color-border)] dark:border-[var(--color-dark-border)]"
              />
            </div>

            {/* Rich text */}
            <div className="space-y-1.5">
              <Label className="text-[var(--color-text-muted)] text-xs uppercase tracking-wide">
                Content
              </Label>
              <RichTextEditor
                content={content}
                onChange={handleContentChange}
                folder="blog/inline"
                placeholder="Start writing your post…"
              />
            </div>
          </div>

          {/* Sidebar column */}
          <div className="space-y-4 lg:sticky lg:top-6">
            {/* Cover image */}
            <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] p-4 bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] space-y-3">
              <ImageUpload
                currentUrl={coverUrl}
                folder="blog/covers"
                onUpload={(url, path) => {
                  setCoverUrl(url)
                  setCoverPath(path)
                  scheduleAutosave()
                }}
                onRemove={() => {
                  setCoverUrl(undefined)
                  setCoverPath(null)
                  scheduleAutosave()
                }}
              />
            </div>

            {/* Excerpt */}
            <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] p-4 bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] space-y-2">
              <Label htmlFor="excerpt" className="text-[var(--color-text-muted)] text-xs uppercase tracking-wide">
                Excerpt
              </Label>
              <Textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => {
                  if (e.target.value.length <= EXCERPT_MAX) {
                    setExcerpt(e.target.value)
                    scheduleAutosave()
                  }
                }}
                placeholder="Short description shown in post listings…"
                rows={4}
                className="resize-none text-sm border-[var(--color-border)] dark:border-[var(--color-dark-border)]"
              />
              <p className="text-xs text-[var(--color-text-muted)] text-right">
                {excerpt.length} / {EXCERPT_MAX}
              </p>
            </div>

            {/* Meta */}
            <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] p-4 bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] space-y-2">
              <p className="text-xs uppercase tracking-wide text-[var(--color-text-muted)] font-medium">
                Meta
              </p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-muted)]">Created</span>
                  <span className="text-[var(--color-text-primary)] dark:text-[#e8ecec]">
                    {formatDate(post.created_at)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-muted)]">Updated</span>
                  <span className="text-[var(--color-text-primary)] dark:text-[#e8ecec]">
                    {formatDate(post.updated_at)}
                  </span>
                </div>
              </div>
            </div>

            {/* Delete */}
            <button
              onClick={() => setConfirmOpen(true)}
              className="w-full text-sm text-red-600 hover:text-red-700 cursor-pointer py-2 rounded-lg border border-red-200 dark:border-red-900/40 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
            >
              Delete Post
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete Blog Post"
        description="This action cannot be undone. The post will be permanently removed."
        onConfirm={handleDelete}
        loading={deleting}
      />
    </>
  )
}
