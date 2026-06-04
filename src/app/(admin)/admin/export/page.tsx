import ExportClient from '@/components/admin/ExportClient'

export default function AdminExportPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] dark:text-white">
          Export Data
        </h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          Download a complete backup of your site content and media.
        </p>
      </div>
      <ExportClient />
    </div>
  )
}
