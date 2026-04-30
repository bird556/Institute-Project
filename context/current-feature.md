# Supabase Data Wiring — COMPLETE ✅

> Branch: `supabase-setup-phase`

## Goal

Swap every action file from mock data to real Supabase queries, then test all CRUD flows end-to-end with live data. Input real page content and confirm the public site reflects it.

## Steps

- [x] Step 1 — Wire `src/actions/settings.ts` (getSiteSettings, updateSiteSetting, updateSiteSettings, toggleSectionVisibility)
- [x] Step 2 — Wire `src/actions/page-content.ts` (getPageContent, upsertPageContent)
- [x] Step 3 — Wire `src/actions/blogs.ts` (all CRUD actions)
- [x] Step 4 — Wire `src/actions/events.ts` (all CRUD actions)
- [x] Step 5 — Wire `src/actions/reading-list.ts` (all CRUD actions)
- [x] Step 6 — Wire `src/actions/partners.ts` (all CRUD actions)
- [x] Step 7 — Wire `src/actions/newsletter.ts` (editions + submissions)
- [x] Step 8 — Wire `src/actions/wellness.ts` (all CRUD actions)
- [x] Step 9 — Wire `src/actions/search.ts` (Supabase FTS across blog_posts, events, reading_list)
- [x] Step 10 — Input real site settings (site name, contact info, admin name/title/email)
- [x] Step 11 — Input real page content (home, about, mission sections via Tiptap editors) ✓ manually tested
- [x] Step 12 — Create a test blog post, event, reading list item, partner — verify publish/unpublish/delete ✓ manually tested
- [x] Step 13 — Wire public pages to Supabase (blogs, events, reading-list, partners, health-wellness, home)
- [x] Step 14 — Test search returns real results ✓ manually tested
- [x] Step 15 — `/api/upload` was already wired to Supabase Storage from initial build

## Additional Work Completed

### Dashboard Stats — Supabase Live Data

- New `src/actions/dashboard.ts` — `getDashboardData()` fires 9 Supabase queries in parallel: COUNT of published blogs, upcoming events, published reading list items, published partners, pending newsletter submissions; top 3 pending submissions for the feed; top 5 recent items across blogs/events/reading_list merged and sorted by `updated_at`
- `DashboardOverview.tsx` converted from mock imports to props-based (`{ data: DashboardData }`) — all `mockDashboardStats` / `mockRecentActivity` / `mockNewsletterSubmissions` references removed
- `admin/page.tsx` calls `getDashboardData()` server-side and passes result to `<DashboardOverview>`
- Added empty-state "No recent activity yet." for new installs

### Partners — Detail Pages + Tiptap Description

- New `getPublicPartnerById` action — queries by id AND `published = true` (safe for public routes)
- New public `/partners/[id]/page.tsx` — full description, full-size logo, "Visit Website" button
- `PartnerCard` wrapped in `Link` to `/partners/[id]`; "Visit Website" `<a>` removed from card (nested anchor); "Learn more →" label added
- Description field in `PartnerEditor` upgraded from plain `<textarea>` (500 char cap) to full `RichTextEditor` with `folder="partners/inline"` — bold, headings, lists, links, inline images all available
- `stripHtml()` utility added to `src/lib/utils.ts` — used on the card to strip HTML tags before `line-clamp-4` truncation
- Public detail page renders description via `dangerouslySetInnerHTML` + `tiptap-content` class

### Footer — Section Visibility Bug Fix

- Footer navigation previously showed all 6 links regardless of admin visibility settings
- Fixed: `Footer.tsx` now calls `getSiteVisibility()` and filters `ALL_FOOTER_LINKS` by the matching visibility key before rendering — matches the public navbar behaviour

### Reading List — Sort & Filter

- New `src/app/(public)/reading-list/ReadingListClient.tsx` (client component) — owns sort and author filter state; filters/sorts entirely client-side (no page reload)
- Sort options: Date Added Newest (default), Date Added Oldest, Title A → Z, Title Z → A
- Author filter: dropdown of unique authors — only shown when 2+ distinct authors exist; shows `"X of Y items"` count when active
- `page.tsx` now selects `created_at` from Supabase and passes it through; renders `<ReadingListClient>` instead of `<ReadingListGrid>` directly
- `ReadingListGrid` and `ReadingListCard` unchanged

### Reading List Detail — Sticky Sidebar

- `<aside>` on `/reading-list/[id]` given `sticky top-24` — book cover and "Find this book" button remain visible while scrolling through long descriptions
- `top-24` (6rem) clears the public site's `sticky top-0` header

### CLAUDE.md — Admin Pages Routes Updated

- Added missing `/admin/pages/*` routes (blogs, events, newsletter, reading-list, partners) to the Admin Pages table — these were built in Phase 14 but never documented

---

## Additional Work Completed

### Section Visibility Toggles on Admin Home

- New `SectionVisibilityToggle.tsx` client component — Eye/EyeOff icons, calls `toggleSectionVisibility()`, toast on result
- `PageSectionEditor`, `GoalEditor`, `ImpactEditor`, `MissionEditor` each accept `visibilityKey` + `initialVisible` props and render the toggle beside their Save button
- Admin `/admin/home` sections reordered to match public page: Hero → Hero Images → Introduction → Goal → Challenge → Mission → CTA
- Toggles on admin/home and toggles in Site Settings share the same `site_settings` keys — they stay in sync
- New `site_settings` keys seeded in Supabase dashboard: `intro_section_enabled`, `cta_section_enabled`, `goal_section_enabled`, `impact_section_enabled`, `mission_section_enabled`

