'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { unlockSite } from '@/actions/access'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function AccessGateForm({ next }: { next?: string }) {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const password = formData.get('password') as string
    const result = await unlockSite(password, next)
    if (result?.error) {
      toast.error(result.error)
      setLoading(false)
    }
    // On success, unlockSite redirects — no need to handle here
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-display text-2xl font-extrabold text-[var(--color-brand-teal)] dark:text-white">
            This site is restricted
          </h1>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Enter the access password to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="off"
              required
              placeholder="••••••••"
              autoFocus
            />
          </div>

          <Button type="submit" className="w-full cursor-pointer" disabled={loading}>
            {loading ? 'Checking…' : 'Enter'}
          </Button>
        </form>
      </div>
    </div>
  )
}
