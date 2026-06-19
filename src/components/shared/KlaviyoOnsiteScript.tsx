import Script from 'next/script'
import { getSiteSettings } from '@/actions/settings'

export async function KlaviyoOnsiteScript() {
  const { data: settings } = await getSiteSettings()
  const enabled = settings?.klaviyo_popup_enabled === 'true'
  const companyId = settings?.klaviyo_company_id?.trim()
  if (!enabled || !companyId) return null

  const id = encodeURIComponent(companyId)

  return (
    <>
      <Script
        id="klaviyo-onsite"
        strategy="afterInteractive"
        src={`https://static.klaviyo.com/onsite/js/${id}/klaviyo.js?company_id=${id}`}
      />
      {/* Klaviyo's official boilerplate — queues klaviyo.push() calls made
          before the async script above has finished loading. */}
      <Script id="klaviyo-onsite-init" strategy="afterInteractive">
        {`!function(){if(!window.klaviyo){window._klOnsite=window._klOnsite||[];try{window.klaviyo=new Proxy({},{get:function(n,i){return"push"===i?function(){var n;(n=window._klOnsite).push.apply(n,arguments)}:function(){for(var n=arguments.length,o=new Array(n),w=0;w<n;w++)o[w]=arguments[w];var t="function"==typeof o[o.length-1]?o.pop():void 0,e=new Promise((function(n){window._klOnsite.push([i].concat(o,[function(i){t&&t(i),n(i)}]))}));return e}}})}catch(n){window.klaviyo=window.klaviyo||[],window.klaviyo.push=function(){var n;(n=window._klOnsite).push.apply(n,arguments)}}}}();`}
      </Script>
    </>
  )
}
