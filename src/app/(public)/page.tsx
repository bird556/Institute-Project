import Link from 'next/link';
import Image from 'next/image';
import { getPageContent } from '@/actions/page-content';
import { getSiteSettings } from '@/actions/settings';
import { getSiteVisibility } from '@/lib/site-visibility';
import { createClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils';
import GoalSection from '@/components/home/GoalSection';
import ImpactSection from '@/components/home/ImpactSection';
import MissionSection from '@/components/home/MissionSection';
import type {
  GoalSectionContent,
  ImpactSectionContent,
  MissionSectionContent,
  PageContent,
} from '@/types';

function parseSection<T>(
  sections: PageContent[] | null | undefined,
  key: string,
  fallback: T,
): T {
  const row = sections?.find((s) => s.section === key);
  if (!row?.content) return fallback;
  try {
    return JSON.parse(row.content) as T;
  } catch {
    return fallback;
  }
}

const GOAL_FALLBACK: GoalSectionContent = {
  label: 'Our Goal',
  title: 'Thriving With Purpose',
  description:
    "Kustawi strives to promote engagement, disseminate knowledge and conduct research that will enable African descent boys, men and those who love them to thrive and continue their life's journey with an enriched sense of themselves endowed by the Grantor of Dominion (GoD).",
  pillars: [
    {
      num: '01',
      label: 'Engagement',
      desc: 'Building meaningful connections and community.',
    },
    {
      num: '02',
      label: 'Knowledge',
      desc: 'Disseminating research and education.',
    },
    {
      num: '03',
      label: 'Research',
      desc: 'Conducting transformative studies.',
    },
  ],
};

const IMPACT_FALLBACK: ImpactSectionContent = {
  label: 'The Challenge',
  title: 'Addressing Hidden Crises',
  description:
    'The Institute will play an important role in raising awareness and offering solutions to the hidden crisis of the sexual abuse of African descent boys and men. Unaddressed and unacknowledged trauma results in:',
  items: [
    'Academic underperformance',
    'Externalized and internalized aggression',
    'Low self-esteem',
    'Negative self-perception',
    'Psychological distress',
    'Stigma and shame',
  ],
};

const MISSION_FALLBACK: MissionSectionContent = {
  label: 'What We Do',
  title: 'Remembering Creative Power',
  description:
    'The Institute recognizes that many African descent boys and men are impacted by misandrist dehumanizing stereotypes, unspoken trauma, and the silencing of their emotional lives.',
  pillars: [
    {
      icon_name: 'Heart',
      title: 'Advocacy',
      desc: 'Championing the emotional well-being and dignity of African descent boys and men.',
    },
    {
      icon_name: 'BookOpen',
      title: 'Education',
      desc: 'Community education and knowledge dissemination for healing and empowerment.',
    },
    {
      icon_name: 'Shield',
      title: 'Research',
      desc: 'Conducting critical research on trauma, identity, and resilience.',
    },
    {
      icon_name: 'Users',
      title: 'Psychotherapy',
      desc: 'Supporting men and boys in reclaiming creative power and voice.',
    },
  ],
};

export default async function HomePage() {
  const [{ data: sections }, { data: settings }, visibility, supabase] =
    await Promise.all([
      getPageContent('home'),
      getSiteSettings(),
      getSiteVisibility(),
      createClient(),
    ]);

  const hero = sections?.find((s) => s.section === 'hero');
  const intro = sections?.find((s) => s.section === 'intro');
  const cta = sections?.find((s) => s.section === 'cta');

  // Reconstruct hero image URLs from storage paths
  const heroImageUrl = settings?.home_hero_image_path
    ? supabase.storage
        .from('institute-media')
        .getPublicUrl(settings.home_hero_image_path).data.publicUrl
    : '/assets/hero-image.jpg';
  const heroBgUrl = settings?.home_hero_bg_path
    ? supabase.storage
        .from('institute-media')
        .getPublicUrl(settings.home_hero_bg_path).data.publicUrl
    : '/assets/forest-bg.jpg';

  const goalData = parseSection(sections, 'goal_section', GOAL_FALLBACK);
  const impactData = parseSection(sections, 'impact_section', IMPACT_FALLBACK);
  const missionData = parseSection(
    sections,
    'mission_section',
    MISSION_FALLBACK,
  );

  // Upcoming events from Supabase
  const now = new Date().toISOString();
  const { data: eventsData } = await supabase
    .from('events')
    .select('id, title, location, event_date')
    .eq('published', true)
    .gt('event_date', now)
    .order('event_date', { ascending: true })
    .limit(2);
  const upcomingEvents = eventsData ?? [];

  return (
    <div>
      {/* Hero — always rendered with defaults */}
      <section className="relative bg-surface dark:bg-dark-surface py-40 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <Image
          src={heroBgUrl}
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative max-w-6xl mx-auto">
          <div className="flex items-center gap-12">
            <div className="flex-1">
              <div
                className="hero-tiptap tiptap-content"
                dangerouslySetInnerHTML={{ __html: hero?.content ?? '' }}
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
              </div>
            </div>
            <div className="hidden md:block flex-shrink-0 w-sm">
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
            </div>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      {visibility.intro_section_enabled && intro?.content && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[var(--color-surface)] dark:bg-dark-background">
          <div className="max-w-4xl mx-auto">
            <div
              className="tiptap-content"
              dangerouslySetInnerHTML={{ __html: intro.content }}
            />
          </div>
        </section>
      )}

      {/* Goal Section */}
      {visibility.goal_section_enabled && <GoalSection data={goalData} />}

      {/* Impact Section */}
      {visibility.impact_section_enabled && <ImpactSection data={impactData} />}

      {/* Mission Section */}
      {visibility.mission_section_enabled && (
        <MissionSection data={missionData} />
      )}

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-(--color-brand-primary) dark:bg-dark-surface">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display text-3xl font-bold text-white mb-8">
              Upcoming Events
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {upcomingEvents.map((event) => (
                <Link
                  key={event.id}
                  href={`/events/${event.id}`}
                  className="group block rounded-xl border border-white/20 bg-white/10 p-6 hover:bg-white/20 transition-colors"
                >
                  <p className="text-xs text-white/60 mb-2">
                    {formatDate(event.event_date)} · {event.location}
                  </p>
                  <h3 className="font-display text-lg font-bold text-white">
                    {event.title}
                  </h3>
                </Link>
              ))}
            </div>
            <div className="mt-8">
              <Link
                href="/events"
                className="text-sm font-medium text-[hsl(35_60%_50%)] hover:underline"
              >
                View all events →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      {visibility.cta_section_enabled && cta?.content && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[var(--color-surface)] dark:bg-dark-background">
          <div className="max-w-4xl mx-auto">
            <div
              className="tiptap-content"
              dangerouslySetInnerHTML={{ __html: cta.content }}
            />
          </div>
        </section>
      )}
    </div>
  );
}
