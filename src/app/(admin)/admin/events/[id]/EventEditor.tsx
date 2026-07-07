'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { ArrowLeft, MoreVertical, Trash2, FileText, X } from 'lucide-react'
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
import { updateEvent, toggleEventPublished, deleteEvent } from '@/actions/events'
import { slugify, formatDate } from '@/lib/utils'
import type { Event } from '@/types'

const AUTOSAVE_MS = 2000

interface EventEditorProps {
  event: Event
  initialCoverUrl?: string
}

/** Split an ISO timestamptz into separate date + time strings for the inputs */
function splitDateTime(iso: string): { date: string; time: string } {
  const d = new Date(iso)
  const date = d.toISOString().slice(0, 10)           // YYYY-MM-DD
  const time = d.toISOString().slice(11, 16)          // HH:MM
  return { date, time }
}

/** Combine date (YYYY-MM-DD) + time (HH:MM) back into an ISO string (UTC) */
function combineDateTime(date: string, time: string): string {
  return `${date}T${time}:00.000Z`
}

export default function EventEditor({ event, initialCoverUrl }: EventEditorProps) {
  const router = useRouter()

  const [title, setTitle] = useState(event.title)
  const [slug, setSlug] = useState(event.slug)
  const [description, setDescription] = useState(event.description)
  const [coverPath, setCoverPath] = useState<string | null>(event.cover_path)
  const [coverUrl, setCoverUrl] = useState<string | undefined>(initialCoverUrl)
  const [docPath, setDocPath] = useState<string | null>(event.doc_path)
  const [docName, setDocName] = useState<string>('')
  const [docUploading, setDocUploading] = useState(false)
  const [location, setLocation] = useState(event.location ?? '')
  const [organizer, setOrganizer] = useState(event.organizer ?? '')
  const [externalUrl, setExternalUrl] = useState(event.external_url ?? '')
  const [eventType, setEventType] = useState<'kustawi' | 'other'>(event.event_type ?? 'kustawi')
  const [published, setPublished] = useState(event.published)
  const [slugManual, setSlugManual] = useState(false)

  const { date: initDate, time: initTime } = splitDateTime(event.event_date)
  const [eventDate, setEventDate] = useState(initDate)
  const [eventTime, setEventTime] = useState(initTime)
  const [dateError, setDateError] = useState('')

  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isDirty = useRef(false)

  function buildFields() {
    return {
      title,
      slug,
      description,
      cover_path: coverPath,
      doc_path: docPath,
      location: location || null,
      organizer: organizer.trim() || null,
      event_date: combineDateTime(eventDate, eventTime),
      external_url: externalUrl.trim() || null,
      event_type: eventType,
    }
  }

  function scheduleAutosave() {
    isDirty.current = true
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current)
    autosaveTimer.current = setTimeout(async () => {
      if (!isDirty.current) return
      await updateEvent(event.id, buildFields())
      isDirty.current = false
    }, AUTOSAVE_MS)
  }

  useEffect(() => () => { if (autosaveTimer.current) clearTimeout(autosaveTimer.current) }, [])

  async function uploadDoc(file: File) {
    setDocUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'events/docs')
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const json = await res.json()
      if (!res.ok) { toast.error(json.error ?? 'Upload failed.'); return }
      setDocPath(json.path)
      setDocName(file.name)
      await updateEvent(event.id, { doc_path: json.path })
      toast.success('Document uploaded.')
    } catch {
      toast.error('Upload failed.')
    } finally {
      setDocUploading(false)
    }
  }

  function handleDocUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) uploadDoc(file)
    e.target.value = ''
  }

  function handleDocDrop(e: React.DragEvent<HTMLElement>) {
    e.preventDefault()
    if (docUploading) return
    const file = e.dataTransfer.files?.[0]
    if (file) uploadDoc(file)
  }

  async function handleDocRemove() {
    setDocPath(null)
    setDocName('')
    await updateEvent(event.id, { doc_path: null })
    toast.success('Document removed.')
  }

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

  function handleDateChange(val: string) {
    setEventDate(val)
    setDateError('')
    scheduleAutosave()
  }

  function handleTimeChange(val: string) {
    setEventTime(val)
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
    if (!slug.trim()) {
      toast.error('Slug is required.')
      return false
    }
    if (!eventDate) {
      setDateError('Event date is required.')
      return false
    }
    return true
  }

  async function handleSave() {
    if (!validate()) return
    setSaving(true)
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current)
    const result = await updateEvent(event.id, buildFields())
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
    const result = await toggleEventPublished(event.id, val)
    setPublishing(false)
    if (!result.success) {
      toast.error(result.error ?? 'Failed to update status.')
    } else {
      setPublished(val)
      toast.success(val ? 'Event published.' : 'Event set to draft.')
    }
  }

  async function handleDelete() {
    setDeleting(true)
    const result = await deleteEvent(event.id)
    setDeleting(false)
    setConfirmOpen(false)
    if (!result.success) {
      toast.error(result.error ?? 'Failed to delete.')
      return
    }
    toast.success('Event deleted.')
    router.push('/admin/events')
  }

  return (
    <>
      <div className="space-y-6 pb-12">
        {/* Top bar */}
        <div className="flex flex-wrap items-center gap-3 justify-between">
          <Link
            href="/admin/events"
            className="flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] dark:hover:text-[#e8ecec] transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Events
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
                  Delete Event
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
                Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Event title"
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
                placeholder="event-slug"
                className="font-mono text-sm border-[var(--color-border)] dark:border-[var(--color-dark-border)]"
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
                folder="events/inline"
                placeholder="Describe this event…"
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 lg:sticky lg:top-6">
            {/* Cover image */}
            <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] p-4 bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] space-y-3">
              <ImageUpload
                currentUrl={coverUrl}
                folder="events/covers"
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

            {/* Downloadable Document */}
            <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] p-4 bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] space-y-3">
              <p className="text-xs uppercase tracking-wide text-[var(--color-text-muted)] font-medium">
                Downloadable Document
              </p>
              <p className="text-xs text-[var(--color-text-muted)]">
                Optional PDF, DOC, or DOCX that attendees can download from the event page. Max 20 MB.
              </p>

              {docPath ? (
                <div
                  className="flex items-center gap-2 rounded-lg bg-[var(--color-background)] dark:bg-[var(--color-dark-background)] px-3 py-2"
                  onDrop={handleDocDrop}
                  onDragOver={(e) => e.preventDefault()}
                >
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
                <label
                  className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[var(--color-border)] dark:border-[var(--color-dark-border)] p-4 cursor-pointer hover:border-[var(--color-brand-teal)] transition-colors"
                  onDrop={handleDocDrop}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <FileText size={20} className="text-[var(--color-text-muted)]" />
                  <span className="text-xs text-[var(--color-text-muted)]">
                    {docUploading ? 'Uploading…' : 'Click or drag a file to upload — PDF, DOC, or DOCX'}
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

            {/* Date & time */}
            <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] p-4 bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] space-y-3">
              <p className="text-xs uppercase tracking-wide text-[var(--color-text-muted)] font-medium">
                Date &amp; Time
              </p>
              <div className="space-y-1.5">
                <Label htmlFor="event-date" className="text-[var(--color-text-muted)] text-xs">
                  Date
                </Label>
                <input
                  id="event-date"
                  type="date"
                  value={eventDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="w-full h-9 rounded-md border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-background)] dark:bg-[var(--color-dark-surface-hover)] text-[var(--color-text-primary)] dark:text-[#e8ecec] text-sm px-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-teal)] cursor-pointer"
                />
                {dateError && (
                  <p className="text-xs text-red-600">{dateError}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="event-time" className="text-[var(--color-text-muted)] text-xs">
                  Time
                </Label>
                <input
                  id="event-time"
                  type="time"
                  value={eventTime}
                  onChange={(e) => handleTimeChange(e.target.value)}
                  className="w-full h-9 rounded-md border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-background)] dark:bg-[var(--color-dark-surface-hover)] text-[var(--color-text-primary)] dark:text-[#e8ecec] text-sm px-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-teal)] cursor-pointer"
                />
              </div>
            </div>

            {/* Location */}
            <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] p-4 bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] space-y-2">
              <Label htmlFor="location" className="text-[var(--color-text-muted)] text-xs uppercase tracking-wide">
                Location
              </Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value)
                  scheduleAutosave()
                }}
                placeholder="e.g. Toronto Convention Centre or Virtual — Zoom"
                className="text-sm border-[var(--color-border)] dark:border-[var(--color-dark-border)]"
              />
            </div>

            {/* Organizer */}
            <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] p-4 bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] space-y-2">
              <Label htmlFor="organizer" className="text-[var(--color-text-muted)] text-xs uppercase tracking-wide">
                Organizer
              </Label>
              <Input
                id="organizer"
                value={organizer}
                onChange={(e) => {
                  setOrganizer(e.target.value)
                  scheduleAutosave()
                }}
                placeholder="e.g. Kustawi Institute"
                className="text-sm border-[var(--color-border)] dark:border-[var(--color-dark-border)]"
              />
            </div>

            {/* Event Type */}
            <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] p-4 bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] space-y-2">
              <Label htmlFor="event-type" className="text-[var(--color-text-muted)] text-xs uppercase tracking-wide">
                Event Type
              </Label>
              <select
                id="event-type"
                value={eventType}
                onChange={(e) => {
                  setEventType(e.target.value as 'kustawi' | 'other')
                  scheduleAutosave()
                }}
                className="w-full h-9 rounded-md border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-background)] dark:bg-[var(--color-dark-surface-hover)] text-[var(--color-text-primary)] dark:text-[#e8ecec] text-sm px-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-teal)] cursor-pointer"
              >
                <option value="kustawi">Kustawi Event</option>
                <option value="other">Other Event</option>
              </select>
            </div>

            {/* External registration link */}
            <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] p-4 bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] space-y-2">
              <Label htmlFor="external-url" className="text-[var(--color-text-muted)] text-xs uppercase tracking-wide">
                Registration Link
              </Label>
              <Input
                id="external-url"
                type="url"
                value={externalUrl}
                onChange={(e) => {
                  setExternalUrl(e.target.value)
                  scheduleAutosave()
                }}
                placeholder="https://eventbrite.ca/…"
                className="text-sm border-[var(--color-border)] dark:border-[var(--color-dark-border)]"
              />
              <p className="text-xs text-[var(--color-text-muted)]">
                Optional — shown as a button on the public event page (e.g. Eventbrite).
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
                    {formatDate(event.created_at)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-muted)]">Updated</span>
                  <span className="text-[var(--color-text-primary)] dark:text-[#e8ecec]">
                    {formatDate(event.updated_at)}
                  </span>
                </div>
              </div>
            </div>

            {/* Delete */}
            <button
              onClick={() => setConfirmOpen(true)}
              className="w-full text-sm text-red-600 hover:text-red-700 cursor-pointer py-2 rounded-lg border border-red-200 dark:border-red-900/40 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
            >
              Delete Event
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete Event"
        description="This action cannot be undone. The event will be permanently removed."
        onConfirm={handleDelete}
        loading={deleting}
      />
    </>
  )
}
