import { Heart, BookOpen, Shield, Users } from 'lucide-react'
import type { MissionSectionContent, MissionPillar } from '@/types'

const ICON_MAP = {
  Heart,
  BookOpen,
  Shield,
  Users,
} satisfies Record<MissionPillar['icon_name'], React.ElementType>

interface MissionSectionProps {
  data: MissionSectionContent
}

export default function MissionSection({ data }: MissionSectionProps) {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-[hsl(35_60%_50%)] font-medium tracking-widest uppercase text-sm mb-3">
            {data.label}
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {data.title}
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            {data.description}
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.pillars.map((pillar) => {
            const Icon = ICON_MAP[pillar.icon_name]
            return (
              <div
                key={pillar.title}
                className="group p-6 rounded-xl bg-card border border-border hover:border-[hsl(35_60%_50%/0.4)] hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-(--color-brand-primary)/10 flex items-center justify-center mb-4 group-hover:bg-[hsl(35_60%_50%)] transition-colors">
                  <Icon className="w-6 h-6 text-(--color-brand-primary) group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-foreground mb-2">
                  {pillar.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
