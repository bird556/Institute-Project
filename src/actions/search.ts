'use server'

import { createClient } from '@/lib/supabase/server'
import type { SearchResult, ActionResult } from '@/types'

export async function searchContent(query: string): Promise<ActionResult<SearchResult[]>> {
  if (query.trim().length < 2) return { success: true, data: [] }

  const supabase = await createClient()

  const [blogsRes, eventsRes, readingRes, wellnessRes] = await Promise.all([
    supabase
      .from('blog_posts')
      .select('id, title, slug, excerpt, published_at')
      .eq('published', true)
      .textSearch('search_vector', query, { type: 'plain', config: 'english' }),
    supabase
      .from('events')
      .select('id, title, slug, event_date')
      .eq('published', true)
      .textSearch('search_vector', query, { type: 'plain', config: 'english' }),
    supabase
      .from('reading_list')
      .select('id, title, author')
      .eq('published', true)
      .textSearch('search_vector', query, { type: 'plain', config: 'english' }),
    supabase
      .from('wellness_posts')
      .select('id, title, slug, excerpt, published_at')
      .eq('published', true)
      .textSearch('search_vector', query, { type: 'plain', config: 'english' }),
  ])

  const blogs = (blogsRes.data ?? []).map<SearchResult>((b) => ({
    id: b.id,
    type: 'blog',
    title: b.title,
    slug: b.slug,
    excerpt: b.excerpt ?? null,
    published_at: b.published_at ?? null,
  }))

  const events = (eventsRes.data ?? []).map<SearchResult>((e) => ({
    id: e.id,
    type: 'event',
    title: e.title,
    slug: e.slug,
    excerpt: null,
    event_date: e.event_date,
  }))

  const reading = (readingRes.data ?? []).map<SearchResult>((r) => ({
    id: r.id,
    type: 'reading_list',
    title: r.title,
    slug: r.id,
    excerpt: r.author ? `by ${r.author}` : null,
  }))

  const wellness = (wellnessRes.data ?? []).map<SearchResult>((w) => ({
    id: w.id,
    type: 'wellness',
    title: w.title,
    slug: w.slug,
    excerpt: w.excerpt ?? null,
    published_at: w.published_at ?? null,
  }))

  return { success: true, data: [...blogs, ...events, ...reading, ...wellness] }
}
