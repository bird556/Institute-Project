import { createClient } from '@supabase/supabase-js'
import { createClient as createAuthClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import JSZip from 'jszip'

type Row = Record<string, unknown>

function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

function omitSearchVector(rows: Row[]): Row[] {
  return rows.map(row =>
    Object.fromEntries(Object.entries(row).filter(([k]) => k !== 'search_vector'))
  )
}

async function fetchFile(
  supabase: ReturnType<typeof serviceClient>,
  path: string
): Promise<{ path: string; buffer: ArrayBuffer } | null> {
  const { data, error } = await supabase.storage.from('institute-media').download(path)
  if (error || !data) return null
  return { path, buffer: await data.arrayBuffer() }
}

function collectPaths(
  blogs: Row[], events: Row[], readingList: Row[],
  partners: Row[], wellness: Row[], editions: Row[],
  research: Row[], directory: Row[],
  siteSettings: Row[]
): string[] {
  const paths = new Set<string>()
  const settingsStorageKeys = new Set(['logo_path', 'home_hero_image_path', 'home_hero_bg_path'])

  for (const row of siteSettings) {
    if (settingsStorageKeys.has(row.key as string) && row.value) paths.add(row.value as string)
  }
  for (const row of blogs)       if (row.cover_path) paths.add(row.cover_path as string)
  for (const row of events)      if (row.cover_path) paths.add(row.cover_path as string)
  for (const row of readingList) if (row.cover_path) paths.add(row.cover_path as string)
  for (const row of partners)    if (row.logo_path)  paths.add(row.logo_path as string)
  for (const row of wellness) {
    if (row.cover_path) paths.add(row.cover_path as string)
    if (row.doc_path)   paths.add(row.doc_path as string)
  }
  for (const row of editions)    if (row.cover_path) paths.add(row.cover_path as string)
  for (const row of research)    if (row.cover_path) paths.add(row.cover_path as string)
  for (const row of directory)   if (row.photo_path) paths.add(row.photo_path as string)

  return [...paths]
}

export async function GET() {
  const authClient = await createAuthClient()
  const { data: { session } } = await authClient.auth.getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = serviceClient()

  const [
    { data: blogs },
    { data: events },
    { data: readingList },
    { data: partners },
    { data: wellness },
    { data: editions },
    { data: submissions },
    { data: pageContent },
    { data: siteSettings },
    { data: research },
    { data: directory },
  ] = await Promise.all([
    supabase.from('blog_posts').select('*'),
    supabase.from('events').select('*'),
    supabase.from('reading_list').select('*'),
    supabase.from('partners').select('*'),
    supabase.from('wellness_posts').select('*'),
    supabase.from('newsletter_editions').select('*'),
    supabase.from('newsletter_submissions').select('*'),
    supabase.from('page_content').select('*'),
    supabase.from('site_settings').select('*'),
    supabase.from('research_posts').select('*'),
    supabase.from('directory_entries').select('*'),
  ])

  const paths = collectPaths(
    (blogs ?? []) as Row[], (events ?? []) as Row[], (readingList ?? []) as Row[],
    (partners ?? []) as Row[], (wellness ?? []) as Row[], (editions ?? []) as Row[],
    (research ?? []) as Row[], (directory ?? []) as Row[],
    (siteSettings ?? []) as Row[]
  )

  const files = await Promise.all(paths.map(p => fetchFile(supabase, p)))

  const zip = new JSZip()
  const dataFolder = zip.folder('data')!
  const mediaFolder = zip.folder('media')!

  const datasets: [string, Row[]][] = [
    ['blogs.json',                  omitSearchVector((blogs ?? []) as Row[])],
    ['events.json',                 omitSearchVector((events ?? []) as Row[])],
    ['reading-list.json',           omitSearchVector((readingList ?? []) as Row[])],
    ['partners.json',               (partners ?? []) as Row[]],
    ['wellness.json',               omitSearchVector((wellness ?? []) as Row[])],
    ['newsletter-editions.json',    omitSearchVector((editions ?? []) as Row[])],
    ['newsletter-submissions.json', omitSearchVector((submissions ?? []) as Row[])],
    ['page-content.json',           (pageContent ?? []) as Row[]],
    ['site-settings.json',          (siteSettings ?? []) as Row[]],
    ['research.json',               omitSearchVector((research ?? []) as Row[])],
    ['directory.json',              (directory ?? []) as Row[]],
  ]

  for (const [filename, data] of datasets) {
    dataFolder.file(filename, JSON.stringify(data, null, 2))
  }

  for (const file of files) {
    if (file) mediaFolder.file(file.path, file.buffer)
  }

  const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' })
  const date = new Date().toISOString().slice(0, 10)

  return new Response(new Uint8Array(zipBuffer), {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="institute-export-${date}.zip"`,
    },
  })
}
