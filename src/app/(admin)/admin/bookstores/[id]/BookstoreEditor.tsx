'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { ArrowLeft, MoreVertical, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import PublishToggle from '@/components/shared/PublishToggle'
import ImageUpload from '@/components/shared/ImageUpload'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import { updateBookstore, toggleBookstorePublished, deleteBookstore } from '@/actions/bookstores'
import { formatDate } from '@/lib/utils'
import { CANADIAN_PROVINCES } from '@/types'
import type { Bookstore } from '@/types'

const AUTOSAVE_MS = 2000

interface Props {
  bookstore: Bookstore
  initialPhotoUrl?: string
}

export default function BookstoreEditor({ bookstore, initialPhotoUrl }: Props) {
  const router = useRouter()

  const [name, setName]               = useState(bookstore.name)
  const [description, setDescription] = useState(bookstore.description ?? '')
  const [email, setEmail]             = useState(bookstore.email ?? '')
  const [province, setProvince]       = useState(bookstore.province ?? '')
  const [address, setAddress]         = useState(bookstore.address ?? '')
  const [phoneNumber, setPhoneNumber] = useState(bookstore.phone_number ?? '')
  const [websiteUrl, setWebsiteUrl]   = useState(bookstore.website_url ?? '')
  const [photoPath, setPhotoPath]     = useState<string | null>(bookstore.photo_path)
  const [photoUrl, setPhotoUrl]       = useState<string | undefined>(initialPhotoUrl)
  const [published, setPublished]     = useState(bookstore.published)

  const [saving, setSaving]         = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [deleting, setDeleting]     = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isDirty = useRef(false)

  function buildFields() {
    return {
      name,
      description: description || null,
      email: email || null,
      province: province || null,
      address: address || null,
      phone_number: phoneNumber || null,
      website_url: websiteUrl || null,
      photo_path: photoPath,
    }
  }

  function scheduleAutosave() {
    isDirty.current = true
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current)
    autosaveTimer.current = setTimeout(async () => {
      if (!isDirty.current) return
      await updateBookstore(bookstore.id, buildFields())
      isDirty.current = false
    }, AUTOSAVE_MS)
  }

  async function handleSave() {
    if (!name.trim()) { toast.error('Name is required.'); return }
    setSaving(true)
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current)
    const result = await updateBookstore(bookstore.id, buildFields())
    setSaving(false)
    isDirty.current = false
    if (!result.success) toast.error(result.error ?? 'Failed to save.')
    else toast.success('Saved.')
  }

  async function handlePublishToggle(val: boolean) {
    setPublishing(true)
    const result = await toggleBookstorePublished(bookstore.id, val)
    setPublishing(false)
    if (!result.success) toast.error(result.error ?? 'Failed to update status.')
    else { setPublished(val); toast.success(val ? 'Published.' : 'Set to draft.') }
  }

  async function handleDelete() {
    setDeleting(true)
    const result = await deleteBookstore(bookstore.id)
    setDeleting(false)
    setConfirmOpen(false)
    if (!result.success) { toast.error(result.error ?? 'Failed to delete.'); return }
    toast.success('Bookstore deleted.')
    router.push('/admin/reading-list?tab=bookstores')
  }

  return (
    <>
      <div className="space-y-6 pb-12">
        <div className="flex flex-wrap items-center gap-3 justify-between">
          <Link
            href="/admin/reading-list?tab=bookstores"
            className="flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] dark:hover:text-[#e8ecec] transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Bookstores
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
                <DropdownMenuItem onClick={() => setConfirmOpen(true)} className="cursor-pointer gap-2 text-red-600 focus:text-red-600">
                  <Trash2 className="h-4 w-4" /> Delete Bookstore
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
              <Input
                value={name}
                onChange={(e) => { setName(e.target.value); scheduleAutosave() }}
                placeholder="e.g. Knowledge Bookstore"
                className="font-display text-lg border-[var(--color-border)] dark:border-[var(--color-dark-border)]"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[var(--color-text-muted)] text-xs uppercase tracking-wide">Address</Label>
              <Textarea
                rows={3}
                value={address}
                onChange={(e) => { setAddress(e.target.value); scheduleAutosave() }}
                placeholder="123 Main St, City, Postal Code"
                className="text-sm border-[var(--color-border)] dark:border-[var(--color-dark-border)]"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[var(--color-text-muted)] text-xs uppercase tracking-wide">Description</Label>
              <Textarea
                rows={5}
                value={description}
                onChange={(e) => { setDescription(e.target.value); scheduleAutosave() }}
                placeholder="A short description of the bookstore..."
                className="text-sm border-[var(--color-border)] dark:border-[var(--color-dark-border)] resize-y"
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 lg:sticky lg:top-6">
            {/* Photo */}
            <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] p-4 bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] space-y-3">
              <p className="text-xs uppercase tracking-wide text-[var(--color-text-muted)] font-medium">Photo</p>
              <ImageUpload
                currentUrl={photoUrl}
                folder="bookstores/covers"
                onUpload={(url, path) => { setPhotoUrl(url); setPhotoPath(path); scheduleAutosave() }}
                onRemove={() => { setPhotoUrl(undefined); setPhotoPath(null); scheduleAutosave() }}
              />
            </div>

            {/* Province */}
            <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] p-4 bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] space-y-2">
              <Label className="text-[var(--color-text-muted)] text-xs uppercase tracking-wide">Province</Label>
              <select
                value={province}
                onChange={(e) => { setProvince(e.target.value); scheduleAutosave() }}
                className="w-full h-9 rounded-md border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-background)] dark:bg-[var(--color-dark-surface-hover)] text-[var(--color-text-primary)] dark:text-[#e8ecec] text-sm px-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-teal)] cursor-pointer"
              >
                <option value="">Not specified</option>
                {CANADIAN_PROVINCES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            {/* Email */}
            <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] p-4 bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] space-y-2">
              <Label className="text-[var(--color-text-muted)] text-xs uppercase tracking-wide">Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); scheduleAutosave() }}
                placeholder="store@example.com"
                className="text-sm border-[var(--color-border)] dark:border-[var(--color-dark-border)]"
              />
            </div>

            {/* Phone Number */}
            <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] p-4 bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] space-y-2">
              <Label className="text-[var(--color-text-muted)] text-xs uppercase tracking-wide">Phone Number</Label>
              <Input
                type="tel"
                value={phoneNumber}
                onChange={(e) => { setPhoneNumber(e.target.value); scheduleAutosave() }}
                placeholder="(555) 555-5555"
                className="text-sm border-[var(--color-border)] dark:border-[var(--color-dark-border)]"
              />
            </div>

            {/* Website URL */}
            <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] p-4 bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] space-y-2">
              <Label className="text-[var(--color-text-muted)] text-xs uppercase tracking-wide">Website URL</Label>
              <Input
                type="url"
                value={websiteUrl}
                onChange={(e) => { setWebsiteUrl(e.target.value); scheduleAutosave() }}
                placeholder="https://example.com"
                className="text-sm border-[var(--color-border)] dark:border-[var(--color-dark-border)]"
              />
            </div>

            {/* Meta */}
            <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] p-4 bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] space-y-2">
              <p className="text-xs uppercase tracking-wide text-[var(--color-text-muted)] font-medium">Meta</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-muted)]">Created</span>
                  <span className="text-[var(--color-text-primary)] dark:text-[#e8ecec]">{formatDate(bookstore.created_at)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-muted)]">Updated</span>
                  <span className="text-[var(--color-text-primary)] dark:text-[#e8ecec]">{formatDate(bookstore.updated_at)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setConfirmOpen(true)}
              className="w-full text-sm text-red-600 hover:text-red-700 cursor-pointer py-2 rounded-lg border border-red-200 dark:border-red-900/40 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
            >
              Delete Bookstore
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete Bookstore"
        description="This action cannot be undone. The bookstore will be permanently removed."
        onConfirm={handleDelete}
        loading={deleting}
      />
    </>
  )
}
