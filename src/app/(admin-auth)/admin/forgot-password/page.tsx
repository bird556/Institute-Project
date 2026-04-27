'use client';

import { useState } from 'react';
import Link from 'next/link';
import { forgotPasswordAction } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await forgotPasswordAction(formData);
    if (result?.error) {
      toast.error(result.error);
      setLoading(false);
    } else {
      setSent(true);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-display text-2xl font-extrabold text-[var(--color-brand-teal)] dark:text-white">
            Reset Password
          </h1>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Enter your email and we'll send you a reset link
          </p>
        </div>

        {sent ? (
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-center space-y-2">
            <p className="font-medium text-[var(--color-text-primary)]">
              Check your email
            </p>
            <p className="text-sm text-[var(--color-text-muted)]">
              A password reset link has been sent to your inbox.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="admin@institute.com"
              />
            </div>

            <Button type="submit" className="w-full cursor-pointer" disabled={loading}>
              {loading ? 'Sending…' : 'Send reset link'}
            </Button>
          </form>
        )}

        <div className="mt-4 text-center">
          <Link
            href="/admin"
            className="text-sm text-[var(--color-text-muted)] dark:text-white dark:hover:text-white/50 hover:text-[var(--color-accent)] transition-colors"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
