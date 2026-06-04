'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

export default function ExportClient() {
  const [exporting, setExporting] = useState(false)

  async function handleExport() {
    setExporting(true)
    try {
      const res = await fetch('/api/export')
      if (!res.ok) throw new Error()
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `institute-export-${new Date().toISOString().slice(0, 10)}.zip`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      toast.error('Export failed. Please try again.')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-[var(--color-text-muted)]">
        Download a complete backup of all your site content and media as a ZIP archive.
        Includes all posts, events, partners, reading list, wellness, research, directory entries,
        newsletter, page content, settings, and all uploaded images and documents.
      </p>
      <Button onClick={handleExport} disabled={exporting} className="cursor-pointer">
        {exporting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Preparing export…
          </>
        ) : (
          'Download Export'
        )}
      </Button>
    </div>
  )
}
