'use client';

import { useState } from 'react';
import { subscribeToKlaviyo } from '@/actions/klaviyo';

interface Props {
  heading: string;
  subtext: string;
  successMessage: string;
  consentText: string;
}

export default function NewsletterSignup({ heading, subtext, successMessage, consentText }: Props) {
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
    });
    setLoading(false);

    if (res.success) {
      setDone(true);
    } else {
      setError(res.error ?? 'Something went wrong. Please try again.');
    }
  }

  return (
    <section className="bg-(--color-brand-primary) dark:bg-dark-surface py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-white font-[var(--font-display)]">
          {heading}
        </h2>
        <p className="mt-3 text-white/80 text-base">{subtext}</p>

        {done ? (
          <div className="mt-8 inline-block rounded-xl bg-white/10 px-8 py-5">
            <p className="text-white font-medium text-lg">{successMessage}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="mt-8">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <input
                type="text"
                placeholder="Full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full sm:w-56 rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 text-sm"
              />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full sm:w-72 rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 text-sm"
              />
              <button
                type="submit"
                disabled={loading || !email.trim()}
                className="rounded-lg bg-[var(--color-brand-secondary)] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? 'Subscribing…' : 'Subscribe'}
              </button>
            </div>

            {error && <p className="mt-3 text-sm text-red-300">{error}</p>}

            <p className="mt-4 text-xs text-white/50">{consentText}</p>
          </form>
        )}
      </div>
    </section>
  );
}
