'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { FadeUp } from '@/components/shared/FadeUp';
import type { GoalSectionContent } from '@/types';

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

interface GoalSectionProps {
  data: GoalSectionContent;
}

export default function GoalSection({ data }: GoalSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section ref={ref} className="py-24 bg-background">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <FadeUp delay={0}>
          <p className="text-secondary dark:text-primary font-medium tracking-widest uppercase text-sm mb-3">
            {data.label}
          </p>
        </FadeUp>
        <FadeUp delay={0.1}>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-6">
            {data.title}
          </h2>
        </FadeUp>
        <FadeUp delay={0.2}>
          <p className="text-muted-foreground text-lg leading-relaxed mb-10">
            {data.description}
          </p>
        </FadeUp>

        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          className="grid sm:grid-cols-3 gap-8"
        >
          {data.pillars.map((pillar) => (
            <motion.div key={pillar.num} variants={item} className="text-left">
              <span className="text-5xl font-serif font-bold text-[hsl(35_60%_50%/0.3)] dark:text-text-on-brand/85">
                {pillar.num}
              </span>
              <h3 className="font-serif text-xl font-semibold text-foreground mt-2 mb-2">
                {pillar.label}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {pillar.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <FadeUp delay={0.4}>
          <div className="mt-10">
            <Link
              href={data.cta_href || '/about'}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[hsl(35_60%_50%)] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              {data.cta_label || 'Learn More About Us'}
            </Link>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
