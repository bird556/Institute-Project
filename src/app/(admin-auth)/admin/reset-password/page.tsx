'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    const params = new URLSearchParams(window.location.hash.substring(1));
    const accessToken  = params.get('access_token');
    const refreshToken = params.get('refresh_token') ?? '';

    if (accessToken) {
      // Invite / reset link: explicitly set the session from the URL hash tokens
      // because @supabase/ssr's createBrowserClient does not auto-detect hash tokens.
      supabase.auth
        .setSession({ access_token: accessToken, refresh_token: refreshToken })
        .then(({ data: { session }, error }) => {
          if (session && !error) {
            // Remove tokens from URL bar without triggering a navigation
            window.history.replaceState(null, '', window.location.pathname);
            setSessionReady(true);
            toast.success('Link verified — set your password.');
          } else {
            toast.error('Session not found. The link may have expired — request a new one.');
          }
        });
    } else {
      // No hash token — check for an existing session (e.g. already authenticated)
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          setSessionReady(true);
          toast.success('Link verified — set your password.');
        } else {
          toast.error('Session not found. The link may have expired — request a new one.');
        }
      });
    }
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const password = formData.get('password') as string;
    const confirm  = formData.get('confirm') as string;

    if (password !== confirm) {
      toast.error('Passwords do not match.');
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      toast.error('Could not update password. The link may have expired.');
      setLoading(false);
      return;
    }

    router.push('/admin');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-display text-2xl font-extrabold text-[var(--color-brand-teal)] dark:text-white">
            Set New Password
          </h1>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Choose a strong password for your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="password">New password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              placeholder="••••••••"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirm">Confirm password</Label>
            <Input
              id="confirm"
              name="confirm"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              placeholder="••••••••"
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading || !sessionReady}>
            {loading ? 'Updating…' : !sessionReady ? 'Verifying link…' : 'Update password'}
          </Button>
        </form>
      </div>
    </div>
  );
}