### Public Home — Introduction Section

- Introduction section was being saved by the admin but never rendered publicly — fixed by reading the `intro` page_content block and gating its render on `intro_section_enabled`
- CTA section gated on `cta_section_enabled`

### Footer — Conditional Contact Fields

- Phone and address only render when their respective visibility toggles (`contact_phone_visible`, `address_visible`) are `true` and the field has a value
- Contact column hidden entirely when no visible fields exist

### `site-visibility.ts` — Supabase Wiring + Bug Fixes

- Rewrote to use `unstable_cache` + real Supabase query; defaults all keys to `true` via `{ ...ALL_ENABLED, ...map }` merge
- **Fix**: `unstable_cache` cannot call `cookies()` — switched to a plain `createClient` from `@supabase/supabase-js` (no session needed for public `site_settings` reads)
- **Fix**: `toggleSectionVisibility` switched from `.upsert()` to `.update()` — Supabase RLS blocks upsert INSERT even when the row exists; `.update()` matches the pattern used by all other settings actions and avoids the INSERT permission check

---

## Additional Work Completed

### Feature Docs Added

- **`context/features/resend-email.md`** — Full setup guide for Resend transactional email: account creation, domain verification, `npm install resend`, `src/lib/resend.ts` singleton, wiring the 3 newsletter TODOs (`submitToNewsletter`, `approveSubmission`, `rejectSubmission`), try/catch pattern so email failures don't block actions. Documents the 3 existing email template components (`SubmissionConfirmation`, `SubmissionApproved`, `SubmissionRejected`) and optional contact form integration.
- **`context/features/seo-management.md`** — Full spec for admin-controlled SEO: 6 new `site_settings` keys (`seo_site_name`, `seo_default_description`, `seo_og_image_path`, `seo_twitter_handle`, `seo_ga_id`, `seo_robots`), per-page SEO via `page_content` `seo_title`/`seo_description` sections, new `src/lib/metadata.ts` helper, `/admin/seo` page spec, GA4 injection via `next/script` in root layout, and all listing/detail pages updated from static `metadata` to `generateMetadata()`.

### Bug Fix — Logo URL Reconstruction (Header Crash)

- `src/components/layout/HeaderServer.tsx` was passing `settings.logo_path` (a raw Supabase Storage key like `logos/my-logo.png`) directly to `Header` as `logoUrl`. `next/image` requires a full URL, causing an `Invalid URL` crash on the public site after uploading a brand logo.
- Fixed: `HeaderServer.tsx` now calls `createClient()` and reconstructs the URL via `supabase.storage.from('institute-media').getPublicUrl(path).data.publicUrl` before passing it down.

### Bug Fix — Admin Settings Logo Not Showing on Reload

- `src/app/(admin)/admin/settings/page.tsx` was not reconstructing the logo URL server-side, so `SettingsClient.tsx` always initialized `logoUrl` state as `undefined` (a `// TODO` comment was left in place). The uploaded logo was never shown on re-entering the settings page.
- Fixed: `settings/page.tsx` now adds `createClient()`, reconstructs the logo URL, and passes it as `initialLogoUrl` prop. `SettingsClient.tsx` initializes state from `useState<string | undefined>(initialLogoUrl)`.

### ImageUpload UX — Preview Overlay + Drag-and-Drop on Existing Image

- `src/components/shared/ImageUpload.tsx` image preview container now uses CSS `group` + `group-hover` for a permanent 30% dark overlay (50% on hover) over the existing image.
- "Change" and "X" (remove) buttons remain in the top-right corner of the preview.
- A "Drop a new image to replace" hint fades in on hover at the bottom of the preview.
- `onDrop` + `onDragOver` handlers added to the preview container so drag-and-drop still works when an image is already shown.

### Bug Fix — Admin Partners List Page Crash

- `src/app/(admin)/admin/partners/page.tsx` → `PartnersClient.tsx` → `SortableRow` was using `partner.logo_path` (raw storage key) as the `src` for `next/image`, causing `Invalid URL` on the admin partners list page.
- Fixed: `partners/page.tsx` now builds a `logoUrls: Record<string, string>` map (keyed by partner ID) via `getPublicUrl()` for every partner that has a `logo_path`, and passes the map to `PartnersClient`. `SortableRow` receives and uses `logoUrl` instead of the raw path.

### Bug Fix — Cover/Logo Images Not Showing in Admin Editors on Load

All 6 content editors were initializing their cover/logo URL state as `undefined`, so `ImageUpload` always showed the empty dropzone even when a cover or logo had previously been saved. Fixed across every editor with the same pattern: server `page.tsx` adds `createClient()`, reconstructs the URL, and passes it as an initial prop; the editor client component initializes state from that prop.

| Editor | Page fixed | Prop added |
|---|---|---|
| Blog editor | `admin/blogs/[id]/page.tsx` + `BlogEditor.tsx` | `initialCoverUrl` |
| Event editor | `admin/events/[id]/page.tsx` + `EventEditor.tsx` | `initialCoverUrl` |
| Reading list editor | `admin/reading-list/[id]/page.tsx` + `ReadingListEditor.tsx` | `initialCoverUrl` |
| Health & Wellness editor | `admin/health-wellness/[id]/page.tsx` + `WellnessEditor.tsx` | `initialCoverUrl` |
| Newsletter edition editor | `admin/newsletter/editions/[id]/page.tsx` + `EditionEditor.tsx` | `initialCoverUrl` |
| Partner editor | `admin/partners/[id]/page.tsx` + `PartnerEditor.tsx` | `initialLogoUrl` |

