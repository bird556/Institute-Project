'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { ImageIcon, Loader2, X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

interface ImageUploadProps {
  currentUrl?: string
  folder: string
  onUpload: (url: string, path: string) => void
  onRemove: () => void
  label?: string
  accept?: string
}

export default function ImageUpload({
  currentUrl,
  folder,
  onUpload,
  onRemove,
  label = 'Cover Image',
  accept = 'image/jpeg,image/png,image/webp,image/svg+xml',
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  async function handleFile(file: File) {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', folder)

      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const json = await res.json() as { url?: string; path?: string; error?: string }

      if (!res.ok || json.error) {
        toast.error(json.error ?? 'Upload failed. Please try again.')
        return
      }

      onUpload(json.url!, json.path!)
    } catch {
      toast.error('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    e.target.value = ''
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-[var(--color-text-primary)] dark:text-[#e8ecec]">
        {label}
      </p>

      {currentUrl ? (
        <div className="relative rounded-lg overflow-hidden border border-[var(--color-border)] dark:border-[var(--color-dark-border)]">
          <div className="relative w-full aspect-video">
            <Image
              src={currentUrl}
              alt="Cover preview"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 400px"
            />
          </div>
          <div className="absolute top-2 right-2 flex gap-1">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="cursor-pointer text-xs h-7"
            >
              {uploading ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Change'}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={onRemove}
              disabled={uploading}
              className="cursor-pointer h-7 w-7 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => !uploading && inputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] aspect-video cursor-pointer hover:bg-[var(--color-surface-hover)] dark:hover:bg-[var(--color-dark-surface-hover)] transition-colors"
        >
          {uploading ? (
            <Loader2 className="h-6 w-6 animate-spin text-[var(--color-text-muted)]" />
          ) : (
            <>
              <ImageIcon className="h-8 w-8 text-[var(--color-text-muted)]" />
              <p className="text-sm text-[var(--color-text-muted)]">
                Click or drag to upload
              </p>
              <p className="text-xs text-[var(--color-text-muted)]">
                JPG, PNG, WebP, SVG — max 5 MB
              </p>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleChange}
      />
    </div>
  )
}
