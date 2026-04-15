'use server'

import {
  mockNewsletterEditions,
  mockNewsletterSubmissions,
  type SubmissionType,
  type SubmissionStatus,
} from '@/lib/mock-data'
import { slugify } from '@/lib/utils'
import type {
  NewsletterEdition,
  NewsletterSubmission,
  ActionResult,
} from '@/types'

// ─── In-memory mock stores ────────────────────────────────────────────────────
// TODO: Remove both stores once Supabase is wired up.

let editionStore: NewsletterEdition[] = mockNewsletterEditions.map((e) => ({
  id: e.id,
  title: e.title,
  slug: e.slug,
  intro: e.intro,
  cover_path: null,
  published: e.published,
  published_at: e.published_at || null,
  created_at: e.created_at,
  updated_at: e.updated_at,
}))

let submissionStore: NewsletterSubmission[] = mockNewsletterSubmissions.map((s) => ({
  id: s.id,
  type: s.type,
  status: s.status,
  title: s.title,
  content: s.content,
  abstract: s.abstract || null,
  submitter_name: s.submitter_name,
  submitter_email: s.submitter_email,
  submitter_role: s.submitter_role || null,
  institution: s.institution || null,
  admin_note: s.admin_note || null,
  reviewed_at: s.reviewed_at || null,
  edition_id: s.edition_id,
  deadline: s.deadline,
  contact_email: s.contact_email,
  created_at: s.created_at,
  updated_at: s.updated_at,
}))

// ─── Editions ─────────────────────────────────────────────────────────────────

export async function getAdminEditions(): Promise<ActionResult<NewsletterEdition[]>> {
  try {
    // TODO: Supabase swap ↓
    // const supabase = createServerClient()
    // const { data, error } = await supabase
    //   .from('newsletter_editions')
    //   .select('*')
    //   .order('created_at', { ascending: false })
    // if (error) throw error
    // return { success: true, data }

    const sorted = [...editionStore].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
    return { success: true, data: sorted }
  } catch {
    return { success: false, error: 'Failed to load editions.' }
  }
}

export async function getEditionById(id: string): Promise<ActionResult<NewsletterEdition>> {
  try {
    // TODO: Supabase swap ↓
    // const supabase = createServerClient()
    // const { data, error } = await supabase
    //   .from('newsletter_editions')
    //   .select('*')
    //   .eq('id', id)
    //   .single()
    // if (error) throw error
    // return { success: true, data }

    const edition = editionStore.find((e) => e.id === id)
    if (!edition) return { success: false, error: 'Edition not found.' }
    return { success: true, data: edition }
  } catch {
    return { success: false, error: 'Failed to load edition.' }
  }
}

export async function createEdition(): Promise<ActionResult<NewsletterEdition>> {
  try {
    // TODO: Supabase swap ↓
    // const supabase = createServerClient()
    // const { data, error } = await supabase
    //   .from('newsletter_editions')
    //   .insert({ title: 'Untitled Edition', slug: `edition-${Date.now()}`, intro: '', published: false })
    //   .select()
    //   .single()
    // if (error) throw error
    // return { success: true, data }

    const now = new Date().toISOString()
    const newEdition: NewsletterEdition = {
      id: crypto.randomUUID(),
      title: 'Untitled Edition',
      slug: `edition-${Date.now()}`,
      intro: '',
      cover_path: null,
      published: false,
      published_at: null,
      created_at: now,
      updated_at: now,
    }
    editionStore = [newEdition, ...editionStore]
    return { success: true, data: newEdition }
  } catch {
    return { success: false, error: 'Failed to create edition.' }
  }
}

export async function updateEdition(
  id: string,
  fields: Partial<Pick<NewsletterEdition, 'title' | 'slug' | 'intro' | 'cover_path'>>,
): Promise<ActionResult<NewsletterEdition>> {
  try {
    // TODO: Supabase swap ↓
    // const supabase = createServerClient()
    // const { data, error } = await supabase
    //   .from('newsletter_editions')
    //   .update({ ...fields, updated_at: new Date().toISOString() })
    //   .eq('id', id)
    //   .select()
    //   .single()
    // if (error) throw error
    // return { success: true, data }

    editionStore = editionStore.map((e) =>
      e.id === id ? { ...e, ...fields, updated_at: new Date().toISOString() } : e,
    )
    const updated = editionStore.find((e) => e.id === id)
    if (!updated) return { success: false, error: 'Edition not found.' }
    return { success: true, data: updated }
  } catch {
    return { success: false, error: 'Failed to update edition.' }
  }
}