### Bug Fix — Admin Home Hero Images Not Showing

- `src/app/(admin)/admin/home/page.tsx` was passing `initialHeroImageUrl={undefined}` and `initialBgImageUrl={undefined}` to `HomeHeroImagePanels` even though `settings` had the paths stored.
- Fixed: `home/page.tsx` now adds `createClient()` to the existing `Promise.all`, reconstructs both URLs server-side, and passes them as props so `HomeHeroImagePanels` initializes its state from the already-uploaded images.

---

# Auth Activation & Testing — COMPLETE ✅

> Branch: `supabase-setup-phase`
> Admin account created via Supabase Dashboard → Add user (email + password directly, no invite link).

## Background

The dev bypass is being removed. Three auth guards are commented out and will be uncommented now that a real Supabase project and admin account exist. Once guards are active, the full login/logout/password flows will be tested end-to-end.

## Already Fixed This Session

- [x] `src/app/(admin-auth)/admin/reset-password/page.tsx` — Rewrote to use browser client `setSession` directly from URL hash (implicit flow). `@supabase/ssr`'s `createBrowserClient` does not auto-detect hash tokens, so the page now manually parses `#access_token` + `#refresh_token` and calls `supabase.auth.setSession()`. Shows "Verifying link…" on the button while session loads; "Link verified — set your password." toast on success. Server action removed — password update now runs entirely on the browser client.

## Steps

- [x] Step 1 — Uncomment auth guard in `src/proxy.ts` (redirects unauthenticated `/admin` requests to `/admin`)
- [x] Step 2 — Uncomment session check in `src/app/(admin)/layout.tsx` (only renders `<AdminShell>` when session exists)
- [x] Step 3 — Uncomment session check + `<LoginForm />` in `src/app/(admin)/admin/page.tsx` (renders login form when unauthenticated, dashboard when authenticated)
- [x] Step 4 — Test: visiting `/admin` while logged out → redirected to login form ✓
- [x] Step 5 — Test: login with correct credentials → dashboard renders ✓
- [x] Step 6 — Test: logout → redirected back to login ✓
- [x] Step 7 — Test: change password from `/admin/settings` while logged in ✓
- [x] Step 8 — Test: forgot password flow → email received → reset link → new password set ✓

---

# Supabase Setup Phase — Pre-Launch Wiring & Bug Fixes — COMPLETE ✅

> Full spec: `context/features/supabase-setup-phase.md`
> Branch: `supabase-setup-phase`

## Steps

- [x] Step 1 — Fix seed SQL: add `about_enabled` + `mission_enabled` to `setups/supabase-setup.md`
- [x] Step 2 — Fix proxy: add `/health-wellness` to `SECTION_ROUTES` and `config.matcher` in `src/proxy.ts`
- [x] Step 3 — Fix CLAUDE.md: reading_list schema `link` → `external_url`
- [x] Step 4 — Fix `setups/supabase-setup.md` Step 6 checklist: list all 9 tables
- [x] Step 5 — Clean up `admin/page.tsx` commented auth block to use `createClient` from `@/lib/supabase/server`
- [x] Step 6 — `.env.local` already has all correct key names + both files are git-ignored via `.env*`

### Audit Fixes (found during full codebase review)
- [x] Added `// import { createClient } from '@/lib/supabase/server'` to all 7 action files that were missing it (`blogs`, `events`, `reading-list`, `partners`, `wellness`, `search`, `newsletter`, `settings`)
- [x] Fixed `createServerClient()` → `await createClient()` in all TODO comment blocks across all action files (was wrong function name — would have broken on uncomment)
- [x] Fixed `createBrowserClient()` → `await createClient()` in `newsletter.ts` `submitToNewsletter` — Server Actions cannot use the browser client
- [x] Removed unused `slugify` import from `newsletter.ts` (TypeScript error)

---

# Phase 16 — V2 Redesign: Color Scheme, Typography & Home Page Sections — COMPLETE ✅

> Full spec: `context/features/v2-redesign-phase-16.md`

## Phase 16 Status

Complete. Branch: `phase-16-v2-redesign` (open — not yet merged to `main`)

## Steps

- [x] Step 1 — Assets: `forest-bg.jpg` + `hero-image.jpg` copied to `public/assets/`
- [x] Step 2 — Color scheme: `globals.css` updated with v2 forest green + gold tokens; `--color-brand-primary` lightened to `hsl(160 40% 25.1%)` for better dark-bg contrast
- [x] Step 3 — Typography: Inter (body) + Playfair Display (headings) wired in `layout.tsx` + `globals.css`
- [x] Step 4 — Header: logo image alongside dynamic site name; `renderSiteName()` helper colors the word "Institute" in gold (`hsl(35 60% 50%)`) whenever it appears in the name
- [x] Step 5 — Hero defaults: `/assets/forest-bg.jpg` + `/assets/hero-image.jpg` as fallbacks
- [x] Step 6 — Section visibility: 3 new keys (`goal_section_enabled`, `impact_section_enabled`, `mission_section_enabled`) in `SiteSettings`, mock data, `site-visibility.ts`, `SettingsClient.tsx`
- [x] Step 7 — Types: `GoalSectionContent`, `ImpactSectionContent`, `MissionSectionContent` added to `src/types/index.ts`
- [x] Step 8 — Mock data: 3 new `page_content` entries with reference copy as JSON; seed SQL added to `supabase-setup.md`
- [x] Step 9 — `GoalSection.tsx` public component
- [x] Step 10 — `ImpactSection.tsx` public component — dark mode bg fixed to `dark:bg-dark-surface`
- [x] Step 11 — `MissionSection.tsx` public component
- [x] Step 12 — Home page: 3 sections with visibility gates + hero defaults; upcoming events section hidden when no future events
- [x] Step 13 — Admin `/admin/home`: `GoalEditor.tsx`, `ImpactEditor.tsx`, `MissionEditor.tsx`
- [x] Step 14 — Supabase setup: seed rows added to `setups/supabase-setup.md`

