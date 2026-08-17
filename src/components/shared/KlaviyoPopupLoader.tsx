'use client'

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import { Mail, X } from 'lucide-react';
import { KlaviyoFallbackForm } from '@/components/shared/KlaviyoFallbackForm';

interface Props {
  companyId: string;
  heading: string;
  successMessage: string;
  consentText: string;
}

// Some blocking methods (DNS sinkholes, network-level filtering) never fire
// a script error event — the request just hangs. If the script hasn't
// loaded (or errored) within this window, treat it as blocked too.
const LOAD_TIMEOUT_MS = 6000;

export function KlaviyoPopupLoader({ companyId, heading, successMessage, consentText }: Props) {
  const [blocked, setBlocked] = useState(false);
  const [open, setOpen] = useState(false);
  const settledRef = useRef(false);
  const id = encodeURIComponent(companyId);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!settledRef.current) {
        settledRef.current = true;
        setBlocked(true);
      }
    }, LOAD_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Script
        id="klaviyo-onsite"
        strategy="afterInteractive"
        src={`https://static.klaviyo.com/onsite/js/${id}/klaviyo.js?company_id=${id}`}
        onLoad={() => { settledRef.current = true; }}
        onError={() => { settledRef.current = true; setBlocked(true); }}
      />
      {/* Klaviyo's official boilerplate — queues klaviyo.push() calls made
          before the async script above has finished loading. */}
      <Script id="klaviyo-onsite-init" strategy="afterInteractive">
        {`!function(){if(!window.klaviyo){window._klOnsite=window._klOnsite||[];try{window.klaviyo=new Proxy({},{get:function(n,i){return"push"===i?function(){var n;(n=window._klOnsite).push.apply(n,arguments)}:function(){for(var n=arguments.length,o=new Array(n),w=0;w<n;w++)o[w]=arguments[w];var t="function"==typeof o[o.length-1]?o.pop():void 0,e=new Promise((function(n){window._klOnsite.push([i].concat(o,[function(i){t&&t(i),n(i)}]))}));return e}}})}catch(n){window.klaviyo=window.klaviyo||[],window.klaviyo.push=function(){var n;(n=window._klOnsite).push.apply(n,arguments)}}}}();`}
      </Script>

      {blocked && (
        <div className="fixed bottom-5 right-5 z-50">
          {open ? (
            <div className="relative w-[calc(100vw-2.5rem)] sm:w-96">
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="absolute -top-2 -right-2 z-10 rounded-full bg-background dark:bg-dark-surface border border-(--color-border) dark:border-dark-border p-1 text-text-muted hover:text-text-primary dark:hover:text-white shadow cursor-pointer"
              >
                <X size={14} />
              </button>
              <KlaviyoFallbackForm
                heading={heading}
                successMessage={successMessage}
                consentText={consentText}
                className="shadow-xl"
              />
            </div>
          ) : (
            <button
              onClick={() => setOpen(true)}
              aria-label="Subscribe to our newsletter"
              className="flex items-center gap-2 rounded-full bg-(--color-brand-teal) text-white px-4 py-3 shadow-lg hover:bg-(--color-brand-teal-dark) transition-colors cursor-pointer"
            >
              <Mail size={18} />
              <span className="text-sm font-semibold">Subscribe</span>
            </button>
          )}
        </div>
      )}
    </>
  );
}
