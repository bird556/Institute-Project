'use server'

import { mockBlogs, mockEvents, mockReadingList, mockWellnessPosts } from '@/lib/mock-data'
import type { SearchResult, ActionResult } from '@/types'

// ─── Strip HTML tags for plain-text search matching ──────────────────────────
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

// ─── Search all published content in parallel ─────────────────────────────────
export async function searchContent(query: string): Promise<ActionResult<SearchResult[]>> {
  if (query.trim().length < 2) return { success: true, data: [] }

  try {
    const q = query.toLowerCase()

    // TODO: Supabase FTS swap ↓ — replace the three mock arrays below with:
    // const supabase = await createServerClient()
    // const tsQuery = `plainto_tsquery('english', '${query}')`
    //
    // const [blogsRes, eventsRes, readingRes] = await Promise.all([
    //   supabase
    //     .from('blog_posts')
    //     .select('id, title, slug, excerpt, published_at')
    //     .eq('published', true)
    //     .textSearch('search_vector', query, { type: 'plain', config: 'english' })
    //     .order('ts_rank(search_vector, plainto_tsquery(\'english\', \'${query}\'))', { ascending: false }),
    //   supabase
    //     .from('events')
    //     .select('id, title, slug, event_date')
    //     .eq('published', true)
    //     .textSearch('search_vector', query, { type: 'plain', config: 'english' }),
    //   supabase
    //     .from('reading_list')
    //     .select('id, title, author')
    //     .eq('published', true)
    //     .textSearch('search_vector', query, { type: 'plain', config: 'english' }),
    // ])
    //
    // const blogs   = (blogsRes.data ?? []).map(b => ({ ...b, type: 'blog'         as const }))
    // const events  = (eventsRes.data ?? []).map(e => ({ ...e, type: 'event'        as const }))
    // const reading = (readingRes.data ?? []).map(r => ({ ...r, type: 'reading_list' as const, slug: r.id }))
    // return { success: true, data: [...blogs, ...events, ...reading] }

    // TODO: Supabase swap — add wellness_posts query ↓
    // const wellnessRes = await supabase
    //   .from('wellness_posts')
    //   .select('id, title, slug, excerpt, published_at')
    //   .eq('published', true)
    //   .textSearch('search_vector', query, { type: 'plain', config: 'english' })
    // const wellness = (wellnessRes.data ?? []).map(w => ({ ...w, type: 'wellness' as const }))

    const [blogs, events, reading, wellness] = await Promise.all([
      Promise.resolve(
        mockBlogs
          .filter((b) => {
            if (!b.published) return false
            return (
              b.title.toLowerCase().includes(q) ||
              b.excerpt.toLowerCase().includes(q) ||
              stripHtml(b.content).toLowerCase().includes(q)
            )
          })
          .map<SearchResult>((b) => ({
            id: b.id,
            type: 'blog',
            title: b.title,
            slug: b.slug,
            excerpt: b.excerpt,
            published_at: b.published_at || null,
          }))
      ),

      Promise.resolve(
        mockEvents
          .filter((e) => {
            if (!e.published) return false
            return (
              e.title.toLowerCase().includes(q) ||
              e.location.toLowerCase().includes(q) ||
              stripHtml(e.description).toLowerCase().includes(q)
            )
          })
          .map<SearchResult>((e) => ({
            id: e.id,
            type: 'event',
            title: e.title,
            slug: e.slug,
            excerpt: null,
            event_date: e.event_date,
          }))
      ),

      Promise.resolve(
        mockReadingList
          .filter((r) => {
            if (!r.published) return false
            return (
              r.title.toLowerCase().includes(q) ||
              r.author.toLowerCase().includes(q) ||
              stripHtml(r.description).toLowerCase().includes(q)
            )
          })
          .map<SearchResult>((r) => ({
            id: r.id,
            type: 'reading_list',
            title: r.title,
            slug: r.id,
            excerpt: r.author ? `by ${r.author}` : null,
          }))
      ),

      Promise.resolve(
        mockWellnessPosts
          .filter((w) => {
            if (!w.published) return false
            return (
              w.title.toLowerCase().includes(q) ||
              w.excerpt.toLowerCase().includes(q) ||
              stripHtml(w.content).toLowerCase().includes(q)
            )
          })
          .map<SearchResult>((w) => ({
            id: w.id,
            type: 'wellness',
            title: w.title,
            slug: w.id,
            excerpt: w.excerpt,
            published_at: w.published_at || null,
          }))
      ),
    ])

    return { success: true, data: [...blogs, ...events, ...reading, ...wellness] }
  } catch (err) {
    console.error('[searchContent]', err)
    return { success: false, error: 'Search failed. Please try again.' }
  }
}
