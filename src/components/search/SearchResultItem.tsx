import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, Calendar, FileText, Heart, Microscope, Users } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { SearchResult } from '@/types';

interface SearchResultItemProps {
  result: SearchResult;
}

const TYPE_CONFIG = {
  blog: {
    label: 'Blog',
    icon: FileText,
    href: (id: string) => `/blogs/${id}`,
    color:
      'text-[var(--color-brand-teal)] bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)]',
  },
  event: {
    label: 'Event',
    icon: Calendar,
    href: (id: string) => `/events/${id}`,
    color:
      'text-[var(--color-brand-teal)] bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)]',
  },
  reading_list: {
    label: 'Reading List',
    icon: BookOpen,
    href: (id: string) => `/reading-list/${id}`,
    color:
      'text-[var(--color-brand-teal)] bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)]',
  },
  wellness: {
    label: 'Health & Wellness',
    icon: Heart,
    href: (id: string) => `/health-wellness/${id}`,
    color:
      'text-[var(--color-brand-teal)] bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)]',
  },
  research: {
    label: 'Research',
    icon: Microscope,
    href: (id: string) => `/research/${id}`,
    color:
      'text-[var(--color-brand-teal)] bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)]',
  },
  directory: {
    label: 'Directory',
    icon: Users,
    href: (id: string) => `/${id}`,
    color:
      'text-[var(--color-brand-teal)] bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)]',
  },
} as const;

export default function SearchResultItem({ result }: SearchResultItemProps) {
  const config = TYPE_CONFIG[result.type];
  const Icon = config.icon;
  const href = config.href(result.id);

  const meta = result.event_date
    ? formatDate(result.event_date)
    : result.published_at
      ? formatDate(result.published_at)
      : null;

  return (
    <Link
      href={href}
      className="group flex items-start gap-4 p-5 rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-[var(--color-background)] dark:bg-[var(--color-dark-surface)] hover:border-[var(--color-brand-teal-light)] hover:shadow-sm transition-all"
    >
      {/* Cover image or icon fallback */}
      <div className="shrink-0 mt-0.5 w-12 h-16 rounded-lg overflow-hidden bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface-hover)] flex items-center justify-center">
        {result.cover_url ? (
          <Image
            src={result.cover_url}
            alt={result.title}
            width={48}
            height={64}
            className="w-full h-full object-cover"
          />
        ) : (
          <Icon size={18} className="text-[var(--color-brand-teal)] dark:text-white" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`text-xs dark:text-white font-medium px-2 py-0.5 rounded-full ${config.color}`}
          >
            {config.label}
          </span>
          {meta && (
            <span className="text-xs text-[var(--color-text-muted)] dark:text-white">
              {meta}
            </span>
          )}
        </div>

        <h3 className="font-medium text-[var(--color-text-primary)] dark:text-white group-hover:text-[var(--color-brand-teal)] dark:group-hover:text-[var(--color-brand-teal-light)] transition-colors leading-snug">
          {result.title}
        </h3>

        {result.excerpt && (
          <p className="text-sm text-[var(--color-text-muted)] line-clamp-2 leading-relaxed">
            {result.excerpt}
          </p>
        )}
      </div>

      {/* Arrow */}
      <span className="shrink-0 self-center text-[var(--color-text-muted)] group-hover:text-[var(--color-brand-teal)] transition-colors">
        →
      </span>
    </Link>
  );
}