## Additional Work Completed in Phase 16

### Site Settings — New Keys

All new keys added to `src/types/index.ts` (`SiteSettings`), `src/lib/mock-data.ts` (`MockSiteSettings` + `mockSiteSettings`), `src/components/admin/SettingsClient.tsx` (`EMPTY` constant + UI), and `setups/supabase-setup.md` (seed SQL):

| Key | Default | Purpose |
|---|---|---|
| `site_name` | `'Institute Name'` | Site name — "Institute" word is colored gold in header + footer |
| `site_description` | `''` | Short tagline shown under the site name in the footer brand column |
| `admin_name` | `'Tamari of Kitossa'` | Administrator full name — shown in footer Contact column |
| `admin_title` | `'Professor, Sociology — Brock University'` | Professional title — shown below name in footer |
| `admin_email` | `'tkitossa@brocku.ca'` | Administrator email — shown in gold (`hsl(35 60% 50%)`) in footer |
| `admin_name_visible` | `'true'` | Toggle admin name visibility in footer |
| `admin_title_visible` | `'true'` | Toggle admin title visibility in footer |
| `admin_email_visible` | `'true'` | Toggle admin email visibility in footer |

### Footer Redesign (`src/components/layout/Footer.tsx`)

- Converted to async Server Component — fetches settings directly
- **Brand column**: dynamic `renderSiteName()` with gold "Institute" coloring + editable `site_description` tagline below
- **Contact column**: admin name (white), title (white/60), email (gold) — individually visibility-toggled; followed by `contact_email` + `contact_phone` if set
- Copyright line uses dynamic `siteName`

### Admin Settings (`/admin/settings`)

- New **Administrator** section (section 3) — Name, Professional Title, Email inputs each with an inline visible/hidden toggle switch
- New **Footer Description** textarea under Site Name section
- All 3 admin field toggles save immediately via `toggleSectionVisibility()`; name/title/email save together via Save button

### Dark Mode Link Fix

All public-facing links using `text-[var(--color-brand-teal)]` or `hover:text-[var(--color-brand-teal)]` were nearly invisible on dark backgrounds (brand primary is dark forest green). Fixed across:

- `newsletter/page.tsx` — "Read Edition →": `dark:text-white dark:hover:text-white/80`
- `newsletter/[slug]/page.tsx` — back link: `dark:hover:text-white`; contact email: `dark:text-white`
- `blogs/[id]/page.tsx`, `events/[id]/page.tsx`, `reading-list/[id]/page.tsx`, `health-wellness/[id]/page.tsx` — all back links: `dark:hover:text-white`
- `ReadingListCard.tsx` — external link hover: `dark:hover:text-white`
- `PartnerCard.tsx` — "Visit Website": upgraded from `dark:text-teal-light` (still too dark) → `dark:text-white`

---

## V1 Color & Font Snapshot (revert reference)

> Saved from `src/app/globals.css` and `src/app/layout.tsx` before Phase 16 changes.
> To revert: restore the `@theme` block below into `globals.css` and restore the font imports in `layout.tsx`.

### `layout.tsx` — V1 Font Imports
```ts
import { DM_Sans, Fraunces } from 'next/font/google'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  style: ['normal', 'italic'],
  variable: '--font-fraunces',
  display: 'swap',
})
// className on <html>: `${dmSans.variable} ${fraunces.variable}`
```

### `globals.css` — V1 `@theme` Block
```css
@theme {
  /* ─── Brand Palette ─────────────────────────────── */
  --color-brand-teal:       rgb(55, 77, 79);
  --color-brand-teal-dark:  rgb(38, 55, 57);
  --color-brand-teal-light: rgb(88, 120, 123);

  /* ─── Light Mode Surfaces ───────────────────────── */
  --color-background:       #ffffff;
  --color-surface:          #f7f8f8;
  --color-surface-hover:    #eef1f1;
  --color-border:           #dde3e3;

  /* ─── Dark Mode Surfaces ────────────────────────── */
  --color-dark-background:  #0f1617;
  --color-dark-surface:     #182022;
  --color-dark-surface-hover: #1f2a2c;
  --color-dark-border:      #2c3c3e;

  /* ─── Text ──────────────────────────────────────── */
  --color-text-primary:     #1a2223;
  --color-text-muted:       #5c7071;
  --color-text-on-brand:    #ffffff;

  /* ─── Semantic Aliases ──────────────────────────── */
  --color-accent:           var(--color-brand-teal);
  --color-accent-hover:     var(--color-brand-teal-dark);

  /* ─── Typography ────────────────────────────────── */
  --font-sans:    var(--font-dm-sans), 'DM Sans', sans-serif;
  --font-display: var(--font-fraunces), 'Fraunces', serif;
}
```

