import type { GoalSectionContent } from '@/types';

interface GoalSectionProps {
  data: GoalSectionContent;
}

export default function GoalSection({ data }: GoalSectionProps) {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <p className="text-secondary dark:text-primary font-medium tracking-widest uppercase text-sm mb-3">
          {data.label}
        </p>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-6">
          {data.title}
        </h2>
        <p className="text-muted-foreground text-lg leading-relaxed mb-10">
          {data.description}
        </p>
        <div className="grid sm:grid-cols-3 gap-8">
          {data.pillars.map((pillar) => (
            <div key={pillar.num} className="text-left">
              <span className="text-5xl font-serif font-bold text-[hsl(35_60%_50%/0.3)] dark:text-text-on-brand/85">
                {pillar.num}
              </span>
              <h3 className="font-serif text-xl font-semibold text-foreground mt-2 mb-2">
                {pillar.label}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
