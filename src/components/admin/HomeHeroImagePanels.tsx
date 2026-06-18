'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import ImageUpload from '@/components/shared/ImageUpload'
import { updateSiteSetting } from '@/actions/settings'

interface HomeHeroImagePanelsProps {
  initialHeroImageUrl?: string
  initialBgImageUrl?: string
}

export default function HomeHeroImagePanels({
  initialHeroImageUrl,
  initialBgImageUrl,
}: HomeHeroImagePanelsProps) {
  const [heroImageUrl, setHeroImageUrl] = useState<string | undefined>(initialHeroImageUrl)
  const [bgImageUrl, setBgImageUrl]     = useState<string | undefined>(initialBgImageUrl)

  async function save(key: string, path: string) {
    const res = await updateSiteSetting(key, path)
    if (!res.success) toast.error(res.error ?? 'Failed to save.')
  }

  function handleHeroUpload(url: string, path: string) {
    setHeroImageUrl(url)
    save('home_hero_image_path', path).then(() =>
      toast.success('Hero side image saved.')
    )
  }

  function handleHeroRemove() {
    setHeroImageUrl(undefined)
    save('home_hero_image_path', '').then(() =>
      toast.success('Hero side image removed.')
    )
  }

  function handleBgUpload(url: string, path: string) {
    setBgImageUrl(url)
    save('home_hero_bg_path', path).then(() =>
      toast.success('Hero background image saved.')
    )
  }

  function handleBgRemove() {
    setBgImageUrl(undefined)
    save('home_hero_bg_path', '').then(() =>
      toast.success('Hero background image removed.')
    )
  }

  return (
    <div className="space-y-6">
      {/* Hero side image */}
      <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] p-5 space-y-3">
        <div>
          <p className="text-sm font-semibold text-[var(--color-text-primary)] dark:text-white">
            Hero Side Image <span className="font-normal text-[var(--color-text-muted)]">(PNG only)</span>
          </p>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
            Shown to the right of the hero text on desktop. Hidden on mobile.
          </p>
        </div>
        <ImageUpload
          currentUrl={heroImageUrl}
          folder="home/hero"
          onUpload={handleHeroUpload}
          onRemove={handleHeroRemove}
          label=""
          accept="image/png"
        />
      </div>

      {/* Hero background image */}
      <div className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] p-5 space-y-3">
        <div>
          <p className="text-sm font-semibold text-[var(--color-text-primary)] dark:text-white">
            Hero Background Image <span className="font-normal text-[var(--color-text-muted)]">(JPEG, PNG, WebP, AVIF)</span>
          </p>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
            Displayed as a dimmed full-bleed background behind the hero section.
          </p>
        </div>
        <ImageUpload
          currentUrl={bgImageUrl}
          folder="home/bg"
          onUpload={handleBgUpload}
          onRemove={handleBgRemove}
          label=""
          accept="image/jpeg,image/png,image/webp,image/avif"
        />
      </div>
    </div>
  )
}