### `globals.css` — V1 Tiptap Heading Color
```css
.tiptap-editor h1, .tiptap-content h1,
.tiptap-editor h2, .tiptap-content h2,
.tiptap-editor h3, .tiptap-content h3 {
  font-family: var(--font-display);  /* Fraunces */
  color: var(--color-brand-teal);
}
```

---

# Phase 15 — Health & Wellness — COMPLETE ✅

> Full spec: `context/features/health-wellness-phase-15.md`

## Phase 15 Status

Complete. Branch merged to `main` (2026-04-20).

---

# Phase 14 — Admin Dashboard: Page Hero Editor — COMPLETE ✅

> Full spec: `context/features/dashboard-admin-phase-10.md`

## Phase 14 Status

Steps 1–9 and 11–14 built, build passed. Branch: `phase-14-page-hero-editor`

## Steps

### Section A — Listing Page Hero Editors (Steps 1–10)
- [x] Step 1 — Add 10 mock data entries to `mock-data.ts` (hero_title + hero_subtitle for blogs, events, newsletter, reading_list, partners)
- [x] Step 2 — `PageHeroEditor.tsx` shared component (heading input + subtitle textarea + Save All)
- [x] Step 3 — `/admin/pages/events` page
- [x] Step 4 — `/admin/pages/blogs` page
- [x] Step 5 — `/admin/pages/newsletter` page
- [x] Step 6 — `/admin/pages/reading-list` page
- [x] Step 7 — `/admin/pages/partners` page
- [x] Step 8 — Sidebar + MobileNav update (5 new links under Pages group)
- [x] Step 9 — Public listing pages updated (blogs, events, newsletter, reading-list, partners fetch + render hero)
- [ ] Step 10 — Supabase swap (deferred)

### Section B — Home Hero Images & Brand Logo (Steps 11–14)
- [x] Step 11 — Add `home_hero_image_path` + `home_hero_bg_path` to `mockSiteSettings` in `mock-data.ts`; update `SiteSettings` type in `src/types/index.ts`
- [x] Step 12 — `/admin/home` page: two image upload panels — "Hero Side Image" (PNG only) and "Hero Background Image" (JPEG/PNG/WebP); each calls `updateSiteSetting()` from `settings.ts`; Remove button clears the value
- [x] Step 13 — Public home page (`/`): two-column hero when side image set, single-column fallback; independent full-bleed dimmed background when bg image set
- [x] Step 14 — Brand logo: PNG-only upload in `/admin/settings`; logo renders left of site name in `Header.tsx` when set (fetched via `HeaderServer.tsx`)
- [ ] Step 15 — Supabase swap (deferred)

---

# Phase 13 — Public Pages: Search — COMPLETE ✅

> Full spec: `context/features/public/public-phase-13.md`

## Phase 13 Status — COMPLETE ✅

Steps 1–5 built, build passed, committed and merged to `main` (2026-04-16). Branch `phase-13-public-search` deleted. Step 6 (Supabase swap) deferred to the Supabase wiring pass at the end of all phases.

## Steps

- [x] Step 1 — Search Server Action (`src/actions/search.ts`) — query `blog_posts`, `events`, `reading_list` in parallel
- [x] Step 2 — `SearchResultItem.tsx` component
- [x] Step 3 — `SearchResults.tsx` component (client — receives results, handles empty/loading)
- [x] Step 4 — `/search` page (`?q=<query>`) — server-rendered, calls search action
- [x] Step 5 — Header search bar (`SearchBar.tsx`) — `useDebounce` 300ms, inline dropdown (5 results max) + "View all" link to `/search?q=`
- [ ] Step 6 — Supabase swap (deferred)

## Notes

- Mock FTS uses `String.includes()` across title, excerpt/description (HTML-stripped), and author — three `Promise.all` branches ready to swap to Supabase FTS
- `SearchBar` debounces 300ms, fires `searchContent()` via `useTransition`, shows inline dropdown; form submit / "View all" navigates to `/search?q=`
- `SearchResultItem` links use `id` (matching the `[id]` route param pattern across all public detail pages)
- Dark mode heading fix: added `.dark .tiptap-content h1/h2/h3 { color: #ffffff }` to `globals.css` — was invisible (brand teal on dark bg)
- Added explicit font sizes to `globals.css`: h1 (2.5rem), h2 (1.875rem), h3 (1.375rem)
- **Future (Supabase phase):** `searchContent` must respect page visibility flags — if admin hides a section, those content types must be excluded from search results

---

# Phase 12 — Public Pages: Reading List, Partners & Newsletter — COMPLETE ✅

> Full spec: `context/features/public/public-phase-12.md`

## Phase 12 Status — COMPLETE ✅

Steps 1–7 built, build passed, committed and merged to `main` (2026-04-15). Branch `phase-12-public` deleted. Step 8 (Supabase swap) deferred to the Supabase wiring pass at the end of all phases.

## Steps

### Section A — Reading List
- [x] Step 1 — `ReadingListCard.tsx` component
- [x] Step 2 — `/reading-list` list page + `/reading-list/[id]` detail page

### Section B — Partners
- [x] Step 3 — `PartnerCard.tsx` + `PartnerGrid.tsx` components
- [x] Step 4 — `/partners` page

### Section C — Newsletter (Public)
- [x] Step 5 — `/newsletter` archive page (built in Phase 8)
- [x] Step 6 — `/newsletter/[slug]` edition detail page (built in Phase 8)
- [x] Step 7 — `/newsletter/submit` public submission form (built in Phase 8)
- [ ] Step 8 — Supabase swap (deferred)

