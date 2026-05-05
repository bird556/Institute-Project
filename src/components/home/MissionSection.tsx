'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Heart, BookOpen, Shield, Users } from 'lucide-react'
import { FadeUp } from '@/components/shared/FadeUp'
import type { MissionSectionContent, MissionPillar } from '@/types'

const ICON_MAP = {
  Heart,
  BookOpen,
  Shield,
  Users,
} satisfies Record<MissionPillar['icon_name'], React.ElementType>

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
}

interface MissionSectionProps {
  data: MissionSectionContent
}

export default function MissionSection({ data }: MissionSectionProps) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section ref={ref} className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <FadeUp delay={0}>
            <p className="text-[hsl(35_60%_50%)] font-medium tracking-widest uppercase text-sm mb-3">
              {data.label}
            </p>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {data.title}
            </h2>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {data.description}
            </p>
          </FadeUp>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {data.pillars.map((pillar) => {
            const Icon = ICON_MAP[pillar.icon_name]
            return (
              <motion.div
                key={pillar.title}
                variants={item}
                whileHover={{ y: -3 }}
                className="group p-6 rounded-xl bg-card border border-border hover:border-[hsl(35_60%_50%/0.4)] hover:shadow-lg transition-colors duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-(--color-brand-primary)/10 flex items-center justify-center mb-4 group-hover:bg-[hsl(35_60%_50%)] transition-colors">
                  <Icon className="w-6 h-6 text-(--color-brand-primary) dark:text-white group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-foreground mb-2">
                  {pillar.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {pillar.desc}
                </p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
