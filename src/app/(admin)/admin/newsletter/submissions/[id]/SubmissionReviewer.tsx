'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ArrowLeft, CheckCircle, XCircle, BookOpen, FileText, MessageSquare, RotateCcw, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import RichTextEditor from '@/components/shared/RichTextEditor'
import {
  approveSubmission,
  rejectSubmission,
  setSubmissionPending,
  deleteSubmission,
  updateSubmissionContent,
  updateSubmissionAdminNote,
  assignToEdition,
} from '@/actions/newsletter'
import { formatDate } from '@/lib/utils'
import type { NewsletterEdition, NewsletterSubmission, SubmissionType, SubmissionStatus } from '@/types'

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

const STATUS_BADGE: Record<SubmissionStatus, { label: string; className: string }> = {
  pending:  { label: 'Pending Review', className: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400' },
  approved: { label: 'Approved',       className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' },
  rejected: { label: 'Rejected',       className: 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400' },
}

interface Props {
  submission: NewsletterSubmission
  editions: NewsletterEdition[]
}

export default function SubmissionReviewer({ submission: initial, editions }: Props) {
  const router = useRouter()

  const [submission, setSubmission] = useState(initial)
  const [content, setContent]       = useState(initial.content)
  const [adminNote, setAdminNote]   = useState(initial.admin_note ?? '')
  const [editionId, setEditionId]   = useState<string>(initial.edition_id ?? '')
  const [rejectNote, setRejectNote] = useState('')

  const [approving, setApproving]   = useState(false)
  const [rejecting, setRejecting]   = useState(false)
  const [resetting, setResetting]   = useState(false)
  const [deleting, setDeleting]     = useState(false)
  const [rejectOpen, setRejectOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [saving, setSaving]         = useState(false)

  const TypeIcon  = TYPE_ICON[submission.type]
  const statusCfg = STATUS_BADGE[submission.status]

  // ── Actions ────────────────────────────────────────────────────────────────

  async function handleApprove() {
    setApproving(true)
    const result = await approveSubmission(submission.id, adminNote || undefined)
    setApproving(false)
    if (!result.success) { toast.error(result.error ?? 'Failed to approve.'); return }
    setSubmission(result.data!)
    toast.success('Submission approved.')
  }

  async function handleReject() {
    if (!rejectNote.trim()) { toast.error('A rejection note is required.'); return }
    setRejecting(true)
    const result = await rejectSubmission(submission.id, rejectNote)
    setRejecting(false)
    if (!result.success) { toast.error(result.error ?? 'Failed to reject.'); return }
    setSubmission(result.data!)
    setRejectOpen(false)
    toast.success('Submission rejected.')
  }

  async function handleReset() {
    setResetting(true)
    const result = await setSubmissionPending(submission.id)
    setResetting(false)
    if (!result.success) { toast.error(result.error ?? 'Failed to reset.'); return }
    setSubmission(result.data!)
    setAdminNote('')
    toast.success('Submission reset to pending.')
  }

  async function handleDelete() {
    setDeleting(true)
    const result = await deleteSubmission(submission.id)
    setDeleting(false)
    if (!result.success) { toast.error(result.error ?? 'Failed to delete.'); return }
    toast.success('Submission deleted.')
    router.push('/admin/newsletter')
  }

  async function handleSave() {
    setSaving(true)
    const [contentResult, noteResult] = await Promise.all([
      updateSubmissionContent(submission.id, content),
      adminNote !== (submission.admin_note ?? '')
        ? updateSubmissionAdminNote(submission.id, adminNote)
        : Promise.resolve({ success: true }),
    ])

    if (editionId !== (submission.edition_id ?? '')) {
      await assignToEdition(submission.id, editionId || null)
      setSubmission((prev) => ({ ...prev, edition_id: editionId || null }))
    }

    setSaving(false)

    if (!contentResult.success || !noteResult.success) {
      toast.error('Failed to save some changes.')
    } else {
      toast.success('Changes saved.')
    }
  }

  return (
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

        {/* Status + review actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusCfg.className}`}>
            {statusCfg.label}
          </span>

          {submission.status === 'pending' && (
            <>
              <Button
                onClick={handleApprove}
                disabled={approving || rejecting}
                className="cursor-pointer gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                size="sm"
              >
                <CheckCircle className="h-3.5 w-3.5" />
                {approving ? 'Approving…' : 'Approve'}
              </Button>
              {/* Reject button — hidden until Resend email is wired up
              <Button
                onClick={() => setRejectOpen(true)}
                disabled={approving || rejecting}
                variant="outline"
                size="sm"
                className="cursor-pointer gap-1.5 border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 dark:border-red-800 dark:text-red-400"
              >
                <XCircle className="h-3.5 w-3.5" />
                Reject
              </Button>
              */}
              <Button
                onClick={() => setDeleteOpen(true)}
                disabled={approving}
                variant="outline"
                size="sm"
                className="cursor-pointer gap-1.5 border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 dark:border-red-800 dark:text-red-400"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </Button>
            </>
          )}

          {submission.status === 'approved' && (
            <>
              <Button
                onClick={handleReset}
                disabled={resetting || deleting}
                variant="outline"
                size="sm"
                className="cursor-pointer gap-1.5"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                {resetting ? 'Resetting…' : 'Reset to Pending'}
              </Button>
              <Button
                onClick={() => setDeleteOpen(true)}
                disabled={resetting || deleting}
                variant="outline"
                size="sm"
                className="cursor-pointer gap-1.5 border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 dark:border-red-800 dark:text-red-400"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </Button>
            </>
          )}

          {submission.status === 'rejected' && (
            <>
              <Button
                onClick={handleApprove}
                disabled={approving || resetting || deleting}
                className="cursor-pointer gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                size="sm"
              >
                <CheckCircle className="h-3.5 w-3.5" />
                {approving ? 'Approving…' : 'Approve'}
              </Button>
              <Button
                onClick={handleReset}
                disabled={approving || resetting || deleting}
                variant="outline"
                size="sm"
                className="cursor-pointer gap-1.5"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                {resetting ? 'Resetting…' : 'Reset to Pending'}
              </Button>
              <Button
                onClick={() => setDeleteOpen(true)}
                disabled={approving || resetting || deleting}
                variant="outline"
                size="sm"
                className="cursor-pointer gap-1.5 border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 dark:border-red-800 dark:text-red-400"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 items-start">
        {/* ── Main column ──────────────────────────────────────────────────── */}
        <div className="space-y-6">
          {/* Submitter details (read-only) */}
          <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] p-5 bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] space-y-4">
            <p className="text-xs uppercase tracking-wide text-[var(--color-text-muted)] font-medium">
              Submission Details
            </p>
            <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
              <dt className="text-[var(--color-text-muted)]">Type</dt>
              <dd>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold ${TYPE_COLOR[submission.type]}`}>
                  <TypeIcon className="h-3 w-3" />
                  {TYPE_FULL[submission.type]}
                </span>
              </dd>

              <dt className="text-[var(--color-text-muted)]">Submitted</dt>
              <dd className="text-[var(--color-text-primary)] dark:text-[#e8ecec]">{formatDate(submission.created_at)}</dd>

              <dt className="text-[var(--color-text-muted)]">Name</dt>
              <dd className="text-[var(--color-text-primary)] dark:text-[#e8ecec]">{submission.submitter_name}</dd>

              {submission.submitter_role && (
                <>
                  <dt className="text-[var(--color-text-muted)]">Role</dt>
                  <dd className="text-[var(--color-text-primary)] dark:text-[#e8ecec]">{submission.submitter_role}</dd>
                </>
              )}
              {submission.institution && (
                <>
                  <dt className="text-[var(--color-text-muted)]">Institution</dt>
                  <dd className="text-[var(--color-text-primary)] dark:text-[#e8ecec]">{submission.institution}</dd>
                </>
              )}

              <dt className="text-[var(--color-text-muted)]">Email</dt>
              <dd>
                <a
                  href={`mailto:${submission.submitter_email}`}
                  className="text-[var(--color-brand-teal)] hover:underline"
                >
                  {submission.submitter_email}
                </a>
              </dd>

              {submission.deadline && (
                <>
                  <dt className="text-[var(--color-text-muted)]">Deadline</dt>
                  <dd className="text-[var(--color-text-primary)] dark:text-[#e8ecec]">{formatDate(submission.deadline)}</dd>
                </>
              )}
              {submission.contact_email && (
                <>
                  <dt className="text-[var(--color-text-muted)]">Contact</dt>
                  <dd>
                    <a
                      href={`mailto:${submission.contact_email}`}
                      className="text-[var(--color-brand-teal)] hover:underline"
                    >
                      {submission.contact_email}
                    </a>
                  </dd>
                </>
              )}
            </dl>

            {/* Title + abstract (from submitter) */}
            <div className="space-y-2 pt-2 border-t border-[var(--color-border)] dark:border-[var(--color-dark-border)]">
              <p className="text-xs uppercase tracking-wide text-[var(--color-text-muted)] font-medium">
                Title (from submitter)
              </p>
              <p className="font-medium text-[var(--color-text-primary)] dark:text-[#e8ecec]">
                {submission.title}
              </p>
            </div>

            {submission.abstract && (
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-wide text-[var(--color-text-muted)] font-medium">
                  Abstract (from submitter)
                </p>
                <p className="text-sm text-[var(--color-text-primary)] dark:text-[#e8ecec] leading-relaxed">
                  {submission.abstract}
                </p>
              </div>
            )}
          </div>

          {/* Editorial content (admin edits) */}
          <div className="space-y-1.5">
            <Label className="text-[var(--color-text-muted)] text-xs uppercase tracking-wide">
              Editorial Content (admin edits — appears in newsletter)
            </Label>
            <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] overflow-hidden">
              <RichTextEditor
                content={content}
                onChange={setContent}
                folder="newsletter/inline"
                placeholder="Format the submission content here — what will appear publicly in the newsletter…"
              />
            </div>
          </div>

          {/* Save button */}
          <Button
            onClick={handleSave}
            disabled={saving}
            className="cursor-pointer bg-[var(--color-brand-teal)] hover:bg-[var(--color-brand-teal-dark)] text-white"
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </Button>
        </div>

        {/* ── Sidebar ────────────────────────────────────────────────────────── */}
        <div className="space-y-4 lg:sticky lg:top-6">
          {/* Admin note */}
          <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] p-4 bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] space-y-2">
            <Label htmlFor="admin-note" className="text-[var(--color-text-muted)] text-xs uppercase tracking-wide">
              Admin Note (internal)
            </Label>
            <textarea
              id="admin-note"
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              placeholder="Internal note — not shown publicly…"
              rows={4}
              className="w-full rounded-md border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-background)] dark:bg-[var(--color-dark-surface)] text-[var(--color-text-primary)] dark:text-[#e8ecec] text-sm px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-teal)] placeholder:text-[var(--color-text-muted)]"
            />
          </div>

          {/* Assign to edition */}
          <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] p-4 bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] space-y-2">
            <Label htmlFor="edition-select" className="text-[var(--color-text-muted)] text-xs uppercase tracking-wide">
              Assign to Edition
            </Label>
            <select
              id="edition-select"
              value={editionId}
              onChange={(e) => setEditionId(e.target.value)}
              className="w-full rounded-md border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-background)] dark:bg-[var(--color-dark-surface)] text-[var(--color-text-primary)] dark:text-[#e8ecec] text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-teal)]"
            >
              <option value="">Unassigned</option>
              {editions.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.title}{e.published ? '' : ' (Draft)'}
                </option>
              ))}
            </select>
            <p className="text-xs text-[var(--color-text-muted)]">
              Only approved submissions can be assigned to an edition.
            </p>
          </div>

          {/* Review status */}
          {submission.reviewed_at && (
            <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] p-4 bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] space-y-2">
              <p className="text-xs uppercase tracking-wide text-[var(--color-text-muted)] font-medium">
                Review Info
              </p>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-muted)]">Reviewed</span>
                  <span className="text-[var(--color-text-primary)] dark:text-[#e8ecec]">{formatDate(submission.reviewed_at)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete confirmation dialog */}
      {deleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm bg-[var(--color-background)] dark:bg-[var(--color-dark-surface)] rounded-2xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] p-6 space-y-4 shadow-xl">
            <h2 className="font-display text-lg font-bold text-[var(--color-text-primary)] dark:text-white">
              Delete Submission?
            </h2>
            <p className="text-sm text-[var(--color-text-muted)]">
              This will permanently remove the submission. This action cannot be undone.
            </p>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setDeleteOpen(false)}
                disabled={deleting}
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                disabled={deleting}
                className="cursor-pointer bg-red-600 hover:bg-red-700 text-white"
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Reject dialog — hidden until Resend email is wired up ─────────────
      {rejectOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md bg-[var(--color-background)] dark:bg-[var(--color-dark-surface)] rounded-2xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] p-6 space-y-4 shadow-xl">
            <h2 className="font-display text-lg font-bold text-[var(--color-text-primary)] dark:text-white">
              Reject Submission
            </h2>
            <p className="text-sm text-[var(--color-text-muted)]">
              Please provide a rejection note. This will be included in the email sent to the submitter.
            </p>
            <textarea
              value={rejectNote}
              onChange={(e) => setRejectNote(e.target.value)}
              placeholder="Reason for rejection…"
              rows={4}
              autoFocus
              className="w-full rounded-md border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface-hover)] text-[var(--color-text-primary)] dark:text-[#e8ecec] text-sm px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-teal)] placeholder:text-[var(--color-text-muted)]"
            />
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setRejectOpen(false)}
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                onClick={handleReject}
                disabled={rejecting}
                className="cursor-pointer bg-red-600 hover:bg-red-700 text-white"
              >
                {rejecting ? 'Rejecting…' : 'Reject Submission'}
              </Button>
            </div>
          </div>
        </div>
      )}
      */}
    </div>
  )
}