## Notes

- Newsletter public pages (Steps 5–7) were fully built during Phase 8 — no work needed here
- `ReadingListGrid` co-located in `src/app/(public)/reading-list/` — `useInView` + `staggerChildren: 0.08` scroll-reveal (same pattern as `BlogGrid` and `EventGrid`), 4-col on desktop, 2-col on mobile
- `PartnerGrid` in `src/components/partners/` — 3-col grid with scroll-reveal
- `PartnerCard` uses `unoptimized` prop on `next/image` so SVG logos (from Supabase storage) render without Next.js optimization pipeline blocking them
- Mock partner `logo_url` values switched from `placehold.co` (SVG, broken with next/image) to Unsplash URLs for dev
- Initials fallback avatar shown when `logo_url` is empty — teal circle with first 2 word initials

---

# Phase 11 — Public Pages: Events List & Detail — COMPLETE ✅

> Full spec: `context/features/public/public-phase-11.md`

## Phase 11 Status — COMPLETE ✅

Steps 1–3 built, build passed, committed and merged to `main` (2026-04-15). Branch `phase-11-public-events` deleted. Step 4 (Supabase swap) deferred to the Supabase wiring pass at the end of all phases.

## Steps

- [x] Step 1 — `EventCard.tsx` component
- [x] Step 2 — Events list page `/events` (Upcoming + Past sections)
- [x] Step 3 — Event detail page `/events/[id]`
- [ ] Step 4 — Supabase swap (deferred)

## Notes

- `external_url: string | null` added to `Event` type, mock data, `events.ts` actions, and `EventEditor.tsx` — optional Eventbrite-style registration link, shown as a "Register / Attend" button on the detail page when set and event is not past
- Admin sets the URL via the "Registration Link" sidebar panel in the event editor
- Past events: cover gets `grayscale-[40%]` on card + `grayscale-[30%]` on detail hero; amber "This event has passed." pill on detail page; "View Past Event →" CTA on card
- `--color-accent` is overridden by shadcn's Tailwind v4 `@theme` block to a near-invisible color — fixed in both `BlogCard` and `EventCard` to use `text-[var(--color-brand-teal)] dark:text-[var(--color-brand-teal-light)]` directly
- `EventGrid.tsx` co-located in `src/app/(public)/events/` — `useInView` + `staggerChildren: 0.08` scroll-reveal (same pattern as `BlogGrid`)
- `formatTime()` added to `src/lib/utils.ts` — UTC-normalised to prevent SSR/CSR hydration mismatches
- Mock events 1 and 5 updated to 2026 dates and both published so the Upcoming section is non-empty during dev
- DB schema updated in `CLAUDE.md`, `context/project-overview.md`, and `setups/supabase-setup.md`

---

# Phase 10 — Public Pages: Blog List & Detail — COMPLETE ✅

> Full spec: `context/features/public/public-phase-10.md`

## Phase 10 Status — COMPLETE ✅

Steps 1–3 built, build passed, committed and merged to `main` (2026-04-15). Branch `phase-10-public-blogs` deleted. Step 4 (Supabase swap) deferred to the Supabase wiring pass at the end of all phases.

## Steps

- [x] Step 1 — `BlogCard.tsx` component
- [x] Step 2 — Blog list page `/blogs`
- [x] Step 3 — Blog detail page `/blogs/[id]`
- [ ] Step 4 — Supabase swap (deferred)

## Notes

- `next.config.ts` updated with `images.remotePatterns` for Unsplash, placehold.co, and `*.supabase.co` — required for `next/image` with external URLs
- `BlogGrid.tsx` uses `useInView` + `staggerChildren: 0.08` for scroll-reveal; `BlogCard.tsx` uses `whileHover: { y: -2 }` for lift
- Framer Motion `ease` bezier arrays must be cast as `[number, number, number, number]` tuples to satisfy TypeScript strict mode

---

# Phase 9 — Page Visibility Switcher — COMPLETE ✅

> Full spec: `context/features/dashboard-admin-phase-9.md`

## Phase 9 Status — COMPLETE ✅

Steps 1–5 built, build passed. Branch: `phase-9-visibility`. Step 6 (Supabase swap) deferred to the Supabase wiring pass at the end of all phases.

## Steps

- [x] Step 1 — Add visibility keys to `mockSiteSettings` in `mock-data.ts` (7 keys: about, mission, blogs, events, reading_list, partners, newsletter)
- [x] Step 2 — Create `src/lib/site-visibility.ts` (mock returns all enabled)
- [x] Step 3 — Update `src/proxy.ts` (redirect disabled public routes to `/`)
- [x] Step 4 — Add Section 5 "Page Visibility" to `/admin/settings` + `toggleSectionVisibility()` action
- [x] Step 5 — Update `Header.tsx` (accept visibility prop) + create `HeaderServer.tsx` (Server Component wrapper)
- [ ] Step 6 — Supabase swap (deferred)

## Notes

- Next.js 16 uses `src/proxy.ts` natively — no `middleware.ts` needed. Having both causes a build error.
- `getSiteVisibility()` returns a hardcoded all-`true` mock. Toggle UI and action work but nav/routing changes won't reflect until Supabase is wired up.
- `SiteSettings` type and `MockSiteSettings` both updated with 7 visibility string fields.

---

# Phase 8 — Quarterly Newsletter — COMPLETE ✅

> Full spec: `context/features/dashboard-admin-phase-8.md`

## Phase 8 Status — COMPLETE ✅

