# Phase 16 — V2 Redesign: Color Scheme, Typography & Home Page Sections

> Full spec: `context/features/v2-redesign-phase-16.md`

## Phase 16 Status

In progress. Branch: `phase-16-v2-redesign`

## Steps

- [ ] Step 1 — Assets: copy `forest-bg.jpg` + `hero-image.jpg` → `public/assets/`
- [ ] Step 2 — Color scheme: update `globals.css` with v2 tokens (forest green + gold)
- [ ] Step 3 — Typography: swap to Inter (body) + Playfair Display (headings) in `layout.tsx` + `globals.css`
- [ ] Step 4 — Header: logo image alongside "Kustawi **Institute**" text treatment
- [ ] Step 5 — Hero defaults: `/assets/forest-bg.jpg` + `/assets/hero-image.jpg` as fallbacks
- [ ] Step 6 — Section visibility: 3 new keys in `SiteSettings`, mock data, `site-visibility.ts`, `SettingsClient.tsx`
- [ ] Step 7 — Types: `GoalSectionContent`, `ImpactSectionContent`, `MissionSectionContent`
- [ ] Step 8 — Mock data: 3 new `page_content` entries with reference copy as JSON
- [ ] Step 9 — `GoalSection.tsx` public component
- [ ] Step 10 — `ImpactSection.tsx` public component
- [ ] Step 11 — `MissionSection.tsx` public component
- [ ] Step 12 — Home page: insert 3 sections with visibility gates + hero defaults
- [ ] Step 13 — Admin `/admin/home`: `GoalEditor.tsx`, `ImpactEditor.tsx`, `MissionEditor.tsx`
- [ ] Step 14 — Supabase setup: new seed rows in `setups/supabase-setup.md`

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
