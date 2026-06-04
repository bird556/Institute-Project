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
  event_type: 'kustawi' | 'other'
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
  author_region: 'canadian' | 'world' | null
  item_type: 'book' | 'thesis_ma' | 'thesis_phd' | null
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
  site_description: string
  logo_path: string
  contact_email: string
  contact_phone: string
  address: string
  // Administrator info — shown in footer
  admin_name: string
  admin_title: string
  admin_email: string
  // Footer field visibility — stored as 'true' | 'false' strings
  admin_name_visible: string
  admin_title_visible: string
  admin_email_visible: string
  contact_phone_visible: string
  address_visible: string
  // Page visibility — stored as 'true' | 'false' strings
  about_enabled: string
  mission_enabled: string
  blogs_enabled: string
  events_enabled: string
  reading_list_enabled: string
  partners_enabled: string
  newsletter_enabled: string
  // Logo visibility
  logo_visible: string
  // Home hero images
  home_hero_image_path: string
  home_hero_bg_path: string
  // Section visibility
  health_wellness_enabled: string
  research_enabled: string
  advocates_enabled: string
  psychotherapists_enabled: string
  referral_agencies_enabled: string
  // Home section visibility
  intro_section_enabled:   string
  cta_section_enabled:     string
  goal_section_enabled:    string
  impact_section_enabled:  string
  mission_section_enabled: string
  // H&W featured section
  wellness_section_enabled: string
  wellness_section_blurb:   string
  wellness_featured_mode:   string  // 'latest' | 'manual'
  wellness_featured_ids:    string  // JSON array of up to 3 post IDs
  // Nav config
  nav_config: string  // JSON array of NavItem
  // Reading list feature
  book_of_the_month_id: string  // empty string = not set
  // Event section blurbs
  kustawi_blurb: string
  non_affiliated_blurb: string
  // Social media links
  social_facebook: string
  social_instagram: string
  social_twitter: string
  social_linkedin: string
  social_youtube: string
  // Footer
  footer_copyright_suffix: string
  footer_nav_heading: string
  footer_contact_heading: string
  // Upcoming events section
  upcoming_events_section_enabled: string
  upcoming_events_max_count: string
  upcoming_events_heading: string
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
  cta_label?: string
  cta_href?: string
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

export type ResearchCategory = 'announcements' | 'recent-publications' | 'reports'

export const RESEARCH_CATEGORIES: ResearchCategory[] = [
  'announcements',
  'recent-publications',
  'reports',
]

export const RESEARCH_CATEGORY_LABELS: Record<ResearchCategory, string> = {
  'announcements':       'Announcements',
  'recent-publications': 'Recent Publications',
  'reports':             'Reports',
}

export interface ResearchPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  cover_path: string | null
  category: ResearchCategory
  published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
}

export type DirectoryCategory = 'advocate' | 'psychotherapist' | 'referral_agency'
export type DirectoryMode     = 'online' | 'in-person' | 'both'

export const DIRECTORY_CATEGORIES: DirectoryCategory[] = ['advocate', 'psychotherapist', 'referral_agency']

export const DIRECTORY_CATEGORY_LABELS: Record<DirectoryCategory, string> = {
  advocate:       'Advocates',
  psychotherapist: 'Psychotherapists',
  referral_agency: 'Referral Agencies',
}

export const DIRECTORY_MODE_LABELS: Record<DirectoryMode, string> = {
  online:     'Online',
  'in-person': 'In-Person',
  both:       'Online & In-Person',
}

export interface DirectoryEntry {
  id: string
  name: string
  organization: string | null
  description: string | null
  website_url: string | null
  email: string | null
  photo_path: string | null
  category: DirectoryCategory
  mode: DirectoryMode | null
  published: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export type SearchResultType = 'blog' | 'event' | 'reading_list' | 'wellness' | 'research'

export interface SearchResult {
  id: string
  type: SearchResultType
  title: string
  slug: string
  excerpt: string | null
  published_at?: string | null
  event_date?: string | null
}
