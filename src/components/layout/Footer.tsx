import Link from 'next/link'
import { getSiteSettings } from '@/actions/settings'
import { parseNavConfig } from '@/lib/nav-config'
import { DIRECTORY_CATEGORIES, DIRECTORY_CATEGORY_LABELS, type DirectoryCategory, type SiteSettings } from '@/types'

function renderSiteName(name: string) {
  const idx = name.indexOf('Institute')
  if (idx === -1) return <>{name}</>
  return (
    <>
      {name.slice(0, idx)}
      <span className="text-[hsl(35_60%_50%)]">Institute</span>
      {name.slice(idx + 'Institute'.length)}
    </>
  )
}

function SocialLink({ href, label }: { href: string; label: string }) {
  if (!href.trim()) return null
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white text-xs font-bold transition-colors"
    >
      {label.slice(0, 2).toUpperCase()}
    </a>
  )
}

const CATEGORY_HREF: Record<DirectoryCategory, string> = {
  advocate:                    '/advocates',
  psychotherapist:             '/psychotherapists',
  referral_agency:             '/referral-agencies',
  black_mens_group:            '/black-mens-groups',
  youth_service_organization:  '/youth-service-organizations',
  community_organization:      '/community-organizations',
}

const CATEGORY_VISIBILITY_KEY: Record<DirectoryCategory, keyof SiteSettings> = {
  advocate:                    'advocates_enabled',
  psychotherapist:             'psychotherapists_enabled',
  referral_agency:             'referral_agencies_enabled',
  black_mens_group:            'black_mens_groups_enabled',
  youth_service_organization:  'youth_service_organizations_enabled',
  community_organization:      'community_organizations_enabled',
}

export async function Footer() {
  const { data: settings } = await getSiteSettings()

  const siteName        = settings?.site_name || 'Kustawi Institute'
  const siteDescription = settings?.site_description || ''

  const adminName  = settings?.admin_name_visible  !== 'false' && settings?.admin_name  ? settings.admin_name  : null
  const adminTitle = settings?.admin_title_visible !== 'false' && settings?.admin_title ? settings.admin_title : null
  const adminEmail = settings?.admin_email_visible !== 'false' && settings?.admin_email ? settings.admin_email : null
  const adminEmail2 = settings?.admin_email_2_visible !== 'false' && settings?.admin_email_2 ? settings.admin_email_2 : null
  const phone      = settings?.contact_phone_visible !== 'false' && settings?.contact_phone ? settings.contact_phone : null
  const address    = settings?.address_visible       !== 'false' && settings?.address       ? settings.address       : null
  const hasContact = adminName || adminTitle || adminEmail || adminEmail2 || phone || address

  const navHeading      = settings?.footer_nav_heading      || 'Navigate'
  const contactHeading  = settings?.footer_contact_heading  || 'Contact'
  const copyrightSuffix = settings?.footer_copyright_suffix ?? 'All rights reserved.'

  // Build nav links from nav_config, in the same order as the header. "Services" has no
  // real page of its own (it's a hover-dropdown trigger) — expand it inline into its
  // directory category children, each gated by its own visibility toggle.
  const navItems = parseNavConfig(settings?.nav_config)
  const footerLinks = navItems
    .filter((i) => i.visible && i.href !== '/')
    .flatMap((item) => {
      if (item.slug !== 'services') return [{ href: item.href, label: item.label }]
      return DIRECTORY_CATEGORIES
        .filter((cat) => settings?.[CATEGORY_VISIBILITY_KEY[cat]] !== 'false')
        .map((cat) => ({ href: CATEGORY_HREF[cat], label: DIRECTORY_CATEGORY_LABELS[cat] }))
    })

  // Social links — only show non-empty entries
  const socials = [
    { key: 'facebook',  label: 'FB', url: settings?.social_facebook  },
    { key: 'instagram', label: 'IG', url: settings?.social_instagram },
    { key: 'twitter',   label: 'TW', url: settings?.social_twitter   },
    { key: 'linkedin',  label: 'LI', url: settings?.social_linkedin  },
    { key: 'youtube',   label: 'YT', url: settings?.social_youtube   },
  ].filter(({ url }) => url?.trim())

  return (
    <footer className="mt-auto bg-(--color-brand-primary) dark:bg-dark-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Brand */}
          <div className="space-y-3">
            <p className="font-display font-bold text-lg text-white">
              {renderSiteName(siteName)}
            </p>
            {siteDescription && (
              <p className="text-sm text-white/60 leading-relaxed">{siteDescription}</p>
            )}
            {socials.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {socials.map(({ key, label, url }) => (
                  <SocialLink key={key} href={url!} label={label} />
                ))}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div>
            <p className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">
              {navHeading}
            </p>
            <ul className="space-y-2">
              {footerLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-white/60 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          {hasContact && (
            <div>
              <p className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">
                {contactHeading}
              </p>
              <div className="space-y-1">
                {adminName  && <p className="text-sm text-white">{adminName}</p>}
                {adminTitle && <p className="text-sm text-white/60">{adminTitle}</p>}
                {adminEmail && (
                  <a href={`mailto:${adminEmail}`} className="block text-sm text-[hsl(35_60%_50%)] hover:underline">
                    {adminEmail}
                  </a>
                )}
                {adminEmail2 && (
                  <a href={`mailto:${adminEmail2}`} className="block text-sm text-[hsl(35_60%_50%)] hover:underline">
                    {adminEmail2}
                  </a>
                )}
                {phone && (
                  <a href={`tel:${phone}`} className="block text-sm text-white/60 hover:text-white transition-colors">
                    {phone}
                  </a>
                )}
                {address && (
                  <p className="text-sm text-white/60 whitespace-pre-line">{address}</p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-white/20 text-center text-xs text-white/40">
          &copy; {new Date().getFullYear()} {siteName}. {copyrightSuffix}
        </div>
      </div>
    </footer>
  )
}
