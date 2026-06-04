import Image from 'next/image';
import { getPageContent } from '@/actions/page-content';
import { getSiteSettings } from '@/actions/settings';
import { getSiteVisibility } from '@/lib/site-visibility';
import { createClient } from '@/lib/supabase/server';
import NewsletterSignup from '@/components/home/NewsletterSignup'
import GoalSection from '@/components/home/GoalSection';
import ImpactSection from '@/components/home/ImpactSection';
import MissionSection from '@/components/home/MissionSection';
import WellnessFeaturedSection from '@/components/home/WellnessFeaturedSection'
import BookOfMonthSection from '@/components/home/BookOfMonthSection';
import { HeroContent } from '@/components/home/HeroContent';
import { UpcomingEventsSection } from '@/components/home/UpcomingEventsSection';
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

  // H&W featured posts
  const wellnessFeaturedMode = settings?.wellness_featured_mode ?? 'latest'
  const wellnessFeaturedIds: string[] = (() => {
    try { return JSON.parse(settings?.wellness_featured_ids ?? '[]') } catch { return [] }
  })()

  let wellnessFeaturedPosts: { id: string; title: string; excerpt: string | null; cover_url: string | null }[] = []
  if (visibility.wellness_section_enabled) {
    let wellnessQuery = supabase
      .from('wellness_posts')
      .select('id, title, excerpt, cover_path')
      .eq('published', true)

    if (wellnessFeaturedMode === 'manual' && wellnessFeaturedIds.length > 0) {
      wellnessQuery = wellnessQuery.in('id', wellnessFeaturedIds)
    } else {
      wellnessQuery = wellnessQuery.order('published_at', { ascending: false }).limit(3)
    }

    const { data: wData } = await wellnessQuery
    const ordered = wellnessFeaturedMode === 'manual' && wellnessFeaturedIds.length > 0
      ? wellnessFeaturedIds.map((id) => (wData ?? []).find((p) => p.id === id)).filter(Boolean)
      : (wData ?? [])

    wellnessFeaturedPosts = (ordered as typeof wData ?? []).map((p) => ({
      id: p!.id,
      title: p!.title,
      excerpt: p!.excerpt,
      cover_url: p!.cover_path
        ? supabase.storage.from('institute-media').getPublicUrl(p!.cover_path).data.publicUrl
        : null,
    }))
  }

  // Book of the Month
  const bookOfMonthId = settings?.book_of_the_month_id || null
  let bookOfMonth: {
    id: string
    title: string
    author: string | null
    description: string | null
    cover_url: string | null
    external_url: string | null
  } | null = null

  if (bookOfMonthId) {
    const { data: bomData } = await supabase
      .from('reading_list')
      .select('id, title, author, description, cover_path, external_url')
      .eq('id', bookOfMonthId)
      .eq('published', true)
      .single()
    if (bomData) {
      bookOfMonth = {
        id: bomData.id,
        title: bomData.title,
        author: bomData.author ?? null,
        description: bomData.description ?? null,
        cover_url: bomData.cover_path
          ? supabase.storage.from('institute-media').getPublicUrl(bomData.cover_path).data.publicUrl
          : null,
        external_url: bomData.external_url ?? null,
      }
    }
  }

  // Upcoming events from Supabase
  const upcomingEventsEnabled = visibility.upcoming_events_section_enabled !== false
  const upcomingEventsMax     = Math.max(1, parseInt(settings?.upcoming_events_max_count ?? '2', 10) || 2)
  const upcomingEventsHeading = settings?.upcoming_events_heading || 'Upcoming Events'

  const now = new Date().toISOString();
  const { data: eventsData } = upcomingEventsEnabled
    ? await supabase
        .from('events')
        .select('id, title, location, event_date')
        .eq('published', true)
        .gt('event_date', now)
        .order('event_date', { ascending: true })
        .limit(upcomingEventsMax)
    : { data: [] }
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

        <HeroContent heroHtml={hero?.content ?? ''} heroImageUrl={heroImageUrl} />
      </section>

      {/* Introduction Section */}
      {visibility.intro_section_enabled && intro?.content && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-surface dark:bg-dark-background">
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

      {/* Health & Wellness Featured */}
      {visibility.wellness_section_enabled && wellnessFeaturedPosts.length > 0 && (
        <WellnessFeaturedSection
          blurb={settings?.wellness_section_blurb ?? ''}
          posts={wellnessFeaturedPosts}
        />
      )}

      {/* Book of the Month */}
      {bookOfMonth && <BookOfMonthSection item={bookOfMonth} />}

      {/* Upcoming Events */}
      {upcomingEventsEnabled && upcomingEvents.length > 0 && (
        <UpcomingEventsSection events={upcomingEvents} heading={upcomingEventsHeading} />
      )}

      {/* CTA */}
      {visibility.cta_section_enabled && cta?.content && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-surface dark:bg-dark-background">
          <div className="max-w-4xl mx-auto">
            <div
              className="tiptap-content"
              dangerouslySetInnerHTML={{ __html: cta.content }}
            />
          </div>
        </section>
      )}

      {/* Newsletter Signup */}
      {visibility.signup_section_enabled && (
        <NewsletterSignup
          heading={settings?.newsletter_heading || 'Stay Connected'}
          subtext={settings?.newsletter_subtext || 'Join our community and be the first to hear about events, publications, and resources from the Kustawi Institute.'}
          successMessage={settings?.newsletter_success_message || "Thank you! You're now subscribed."}
          consentText={settings?.newsletter_consent_text || 'By subscribing you agree to receive email communications from the Kustawi Institute. Unsubscribe at any time.'}
        />
      )}
    </div>
  );
}
