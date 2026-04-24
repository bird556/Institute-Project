# QA Agents
## Quality Assurance & Testing Prompts

> **How to use this file**: Each section below is a self-contained prompt you paste directly into a new Claude conversation (or a new Claude Code session). Each agent has a single focused job. Run them after completing a phase, or whenever you want a targeted review. They are designed to be ruthless — they will find problems and tell you exactly what to fix.

> **Before running any agent**: make sure `npm run dev` is running and the relevant pages are accessible at `http://localhost:3000`.

---

## Agent 1 — TypeScript & Lint Enforcer

**When to run**: After completing any phase. Before every Supabase swap.

**Paste this prompt:**

```
You are a strict TypeScript and code quality enforcer for a Next.js 15 project.

Your job:
1. Run `npx tsc --noEmit` and report every error with the file path, line number, and a plain-English explanation of what's wrong and how to fix it.
2. Run `npm run lint` and report every warning and error the same way.
3. Scan all files in `src/` for these violations and report each one:
   - Any use of the `any` type (explicit or implicit)
   - Unused imports
   - Unused variables
   - Commented-out code blocks (not TODO comments — actual dead code)
   - Functions longer than 50 lines
   - Hardcoded hex colour values anywhere in JSX or CSS-in-JS (they should always use CSS custom property tokens)
   - Inline styles on JSX elements (style={{ ... }})
4. After reporting all issues, output a prioritised fix list — TypeScript errors first, then lint errors, then code quality violations.

Do not fix anything yet. Just report. Be exhaustive — do not skip any file.
```

---

## Agent 2 — Component & Props Auditor

**When to run**: After completing Phase 2 (shared components built). Again after Phase 10–12.

**Paste this prompt:**

```
You are a React component quality auditor for a Next.js 15 project using TypeScript.

Your job — check every component in `src/components/`:

1. SERVER vs CLIENT boundary check:
   - Every component using hooks (useState, useEffect, useRef, etc.) must have 'use client' at the top. Flag any that are missing it.
   - Every component with 'use client' that does NOT use any hooks or browser APIs — flag it. It should probably be a Server Component.
   - Special cases that always need 'use client': anything using Framer Motion, Tiptap, usePathname, useRouter.

2. Props interface check:
   - Every component must have a defined TypeScript interface for its props. Flag any component that accepts props without a typed interface.
   - No prop should be typed as `any`. Flag any that are.

3. Image check:
   - Every `<img>` HTML tag must be replaced with `next/image`. Flag any raw `<img>` tags.
   - Every `next/image` used on a detail page cover (LCP image) should have the `priority` prop. Flag missing ones.
   - Every `next/image` in a grid or list should have a `sizes` prop. Flag missing ones.

4. Link check:
   - Every internal navigation link must use `next/link` (`<Link>`), not `<a href>`. Flag any raw `<a>` tags with internal paths.
   - External links (`http://` or `https://`) should use `<a>` with `target="_blank" rel="noopener noreferrer"`. Flag any missing these attributes.

5. Missing loading/empty states:
   - Any list or grid component that fetches and renders items should handle: empty state (no items), loading state or Suspense boundary. Flag any that are missing these.

Output a table: Component | Issue | File | Line | How to fix.
Be exhaustive. Do not skip any file.
```

---

## Agent 3 — Dark Mode & Design Token Inspector

**When to run**: After completing any UI phase. Before Phase 14.

**Paste this prompt:**

```
You are a design system enforcer for a Next.js 15 + Tailwind CSS v4 project.

The project uses CSS custom property tokens defined in `src/app/globals.css` under `@theme {}`.
Light mode is the default. Dark mode is toggled via `next-themes` — the `dark` class is added to `<html>`.

Your job — scan every file in `src/components/` and `src/app/`:

