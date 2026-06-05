'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import {
  ArrowLeft,
  Trash2,
  Plus,
  X,
  GripVertical,
  BookOpen,
  FileText,
  MessageSquare,
} from 'lucide-react'
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import PublishToggle from '@/components/shared/PublishToggle'
import ImageUpload from '@/components/shared/ImageUpload'
import RichTextEditor from '@/components/shared/RichTextEditor'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import {
  updateEdition,
  toggleEditionPublished,
  deleteEdition,
  assignToEdition,
} from '@/actions/newsletter'
import { slugify, formatDate } from '@/lib/utils'
import type { NewsletterEdition, NewsletterSubmission, SubmissionType } from '@/types'

const AUTOSAVE_MS = 2000

const TYPE_LABEL: Record<SubmissionType, string> = {
  research_call: 'RC',
  research_note: 'RN',
  commentary:    'AC',
}

const TYPE_COLOR: Record<SubmissionType, string> = {
  research_call: 'bg-[var(--color-brand-teal)] text-white',
  research_note: 'bg-amber-500 text-white',
  commentary:    'bg-purple-600 text-white',
}

const TYPE_ICON: Record<SubmissionType, React.ElementType> = {
  research_call: BookOpen,
  research_note: FileText,
  commentary:    MessageSquare,
}

interface EditionEditorProps {
  edition: NewsletterEdition
  editionSubmissions: NewsletterSubmission[]
  availableSubmissions: NewsletterSubmission[]
  initialCoverUrl?: string
}

