'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  Newspaper,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle,
  XCircle,
  BookOpen,
  FileText,
  MessageSquare,
  Search,
  X,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import { createEdition, deleteEdition } from '@/actions/newsletter'
import { formatDate } from '@/lib/utils'
import type { NewsletterEdition, NewsletterSubmission, SubmissionType, SubmissionStatus } from '@/types'

type MainTab       = 'submissions' | 'editions'
type StatusFilter  = 'all' | SubmissionStatus
type TypeFilter    = 'all' | SubmissionType

interface Props {
  submissions: NewsletterSubmission[]
  editions: NewsletterEdition[]
}

const TYPE_LABEL: Record<SubmissionType, string> = {
  research_call: 'RC',
  research_note: 'RN',
  commentary:    'AC',
}

const TYPE_FULL: Record<SubmissionType, string> = {
  research_call: 'Research Call',
  research_note: 'Research Note',
  commentary:    'Analytical Commentary',
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

export default function NewsletterClient({ submissions: initial, editions: initialEditions }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [mainTab, setMainTab]               = useState<MainTab>('submissions')
  const [statusFilter, setStatusFilter]     = useState<StatusFilter>('all')
  const [typeFilter, setTypeFilter]         = useState<TypeFilter>('all')
  const [submissionQuery, setSubmissionQuery] = useState('')
  const [editionQuery, setEditionQuery]     = useState('')
  const [submissions]                       = useState(initial)
  const [editions, setEditions]             = useState(initialEditions)
  const [deleteEditionId, setDeleteEditionId] = useState<string | null>(null)
  const [deletingEdition, setDeletingEdition] = useState(false)

  const pendingCount  = submissions.filter((s) => s.status === 'pending').length
  const approvedCount = submissions.filter((s) => s.status === 'approved').length
  const rejectedCount = submissions.filter((s) => s.status === 'rejected').length

  const filteredSubmissions = submissions.filter((s) => {
    const q = submissionQuery.toLowerCase()
    const matchesQuery =
      !q ||
      s.title.toLowerCase().includes(q) ||
      s.submitter_name.toLowerCase().includes(q) ||
      s.submitter_email.toLowerCase().includes(q)
    const statusMatch = statusFilter === 'all' || s.status === statusFilter
    const typeMatch   = typeFilter === 'all'   || s.type === typeFilter
    return matchesQuery && statusMatch && typeMatch
  })

  const pendingFirst = [
    ...filteredSubmissions.filter((s) => s.status === 'pending'),
    ...filteredSubmissions.filter((s) => s.status === 'approved'),
    ...filteredSubmissions.filter((s) => s.status === 'rejected'),
  ]

  const filteredEditions = editions.filter((e) => {
    const q = editionQuery.toLowerCase()
    return !q || e.title.toLowerCase().includes(q) || (e.intro ?? '').toLowerCase().includes(q)
  })

  function handleNewEdition() {
    startTransition(async () => {
      const result = await createEdition()
      if (!result.success || !result.data) {
        toast.error(result.error ?? 'Could not create edition.')
        return
      }
      router.push(`/admin/newsletter/editions/${result.data.id}`)
    })
  }

  async function handleDeleteEdition() {
    if (!deleteEditionId) return
    setDeletingEdition(true)
    const result = await deleteEdition(deleteEditionId)
    setDeletingEdition(false)
    setDeleteEditionId(null)
    if (!result.success) {
      toast.error(result.error ?? 'Could not delete edition.')
      return
    }
    setEditions((prev) => prev.filter((e) => e.id !== deleteEditionId))
    toast.success('Edition deleted.')
  }

  const tabBtnClass = (active: boolean) =>
    `px-4 py-2 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
      active
        ? 'border-[var(--color-brand-teal)] text-[var(--color-brand-teal)]'
        : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] dark:hover:text-[#e8ecec]'
    }`

  const filterBtnClass = (active: boolean) =>
    `px-3 py-1 text-xs rounded-full cursor-pointer transition-colors ${
      active
        ? 'bg-[var(--color-brand-teal)] text-white'
        : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] dark:hover:bg-[var(--color-dark-surface-hover)]'
    }`

  return (
    <>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold text-[var(--color-brand-teal)] dark:text-white">
            Newsletter
          </h1>
          {mainTab === 'submissions' ? (
            <Button
              onClick={() => toast.info('Use "Submit a Research Call" from the public form, or approve a pending submission.')}
              className="cursor-pointer gap-1.5 bg-[var(--color-brand-teal)] hover:bg-[var(--color-brand-teal-dark)] text-white"
            >
              <Plus className="h-4 w-4" />
              New Research Call
            </Button>
          ) : (
            <Button
              onClick={handleNewEdition}
              disabled={isPending}
              className="cursor-pointer gap-1.5 bg-[var(--color-brand-teal)] hover:bg-[var(--color-brand-teal-dark)] text-white"
            >
              <Plus className="h-4 w-4" />
              New Edition
            </Button>
          )}
        </div>

        {/* Main tabs */}
        <div className="border-b border-[var(--color-border)] dark:border-[var(--color-dark-border)]">
          <div className="flex gap-0">
            <button onClick={() => setMainTab('submissions')} className={tabBtnClass(mainTab === 'submissions')}>
              Submissions
              {pendingCount > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center h-4 min-w-4 px-1 rounded-full bg-amber-500 text-white text-[10px] font-bold">
                  {pendingCount}
                </span>
              )}
            </button>
            <button onClick={() => setMainTab('editions')} className={tabBtnClass(mainTab === 'editions')}>
              Editions
            </button>
          </div>
        </div>

        {/* ── Submissions tab ─────────────────────────────────────────────────── */}
        {mainTab === 'submissions' && (
          <div className="space-y-4">
            {/* Search */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)] pointer-events-none" />
              <input
                type="text"
                value={submissionQuery}
                onChange={(e) => setSubmissionQuery(e.target.value)}
                placeholder="Search by name, email, or title…"
                className="w-full pl-9 pr-8 h-9 text-sm rounded-lg border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-background)] dark:bg-[var(--color-dark-surface)] text-[var(--color-text-primary)] dark:text-[#e8ecec] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-teal)] transition-colors"
              />
              {submissionQuery && (
                <button
                  onClick={() => setSubmissionQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Filter rows */}
            <div className="flex flex-wrap gap-3">
              <div className="flex gap-1 p-1 rounded-lg bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] w-fit">
                {(['all', 'pending', 'approved', 'rejected'] as StatusFilter[]).map((f) => {
                  const count = f === 'pending' ? pendingCount : f === 'approved' ? approvedCount : f === 'rejected' ? rejectedCount : submissions.length
                  return (
                    <button key={f} onClick={() => setStatusFilter(f)} className={filterBtnClass(statusFilter === f)}>
                      {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
                      {f !== 'all' && <span className="ml-1 opacity-70">({count})</span>}
                    </button>
                  )
                })}
              </div>

              <div className="flex gap-1 p-1 rounded-lg bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] w-fit">
                {(['all', 'research_call', 'research_note', 'commentary'] as TypeFilter[]).map((f) => (
                  <button key={f} onClick={() => setTypeFilter(f)} className={filterBtnClass(typeFilter === f)}>
                    {f === 'all' ? 'All Types' : TYPE_FULL[f as SubmissionType]}
                  </button>
                ))}
              </div>
            </div>

            {/* Result count */}
            {(submissionQuery || statusFilter !== 'all' || typeFilter !== 'all') && (
              <p className="text-sm text-[var(--color-text-muted)]">
                Showing {pendingFirst.length} of {submissions.length} {submissions.length === 1 ? 'submission' : 'submissions'}
              </p>
            )}

            {/* Submission list */}
            {pendingFirst.length === 0 ? (
              <SubmissionsEmpty hasQuery={!!submissionQuery} onClear={() => { setSubmissionQuery(''); setStatusFilter('all'); setTypeFilter('all') }} />
            ) : (
              <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] overflow-hidden">
                {pendingFirst.map((s, i) => (
                  <SubmissionRow key={s.id} submission={s} index={i} onReview={() => router.push(`/admin/newsletter/submissions/${s.id}`)} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Editions tab ────────────────────────────────────────────────────── */}
        {mainTab === 'editions' && (
          <div className="space-y-4">
            {/* Search */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)] pointer-events-none" />
              <input
                type="text"
                value={editionQuery}
                onChange={(e) => setEditionQuery(e.target.value)}
                placeholder="Search editions…"
                className="w-full pl-9 pr-8 h-9 text-sm rounded-lg border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-background)] dark:bg-[var(--color-dark-surface)] text-[var(--color-text-primary)] dark:text-[#e8ecec] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-teal)] transition-colors"
              />
              {editionQuery && (
                <button
                  onClick={() => setEditionQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Result count */}
            {editionQuery && (
              <p className="text-sm text-[var(--color-text-muted)]">
                Showing {filteredEditions.length} of {editions.length} {editions.length === 1 ? 'edition' : 'editions'}
              </p>
            )}

            {filteredEditions.length === 0 ? (
              editionQuery ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4 text-center rounded-xl border border-dashed border-[var(--color-border)] dark:border-[var(--color-dark-border)]">
                  <Newspaper className="h-8 w-8 text-[var(--color-text-muted)]" />
                  <div>
                    <p className="font-medium text-[var(--color-text-primary)] dark:text-[#e8ecec]">No results for &ldquo;{editionQuery}&rdquo;</p>
                    <p className="text-sm text-[var(--color-text-muted)] mt-1">Try a different search.</p>
                  </div>
                  <Button variant="ghost" onClick={() => setEditionQuery('')} className="cursor-pointer text-[var(--color-brand-teal)]">
                    Clear search
                  </Button>
                </div>
              ) : (
                <EditionsEmpty onNew={handleNewEdition} creating={isPending} />
              )
            ) : (
              <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] overflow-hidden">
                {filteredEditions.map((edition, i) => (
                  <EditionRow
                    key={edition.id}
                    edition={edition}
                    index={i}
                    submissionCount={submissions.filter((s) => s.edition_id === edition.id && s.status === 'approved').length}
                    onEdit={() => router.push(`/admin/newsletter/editions/${edition.id}`)}
                    onDelete={() => setDeleteEditionId(edition.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteEditionId}
        onOpenChange={(open) => !open && setDeleteEditionId(null)}
        title="Delete Edition"
        description="This will permanently delete the edition. Submissions assigned to it will become unassigned."
        onConfirm={handleDeleteEdition}
        loading={deletingEdition}
      />
    </>
  )
}

function SubmissionRow({
  submission: s,
  index,
  onReview,
}: {
  submission: NewsletterSubmission
  index: number
  onReview: () => void
}) {
  const TypeIcon = TYPE_ICON[s.type]

  const statusIcon =
    s.status === 'pending'  ? <Clock className="h-3.5 w-3.5" /> :
    s.status === 'approved' ? <CheckCircle className="h-3.5 w-3.5" /> :
                              <XCircle className="h-3.5 w-3.5" />

  const statusColor =
    s.status === 'pending'  ? 'text-amber-600 bg-amber-50 dark:bg-amber-950/30' :
    s.status === 'approved' ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30' :
                              'text-red-600 bg-red-50 dark:bg-red-950/30'

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.25 }}
      className="flex items-center gap-4 px-4 py-3 border-b last:border-b-0 border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-background)] dark:bg-[var(--color-dark-surface)] hover:bg-[var(--color-surface)] dark:hover:bg-[var(--color-dark-surface-hover)] transition-colors"
    >
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold shrink-0 ${TYPE_COLOR[s.type]}`}>
        <TypeIcon className="h-3 w-3" />
        {TYPE_LABEL[s.type]}
      </span>

      <div className="flex-1 min-w-0">
        <p className="font-medium text-[var(--color-text-primary)] dark:text-[#e8ecec] truncate">
          {s.title}
        </p>
        <p className="text-sm text-[var(--color-text-muted)] truncate mt-0.5">
          {s.submitter_name}
          {s.institution ? ` · ${s.institution}` : ''}
          {' · '}
          {formatDate(s.created_at)}
        </p>
      </div>

      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium shrink-0 ${statusColor}`}>
        {statusIcon}
        {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
      </span>

      <Button
        variant="ghost"
        size="sm"
        onClick={onReview}
        className="cursor-pointer shrink-0 gap-1 text-[var(--color-brand-teal)] hover:text-[var(--color-brand-teal-dark)] hover:bg-[var(--color-surface-hover)] dark:hover:bg-[var(--color-dark-surface-hover)]"
      >
        Review
        <ArrowRight className="h-3.5 w-3.5" />
      </Button>
    </motion.div>
  )
}

function EditionRow({
  edition,
  index,
  submissionCount,
  onEdit,
  onDelete,
}: {
  edition: NewsletterEdition
  index: number
  submissionCount: number
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.25 }}
      className="flex items-center gap-4 px-4 py-3 border-b last:border-b-0 border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-background)] dark:bg-[var(--color-dark-surface)] hover:bg-[var(--color-surface)] dark:hover:bg-[var(--color-dark-surface-hover)] transition-colors"
    >
      <div className="h-10 w-10 rounded-md bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface-hover)] flex items-center justify-center shrink-0">
        <Newspaper className="h-5 w-5 text-[var(--color-text-muted)]" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-medium text-[var(--color-text-primary)] dark:text-[#e8ecec] truncate">
          {edition.title}
        </p>
        <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
          {submissionCount} {submissionCount === 1 ? 'submission' : 'submissions'}
          {edition.published_at ? ` · Published ${formatDate(edition.published_at)}` : ''}
        </p>
      </div>

      <Badge
        variant={edition.published ? 'default' : 'secondary'}
        className={edition.published ? 'bg-[var(--color-brand-teal)] text-white shrink-0' : 'shrink-0'}
      >
        {edition.published ? 'Published' : 'Draft'}
      </Badge>

      <div className="flex items-center gap-2 shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={onEdit}
          className="cursor-pointer gap-1 text-[var(--color-brand-teal)] hover:text-[var(--color-brand-teal-dark)] hover:bg-[var(--color-surface-hover)] dark:hover:bg-[var(--color-dark-surface-hover)]"
        >
          Edit
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="cursor-pointer text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
        >
          Delete
        </Button>
      </div>
    </motion.div>
  )
}

function SubmissionsEmpty({ hasQuery, onClear }: { hasQuery: boolean; onClear: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center rounded-xl border border-dashed border-[var(--color-border)] dark:border-[var(--color-dark-border)]">
      <div className="h-12 w-12 rounded-full bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] flex items-center justify-center">
        <FileText className="h-6 w-6 text-[var(--color-text-muted)]" />
      </div>
      <p className="font-medium text-[var(--color-text-primary)] dark:text-[#e8ecec]">No submissions match this filter</p>
      <p className="text-sm text-[var(--color-text-muted)]">Try changing the status, type, or search query.</p>
      {hasQuery && (
        <Button variant="ghost" onClick={onClear} className="cursor-pointer text-[var(--color-brand-teal)]">
          Clear filters
        </Button>
      )}
    </div>
  )
}

function EditionsEmpty({ onNew, creating }: { onNew: () => void; creating: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center rounded-xl border border-dashed border-[var(--color-border)] dark:border-[var(--color-dark-border)]">
      <div className="h-12 w-12 rounded-full bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] flex items-center justify-center">
        <Newspaper className="h-6 w-6 text-[var(--color-text-muted)]" />
      </div>
      <div>
        <p className="font-medium text-[var(--color-text-primary)] dark:text-[#e8ecec]">No editions yet</p>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">Create your first edition to get started.</p>
      </div>
      <Button
        onClick={onNew}
        disabled={creating}
        className="cursor-pointer bg-[var(--color-brand-teal)] hover:bg-[var(--color-brand-teal-dark)] text-white gap-1.5"
      >
        <Plus className="h-4 w-4" />
        Create first edition
      </Button>
    </div>
  )
}