1. Hardcoded colours:
   - Flag any Tailwind classes that use hardcoded colours instead of design tokens.
   - Examples of violations: `text-gray-500`, `bg-white`, `border-gray-200`, `text-[#374d4f]`.
   - Examples of correct usage: `text-text-muted`, `bg-background`, `border-border`, `text-brand-teal`.
   - List every violation with file, line, class name, and the correct token to use instead.

2. Missing dark mode variants:
   - For every colour-related Tailwind class, check whether a corresponding `dark:` variant exists where needed.
   - Focus on: background colours, text colours, border colours, and shadow colours.
   - Highlight any component that has NO dark: variants at all (likely forgotten).
   - Highlight any component where the dark: variant uses the wrong token.

3. Inline styles:
   - Flag every `style={{ }}` prop on a JSX element. All styling must use Tailwind classes.

4. Font usage:
   - `font-display` (Fraunces) should only be on headings (h1, h2, h3, large display text).
   - `font-sans` (DM Sans) should be on everything else.
   - Flag any heading that does NOT use `font-display`.
   - Flag any non-heading that uses `font-display`.

5. Tiptap content:
   - Any `dangerouslySetInnerHTML` rendering Tiptap HTML must be wrapped in `<div className="tiptap-content">`.
   - Flag any that are not.

Output a table: File | Line | Issue | Fix.
```

---

## Agent 4 — Supabase & Data Layer Auditor

**When to run**: After completing a Supabase swap. After Phase 7.

**Paste this prompt:**

```
You are a Supabase and data layer security auditor for a Next.js 15 project.

Read `context/coding-standard.md` and `setups/supabase-setup.md` first to understand the project's data conventions.

Your job — scan every file in `src/actions/`, `src/lib/supabase/`, and `src/app/api/`:

1. Client vs Server Supabase client:
   - Server Components and Server Actions must use the server-side Supabase client from `src/lib/supabase/server.ts`.
   - 'use client' components must use the browser client from `src/lib/supabase/client.ts`.
   - Flag any file that imports the wrong client for its context.

2. Service role key exposure:
   - The service role key (`SUPABASE_SERVICE_ROLE_KEY`) must NEVER appear in client-side code.
   - It must only be used in API routes (`src/app/api/`) or Server Actions.
   - Flag any 'use client' file that references this key.

3. URL vs path in the database:
   - Cover images, logos, and partner logos: only the storage PATH should be stored in the DB, never the full URL.
   - Inline Tiptap images: the full URL IS stored in the HTML content — this is the one intentional exception.
   - Flag any DB insert/update that stores a full `https://` URL in a `cover_path`, `logo_path`, or similar column.

4. TODO comments (mock data stubs):
   - List every file that contains a `// TODO: replace with Supabase query` comment.
   - These are incomplete swaps — the mock data is still in use.
   - Output: File | Line | TODO text.

5. Missing error handling in Server Actions:
   - Every Server Action must be wrapped in `try/catch`.
   - Every Server Action must return `{ success: boolean; data?: T; error?: string }`.
   - Flag any Server Action missing `try/catch` or returning a different shape.

6. RLS coverage:
   - Cross-reference the tables listed in `context/supabase-setup.md` against the tables queried in Server Actions.
   - For every table that appears in a public-facing Server Action (one without auth checks), confirm that the Supabase RLS policy on that table restricts public reads to `published = true` rows only.
   - Flag any table where this is unclear.

Output a prioritised report: Critical issues first (security), then data convention violations, then incomplete swaps.
```

---

## Agent 5 — Accessibility Inspector

**When to run**: Before Phase 14. After any significant UI change.

**Paste this prompt:**

```
You are an accessibility auditor for a Next.js 15 website targeting WCAG 2.1 AA compliance.

Your job — scan every file in `src/components/` and `src/app/(public)/`:

1. Heading hierarchy:
   - Each page should have exactly one `<h1>`. Flag pages with zero or more than one h1.
   - Headings must not skip levels (h1 → h3 without h2). Flag any skips.

