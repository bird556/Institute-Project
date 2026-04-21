import type { ImpactSectionContent } from '@/types';

interface ImpactSectionProps {
  data: ImpactSectionContent;
}

export default function ImpactSection({ data }: ImpactSectionProps) {
  return (
    <section className="py-24 bg-(--color-brand-primary) dark:bg-dark-surface">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <p className="text-[hsl(35_60%_50%)] font-medium tracking-widest uppercase text-sm mb-3">
              {data.label}
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-6">
              {data.title}
            </h2>
            <p className="text-white/80 text-lg leading-relaxed">
              {data.description}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {data.items.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 p-4 rounded-lg bg-white/5 border border-white/10"
              >
                <div className="w-2 h-2 rounded-full bg-[hsl(35_60%_50%)] flex-shrink-0" />
                <span className="text-white/90 text-sm font-medium">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
