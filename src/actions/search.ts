'use server'

import { createClient } from '@/lib/supabase/server'
import type { SearchResult, ActionResult } from '@/types'

function coverUrl(supabase: Awaited<ReturnType<typeof createClient>>, path: string | null): string | null {
  if (!path) return null
  return supabase.storage.from('institute-media').getPublicUrl(path).data.publicUrl
}

const DIRECTORY_PATH: Record<string, string> = {
  advocate:        'advocates',
  psychotherapist: 'psychotherapists',
  referral_agency: 'referral-agencies',
}

export async function searchContent(query: string): Promise<ActionResult<SearchResult[]>> {
  if (query.trim().length < 2) return { success: true, data: [] }

  const supabase = await createClient()

  const [blogsRes, eventsRes, readingRes, wellnessRes, researchRes, directoryRes] = await Promise.all([
    supabase
      .from('blog_posts')
      .select('id, title, slug, excerpt, published_at, cover_path')
      .eq('published', true)
      .textSearch('search_vector', query, { type: 'plain', config: 'english' }),
    supabase
      .from('events')
      .select('id, title, slug, event_date, cover_path')
      .eq('published', true)
      .textSearch('search_vector', query, { type: 'plain', config: 'english' }),
    supabase
      .from('reading_list')
      .select('id, title, author, cover_path')
      .eq('published', true)
      .textSearch('search_vector', query, { type: 'plain', config: 'english' }),
    supabase
      .from('wellness_posts')
      .select('id, title, slug, excerpt, published_at, cover_path')
      .eq('published', true)
      .textSearch('search_vector', query, { type: 'plain', config: 'english' }),
    supabase
      .from('research_posts')
      .select('id, title, category, excerpt, published_at, cover_path')
      .eq('published', true)
      .textSearch('search_vector', query, { type: 'plain', config: 'english' }),
    supabase
      .from('directory_entries')
      .select('id, name, organization, description, category, photo_path')
      .eq('published', true)
      .or(`name.ilike.%${query}%,organization.ilike.%${query}%,description.ilike.%${query}%`),
  ])

  const blogs = (blogsRes.data ?? []).map<SearchResult>((b) => ({
    id: b.id,
    type: 'blog',
    title: b.title,
    slug: b.slug,
    excerpt: b.excerpt ?? null,
    published_at: b.published_at ?? null,
    cover_url: coverUrl(supabase, b.cover_path),
  }))

  const events = (eventsRes.data ?? []).map<SearchResult>((e) => ({
    id: e.id,
    type: 'event',
    title: e.title,
    slug: e.slug,
    excerpt: null,
    event_date: e.event_date,
    cover_url: coverUrl(supabase, e.cover_path),
  }))

  const reading = (readingRes.data ?? []).map<SearchResult>((r) => ({
    id: r.id,
    type: 'reading_list',
    title: r.title,
    slug: r.id,
    excerpt: r.author ? `by ${r.author}` : null,
    cover_url: coverUrl(supabase, r.cover_path),
  }))

  const wellness = (wellnessRes.data ?? []).map<SearchResult>((w) => ({
    id: w.id,
    type: 'wellness',
    title: w.title,
    slug: w.slug,
    excerpt: w.excerpt ?? null,
    published_at: w.published_at ?? null,
    cover_url: coverUrl(supabase, w.cover_path),
  }))

  const research = (researchRes.data ?? []).map<SearchResult>((r) => ({
    id: `${r.category}/${r.id}`,
    type: 'research',
    title: r.title,
    slug: r.id,
    excerpt: r.excerpt ?? null,
    published_at: r.published_at ?? null,
    cover_url: coverUrl(supabase, r.cover_path),
  }))

  const directory = (directoryRes.data ?? []).map<SearchResult>((d) => {
    const section = DIRECTORY_PATH[d.category] ?? 'advocates'
    return {
      id: `${section}/${d.id}`,
      type: 'directory',
      title: d.name,
      slug: d.id,
      excerpt: d.organization ?? null,
      cover_url: coverUrl(supabase, d.photo_path),
    }
  })

  return { success: true, data: [...blogs, ...events, ...reading, ...wellness, ...research, ...directory] }
}