All steps built, build passed, committed and merged to `main` (2026-04-15). Branch `phase-8-newsletter` deleted.

## Steps

- [x] Step 1 — Add mock newsletter data to `mock-data.ts` (editions, submissions, dashboard stats)
- [x] Step 2 — Newsletter server actions (`src/actions/newsletter.ts`)
- [x] Step 3 — Admin submissions queue + editions tab (`/admin/newsletter`)
- [x] Step 4 — Edition editor (`/admin/newsletter/editions/[id]`)
- [x] Step 5 — Submission detail / review editor (`/admin/newsletter/submissions/[id]`)
- [x] Step 6 — Sidebar + MobileNav update (add Newsletter link)
- [x] Step 7 — Public newsletter archive (`/newsletter`)
- [x] Step 8 — Public edition detail (`/newsletter/[slug]`)
- [x] Step 9 — Public submission form (`/newsletter/submit`) + Resend email templates
- [x] Step 10 — Dashboard overview update (newsletter stats card + pending feed)
- [x] Step 10b — Public navbar Newsletter link + submit form back button with unsaved-changes guard

## Notes

- `SubmissionType` and `SubmissionStatus` are canonical types in `src/types/index.ts`
- Edition editor uses `@dnd-kit` for drag-to-reorder assigned submissions (same pattern as Partners)
- `RichTextEditor` prop is `content` (not `initialContent`)
- Email templates in `src/components/emails/` — wire to Resend in Supabase phase
- Submit form: `← Back to Newsletter` button + `useBeforeUnload` guard + in-app leave dialog when form is dirty
- All Supabase queries written behind `// TODO:` comments in `src/actions/newsletter.ts`

---

# Phase 7 — Admin Dashboard: Settings — COMPLETE ✅

> Full spec: `context/features/dashboard-admin-phase-7.md`

## Phase 7 Status — COMPLETE ✅

All steps built, build passed, committed and merged to `main` (2026-04-13). Branch `phase-7-settings` deleted.

## Steps

- [x] Step 1 — Add `mockSiteSettings` to `mock-data.ts`
- [x] Step 2 — Settings server actions (`src/actions/settings.ts`)
- [x] Step 3 — Settings page (`/admin/settings`) — logo, site name, contact info, change password
- [x] Step 4 — Supabase swap (queries written behind `// TODO:` comments, ready to activate)

## Notes

- Contact info fields (email, phone, address) use empty-string-as-hidden — no separate toggle or DB column needed; leaving a field blank hides it from the footer
- `SettingsClient.tsx` is the client component holding all 4 form sections; `page.tsx` is the server component that fetches settings and passes them down
- Password change mock always returns `{ success: true }` — real Supabase call is `supabase.auth.updateUser({ password: newPassword })`

---

# Phase 6 — Admin Dashboard: Page Content Editor (Home, About, Mission) — COMPLETE ✅

> Full spec: `context/features/dashboard-admin-phase-6.md`

## Phase 6 Status — COMPLETE ✅

All steps built, build passed, committed and merged to `main` (2026-04-13). Branch `phase-6-page-content` deleted.

## Steps

- [x] Step 1 — Page content server actions (`src/actions/page-content.ts`)
- [x] Step 2 — `PageSectionEditor.tsx` shared component + `/admin/home` editor
- [x] Step 3 — `/admin/about` editor
- [x] Step 4 — `/admin/mission` editor (add to sidebar nav)
- [x] Step 5 — Public home page `/` (renders page_content sections + featured blogs/events)
- [x] Step 6 — Public about page `/about`
- [x] Step 7 — Public mission page `/mission`

## Extras Built in Phase 6

- "View Site" added to admin header dropdown — opens `/` in a new tab from anywhere in the dashboard

## Notes

- `PageSectionEditor` tracks dirty state against last-saved content (not just initial), so Save re-enables correctly after multiple edits
- Supabase `upsert` query (with `onConflict: 'page,section'`) is written and ready behind `// TODO:` comments in `page-content.ts`
- Public pages are fully server-rendered — content updates in admin appear on public pages immediately after Supabase is wired up
- Featured content on home page uses `mockBlogs` / `mockEvents` — swap for real Supabase queries in a later phase

---

# Phase 5 — Admin Dashboard: Partners CRUD — COMPLETE ✅

> Full spec: `context/features/dashboard-admin-phase-5.md`

## Phase 5 Status — COMPLETE ✅

All steps built, build passed, committed and merged to `main` (2026-04-13). Branch `phase-5-partners` deleted.

## Steps

- [x] Step 1 — Partners server actions (`src/actions/partners.ts`) — mock data, Supabase query logic in `// TODO:` comments
- [x] Step 2 — Partners list page (`src/app/(admin)/admin/partners/page.tsx`) + `PartnersClient.tsx` — drag-to-reorder with `@dnd-kit`
- [x] Step 3 — Partner editor page (`src/app/(admin)/admin/partners/[id]/page.tsx`) + `PartnerEditor.tsx`

---

# Phase 4 — Admin Dashboard: Reading List CRUD — COMPLETE ✅

> Full spec: `context/features/dashboard-admin-phase-4.md`

## Phase 4 Status — COMPLETE ✅

All steps built, build passed, committed and merged to `main` (2026-04-13). Branch `phase-4-reading-list` deleted.

## Steps

