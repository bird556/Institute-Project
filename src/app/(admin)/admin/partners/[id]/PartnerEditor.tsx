'use client'

import { useState, useRef, useEffect } from 'react'
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
import ImageUpload from '@/components/shared/ImageUpload'
import RichTextEditor from '@/components/shared/RichTextEditor'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import { updatePartner, deletePartner } from '@/actions/partners'
import { formatDate } from '@/lib/utils'
import type { Partner } from '@/types'

const AUTOSAVE_MS = 2000

function isValidUrl(value: string): boolean {
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}

interface PartnerEditorProps {
  partner: Partner
  initialLogoUrl?: string
}

export default function PartnerEditor({ partner, initialLogoUrl }: PartnerEditorProps) {
  const router = useRouter()

  const [name, setName] = useState(partner.name)
  const [description, setDescription] = useState(partner.description ?? '')
  const [logoPath, setLogoPath] = useState<string | null>(partner.logo_path)
  const [logoUrl, setLogoUrl] = useState<string | undefined>(initialLogoUrl)
  const [websiteUrl, setWebsiteUrl] = useState(partner.website_url ?? '')
  const [urlError, setUrlError] = useState('')

  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isDirty = useRef(false)

  function buildFields() {
    return {
      name,
      description: description || null,
      logo_path: logoPath,
      website_url: websiteUrl || null,
    }
  }

  function scheduleAutosave() {
    isDirty.current = true
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current)
    autosaveTimer.current = setTimeout(async () => {
      if (!isDirty.current) return
      await updatePartner(partner.id, buildFields())
      isDirty.current = false
    }, AUTOSAVE_MS)
  }

  useEffect(() => () => { if (autosaveTimer.current) clearTimeout(autosaveTimer.current) }, [])

  function handleNameChange(val: string) {
    setName(val)
    scheduleAutosave()
  }

  function handleDescriptionChange(val: string) {
    setDescription(val)
    scheduleAutosave()
  }

  function handleUrlChange(val: string) {
    setWebsiteUrl(val)
    setUrlError('')
    scheduleAutosave()
  }

  function validate(): boolean {
    if (!name.trim()) {
      toast.error('Organisation name is required.')
      return false
    }
    if (websiteUrl && !isValidUrl(websiteUrl)) {
      setUrlError('Please enter a valid URL (include https://).')
      return false
    }
    return true
  }

  async function handleSave() {
    if (!validate()) return
    setSaving(true)
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current)
    const result = await updatePartner(partner.id, buildFields())
    setSaving(false)
    isDirty.current = false
    if (!result.success) {
      toast.error(result.error ?? 'Failed to save.')
    } else {
      toast.success('Saved.')
    }
  }

  async function handleDelete() {
    setDeleting(true)
    const result = await deletePartner(partner.id)
    setDeleting(false)
    setConfirmOpen(false)
    if (!result.success) {
      toast.error(result.error ?? 'Failed to delete.')
      return
    }
    toast.success('Partner deleted.')
    router.push('/admin/partners')
  }

  return (
    <>
      <div className="space-y-6 pb-12">
        {/* Top bar */}
        <div className="flex flex-wrap items-center gap-3 justify-between">
          <Link
            href="/admin/partners"
            className="flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] dark:hover:text-[#e8ecec] transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Partners
          </Link>

          <div className="flex items-center gap-3">
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
                  Delete Partner
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">
          {/* Main column */}
          <div className="space-y-4">
            {/* Name */}
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-[var(--color-text-muted)] text-xs uppercase tracking-wide">
                Organisation Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Partner organisation name"
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
                folder="partners/inline"
                placeholder="Write a description for this partner organisation…"
                minHeight={250}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 lg:sticky lg:top-6">
            {/* Logo */}
            <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] p-4 bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] space-y-3">
              <p className="text-xs uppercase tracking-wide text-[var(--color-text-muted)] font-medium">
                Logo
              </p>
              <ImageUpload
                currentUrl={logoUrl}
                folder="partners"
                onUpload={(url, path) => {
                  setLogoUrl(url)
                  setLogoPath(path)
                  scheduleAutosave()
                }}
                onRemove={() => {
                  setLogoUrl(undefined)
                  setLogoPath(null)
                  scheduleAutosave()
                }}
              />
            </div>

            {/* Website URL */}
            <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] p-4 bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] space-y-2">
              <Label htmlFor="website-url" className="text-[var(--color-text-muted)] text-xs uppercase tracking-wide">
                Website URL
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="website-url"
                  value={websiteUrl}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  placeholder="https://example.com"
                  className="text-sm border-[var(--color-border)] dark:border-[var(--color-dark-border)]"
                />
                {websiteUrl && isValidUrl(websiteUrl) && (
                  <a
                    href={websiteUrl}
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

            {/* Meta */}
            <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] p-4 bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] space-y-2">
              <p className="text-xs uppercase tracking-wide text-[var(--color-text-muted)] font-medium">
                Meta
              </p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-muted)]">Created</span>
                  <span className="text-[var(--color-text-primary)] dark:text-[#e8ecec]">
                    {formatDate(partner.created_at)}
                  </span>
                </div>
              </div>
            </div>

            {/* Delete */}
            <button
              onClick={() => setConfirmOpen(true)}
              className="w-full text-sm text-red-600 hover:text-red-700 cursor-pointer py-2 rounded-lg border border-red-200 dark:border-red-900/40 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
            >
              Delete Partner
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete Partner"
        description="This action cannot be undone. The partner will be permanently removed."
        onConfirm={handleDelete}
        loading={deleting}
      />
    </>
  )
}
