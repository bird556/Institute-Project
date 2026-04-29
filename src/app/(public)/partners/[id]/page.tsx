import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getPublicPartnerById } from '@/actions/partners'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const { data } = await getPublicPartnerById(id)
  if (!data) return { title: 'Partner Not Found' }
  return {
    title: `${data.name} | Partners`,
    description: data.description ?? undefined,
  }
}

export default async function PartnerDetailPage({ params }: Props) {
  const { id } = await params
  const [{ data: partner }, supabase] = await Promise.all([
    getPublicPartnerById(id),
    createClient(),
  ])

  if (!partner) notFound()

  const logoUrl = partner.logo_path
    ? supabase.storage.from('institute-media').getPublicUrl(partner.logo_path).data.publicUrl
    : null

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      {/* Back */}
      <Link
        href="/partners"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Partners
      </Link>

      {/* Logo */}
      {logoUrl && (
        <div className="flex justify-center">
          <div className="relative h-28 w-64">
            <Image
              src={logoUrl}
              alt={`${partner.name} logo`}
              fill
              unoptimized
              className="object-contain"
              sizes="256px"
            />
          </div>
        </div>
      )}

      {/* Name */}
      <h1 className="font-display text-4xl font-bold text-[var(--color-brand-teal)] dark:text-white leading-tight">
        {partner.name}
      </h1>

      {/* Full description */}
      {partner.description && (
        <div
          className="tiptap-content"
          dangerouslySetInnerHTML={{ __html: partner.description }}
        />
      )}

      {/* Website */}
      {partner.website_url && (
        <a
          href={partner.website_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--color-brand-teal)] text-white text-sm font-medium hover:bg-[var(--color-brand-teal-dark)] transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          Visit Website
        </a>
      )}
    </div>
  )
}
