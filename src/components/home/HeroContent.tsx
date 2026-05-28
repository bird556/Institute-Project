'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

interface HeroContentProps {
  heroHtml: string
  heroImageUrl: string
}

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

export function HeroContent({ heroHtml, heroImageUrl }: HeroContentProps) {
  return (
    <div className="relative max-w-6xl mx-auto">
      <div className="flex items-center gap-12">
        <motion.div
          className="flex-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
        >
          <div
            className="hero-tiptap tiptap-content"
            dangerouslySetInnerHTML={{ __html: heroHtml }}
          />
          <div className="flex flex-wrap gap-3 mt-6">
            <a
              href="/mission"
              className="inline-block px-6 py-3 rounded-lg bg-[hsl(35_60%_50%)] text-white font-semibold text-sm hover:bg-[hsl(35_65%_45%)] transition-colors"
            >
              Our Mission
            </a>
            <a
              href="/events"
              className="inline-block px-6 py-3 rounded-lg border border-white text-white font-semibold text-sm hover:bg-white/10 transition-colors"
            >
              Upcoming Events
            </a>
            <a
              href="/reading-list"
              className="inline-block px-6 py-3 rounded-lg border border-[hsl(35_60%_50%)] text-[hsl(35_60%_50%)] font-semibold text-sm hover:bg-[hsl(35_60%_50%)] hover:text-white transition-colors"
            >
              Book of the Month
            </a>
          </div>
        </motion.div>

        <motion.div
          className="hidden md:block flex-shrink-0 w-sm"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.15 }}
        >
          <div className="relative rounded-2xl overflow-hidden shadow-lg aspect-[4/5]">
            <Image
              src={heroImageUrl}
              alt=""
              fill
              className="object-cover"
              priority
              quality={75}
            />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
