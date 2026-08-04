'use client'

import Image from 'next/image'
import { MapPin, Phone, Globe, Mail, Store } from 'lucide-react'

export interface BookstoreRowProps {
  id: string
  name: string
  description: string | null
  email: string | null
  province: string | null
  address: string | null
  phone_number: string | null
  website_url: string | null
  photo_url: string | null
}

export default function BookstoreRow({
  name,
  description,
  email,
  province,
  address,
  phone_number,
  website_url,
  photo_url,
}: BookstoreRowProps) {
  return (
    <div className="flex items-start gap-4 px-4 py-4 bg-[var(--color-background)] dark:bg-[var(--color-dark-surface)] hover:bg-[var(--color-surface)] dark:hover:bg-[var(--color-dark-surface-hover)] transition-colors">
      <div className="relative rounded-lg overflow-hidden bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface-hover)] shrink-0" style={{ width: 64, height: 64 }}>
        {photo_url ? (
          <Image src={photo_url} alt={name} fill className="object-cover" sizes="64px" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Store className="w-6 h-6 text-[var(--color-text-muted)] opacity-40" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <div className="flex items-start justify-between gap-3">
          <p className="font-display font-bold text-base text-[var(--color-text-primary)] dark:text-white leading-snug">
            {name}
          </p>
          {province && (
            <span className="shrink-0 text-xs px-2 py-0.5 rounded-full bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface-hover)] text-[var(--color-text-muted)] border border-[var(--color-border)] dark:border-[var(--color-dark-border)]">
              {province}
            </span>
          )}
        </div>

        {address && (
          <p className="flex items-start gap-1.5 text-sm text-[var(--color-text-muted)]">
            <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span>{address}</span>
          </p>
        )}
        {province && (
          <p className="hidden sm:block text-sm text-[var(--color-text-muted)] pl-5">
            {province}
          </p>
        )}

        {description && (
          <p className="text-sm text-[var(--color-text-muted)] leading-relaxed line-clamp-2">
            {description}
          </p>
        )}

        <div className="flex items-center gap-3 flex-wrap pt-1">
          {phone_number && (
            <a
              href={`tel:${phone_number}`}
              className="inline-flex items-center gap-1 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-brand-teal)] dark:hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              {phone_number}
            </a>
          )}
          {email && (
            <a
              href={`mailto:${email}`}
              className="inline-flex items-center gap-1 min-w-0 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-brand-teal)] dark:hover:text-white transition-colors"
            >
              <Mail className="w-3.5 h-3.5 shrink-0" />
              <span className="break-all">{email}</span>
            </a>
          )}
          {website_url && (
            <a
              href={website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-brand-teal)] dark:hover:text-white transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              Visit Website
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
