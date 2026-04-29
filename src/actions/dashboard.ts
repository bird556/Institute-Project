'use server'

import { createClient } from '@/lib/supabase/server'
import type { SubmissionType } from '@/types'

export interface DashboardStats {
  blogs: number
  upcomingEvents: number
  readingList: number
  partners: number
  pendingSubmissions: number
}

export interface DashboardPendingSubmission {
  id: string
  title: string
  type: SubmissionType
}

export interface DashboardActivityItem {
  title: string
  type: 'blog' | 'event' | 'reading_list'
  href: string
  date: string
}

export interface DashboardData {
  stats: DashboardStats
  pendingSubmissions: DashboardPendingSubmission[]
  recentActivity: DashboardActivityItem[]
}

export async function getDashboardData(): Promise<DashboardData> {
  const supabase = await createClient()
  const now = new Date().toISOString()

  const [
    { count: blogsCount },
    { count: eventsCount },
    { count: readingListCount },
    { count: partnersCount },
    { count: pendingCount },
    { data: pendingSubmissions },
    { data: recentBlogs },
    { data: recentEvents },
    { data: recentReadingList },
  ] = await Promise.all([
    supabase.from('blog_posts').select('*', { count: 'exact', head: true }).eq('published', true),
    supabase.from('events').select('*', { count: 'exact', head: true }).gt('event_date', now),
    supabase.from('reading_list').select('*', { count: 'exact', head: true }).eq('published', true),
    supabase.from('partners').select('*', { count: 'exact', head: true }).eq('published', true),
    supabase.from('newsletter_submissions').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('newsletter_submissions').select('id, title, type').eq('status', 'pending').order('created_at', { ascending: false }).limit(3),
    supabase.from('blog_posts').select('id, title, updated_at').order('updated_at', { ascending: false }).limit(5),
    supabase.from('events').select('id, title, updated_at').order('updated_at', { ascending: false }).limit(5),
    supabase.from('reading_list').select('id, title, updated_at').order('updated_at', { ascending: false }).limit(5),
  ])

  const recentActivity: DashboardActivityItem[] = [
    ...(recentBlogs ?? []).map(b => ({ title: b.title, type: 'blog' as const, href: `/admin/blogs/${b.id}`, date: b.updated_at })),
    ...(recentEvents ?? []).map(e => ({ title: e.title, type: 'event' as const, href: `/admin/events/${e.id}`, date: e.updated_at })),
    ...(recentReadingList ?? []).map(r => ({ title: r.title, type: 'reading_list' as const, href: `/admin/reading-list/${r.id}`, date: r.updated_at })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  return {
    stats: {
      blogs:               blogsCount        ?? 0,
      upcomingEvents:      eventsCount       ?? 0,
      readingList:         readingListCount  ?? 0,
      partners:            partnersCount     ?? 0,
      pendingSubmissions:  pendingCount      ?? 0,
    },
    pendingSubmissions: (pendingSubmissions ?? []) as DashboardPendingSubmission[],
    recentActivity,
  }
}
