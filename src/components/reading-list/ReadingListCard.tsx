'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

export interface ReadingListCardProps {
  id: string;
  title: string;
  author: string;
  description_excerpt: string;
  cover_url: string;
  external_url?: string | null;
}

export default function ReadingListCard({
  id,
  title,
  author,
  description_excerpt,
  cover_url,
  external_url,
}: ReadingListCardProps) {
  return (
    <motion.div
      className="group h-full"
      whileHover={{ y: -2 }}
      transition={{
        duration: 0.25,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      }}
    >
      <div className="flex flex-col h-full rounded-2xl overflow-hidden bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface)] border border-[var(--color-border)] dark:border-[var(--color-dark-border)] hover:shadow-lg hover:border-[var(--color-brand-teal-light)] dark:hover:border-[var(--color-brand-teal)] transition-all duration-300">
        {/* Cover — portrait 3:4, clickable */}
        <Link href={`/reading-list/${id}`} className="block relative w-full overflow-hidden cursor-pointer" style={{ aspectRatio: '3/4' }}>
          {cover_url ? (
            <Image
              src={cover_url}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
            />
          ) : (
            <div className="absolute inset-0 bg-[var(--color-surface)] dark:bg-[var(--color-dark-surface-hover)] flex items-center justify-center">
              <BookOpen className="w-12 h-12 text-[var(--color-text-muted)] opacity-40" />
            </div>
          )}
        </Link>

        {/* Body */}
        <div className="flex flex-col flex-1 p-4 space-y-2">
          <h2 className="font-display text-base font-bold text-[var(--color-text-primary)] dark:text-white line-clamp-2 leading-snug">
            {title}
          </h2>
          {author && (
            <p className="text-sm text-[var(--color-text-muted)]">{author}</p>
          )}
          {description_excerpt && (
            <p className="text-sm text-[var(--color-text-muted)] line-clamp-3 leading-relaxed flex-1">
              {description_excerpt}
            </p>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <Link
              href={`/reading-list/${id}`}
              className="text-sm font-medium text-[var(--color-brand-teal)] dark:text-white hover:underline"
            >
              View →
            </Link>
            {external_url && (
              <a
                href={external_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-brand-teal)] dark:hover:text-white transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="w-3.5 h-3.5" />
                External Link
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
