'use client'

import Link from 'next/link'
import { Home } from 'lucide-react'
import { DetailPageShell } from '@/components/shared/DetailPageShell'

export function NotFoundContent() {
  return (
    <DetailPageShell className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center space-y-6">
      <p className="font-display text-6xl sm:text-7xl font-bold text-[var(--color-brand-teal)]">
        404
      </p>
      <h1 className="font-display text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)] dark:text-white">
        Page Not Found
      </h1>
      <p className="text-[var(--color-text-muted)] max-w-md mx-auto">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-brand-teal)] hover:bg-[var(--color-brand-teal-dark)] text-white font-medium text-sm transition-colors duration-200"
        >
          <Home className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </DetailPageShell>
  )
}