export async function toggleEditionPublished(
  id: string,
  published: boolean,
): Promise<ActionResult<NewsletterEdition>> {
  try {
    // TODO: Supabase swap ↓
    // const supabase = createServerClient()
    // const { data, error } = await supabase
    //   .from('newsletter_editions')
    //   .update({ published, published_at: published ? new Date().toISOString() : null, updated_at: new Date().toISOString() })
    //   .eq('id', id)
    //   .select()
    //   .single()
    // if (error) throw error
    // return { success: true, data }

    const now = new Date().toISOString()
    editionStore = editionStore.map((e) =>
      e.id === id
        ? { ...e, published, published_at: published ? now : null, updated_at: now }
        : e,
    )
    const updated = editionStore.find((e) => e.id === id)
    if (!updated) return { success: false, error: 'Edition not found.' }
    return { success: true, data: updated }
  } catch {
    return { success: false, error: 'Failed to toggle edition.' }
  }
}

export async function deleteEdition(id: string): Promise<ActionResult> {
  try {
    // TODO: Supabase swap ↓
    // const supabase = createServerClient()
    // const { error } = await supabase.from('newsletter_editions').delete().eq('id', id)
    // if (error) throw error
    // return { success: true }

    editionStore = editionStore.filter((e) => e.id !== id)
    // Unassign any submissions that were in this edition
    submissionStore = submissionStore.map((s) =>
      s.edition_id === id ? { ...s, edition_id: null } : s,
    )
    return { success: true }
  } catch {
    return { success: false, error: 'Failed to delete edition.' }
  }
}

// ─── Submissions ──────────────────────────────────────────────────────────────

export async function getAdminSubmissions(filters?: {
  type?: SubmissionType
  status?: SubmissionStatus
  editionId?: string
}): Promise<ActionResult<NewsletterSubmission[]>> {
  try {
    // TODO: Supabase swap ↓
    // const supabase = createServerClient()
    // let query = supabase.from('newsletter_submissions').select('*').order('created_at', { ascending: false })
    // if (filters?.type)      query = query.eq('type', filters.type)
    // if (filters?.status)    query = query.eq('status', filters.status)
    // if (filters?.editionId) query = query.eq('edition_id', filters.editionId)
    // const { data, error } = await query
    // if (error) throw error
    // return { success: true, data }

    let results = [...submissionStore].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
    if (filters?.type)      results = results.filter((s) => s.type === filters.type)
    if (filters?.status)    results = results.filter((s) => s.status === filters.status)
    if (filters?.editionId) results = results.filter((s) => s.edition_id === filters.editionId)
    return { success: true, data: results }
  } catch {
    return { success: false, error: 'Failed to load submissions.' }
  }
}

export async function getSubmissionById(id: string): Promise<ActionResult<NewsletterSubmission>> {
  try {
    // TODO: Supabase swap ↓
    // const supabase = createServerClient()
    // const { data, error } = await supabase
    //   .from('newsletter_submissions')
    //   .select('*')
    //   .eq('id', id)
    //   .single()
    // if (error) throw error
    // return { success: true, data }

    const submission = submissionStore.find((s) => s.id === id)
    if (!submission) return { success: false, error: 'Submission not found.' }
    return { success: true, data: submission }
  } catch {
    return { success: false, error: 'Failed to load submission.' }
  }
}

