import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const ACCEPTED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'])
const MAX_BYTES = 5 * 1024 * 1024 // 5 MB

function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const folder = formData.get('folder') as string | null

    if (!file || !folder) {
      return NextResponse.json({ error: 'Missing file or folder.' }, { status: 400 })
    }

    if (!ACCEPTED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: 'Unsupported file type. Use JPG, PNG, WebP, or SVG.' },
        { status: 415 }
      )
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'File exceeds the 5 MB limit.' }, { status: 413 })
    }

    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`
    const storagePath = `${folder}/${filename}`

    const supabase = serviceClient()
    const { error: uploadError } = await supabase.storage
      .from('institute-media')
      .upload(storagePath, file, { contentType: file.type, upsert: false })

    if (uploadError) {
      console.error('[upload] Supabase storage error:', uploadError)
      return NextResponse.json({ error: 'Upload failed. Please try again.' }, { status: 500 })
    }

    const { data: { publicUrl } } = supabase.storage
      .from('institute-media')
      .getPublicUrl(storagePath)

    return NextResponse.json({ url: publicUrl, path: storagePath })
  } catch (err) {
    console.error('[upload] Unexpected error:', err)
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 })
  }
}
