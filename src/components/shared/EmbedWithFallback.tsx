'use client'

import { useEffect, useRef, useState } from 'react';
import { KlaviyoFallbackForm } from '@/components/shared/KlaviyoFallbackForm';

interface Props {
  html: string;
  transparentBg: boolean;
  heading: string;
  successMessage: string;
  consentText: string;
  listId?: string | null;
}

const DETECTION_DELAY_MS = 4000;

export function EmbedWithFallback({ html, transparentBg, heading, successMessage, consentText, listId }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const rendered = containerRef.current?.querySelector('.klaviyo-form, form, iframe');
      if (!rendered) setBlocked(true);
    }, DETECTION_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <div
        ref={containerRef}
        className={transparentBg ? 'embed-transparent-bg' : undefined}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {blocked && listId && (
        <KlaviyoFallbackForm
          heading={heading}
          successMessage={successMessage}
          consentText={consentText}
          listId={listId}
          submitLabel="Register"
          loadingLabel="Registering…"
          className="mt-4"
        />
      )}
    </div>
  );
}