export default function EditionEditor({
  edition,
  editionSubmissions: initialEditionSubs,
  availableSubmissions: initialAvailable,
  initialCoverUrl,
}: EditionEditorProps) {
  const router = useRouter()

  const [title, setTitle]           = useState(edition.title)
  const [slug, setSlug]             = useState(edition.slug)
  const [intro, setIntro]           = useState(edition.intro)
  const [coverPath, setCoverPath]   = useState<string | null>(edition.cover_path)
  const [coverUrl, setCoverUrl]     = useState<string | undefined>(initialCoverUrl)
  const [published, setPublished]   = useState(edition.published)
  const [slugManual, setSlugManual] = useState(false)

  const [assigned, setAssigned]     = useState(initialEditionSubs)
  const [available, setAvailable]   = useState(initialAvailable)

  const [saving, setSaving]         = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [deleting, setDeleting]     = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [assigning, setAssigning]   = useState(false)

  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isDirty       = useRef(false)

  function scheduleAutosave(fields: Parameters<typeof updateEdition>[1]) {
    isDirty.current = true
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current)
    autosaveTimer.current = setTimeout(async () => {
      if (!isDirty.current) return
      await updateEdition(edition.id, fields)
      isDirty.current = false
    }, AUTOSAVE_MS)
  }

  useEffect(() => () => { if (autosaveTimer.current) clearTimeout(autosaveTimer.current) }, [])

  function handleTitleChange(val: string) {
    setTitle(val)
    if (!slugManual) setSlug(slugify(val))
    scheduleAutosave({ title: val, slug: slugManual ? slug : slugify(val), intro, cover_path: coverPath })
  }

  function handleSlugChange(val: string) {
    setSlugManual(true)
    setSlug(val)
    scheduleAutosave({ title, slug: val, intro, cover_path: coverPath })
  }

  function handleIntroChange(val: string) {
    setIntro(val)
    scheduleAutosave({ title, slug, intro: val, cover_path: coverPath })
  }

  async function handleSave() {
    if (!title.trim()) { toast.error('Edition title is required.'); return }
    setSaving(true)
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current)
    const result = await updateEdition(edition.id, { title, slug, intro, cover_path: coverPath })
    setSaving(false)
    isDirty.current = false
    if (!result.success) toast.error(result.error ?? 'Failed to save.')
    else toast.success('Saved.')
  }

  async function handlePublishToggle(val: boolean) {
    setPublishing(true)
    const result = await toggleEditionPublished(edition.id, val)
    setPublishing(false)
    if (!result.success) toast.error(result.error ?? 'Failed to update publish status.')
    else {
      setPublished(val)
      toast.success(val ? 'Edition published.' : 'Edition unpublished.')
    }
  }

  async function handleDelete() {
    setDeleting(true)
    const result = await deleteEdition(edition.id)
    setDeleting(false)
    setConfirmOpen(false)
    if (!result.success) { toast.error(result.error ?? 'Failed to delete.'); return }
    toast.success('Edition deleted.')
    router.push('/admin/newsletter')
  }

  // ── Submission management ─────────────────────────────────────────────────

  async function handleAdd(submission: NewsletterSubmission) {
    setAssigning(true)
    const result = await assignToEdition(submission.id, edition.id)
    setAssigning(false)
    if (!result.success) { toast.error(result.error ?? 'Failed to assign.'); return }
    setAssigned((prev) => [...prev, { ...submission, edition_id: edition.id }])
    setAvailable((prev) => prev.filter((s) => s.id !== submission.id))
  }

  async function handleRemove(submission: NewsletterSubmission) {
    const result = await assignToEdition(submission.id, null)
    if (!result.success) { toast.error(result.error ?? 'Failed to remove.'); return }
    setAssigned((prev) => prev.filter((s) => s.id !== submission.id))
    setAvailable((prev) => [{ ...submission, edition_id: null }, ...prev])
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    setAssigned((items) => {
      const oldIndex = items.findIndex((s) => s.id === active.id)
      const newIndex = items.findIndex((s) => s.id === over.id)
      return arrayMove(items, oldIndex, newIndex)
    })
  }

  return (
    <>
      <div className="space-y-6 pb-12">
        {/* Top bar */}
        <div className="flex flex-wrap items-center gap-3 justify-between">
          <Link
            href="/admin/newsletter"
            className="flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] dark:hover:text-[#e8ecec] transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Newsletter
          </Link>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="cursor-pointer bg-[var(--color-brand-teal)] hover:bg-[var(--color-brand-teal-dark)] text-white"
          >
            {saving ? 'Saving…' : 'Save'}
          </Button>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">
          {/* ── Main column ─────────────────────────────────────────────────── */}
          <div className="space-y-6">
            {/* Title */}
            <div className="space-y-1.5">
              <Label htmlFor="title" className="text-[var(--color-text-muted)] text-xs uppercase tracking-wide">
                Edition Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Volume 3, Q2 2025"
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
                placeholder="vol-3-q2-2025"
                className="font-mono text-sm border-[var(--color-border)] dark:border-[var(--color-dark-border)]"
              />
            </div>

            {/* Editorial intro */}
            <div className="space-y-1.5">
              <Label className="text-[var(--color-text-muted)] text-xs uppercase tracking-wide">
                Editorial Introduction
              </Label>
              <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] overflow-hidden">
                <RichTextEditor
                  content={intro}
                  onChange={handleIntroChange}
                  folder="newsletter/inline"
                  placeholder="Write an editorial introduction for this edition…"
                />
              </div>
            </div>

            {/* Submissions in this edition */}
            <div className="space-y-3">
              <p className="text-[var(--color-text-muted)] text-xs uppercase tracking-wide font-medium">
                Submissions in this Edition ({assigned.length})
              </p>

              {assigned.length === 0 ? (
                <p className="text-sm text-[var(--color-text-muted)] italic">
                  No submissions assigned yet. Add from the panel below.
                </p>
              ) : (
                <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={assigned.map((s) => s.id)} strategy={verticalListSortingStrategy}>
                    <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] overflow-hidden">
                      {assigned.map((s) => (
                        <SortableSubmissionRow
                          key={s.id}
                          submission={s}
                          onRemove={() => handleRemove(s)}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              )}
            </div>

            {/* Add submissions panel */}
            {available.length > 0 && (
              <div className="space-y-3">
                <p className="text-[var(--color-text-muted)] text-xs uppercase tracking-wide font-medium">
                  Add Approved Submissions
                </p>
                <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] overflow-hidden">
                  {available.map((s) => (
                    <AvailableSubmissionRow
                      key={s.id}
                      submission={s}
                      onAdd={() => handleAdd(s)}
                      disabled={assigning}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Sidebar ──────────────────────────────────────────────────────── */}
          <div className="space-y-4 lg:sticky lg:top-6">
            {/* Cover image */}
            <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] p-4 bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] space-y-3">
              <p className="text-xs uppercase tracking-wide text-[var(--color-text-muted)] font-medium">
                Cover Image
              </p>
              <ImageUpload
                currentUrl={coverUrl}
                folder="newsletter/covers"
                onUpload={(url, path) => {
                  setCoverUrl(url)
                  setCoverPath(path)
                  scheduleAutosave({ title, slug, intro, cover_path: path })
                }}
                onRemove={() => {
                  setCoverUrl(undefined)
                  setCoverPath(null)
                  scheduleAutosave({ title, slug, intro, cover_path: null })
                }}
              />
            </div>

            {/* Publish */}
            <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] p-4 bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] space-y-4">
              <p className="text-xs uppercase tracking-wide text-[var(--color-text-muted)] font-medium">
                Status
              </p>
              <PublishToggle
                published={published}
                onChange={handlePublishToggle}
                loading={publishing}
              />
              <Button
                onClick={handleSave}
                disabled={saving}
                className="w-full cursor-pointer bg-[var(--color-brand-teal)] hover:bg-[var(--color-brand-teal-dark)] text-white"
              >
                {saving ? 'Saving…' : 'Save Changes'}
              </Button>
            </div>

            {/* Stats */}
            <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] p-4 bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] space-y-2">
              <p className="text-xs uppercase tracking-wide text-[var(--color-text-muted)] font-medium">
                Stats
              </p>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--color-text-muted)]">Submissions</span>
                <span className="font-medium text-[var(--color-text-primary)] dark:text-[#e8ecec]">{assigned.length}</span>
              </div>
              {edition.published_at && (
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-text-muted)]">Published</span>
                  <span className="text-[var(--color-text-primary)] dark:text-[#e8ecec]">{formatDate(edition.published_at)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-[var(--color-text-muted)]">Created</span>
                <span className="text-[var(--color-text-primary)] dark:text-[#e8ecec]">{formatDate(edition.created_at)}</span>
              </div>
            </div>

            {/* Delete */}
            <button
              onClick={() => setConfirmOpen(true)}
              className="w-full text-sm text-red-600 hover:text-red-700 cursor-pointer py-2 rounded-lg border border-red-200 dark:border-red-900/40 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete Edition
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete Edition"
        description="This action cannot be undone. Submissions assigned to this edition will become unassigned."
        onConfirm={handleDelete}
        loading={deleting}
      />
    </>
  )
}

