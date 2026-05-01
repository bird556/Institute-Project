# Institute Website

A modern, full-stack institute website with a built-in content management system. Admins manage all site content through a protected dashboard; the public site reflects changes in real time.


## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Database & Auth | Supabase (PostgreSQL + Row Level Security) |
| Storage | Supabase Storage |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui |
| Rich Text | Tiptap |
| Animations | Framer Motion |
| Notifications | Sonner |
| Fonts | Fraunces (display) · DM Sans (body) |

## Features

### Public Site

- **Home** — hero section, intro, featured content
- **Blog** — published articles with cover images and rich text
- **Events** — upcoming and past events with date, location, and external registration links
- **Reading List** — curated books and articles with cover images and external links
- **Health & Wellness** — posts with tags, downloadable PDFs, and rich text content
- **Newsletter** — quarterly editions with submission portal (research calls, notes, commentaries)
- **Partners** — partner organisations with logos and website links
- **About / Mission** — editable page content blocks
- **Search** — full-text search across blogs, events, and reading list (Supabase FTS)

### Admin Dashboard (`/admin`)

- **Authentication** — email + password, single admin account, forgot/reset password flow
- **Content editors** — full CRUD for all content types with Tiptap rich text and image uploads
- **Settings** — site name, description, logo, contact info, admin details, footer visibility toggles
- **Page visibility** — toggle entire sections of the public site on/off
- **Home editor** — control hero images and all home section content
- **Data export** — one-click ZIP download of all DB records and media files

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project

### Installation

```bash
git clone <repo-url>
cd Institute-Project
npm install
```

### Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Database

Apply the migrations to your Supabase project:

```bash
supabase db push --linked
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the public site. The admin dashboard is at [http://localhost:3000/admin](http://localhost:3000/admin).

## Project Structure

```
src/
├── app/
│   ├── (public)/          # Public-facing pages
│   ├── (admin)/           # Admin dashboard pages
│   └── api/               # API routes (upload, export)
├── actions/               # Server Actions (CRUD per content type)
├── components/
│   ├── admin/             # Dashboard UI components
│   ├── layout/            # Header, Footer, navigation
│   └── shared/            # RichTextEditor, ImageUpload, PublishToggle
├── lib/
│   ├── supabase/          # Server and browser Supabase clients
│   ├── metadata.ts        # SEO metadata helper (buildMetadata)
│   └── utils.ts           # cn, slugify, formatDate, truncate, stripHtml
└── types/                 # Shared TypeScript types
```

## Key Conventions

- Storage paths (not full URLs) are stored in the database — URLs are reconstructed server-side
- `published` boolean gates all public queries — unpublished content never appears on the public site
- Server Components are used everywhere possible; client components are used only when interactivity is required
- All Server Actions return `{ success: boolean; data?: T; error?: string }`

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run start        # Start production server
npx tsc --noEmit     # Type check
npm run lint         # Lint
```