- [x] Step 1 — Reading list server actions (`src/actions/reading-list.ts`) — mock data, Supabase query logic in `// TODO:` comments
- [x] Step 2 — Reading list page (`src/app/(admin)/admin/reading-list/page.tsx`) + `ReadingListClient.tsx`
- [x] Step 3 — Reading list item editor (`src/app/(admin)/admin/reading-list/[id]/page.tsx`) + `ReadingListEditor.tsx`

---

# Phase 3 — Admin Dashboard: Events CRUD — COMPLETE ✅

> Full spec: `context/features/dashboard-admin-phase-3.md`

## Phase 3 Status — COMPLETE ✅

All steps built, build passed, committed and merged to `main` (2026-04-13). Branch `phase-3-events-crud` deleted.

---

# Phase 2 — Admin Dashboard: Blogs CRUD — COMPLETE ✅

> Full spec: `context/features/dashboard-admin-phase-2.md`

## Phase 1 Status — COMPLETE ✅

All 10 steps built, all 6 bugs fixed, committed and pushed to `main` (2026-04-13).

---

## Phase 2 Status — COMPLETE ✅

All steps built, browser QA passed, committed and merged to `main` (2026-04-13). Branch `phase-2-blogs-crud` deleted.

## Steps

- [x] Step 1 — Shared components: `RichTextEditor.tsx`, `ImageUpload.tsx`, `PublishToggle.tsx`, `ConfirmDialog.tsx`
- [x] Step 2 — `/api/upload` route (`src/app/api/upload/route.ts`)
- [x] Step 3 — Blogs server actions (`src/actions/blogs.ts`) — mock data active, Supabase query logic in `// TODO:` comments
- [x] Step 4 — Blog list page (`src/app/(admin)/admin/blogs/page.tsx`) + `BlogListClient.tsx`
- [x] Step 5 — Blog editor page (`src/app/(admin)/admin/blogs/[id]/page.tsx`) + `BlogEditor.tsx`

## Bugs Fixed During Phase 2

- `published_at: ''` in mock data caused `Invalid time value` in `formatDate` — fixed by coercing empty string to `null` in the store mapping and using `||` instead of `??` in the display
- Tiptap SSR hydration error — fixed with `immediatelyRender: false` in `useEditor`
- Tiptap duplicate `link` extension warning — fixed by passing `link: false` to `StarterKit.configure()`
- `AdminHeader` theme toggle hydration mismatch (Sun vs Moon) — fixed with `mounted` state guard
- Admin layout showed bare `{children}` with no shell when unauthenticated — temporarily bypassed by always rendering `<AdminShell>` during dev (auth guards commented out)
- Admin header showed UUID in page title for editor routes — fixed `getPageTitle()` to detect UUID segments and map parent route to a human-readable title ("Blog Post", "Event", etc.)

---

## Supabase — What Needs to Be Done (Once Project is Created)

> Complete all phases first, then wire up Supabase in one pass at the end.

### 1 — Create Supabase project and populate `.env.local`
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

### 2 — Run migrations to create all tables
Apply the schema from `CLAUDE.md` → "Suggested Schema" via the Supabase CLI:
```bash
supabase migration new initial_schema
supabase db push --linked
```

### 3 — Create the admin user
Authentication → Users → Invite user in the Supabase dashboard. Email + password only — no public registration.

### 4 — Create the storage bucket
Create a **public** bucket named `institute-media` with subfolders: `logos/`, `blog/`, `events/`, `reading-list/`, `partners/`

### 5 — Re-enable auth guards (currently commented out for dev)
- `src/proxy.ts` — uncomment the session check block
- `src/app/(admin)/layout.tsx` — uncomment the session check, restore conditional `<AdminShell>` render
- `src/app/(admin)/admin/page.tsx` — uncomment the session check, restore `<LoginForm />` fallback

### 6 — Activate Supabase queries in server actions
Each action file has real Supabase queries written and ready behind `// TODO:` comments. For each phase:
- `src/actions/blogs.ts` — remove mock store, uncomment Supabase client calls
- `src/actions/events.ts` — same
- `src/actions/reading-list.ts` — same
- `src/actions/partners.ts` — same
- `src/actions/settings.ts` — same
- `src/actions/page-content.ts` — same

### 7 — Regenerate types
```bash
supabase gen types typescript --linked > src/types/supabase.ts
```

### 8 — Test full CRUD end-to-end per content type
Create → Edit → Publish → Delete for blogs, events, reading list, partners.

---

## Notes

- shadcn uses `@base-ui/react` not Radix — `asChild` prop does NOT exist on its Trigger components; style the Trigger directly with `className`
- Tiptap requires `immediatelyRender: false` in `useEditor` for Next.js SSR compatibility
- `StarterKit` in Tiptap v3 includes `link` — always pass `StarterKit.configure({ link: false })` when also using the standalone `Link` extension
- `useTheme()` from `next-themes` always needs a `mounted` guard before rendering theme-dependent icons — server and client diverge otherwise
- All h1 headings use `dark:text-white` (not dark teal — too dark on dark backgrounds)
- Auth guards in `proxy.ts`, `layout.tsx`, and `admin/page.tsx` are commented out for dev. Re-enable all three when Supabase is wired up.

## History

- 2026-04-09: Phase 0 completed — Next.js scaffold, design tokens, Header, Footer, utility files
- 2026-04-09: Bug fix — homepage h1 was white in light mode
- 2026-04-11: Phase 1 all 10 steps built — visual and hydration bugs discovered and fixed
- 2026-04-13: Phase 1 committed and pushed to `main`
- 2026-04-13: Phase 2 all steps built and QA'd — committed, merged to `main`, branch deleted
