import { getSiteSettings } from '@/actions/settings'
import type { Metadata } from 'next'

interface MetadataInput {
  title?: string
  description?: string
  imageUrl?: string | null  // full public URL — null = skip cover, undefined = use default OG
  noIndex?: boolean
}

export async function buildMetadata(input: MetadataInput = {}): Promise<Metadata> {
  const { data: settings } = await getSiteSettings()

  const siteName    = settings?.site_name        || 'Kustawi Institute'
  const defaultDesc = settings?.site_description || ''

  const titleStr    = input.title ? `${input.title} | ${siteName}` : siteName
  const description = input.description ?? defaultDesc
  const imageUrl    = input.imageUrl !== undefined
    ? input.imageUrl
    : `${process.env.NEXT_PUBLIC_APP_URL}/og-default.jpg`

  return {
    title: titleStr,
    description: description || undefined,
    robots: input.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title: titleStr,
      description: description || undefined,
      siteName,
      images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: titleStr,
      description: description || undefined,
      images: imageUrl ? [imageUrl] : [],
    },
  }
}