// ─── Sortable assigned submission row ────────────────────────────────────────

function SortableSubmissionRow({
  submission: s,
  onRemove,
}: {
  submission: NewsletterSubmission
  onRemove: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: s.id })
  const TypeIcon = TYPE_ICON[s.type]

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 px-4 py-3 border-b last:border-b-0 border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-background)] dark:bg-[var(--color-dark-surface)]"
    >
      <button
        {...attributes}
        {...listeners}
        className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] cursor-grab active:cursor-grabbing"
        aria-label="Drag to reorder"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold shrink-0 ${TYPE_COLOR[s.type]}`}>
        <TypeIcon className="h-3 w-3" />
        {TYPE_LABEL[s.type]}
      </span>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[var(--color-text-primary)] dark:text-[#e8ecec] truncate">{s.title}</p>
        <p className="text-xs text-[var(--color-text-muted)] truncate">{s.submitter_name}</p>
      </div>

      <button
        onClick={onRemove}
        className="text-[var(--color-text-muted)] hover:text-red-600 cursor-pointer transition-colors shrink-0"
        aria-label="Remove from edition"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

// ─── Available submission row ─────────────────────────────────────────────────

function AvailableSubmissionRow({
  submission: s,
  onAdd,
  disabled,
}: {
  submission: NewsletterSubmission
  onAdd: () => void
  disabled: boolean
}) {
  const TypeIcon = TYPE_ICON[s.type]

  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b last:border-b-0 border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-background)] dark:bg-[var(--color-dark-surface)] hover:bg-[var(--color-surface)] dark:hover:bg-[var(--color-dark-surface-hover)] transition-colors">
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold shrink-0 ${TYPE_COLOR[s.type]}`}>
        <TypeIcon className="h-3 w-3" />
        {TYPE_LABEL[s.type]}
      </span>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[var(--color-text-primary)] dark:text-[#e8ecec] truncate">{s.title}</p>
        <p className="text-xs text-[var(--color-text-muted)] truncate">{s.submitter_name}</p>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={onAdd}
        disabled={disabled}
        className="cursor-pointer shrink-0 gap-1 text-[var(--color-brand-teal)] hover:text-[var(--color-brand-teal-dark)] hover:bg-[var(--color-surface-hover)] dark:hover:bg-[var(--color-dark-surface-hover)]"
      >
        <Plus className="h-3.5 w-3.5" />
        Add
      </Button>
    </div>
  )
}