export async function submitToNewsletter(data: {
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
  try {
    // TODO: Supabase swap ↓ (use anon key — RLS allows public insert without auth)
    // const supabase = createBrowserClient()
    // const { data: row, error } = await supabase
    //   .from('newsletter_submissions')
    //   .insert({ ...data, status: 'pending' })
    //   .select()
    //   .single()
    // if (error) throw error
    // TODO: Send confirmation email via Resend here
    // return { success: true, data: row }

    const now = new Date().toISOString()
    const newSubmission: NewsletterSubmission = {
      id: crypto.randomUUID(),
      type: data.type,
      status: 'pending',
      title: data.title,
      content: data.content,
      abstract: data.abstract || null,
      submitter_name: data.submitter_name,
      submitter_email: data.submitter_email,
      submitter_role: data.submitter_role ?? null,
      institution: data.institution ?? null,
      admin_note: null,
      reviewed_at: null,
      edition_id: null,
      deadline: data.deadline ?? null,
      contact_email: data.contact_email ?? null,
      created_at: now,
      updated_at: now,
    }
    submissionStore = [newSubmission, ...submissionStore]
    return { success: true, data: newSubmission }
  } catch {
    return { success: false, error: 'Failed to submit. Please try again.' }
  }
}

export async function approveSubmission(
  id: string,
  adminNote?: string,
): Promise<ActionResult<NewsletterSubmission>> {
  try {
    // TODO: Supabase swap ↓
    // const supabase = createServerClient()
    // const { data, error } = await supabase
    //   .from('newsletter_submissions')
    //   .update({ status: 'approved', reviewed_at: new Date().toISOString(), admin_note: adminNote ?? null })
    //   .eq('id', id)
    //   .select()
    //   .single()
    // if (error) throw error
    // TODO: Send SubmissionApproved email via Resend
    // return { success: true, data }

    const now = new Date().toISOString()
    submissionStore = submissionStore.map((s) =>
      s.id === id
        ? { ...s, status: 'approved', reviewed_at: now, admin_note: adminNote ?? s.admin_note, updated_at: now }
        : s,
    )
    const updated = submissionStore.find((s) => s.id === id)
    if (!updated) return { success: false, error: 'Submission not found.' }
    return { success: true, data: updated }
  } catch {
    return { success: false, error: 'Failed to approve submission.' }
  }
}

export async function rejectSubmission(
  id: string,
  adminNote: string,
): Promise<ActionResult<NewsletterSubmission>> {
  try {
    // TODO: Supabase swap ↓
    // const supabase = createServerClient()
    // const { data, error } = await supabase
    //   .from('newsletter_submissions')
    //   .update({ status: 'rejected', reviewed_at: new Date().toISOString(), admin_note: adminNote })
    //   .eq('id', id)
    //   .select()
    //   .single()
    // if (error) throw error
    // TODO: Send SubmissionRejected email via Resend (include adminNote)
    // return { success: true, data }

    const now = new Date().toISOString()
    submissionStore = submissionStore.map((s) =>
      s.id === id
        ? { ...s, status: 'rejected', reviewed_at: now, admin_note: adminNote, updated_at: now }
        : s,
    )
    const updated = submissionStore.find((s) => s.id === id)
    if (!updated) return { success: false, error: 'Submission not found.' }
    return { success: true, data: updated }
  } catch {
    return { success: false, error: 'Failed to reject submission.' }
  }
}

export async function updateSubmissionContent(
  id: string,
  content: string,
): Promise<ActionResult<NewsletterSubmission>> {
  try {
    // TODO: Supabase swap ↓
    // const supabase = createServerClient()
    // const { data, error } = await supabase
    //   .from('newsletter_submissions')
    //   .update({ content, updated_at: new Date().toISOString() })
    //   .eq('id', id)
    //   .select()
    //   .single()
    // if (error) throw error
    // return { success: true, data }

    submissionStore = submissionStore.map((s) =>
      s.id === id ? { ...s, content, updated_at: new Date().toISOString() } : s,
    )
    const updated = submissionStore.find((s) => s.id === id)
    if (!updated) return { success: false, error: 'Submission not found.' }
    return { success: true, data: updated }
  } catch {
    return { success: false, error: 'Failed to update submission content.' }
  }
}

export async function updateSubmissionAdminNote(
  id: string,
  adminNote: string,
): Promise<ActionResult<NewsletterSubmission>> {
  try {
    // TODO: Supabase swap ↓
    // const supabase = createServerClient()
    // const { data, error } = await supabase
    //   .from('newsletter_submissions')
    //   .update({ admin_note: adminNote, updated_at: new Date().toISOString() })
    //   .eq('id', id)
    //   .select()
    //   .single()
    // if (error) throw error
    // return { success: true, data }

    submissionStore = submissionStore.map((s) =>
      s.id === id ? { ...s, admin_note: adminNote, updated_at: new Date().toISOString() } : s,
    )
    const updated = submissionStore.find((s) => s.id === id)
    if (!updated) return { success: false, error: 'Submission not found.' }
    return { success: true, data: updated }
  } catch {
    return { success: false, error: 'Failed to update admin note.' }
  }
}

export async function assignToEdition(
  submissionId: string,
  editionId: string | null,
): Promise<ActionResult<NewsletterSubmission>> {
  try {
    // TODO: Supabase swap ↓
    // const supabase = createServerClient()
    // const { data, error } = await supabase
    //   .from('newsletter_submissions')
    //   .update({ edition_id: editionId, updated_at: new Date().toISOString() })
    //   .eq('id', submissionId)
    //   .select()
    //   .single()
    // if (error) throw error
    // return { success: true, data }

    submissionStore = submissionStore.map((s) =>
      s.id === submissionId
        ? { ...s, edition_id: editionId, updated_at: new Date().toISOString() }
        : s,
    )
    const updated = submissionStore.find((s) => s.id === submissionId)
    if (!updated) return { success: false, error: 'Submission not found.' }
    return { success: true, data: updated }
  } catch {
    return { success: false, error: 'Failed to assign submission to edition.' }
  }
}

export async function getEditionSubmissions(
  editionId: string,
): Promise<ActionResult<NewsletterSubmission[]>> {
  try {
    // TODO: Supabase swap ↓
    // const supabase = createServerClient()
    // const { data, error } = await supabase
    //   .from('newsletter_submissions')
    //   .select('*')
    //   .eq('edition_id', editionId)
    //   .eq('status', 'approved')
    //   .order('type')
    //   .order('created_at')
    // if (error) throw error
    // return { success: true, data }

    const results = submissionStore
      .filter((s) => s.edition_id === editionId && s.status === 'approved')
      .sort((a, b) => {
        const typeOrder = { research_call: 0, research_note: 1, commentary: 2 }
        const typeDiff = typeOrder[a.type] - typeOrder[b.type]
        if (typeDiff !== 0) return typeDiff
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      })
    return { success: true, data: results }
  } catch {
    return { success: false, error: 'Failed to load edition submissions.' }
  }
}

// ─── Public queries ───────────────────────────────────────────────────────────

export async function getPublishedEditions(): Promise<ActionResult<NewsletterEdition[]>> {
  try {
    // TODO: Supabase swap ↓
    // const supabase = createServerClient()
    // const { data, error } = await supabase
    //   .from('newsletter_editions')
    //   .select('*')
    //   .eq('published', true)
    //   .order('published_at', { ascending: false })
    // if (error) throw error
    // return { success: true, data }

    const results = editionStore
      .filter((e) => e.published)
      .sort((a, b) => {
        const aDate = a.published_at ?? a.created_at
        const bDate = b.published_at ?? b.created_at
        return new Date(bDate).getTime() - new Date(aDate).getTime()
      })
    return { success: true, data: results }
  } catch {
    return { success: false, error: 'Failed to load editions.' }
  }
}

export async function getPublishedEditionBySlug(
  slug: string,
): Promise<ActionResult<NewsletterEdition>> {
  try {
    // TODO: Supabase swap ↓
    // const supabase = createServerClient()
    // const { data, error } = await supabase
    //   .from('newsletter_editions')
    //   .select('*')
    //   .eq('slug', slug)
    //   .eq('published', true)
    //   .single()
    // if (error) throw error
    // return { success: true, data }

    const edition = editionStore.find((e) => e.slug === slug && e.published)
    if (!edition) return { success: false, error: 'Edition not found.' }
    return { success: true, data: edition }
  } catch {
    return { success: false, error: 'Failed to load edition.' }
  }
}
