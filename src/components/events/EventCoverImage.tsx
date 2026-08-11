'use client'

import { useState } from 'react'
import Image from 'next/image'

interface EventCoverImageProps {
  src: string
  alt: string
  isPast: boolean
}

const DEFAULT_ASPECT = 16 / 7
const MAX_HEIGHT_PX = 560

export default function EventCoverImage({ src, alt, isPast }: EventCoverImageProps) {
  const [aspect, setAspect] = useState(DEFAULT_ASPECT)

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface-hover)]"
      style={{ aspectRatio: aspect, maxHeight: MAX_HEIGHT_PX }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority
        onLoad={(e) => {
          const img = e.currentTarget
          if (img.naturalWidth && img.naturalHeight) {
            setAspect(img.naturalWidth / img.naturalHeight)
          }
        }}
        className={`object-contain${isPast ? ' grayscale-[30%]' : ''}`}
        sizes="(max-width: 1024px) 100vw, 896px"
      />
    </div>
  )
}
