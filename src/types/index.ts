export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  cover_path: string | null
  published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface Event {
  id: string
  title: string
  slug: string
  description: string
  cover_path: string | null
  location: string | null
  event_date: string
  published: boolean
  created_at: string
  updated_at: string
}

export interface ReadingListItem {
  id: string
  title: string
  author: string | null
  description: string | null
  cover_path: string | null
  external_url: string | null
  published: boolean
  created_at: string
  updated_at: string
}

export interface Partner {
  id: string
  name: string
  logo_path: string | null
  description: string | null
  website_url: string | null
  sort_order: number
  published: boolean
  created_at: string
}

export interface SiteSetting {
  key: string
  value: string
}

export interface SiteSettings {
  site_name: string
  logo_path: string
  contact_email: string
  contact_phone: string
  address: string
}

export interface PageContent {
  id: string
  page: string
  section: string
  content: string
  updated_at: string
}

export interface ActionResult<T = undefined> {
  success: boolean
  data?: T
  error?: string
}

export type SearchResultType = 'blog' | 'event' | 'reading_list'

export interface SearchResult {
  id: string
  type: SearchResultType
  title: string
  slug: string
  excerpt: string | null
  published_at?: string | null
  event_date?: string | null
}