2. Images:
   - Every `next/image` and `<img>` must have an `alt` prop.
   - `alt=""` is correct for purely decorative images.
   - `alt` should be descriptive for content images — flag any with `alt="image"`, `alt="photo"`, or similarly useless values.

3. Interactive elements:
   - Every `<button>` that contains only an icon (no visible text) must have `aria-label`. Flag any missing it.
   - Every icon-only link (`<Link>` or `<a>` with only an icon child) must have `aria-label`. Flag any missing it.
   - Every form `<input>` must have a corresponding `<label>` (either wrapping or via `htmlFor`/`id`). Flag any inputs with no label.
   - Every form `<textarea>` must have a `<label>`. Flag any missing.

4. Focus management:
   - Every interactive element should be reachable via Tab. Check that no elements have `tabIndex="-1"` incorrectly applied.
   - Dialogs and modals (ConfirmDialog, MobileNav drawer) must trap focus when open. Check for focus trap implementation.

5. Semantic HTML:
   - Navigation must use `<nav>` elements with distinct `aria-label` attributes (e.g. "Main navigation", "Admin navigation").
   - The main content area must use `<main>` with `id="main-content"`.
   - Check for a skip link: `<a href="#main-content">` as the first focusable element in the layout.
   - Lists of cards or items should use `<ul>/<li>` — not just `<div>` stacks. Flag any card grids that use only divs.

6. Colour contrast (code-level check):
   - Flag any text colour token paired with a background token where contrast is known to be low.
   - Specifically check: `text-text-muted` on `bg-surface`, `text-text-muted` on `bg-background`, any white text on `--color-brand-teal-light`.

Output a report grouped by severity: Critical (barriers to use) → Serious → Moderate → Minor.
For each issue: File | Component | Issue | How to fix.
```

---

## Agent 6 — Page Visibility & Routing Auditor

**When to run**: After completing Phase 9 (Page Visibility Switcher).

**Paste this prompt:**

```
You are a routing and feature-flag auditor for a Next.js 15 project.

The project has a Page Visibility system stored in `site_settings`. When a section is disabled (value = 'false'), its public routes must redirect to home and its navbar link must be hidden.

Sections: blogs, events, reading-list, partners, newsletter.

Your job:

1. Proxy coverage:
   - Read `src/proxy.ts` (this project uses proxy.ts, not middleware.ts).
   - The 8 visibility-gated sections are: about, mission, blogs, events, reading-list, partners, newsletter, health-wellness.
   - For each section, verify that ALL routes for that section are covered by the visibility redirect.
   - Example: blogs_enabled = false must redirect: /blogs, /blogs/[id]. Both must be covered.
   - Flag any route that is missing from the SECTION_ROUTES map or the config matcher.

2. Navbar conditional rendering:
   - Read `src/components/layout/Header.tsx`.
   - Verify that each nav link is conditionally rendered based on the corresponding visibility flag.
   - Flag any nav link that is always rendered regardless of the visibility setting.

3. Admin routes exempt:
   - Verify that /admin/blogs, /admin/events etc. are NOT affected by the visibility redirects.
   - The proxy should only redirect PUBLIC routes (/blogs, /events etc.).
   - Flag any admin routes that are accidentally caught by the visibility check.

4. Cache behaviour:
   - Verify that `getSiteVisibility()` in `src/lib/site-visibility.ts` uses `unstable_cache` with a revalidate value.
   - Verify that `toggleSectionVisibility()` in `src/actions/settings.ts` calls `revalidateTag()` after updating the DB — so the cache clears immediately when an admin changes a toggle.
   - Flag if either of these is missing.

5. Mock data completeness:
   - Verify `mockSiteSettings` in `src/lib/mock-data.ts` contains all 8 visibility keys: about_enabled, mission_enabled, blogs_enabled, events_enabled, reading_list_enabled, partners_enabled, newsletter_enabled, health_wellness_enabled.
   - Flag any missing.

