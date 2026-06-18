import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const ACCEPTED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/avif'])
const ACCEPTED_DOC_TYPES   = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
])
const MAX_IMAGE_BYTES = 5  * 1024 * 1024  // 5 MB
const MAX_DOC_BYTES   = 20 * 1024 * 1024  // 20 MB

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

    const isDoc   = folder === 'wellness/docs'
    const isImage = ACCEPTED_IMAGE_TYPES.has(file.type)
    const isDocType = ACCEPTED_DOC_TYPES.has(file.type)

    if (isDoc && !isDocType) {
      return NextResponse.json(
        { error: 'Unsupported document type. Use PDF, DOC, or DOCX.' },
        { status: 415 }
      )
    }

    if (!isDoc && !isImage) {
      return NextResponse.json(
        { error: 'Unsupported file type. Use JPG, PNG, WebP, AVIF, or SVG.' },
        { status: 415 }
      )
    }

    const maxBytes = isDoc ? MAX_DOC_BYTES : MAX_IMAGE_BYTES
    if (file.size > maxBytes) {
      const limit = isDoc ? '20 MB' : '5 MB'
      return NextResponse.json({ error: `File exceeds the ${limit} limit.` }, { status: 413 })
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
