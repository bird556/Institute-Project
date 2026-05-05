'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { FadeUp } from '@/components/shared/FadeUp'
import type { ImpactSectionContent } from '@/types'

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const item = {
  hidden: { opacity: 0, x: 16 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease } },
}

interface ImpactSectionProps {
  data: ImpactSectionContent
}

export default function ImpactSection({ data }: ImpactSectionProps) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section ref={ref} className="py-24 bg-(--color-brand-primary) dark:bg-dark-surface">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <FadeUp delay={0}>
              <p className="text-[hsl(35_60%_50%)] font-medium tracking-widest uppercase text-sm mb-3">
                {data.label}
              </p>
            </FadeUp>
            <FadeUp delay={0.1}>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-6">
                {data.title}
              </h2>
            </FadeUp>
            <FadeUp delay={0.2}>
              <p className="text-white/80 text-lg leading-relaxed">
                {data.description}
              </p>
            </FadeUp>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            animate={inView ? 'show' : 'hidden'}
            className="grid sm:grid-cols-2 gap-4"
          >
            {data.items.map((impact) => (
              <motion.div
                key={impact}
                variants={item}
                className="flex items-center gap-3 p-4 rounded-lg bg-white/5 border border-white/10"
              >
                <div className="w-2 h-2 rounded-full bg-[hsl(35_60%_50%)] shrink-0" />
                <span className="text-white/90 text-sm font-medium">
                  {impact}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