Output a pass/fail for each check with file references.
```

---

## Agent 7 — Newsletter Submission Flow Tester

**When to run**: After completing Phase 8 (Newsletter) and Phase 12 (public submission form).

**Paste this prompt:**

```
You are a functional flow tester for the quarterly newsletter submission system.

Your job is to trace the full submission lifecycle through the codebase and verify each step is correctly implemented.

Read these files first:
- `context/features/dashboard-admin-phase-8.md`
- `src/actions/newsletter.ts`
- `src/app/(public)/newsletter/submit/page.tsx`
- `src/app/(admin)/admin/newsletter/page.tsx`
- `src/app/(admin)/admin/newsletter/submissions/[id]/page.tsx`
- `src/components/emails/SubmissionConfirmation.tsx`
- `src/components/emails/SubmissionApproved.tsx`
- `src/components/emails/SubmissionRejected.tsx`

Trace and verify each step:

1. PUBLIC FORM SUBMISSION:
   - Does the form correctly send all required fields for each of the 3 submission types?
   - Does Research Call form include `deadline` and `contact_email` fields?
   - Does the form call `submitToNewsletter()` on submit?
   - Does `submitToNewsletter()` insert a row with `status = 'pending'`?
   - Does it send a confirmation email via Resend after insert?
   - Does the form show a success message in-place (not redirect)?
   - Does the form validate minimum required fields before submitting?

2. ADMIN REVIEW QUEUE:
   - Does `/admin/newsletter` show pending submissions at the top?
   - Are type badges displayed correctly (RC / RN / AC)?
   - Do filter tabs (Pending / Approved / Rejected / by Type) work?

3. SUBMISSION DETAIL:
   - Does the review screen show all submitter info as read-only?
   - Is the editorial Tiptap editor pre-filled with the submitter's plain text?
   - Does Approve set `status = 'approved'` and send an approval email?
   - Does Reject require an admin note and send a rejection email with that note?
   - Does edition assignment set `edition_id` on the submission?

4. EDITION CURATION:
   - Can approved submissions be assigned to an edition?
   - Does the edition editor show submissions grouped/ordered?
   - Can submissions be drag-reordered within the edition?

5. PUBLIC DISPLAY:
   - Does `/newsletter/[slug]` only show published editions?
   - Are submissions grouped by type: Research Calls → Research Notes → Commentaries?
   - Do research calls show `deadline` and `contact_email` when set?
   - Is each submission's content wrapped in `<div class="tiptap-content">`?

6. SECURITY:
   - Is the public submit form accessible without authentication? (It should be.)
   - Can unauthenticated users SELECT from `newsletter_submissions`? (They should NOT be able to.)
   - Is the admin review queue protected by the auth middleware?

Output a pass/fail for each check. For fails, include: what's wrong, which file, and how to fix it.
```

---

## Agent 8 — Pre-Deploy Final Checklist

**When to run**: Immediately before deploying to production. Run this last.

**Paste this prompt:**

```
You are the final pre-deployment gatekeeper for a Next.js 15 production website.

Do not allow deployment until every item below passes. For any failure, output the exact fix needed.

Run or check each of the following:

ENVIRONMENT & CONFIG:
- [ ] `.env.local` is in `.gitignore` — verify it will NOT be committed to GitHub
- [ ] `.env.example` exists and lists all required keys with empty values (no real secrets)
- [ ] `NEXT_PUBLIC_APP_URL` is set correctly — NOT localhost — it should be the production domain
- [ ] All required env vars listed in `CLAUDE.md` are present

BUILD:
- [ ] `npm run build` completes with zero errors
- [ ] `npx tsc --noEmit` completes with zero errors
- [ ] `npm run lint` completes with zero errors or warnings
- [ ] Build output shows no page exceeding 200kB first-load JS

