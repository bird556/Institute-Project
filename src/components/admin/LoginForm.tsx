'use client';

import { useState } from 'react';
import Link from 'next/link';
import { loginAction } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function LoginForm() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await loginAction(formData);
    if (result?.error) {
      toast.error(result.error);
      setLoading(false);
    }
    // On success, loginAction redirects — no need to handle here
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-display text-2xl font-extrabold text-[var(--color-brand-teal)] dark:text-white">
            Institute Admin
          </h1>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Sign in to your dashboard
          </p>
        </div>

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

          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="••••••••"
            />
          </div>

          <Button type="submit" className="w-full cursor-pointer" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <Link
            href="/admin/forgot-password"
            className="text-sm text-[var(--color-text-muted)] dark:text-white dark:hover:text-white/50 hover:text-[var(--color-accent)] transition-colors"
          >
            Forgot your password?
          </Link>
        </div>
      </div>
    </div>
  );
}
