'use client'

import { useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { ArrowLeft, MoreVertical, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import PublishToggle from '@/components/shared/PublishToggle'
import ImageUpload from '@/components/shared/ImageUpload'
import RichTextEditor from '@/components/shared/RichTextEditor'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import { updateDirectoryEntry, toggleDirectoryEntryPublished, deleteDirectoryEntry } from '@/actions/directory'
import { formatDate } from '@/lib/utils'
import type { DirectoryEntry, DirectoryMode } from '@/types'
import { DIRECTORY_CATEGORY_LABELS, DIRECTORY_MODE_LABELS } from '@/types'

const AUTOSAVE_MS = 2000

interface Props {
  entry: DirectoryEntry
  initialPhotoUrl?: string
}

export default function DirectoryEntryEditor({ entry, initialPhotoUrl }: Props) {
  const router = useRouter()

  const [name, setName]               = useState(entry.name)
  const [organization, setOrg]        = useState(entry.organization ?? '')
  const [description, setDescription] = useState(entry.description ?? '')
  const [website_url, setWebsite]     = useState(entry.website_url ?? '')
  const [email, setEmail]             = useState(entry.email ?? '')
  const [mode, setMode]               = useState<DirectoryMode | ''>(entry.mode ?? '')
  const [photoPath, setPhotoPath]     = useState<string | null>(entry.photo_path)
  const [photoUrl, setPhotoUrl]       = useState<string | undefined>(initialPhotoUrl)
  const [published, setPublished]     = useState(entry.published)

  const [saving, setSaving]       = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [deleting, setDeleting]   = useState(false)
  const [confirmOpen, setConfirm] = useState(false)

  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isDirty = useRef(false)

  const categoryLabel = DIRECTORY_CATEGORY_LABELS[entry.category]
  const adminHref = '/admin/directory'

  function buildFields() {
    return {
      name,
      organization: organization || null,
      description,
      website_url: website_url.trim() || null,
      email: email.trim() || null,
      mode: (mode || null) as DirectoryMode | null,
      photo_path: photoPath,
    }
  }

  function scheduleAutosave() {
    isDirty.current = true
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current)
    autosaveTimer.current = setTimeout(async () => {
      if (!isDirty.current) return
      await updateDirectoryEntry(entry.id, buildFields())
      isDirty.current = false
    }, AUTOSAVE_MS)
  }

  const handleDescriptionChange = useCallback((html: string) => {
    setDescription(html)
    scheduleAutosave()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSave() {
    if (!name.trim()) { toast.error('Name is required.'); return }
    setSaving(true)
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current)
    const result = await updateDirectoryEntry(entry.id, buildFields())
    setSaving(false)
    isDirty.current = false
    if (!result.success) toast.error(result.error ?? 'Failed to save.')
    else toast.success('Saved.')
  }

  async function handlePublishToggle(val: boolean) {
    setPublishing(true)
    const result = await toggleDirectoryEntryPublished(entry.id, val)
    setPublishing(false)
    if (!result.success) toast.error(result.error ?? 'Failed to update status.')
    else { setPublished(val); toast.success(val ? 'Published.' : 'Set to draft.') }
  }

  async function handleDelete() {
    setDeleting(true)
    const result = await deleteDirectoryEntry(entry.id)
    setDeleting(false)
    setConfirm(false)
    if (!result.success) { toast.error(result.error ?? 'Failed to delete.'); return }
    toast.success('Entry deleted.')
    router.push(adminHref)
  }

  return (
    <>
      <div className="space-y-6 pb-12">
        <div className="flex flex-wrap items-center gap-3 justify-between">
          <Link href={adminHref} className="flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] dark:hover:text-[#e8ecec] transition-colors cursor-pointer">
            <ArrowLeft className="h-4 w-4" />
            Back to Directory
          </Link>
          <div className="flex items-center gap-3">
            <PublishToggle published={published} onChange={handlePublishToggle} loading={publishing} />
            <Button onClick={handleSave} disabled={saving} className="cursor-pointer bg-[var(--color-brand-teal)] hover:bg-[var(--color-brand-teal-dark)] text-white">
              {saving ? 'Saving…' : 'Save'}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger className="p-2 rounded cursor-pointer text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] dark:hover:text-[#e8ecec] hover:bg-[var(--color-surface-hover)] dark:hover:bg-[var(--color-dark-surface-hover)] transition-colors">
                <MoreVertical className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setConfirm(true)} className="cursor-pointer gap-2 text-red-600 focus:text-red-600">
                  <Trash2 className="h-4 w-4" /> Delete Entry
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">
          {/* Main */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-[var(--color-text-muted)] text-xs uppercase tracking-wide">Name</Label>
              <Input value={name} onChange={(e) => { setName(e.target.value); scheduleAutosave() }} placeholder="Full name" className="font-display text-lg border-[var(--color-border)] dark:border-[var(--color-dark-border)]" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[var(--color-text-muted)] text-xs uppercase tracking-wide">Organisation</Label>
              <Input value={organization} onChange={(e) => { setOrg(e.target.value); scheduleAutosave() }} placeholder="e.g. Brock University" className="text-sm border-[var(--color-border)] dark:border-[var(--color-dark-border)]" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[var(--color-text-muted)] text-xs uppercase tracking-wide">Description</Label>
              <RichTextEditor content={description} onChange={handleDescriptionChange} folder={`directory/${entry.category}/inline`} placeholder="Write a bio or description…" />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 lg:sticky lg:top-6">
            {/* Photo */}
            <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] p-4 bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] space-y-3">
              <p className="text-xs uppercase tracking-wide text-[var(--color-text-muted)] font-medium">Photo</p>
              <ImageUpload
                currentUrl={photoUrl}
                folder={`directory/${entry.category}`}
                onUpload={(url, path) => { setPhotoUrl(url); setPhotoPath(path); scheduleAutosave() }}
                onRemove={() => { setPhotoUrl(undefined); setPhotoPath(null); scheduleAutosave() }}
              />
            </div>

            {/* Category (read-only badge) */}
            <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] p-4 bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] space-y-2">
              <p className="text-xs uppercase tracking-wide text-[var(--color-text-muted)] font-medium">Category</p>
              <p className="text-sm text-[var(--color-text-primary)] dark:text-[#e8ecec] font-medium">{categoryLabel}</p>
            </div>

            {/* Mode */}
            <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] p-4 bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] space-y-2">
              <Label className="text-[var(--color-text-muted)] text-xs uppercase tracking-wide">Mode</Label>
              <select
                value={mode}
                onChange={(e) => { setMode(e.target.value as DirectoryMode | ''); scheduleAutosave() }}
                className="w-full h-9 rounded-md border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-background)] dark:bg-[var(--color-dark-surface-hover)] text-[var(--color-text-primary)] dark:text-[#e8ecec] text-sm px-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-teal)] cursor-pointer"
              >
                <option value="">Not specified</option>
                {(Object.entries(DIRECTORY_MODE_LABELS) as [DirectoryMode, string][]).map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
            </div>

            {/* Website URL */}
            <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] p-4 bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] space-y-2">
              <Label className="text-[var(--color-text-muted)] text-xs uppercase tracking-wide">Website URL</Label>
              <Input type="url" value={website_url} onChange={(e) => { setWebsite(e.target.value); scheduleAutosave() }} placeholder="https://example.com" className="text-sm border-[var(--color-border)] dark:border-[var(--color-dark-border)]" />
            </div>

            {/* Email */}
            <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] p-4 bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] space-y-2">
              <Label className="text-[var(--color-text-muted)] text-xs uppercase tracking-wide">Email</Label>
              <Input type="email" value={email} onChange={(e) => { setEmail(e.target.value); scheduleAutosave() }} placeholder="contact@example.com" className="text-sm border-[var(--color-border)] dark:border-[var(--color-dark-border)]" />
            </div>

            {/* Meta */}
            <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] p-4 bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] space-y-2">
              <p className="text-xs uppercase tracking-wide text-[var(--color-text-muted)] font-medium">Meta</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-muted)]">Created</span>
                  <span className="text-[var(--color-text-primary)] dark:text-[#e8ecec]">{formatDate(entry.created_at)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-muted)]">Updated</span>
                  <span className="text-[var(--color-text-primary)] dark:text-[#e8ecec]">{formatDate(entry.updated_at)}</span>
                </div>
              </div>
            </div>

            <button onClick={() => setConfirm(true)} className="w-full text-sm text-red-600 hover:text-red-700 cursor-pointer py-2 rounded-lg border border-red-200 dark:border-red-900/40 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors">
              Delete Entry
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirm}
        title="Delete Entry"
        description="This action cannot be undone. The entry will be permanently removed."
        onConfirm={handleDelete}
        loading={deleting}
      />
    </>
  )
}