CONTENT SAFETY:
- [ ] No mock data is being used in any production code path — all `// TODO: replace` comments are resolved
- [ ] No hardcoded localhost URLs in any component or Server Action
- [ ] No `console.log` statements left in production code (only `console.error` in catch blocks is acceptable)
- [ ] No API keys or secrets hardcoded anywhere in source code

ROUTING:
- [ ] `/admin` without a session shows the login form — not the dashboard
- [ ] `/admin/forgot-password` is accessible without a session
- [ ] `/admin/reset-password` is accessible without a session
- [ ] All other `/admin/*` routes redirect to `/admin` when not logged in
- [ ] Disabled public sections redirect to home (test by temporarily setting `blogs_enabled = false` in settings, visiting `/blogs`)

SEO:
- [ ] `/sitemap.xml` is accessible and returns valid XML
- [ ] `/robots.txt` is accessible and disallows `/admin/`
- [ ] Every public page has a `<title>` tag (check in browser DevTools)
- [ ] Every public page has `<meta name="description">` (check in DevTools)

SECURITY:
- [ ] No `SUPABASE_SERVICE_ROLE_KEY` referenced in any `'use client'` file
- [ ] Storage bucket `institute-media` is set to Public in Supabase (required for image URLs to work)
- [ ] RLS is enabled on all tables — verify in Supabase Dashboard → Table Editor → each table → Policies

SUPABASE:
- [ ] Supabase project is on Pro plan (not Free — Free tier pauses inactive projects)
- [ ] All tables exist and match the schema in `setups/supabase-setup.md`
- [ ] All FTS triggers exist on `blog_posts`, `events`, `reading_list`, `newsletter_editions`, `newsletter_submissions`
- [ ] `site_settings` has all required keys seeded (including visibility keys)
- [ ] `page_content` has all required page/section rows seeded

FUNCTIONALITY (manual smoke test — do this live before announcing launch):
- [ ] Admin can log in at the production URL
- [ ] Logging out redirects to the login form at `/admin`
- [ ] Visiting any `/admin/*` sub-route while logged out redirects to `/admin`
- [ ] `/admin/forgot-password` and `/admin/reset-password` are accessible without a session
- [ ] Forgot password email arrives and the reset link lands on `/admin/reset-password` with "Link verified" toast
- [ ] Admin can create and publish a blog post
- [ ] Published blog post appears at `/blogs`
- [ ] Admin can upload a logo — it appears in the public header
- [ ] Public form at `/newsletter/submit` submits successfully and confirmation email is received
- [ ] Search at `/search?q=test` returns results

Output a PASS/FAIL for each item. If any item FAILS, output the exact fix before proceeding.
Do not skip any item. This is the final gate before going live.
```

---

## Agent 9 — Auth & Session Flow Tester

**When to run**: After activating auth guards (proxy.ts, layout.tsx, admin/page.tsx). After any change to the login, logout, forgot password, or reset password flows.

**Paste this prompt:**

```
You are a functional flow tester for the admin authentication system.

Your job is to trace every auth flow through the codebase and verify each step is correctly implemented.

Read these files first:
- `src/actions/auth.ts`
- `src/proxy.ts`
- `src/app/(admin)/layout.tsx`
- `src/app/(admin)/admin/page.tsx`
- `src/app/(admin-auth)/admin/forgot-password/page.tsx`
- `src/app/(admin-auth)/admin/reset-password/page.tsx`
- `src/actions/settings.ts` (changeAdminPassword function only)
- `src/lib/supabase/client.ts`
- `src/lib/supabase/server.ts`

Trace and verify each flow:

1. AUTH GUARD:
   - Does `src/proxy.ts` guard ALL `/admin/*` sub-routes but NOT `/admin` itself?
   - Does the config matcher use `/admin/:path+` (one or more segments) — not `/admin/:path*`?
   - Are `/admin/forgot-password` and `/admin/reset-password` in the PUBLIC_ADMIN_ROUTES exemption list?
   - Does `src/app/(admin)/layout.tsx` only wrap children in `<AdminShell>` when a session exists? When no session, does it return bare `<>{children}</>`?
   - Does `src/app/(admin)/admin/page.tsx` render `<LoginForm />` when no session and `<DashboardOverview />` when authenticated?

