'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type {
  NewsletterEdition,
  NewsletterSubmission,
  ActionResult,
  SubmissionType,
  SubmissionStatus,
} from '@/types'

// ─── Editions ─────────────────────────────────────────────────────────────────

export async function getAdminEditions(): Promise<ActionResult<NewsletterEdition[]>> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('newsletter_editions')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) return { success: false, error: 'Failed to load editions.' }
  return { success: true, data }
}

export async function getEditionById(id: string): Promise<ActionResult<NewsletterEdition>> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('newsletter_editions')
    .select('*')
    .eq('id', id)
    .single()
  if (error) return { success: false, error: 'Failed to load edition.' }
  return { success: true, data }
}

export async function createEdition(): Promise<ActionResult<NewsletterEdition>> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('newsletter_editions')
    .insert({ title: 'Untitled Edition', slug: `edition-${Date.now()}`, intro: '', published: false })
    .select()
    .single()
  if (error) return { success: false, error: 'Failed to create edition.' }
  return { success: true, data }
}

export async function updateEdition(
  id: string,
  fields: Partial<Pick<NewsletterEdition, 'title' | 'slug' | 'intro' | 'cover_path'>>,
): Promise<ActionResult<NewsletterEdition>> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('newsletter_editions')
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) return { success: false, error: 'Failed to update edition.' }
  revalidatePath('/newsletter', 'layout')
  return { success: true, data }
}

export async function toggleEditionPublished(
  id: string,
  published: boolean,
): Promise<ActionResult<NewsletterEdition>> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('newsletter_editions')
    .update({
      published,
      published_at: published ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()
  if (error) return { success: false, error: 'Failed to toggle edition.' }
  revalidatePath('/newsletter', 'layout')
  return { success: true, data }
}

export async function deleteEdition(id: string): Promise<ActionResult> {
  const supabase = await createClient()
  // Unassign submissions before deleting the edition
  await supabase
    .from('newsletter_submissions')
    .update({ edition_id: null })
    .eq('edition_id', id)
  const { error } = await supabase.from('newsletter_editions').delete().eq('id', id)
  if (error) return { success: false, error: 'Failed to delete edition.' }
  revalidatePath('/newsletter', 'layout')
  return { success: true }
}

// ─── Submissions ──────────────────────────────────────────────────────────────

export async function getAdminSubmissions(filters?: {
  type?: SubmissionType
  status?: SubmissionStatus
  editionId?: string
}): Promise<ActionResult<NewsletterSubmission[]>> {
  const supabase = await createClient()
  let query = supabase
    .from('newsletter_submissions')
    .select('*')
    .order('created_at', { ascending: false })
  if (filters?.type)      query = query.eq('type', filters.type)
  if (filters?.status)    query = query.eq('status', filters.status)
  if (filters?.editionId) query = query.eq('edition_id', filters.editionId)
  const { data, error } = await query
  if (error) return { success: false, error: 'Failed to load submissions.' }
  return { success: true, data }
}

export async function getSubmissionById(id: string): Promise<ActionResult<NewsletterSubmission>> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('newsletter_submissions')
    .select('*')
    .eq('id', id)
    .single()
  if (error) return { success: false, error: 'Failed to load submission.' }
  return { success: true, data }
}

export async function submitToNewsletter(formData: {
  type: SubmissionType
  title: string
  abstract: string
  content: string
  submitter_name: string
  submitter_email: string
  submitter_role?: string
  institution?: string
  deadline?: string
  contact_email?: string
}): Promise<ActionResult<NewsletterSubmission>> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('newsletter_submissions')
    .insert({ ...formData, status: 'pending' })
    .select()
    .single()
  if (error) return { success: false, error: 'Failed to submit. Please try again.' }
  // TODO: Send confirmation email via Resend here
  return { success: true, data }
}

export async function approveSubmission(
  id: string,
  adminNote?: string,
): Promise<ActionResult<NewsletterSubmission>> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('newsletter_submissions')
    .update({ status: 'approved', reviewed_at: new Date().toISOString(), admin_note: adminNote ?? null })
    .eq('id', id)
    .select()
    .single()
  if (error) return { success: false, error: 'Failed to approve submission.' }
  // TODO: Send SubmissionApproved email via Resend
  return { success: true, data }
}

export async function rejectSubmission(
  id: string,
  adminNote: string,
): Promise<ActionResult<NewsletterSubmission>> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('newsletter_submissions')
    .update({ status: 'rejected', reviewed_at: new Date().toISOString(), admin_note: adminNote })
    .eq('id', id)
    .select()
    .single()
  if (error) return { success: false, error: 'Failed to reject submission.' }
  // TODO: Send SubmissionRejected email via Resend (include adminNote)
  return { success: true, data }
}

export async function updateSubmissionContent(
  id: string,
  content: string,
): Promise<ActionResult<NewsletterSubmission>> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('newsletter_submissions')
    .update({ content, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) return { success: false, error: 'Failed to update submission content.' }
  return { success: true, data }
}

export async function updateSubmissionAdminNote(
  id: string,
  adminNote: string,
): Promise<ActionResult<NewsletterSubmission>> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('newsletter_submissions')
    .update({ admin_note: adminNote, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) return { success: false, error: 'Failed to update admin note.' }
  return { success: true, data }
}

export async function assignToEdition(
  submissionId: string,
  editionId: string | null,
): Promise<ActionResult<NewsletterSubmission>> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('newsletter_submissions')
    .update({ edition_id: editionId, updated_at: new Date().toISOString() })
    .eq('id', submissionId)
    .select()
    .single()
  if (error) return { success: false, error: 'Failed to assign submission to edition.' }
  return { success: true, data }
}

export async function setSubmissionPending(
  id: string,
): Promise<ActionResult<NewsletterSubmission>> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('newsletter_submissions')
    .update({ status: 'pending', reviewed_at: null, admin_note: null, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) return { success: false, error: 'Failed to reset submission.' }
  return { success: true, data }
}

export async function deleteSubmission(id: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.from('newsletter_submissions').delete().eq('id', id)
  if (error) return { success: false, error: 'Failed to delete submission.' }
  return { success: true }
}

export async function getEditionSubmissions(
  editionId: string,
): Promise<ActionResult<NewsletterSubmission[]>> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('newsletter_submissions')
    .select('*')
    .eq('edition_id', editionId)
    .eq('status', 'approved')
    .order('type')
    .order('created_at')
  if (error) return { success: false, error: 'Failed to load edition submissions.' }
  return { success: true, data }
}

// ─── Public queries ───────────────────────────────────────────────────────────

export async function getPublishedEditions(): Promise<ActionResult<NewsletterEdition[]>> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('newsletter_editions')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false })
  if (error) return { success: false, error: 'Failed to load editions.' }
  return { success: true, data }
}

export async function getPublishedEditionBySlug(
  slug: string,
): Promise<ActionResult<NewsletterEdition>> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('newsletter_editions')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()
  if (error) return { success: false, error: 'Failed to load edition.' }
  return { success: true, data }
}
