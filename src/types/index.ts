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
  external_url: string | null   // Optional link to external registration (e.g. Eventbrite)
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
  // Page visibility — stored as 'true' | 'false' strings
  about_enabled: string
  mission_enabled: string
  blogs_enabled: string
  events_enabled: string
  reading_list_enabled: string
  partners_enabled: string
  newsletter_enabled: string
  // Home hero images
  home_hero_image_path: string
  home_hero_bg_path: string
  // Section visibility
  health_wellness_enabled: string
  // Home section visibility
  goal_section_enabled:    string
  impact_section_enabled:  string
  mission_section_enabled: string
}

export interface GoalPillar {
  num: string
  label: string
  desc: string
}
export interface GoalSectionContent {
  label: string
  title: string
  description: string
  pillars: GoalPillar[]
}

export interface ImpactSectionContent {
  label: string
  title: string
  description: string
  items: string[]
}

export interface MissionPillar {
  icon_name: 'Heart' | 'BookOpen' | 'Shield' | 'Users'
  title: string
  desc: string
}
export interface MissionSectionContent {
  label: string
  title: string
  description: string
  pillars: MissionPillar[]
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

export type SubmissionType   = 'research_call' | 'research_note' | 'commentary'
export type SubmissionStatus = 'pending' | 'approved' | 'rejected'

export interface NewsletterEdition {
  id: string
  title: string
  slug: string
  intro: string
  cover_path: string | null
  published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface NewsletterSubmission {
  id: string
  type: SubmissionType
  status: SubmissionStatus
  title: string
  content: string
  abstract: string | null
  submitter_name: string
  submitter_email: string
  submitter_role: string | null
  institution: string | null
  admin_note: string | null
  reviewed_at: string | null
  edition_id: string | null
  deadline: string | null
  contact_email: string | null
  created_at: string
  updated_at: string
}

export const WELLNESS_TAGS = [
  'Fitness',
  'Nutrition',
  'Mental Health',
  'Mindfulness',
  'Sleep',
  'Recovery',
  'General Wellness',
] as const

export type WellnessTag = typeof WELLNESS_TAGS[number]

export interface WellnessPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  cover_path: string | null
  doc_path: string | null     // PDF/DOC/DOCX download — null = no download shown
  tags: string[]
  published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
}

export type SearchResultType = 'blog' | 'event' | 'reading_list' | 'wellness'

export interface SearchResult {
  id: string
  type: SearchResultType
  title: string
  slug: string
  excerpt: string | null
  published_at?: string | null
  event_date?: string | null
}