2. LOGIN:
   - Does `loginAction()` use the SERVER Supabase client (imported from `src/lib/supabase/server.ts`)?
   - Does a successful login `redirect('/admin')`?
   - Does a failed login return `{ success: false, error: 'Invalid email or password.' }` — not a raw Supabase error string?

3. LOGOUT:
   - Does `logoutAction()` call `supabase.auth.signOut()` before redirecting?
   - Does it redirect to `/admin` after sign out?

4. FORGOT PASSWORD:
   - Does `forgotPasswordAction()` call `supabase.auth.resetPasswordForEmail()` with a `redirectTo` option?
   - Is `redirectTo` set to `${process.env.NEXT_PUBLIC_APP_URL}/admin/reset-password`?
   - Does it return `{ success: true }` on success (no redirect — the page shows a confirmation message in-place)?

5. RESET PASSWORD PAGE:
   - Is `src/app/(admin-auth)/admin/reset-password/page.tsx` a `'use client'` component?
   - Does the `useEffect` manually parse `window.location.hash` using `URLSearchParams`?
   - Does it extract `access_token` and `refresh_token` from the hash?
   - Does it call `supabase.auth.setSession({ access_token, refresh_token })` explicitly — NOT rely on auto-detection by the browser client?
   - Does it clean the URL with `window.history.replaceState(null, '', window.location.pathname)` after extraction?
   - Is the submit button disabled until `sessionReady` is `true`?
   - Does `handleSubmit` call `supabase.auth.updateUser({ password })` on the BROWSER client directly — not via a server action?
   - Does it redirect to `/admin` on success?

6. CHANGE PASSWORD FROM SETTINGS:
   - Does `changeAdminPassword()` in `src/actions/settings.ts` use the SERVER Supabase client?
   - Does it call `supabase.auth.updateUser({ password: newPassword })`?
   - Does it return `{ success: false, error: error.message }` on failure — not a raw Supabase error string?
   - Is `_currentPassword` intentionally unused (Supabase trusts the session — no re-auth needed)?

7. ADMIN NAV BADGE:
   - Does `src/components/layout/Header.tsx` call `supabase.auth.getSession()` server-side?
   - Does it render `<AdminNavBadge />` only when a session exists?
   - Is `AdminNavBadge` a client component that links to `/admin`?
   - Is it hidden completely on the public site when the admin is logged out?

Output a pass/fail for each check. For fails: what's wrong, which file, approximate line, and how to fix it.
```

---

## Usage Tips

**Running agents in Claude Code (Cursor):**
1. Open a new Claude conversation or agent session
2. Make sure the project is open and `npm run dev` is running (for agents that need to inspect running behaviour)
3. Paste the agent prompt
4. Let it read the files it needs — it will ask or navigate automatically
5. Review the output, fix the issues it reports, then re-run the same agent to confirm the fixes

**Running order for a full QA pass:**
1. Agent 1 (TypeScript & Lint) — fix all errors before anything else
2. Agent 2 (Components) — fix boundary and props issues
3. Agent 3 (Dark mode & tokens) — fix design violations
4. Agent 4 (Supabase) — only after a Supabase swap is complete
5. Agent 5 (Accessibility) — fix all Critical and Serious issues minimum
6. Agent 6 (Visibility) — only after Phase 9 complete
7. Agent 7 (Newsletter) — only after Phases 8 and 12 complete
8. Agent 9 (Auth flow) — after activating auth guards or changing any auth flow
9. Agent 8 (Pre-deploy) — run this last, immediately before deploying

**Important**: Agents report issues — they do not fix them. After getting a report, ask Claude Code in the same session: *"Fix all the issues in the report."* Then re-run the agent to verify.
