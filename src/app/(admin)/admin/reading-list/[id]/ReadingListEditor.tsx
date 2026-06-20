'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { ArrowLeft, MoreVertical, Trash2, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import { updateReadingListItem, toggleReadingListPublished, deleteReadingListItem } from '@/actions/reading-list'
import { formatDate } from '@/lib/utils'
import type { ReadingListItem } from '@/types'

const AUTOSAVE_MS = 2000

interface ReadingListEditorProps {
  item: ReadingListItem
  initialCoverUrl?: string
}

function isValidUrl(value: string): boolean {
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}

export default function ReadingListEditor({ item, initialCoverUrl }: ReadingListEditorProps) {
  const router = useRouter()

  const [title, setTitle] = useState(item.title)
  const [author, setAuthor] = useState(item.author ?? '')
  const [description, setDescription] = useState(item.description ?? '')
  const [coverPath, setCoverPath] = useState<string | null>(item.cover_path)
  const [coverUrl, setCoverUrl] = useState<string | undefined>(initialCoverUrl)
  const [externalUrl, setExternalUrl] = useState(item.external_url ?? '')
  const [urlError, setUrlError] = useState('')
  const [email, setEmail] = useState(item.email ?? '')
  const [authorRegion, setAuthorRegion] = useState<'canadian' | 'world' | ''>(item.author_region ?? '')
  const [itemType, setItemType] = useState<'book' | 'thesis_ma' | 'thesis_phd' | 'bookstore' | ''>(item.item_type ?? '')
  const [published, setPublished] = useState(item.published)

  const isBookstore = itemType === 'bookstore'

  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isDirty = useRef(false)

  function buildFields() {
    return {
      title,
      author: author || null,
      description: description || null,
      cover_path: coverPath,
      external_url: externalUrl || null,
      email: email || null,
      author_region: (authorRegion || null) as 'canadian' | 'world' | null,
      item_type: (itemType || null) as 'book' | 'thesis_ma' | 'thesis_phd' | 'bookstore' | null,
    }
  }

  function scheduleAutosave() {
    isDirty.current = true
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current)
    autosaveTimer.current = setTimeout(async () => {
      if (!isDirty.current) return
      await updateReadingListItem(item.id, buildFields())
      isDirty.current = false
    }, AUTOSAVE_MS)
  }

  useEffect(() => () => { if (autosaveTimer.current) clearTimeout(autosaveTimer.current) }, [])

  function handleTitleChange(val: string) {
    setTitle(val)
    scheduleAutosave()
  }

  function handleAuthorChange(val: string) {
    setAuthor(val)
    scheduleAutosave()
  }

  function handleUrlChange(val: string) {
    setExternalUrl(val)
    setUrlError('')
    scheduleAutosave()
  }

  function handleEmailChange(val: string) {
    setEmail(val)
    scheduleAutosave()
  }

  const handleDescriptionChange = useCallback((html: string) => {
    setDescription(html)
    scheduleAutosave()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function validate(): boolean {
    if (!title.trim()) {
      toast.error('Title is required.')
      return false
    }
    if (externalUrl && !isValidUrl(externalUrl)) {
      setUrlError('Please enter a valid URL (include https://).')
      return false
    }
    return true
  }

  async function handleSave() {
    if (!validate()) return
    setSaving(true)
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current)
    const result = await updateReadingListItem(item.id, buildFields())
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
    const result = await toggleReadingListPublished(item.id, val)
    setPublishing(false)
    if (!result.success) {
      toast.error(result.error ?? 'Failed to update status.')
    } else {
      setPublished(val)
      toast.success(val ? 'Item published.' : 'Item set to draft.')
    }
  }

  async function handleDelete() {
    setDeleting(true)
    const result = await deleteReadingListItem(item.id)
    setDeleting(false)
    setConfirmOpen(false)
    if (!result.success) {
      toast.error(result.error ?? 'Failed to delete.')
      return
    }
    toast.success('Item deleted.')
    router.push('/admin/reading-list')
  }

  return (
    <>
      <div className="space-y-6 pb-12">
        {/* Top bar */}
        <div className="flex flex-wrap items-center gap-3 justify-between">
          <Link
            href="/admin/reading-list"
            className="flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] dark:hover:text-[#e8ecec] transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Reading List
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
                  Delete Item
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">
          {/* Main column */}
          <div className="space-y-4">
            {/* Title */}
            <div className="space-y-1.5">
              <Label htmlFor="title" className="text-[var(--color-text-muted)] text-xs uppercase tracking-wide">
                {isBookstore ? 'Bookstore Name' : 'Title'}
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder={isBookstore ? 'e.g. Knowledge Bookstore' : 'Book or article title'}
                className="font-display text-lg border-[var(--color-border)] dark:border-[var(--color-dark-border)]"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label className="text-[var(--color-text-muted)] text-xs uppercase tracking-wide">
                Description
              </Label>
              <RichTextEditor
                content={description}
                onChange={handleDescriptionChange}
                folder="reading-list/inline"
                placeholder={isBookstore ? 'What does this bookstore offer?' : 'Why is this worth reading? Add annotations, notes, or a summary…'}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 lg:sticky lg:top-6">
            {/* Cover image */}
            <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] p-4 bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] space-y-3">
              <ImageUpload
                currentUrl={coverUrl}
                folder="reading-list/covers"
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

            {/* Author — not applicable to bookstores */}
            {!isBookstore && (
              <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] p-4 bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] space-y-2">
                <Label htmlFor="author" className="text-[var(--color-text-muted)] text-xs uppercase tracking-wide">
                  Author
                </Label>
                <Input
                  id="author"
                  value={author}
                  onChange={(e) => handleAuthorChange(e.target.value)}
                  placeholder="e.g. Paulo Freire"
                  className="text-sm border-[var(--color-border)] dark:border-[var(--color-dark-border)]"
                />
              </div>
            )}

            {/* Author Region — not applicable to bookstores */}
            {!isBookstore && (
              <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] p-4 bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] space-y-2">
                <Label htmlFor="author-region" className="text-[var(--color-text-muted)] text-xs uppercase tracking-wide">
                  Author Region
                </Label>
                <select
                  id="author-region"
                  value={authorRegion}
                  onChange={(e) => { setAuthorRegion(e.target.value as 'canadian' | 'world' | ''); scheduleAutosave() }}
                  className="w-full h-9 px-3 text-sm rounded-md border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-background)] dark:bg-[var(--color-dark-surface)] text-[var(--color-text-primary)] dark:text-[#e8ecec] focus:outline-none focus:border-[var(--color-brand-teal)] cursor-pointer"
                >
                  <option value="">— Not set —</option>
                  <option value="canadian">Canadian</option>
                  <option value="world">International</option>
                </select>
              </div>
            )}

            {/* Item Type */}
            <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] p-4 bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] space-y-2">
              <Label htmlFor="item-type" className="text-[var(--color-text-muted)] text-xs uppercase tracking-wide">
                Item Type
              </Label>
              <select
                id="item-type"
                value={itemType}
                onChange={(e) => { setItemType(e.target.value as 'book' | 'thesis_ma' | 'thesis_phd' | 'bookstore' | ''); scheduleAutosave() }}
                className="w-full h-9 px-3 text-sm rounded-md border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-background)] dark:bg-[var(--color-dark-surface)] text-[var(--color-text-primary)] dark:text-[#e8ecec] focus:outline-none focus:border-[var(--color-brand-teal)] cursor-pointer"
              >
                <option value="">— Not set —</option>
                <option value="book">Book</option>
                <option value="thesis_ma">Thesis (M.A.)</option>
                <option value="thesis_phd">Thesis (Ph.D.)</option>
                <option value="bookstore">Bookstore</option>
              </select>
            </div>

            {/* External URL */}
            <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] p-4 bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] space-y-2">
              <Label htmlFor="external-url" className="text-[var(--color-text-muted)] text-xs uppercase tracking-wide">
                {isBookstore ? 'Website URL' : 'External URL'}
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="external-url"
                  value={externalUrl}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  placeholder="https://example.com"
                  className="text-sm border-[var(--color-border)] dark:border-[var(--color-dark-border)]"
                />
                {externalUrl && isValidUrl(externalUrl) && (
                  <a
                    href={externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Open link"
                    className="shrink-0 p-2 rounded-md text-[var(--color-text-muted)] hover:text-[var(--color-brand-teal)] hover:bg-[var(--color-surface-hover)] dark:hover:bg-[var(--color-dark-surface-hover)] transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
              {urlError && (
                <p className="text-xs text-red-600">{urlError}</p>
              )}
            </div>

            {/* Email */}
            <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] p-4 bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] space-y-2">
              <Label htmlFor="email" className="text-[var(--color-text-muted)] text-xs uppercase tracking-wide">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                placeholder="contact@example.com"
                className="text-sm border-[var(--color-border)] dark:border-[var(--color-dark-border)]"
              />
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
                    {formatDate(item.created_at)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-muted)]">Updated</span>
                  <span className="text-[var(--color-text-primary)] dark:text-[#e8ecec]">
                    {formatDate(item.updated_at)}
                  </span>
                </div>
              </div>
            </div>

            {/* Delete */}
            <button
              onClick={() => setConfirmOpen(true)}
              className="w-full text-sm text-red-600 hover:text-red-700 cursor-pointer py-2 rounded-lg border border-red-200 dark:border-red-900/40 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
            >
              Delete Item
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete Item"
        description="This action cannot be undone. The reading list item will be permanently removed."
        onConfirm={handleDelete}
        loading={deleting}
      />
    </>
  )
}
