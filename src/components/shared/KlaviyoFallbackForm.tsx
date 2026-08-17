'use client'

import { useState } from 'react';
import { subscribeToKlaviyo } from '@/actions/klaviyo';

interface Props {
  heading: string;
  subtext?: string;
  successMessage: string;
  consentText: string;
  className?: string;
  listId?: string | null;
  submitLabel?: string;
  loadingLabel?: string;
}

export function KlaviyoFallbackForm({
  heading,
  subtext,
  successMessage,
  consentText,
  className,
  listId,
  submitLabel = 'Subscribe',
  loadingLabel = 'Subscribing…',
}: Props) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email.trim()) return;
    setLoading(true);

    const res = await subscribeToKlaviyo({
      email,
      fullName: fullName || undefined,
      listId: listId || undefined,
    });
    setLoading(false);

    if (res.success) {
      setDone(true);
    } else {
      setError(res.error ?? 'Something went wrong. Please try again.');
    }
  }

  return (
    <div className={`rounded-xl border border-(--color-border) dark:border-dark-border bg-surface dark:bg-dark-surface p-6 ${className ?? ''}`}>
      <h3 className="font-display text-lg font-bold text-text-primary dark:text-white">{heading}</h3>
      {subtext && <p className="mt-1 text-sm text-text-muted">{subtext}</p>}

      {done ? (
        <p className="mt-4 text-sm font-medium text-(--color-brand-teal) dark:text-white">{successMessage}</p>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="mt-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full sm:w-48 rounded-lg border border-(--color-border) dark:border-dark-border bg-background dark:bg-dark-surface-hover px-3 py-2.5 text-text-primary dark:text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-(--color-brand-teal) text-sm"
            />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full sm:w-60 rounded-lg border border-(--color-border) dark:border-dark-border bg-background dark:bg-dark-surface-hover px-3 py-2.5 text-text-primary dark:text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-(--color-brand-teal) text-sm"
            />
            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="rounded-lg bg-(--color-brand-teal) px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-(--color-brand-teal-dark) disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? loadingLabel : submitLabel}
            </button>
          </div>

          {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}

          <p className="mt-3 text-xs text-text-muted">{consentText}</p>
        </form>
      )}
    </div>
  );
}
