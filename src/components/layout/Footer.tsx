import Link from 'next/link';
import { getSiteSettings } from '@/actions/settings';

function renderSiteName(name: string) {
  const idx = name.indexOf('Institute');
  if (idx === -1) return <>{name}</>;
  return (
    <>
      {name.slice(0, idx)}
      <span className="text-[hsl(35_60%_50%)]">Institute</span>
      {name.slice(idx + 'Institute'.length)}
    </>
  );
}

const footerLinks = [
  { href: '/about', label: 'About' },
  { href: '/mission', label: 'Mission' },
  { href: '/events', label: 'Events' },
  { href: '/blogs', label: 'Blogs' },
  { href: '/reading-list', label: 'Reading List' },
  { href: '/partners', label: 'Partners' },
];

export async function Footer() {
  const { data: settings } = await getSiteSettings();

  const siteName        = settings?.site_name || 'Kustawi Institute';
  const siteDescription = settings?.site_description || '';

  const adminName  = settings?.admin_name_visible  !== 'false' && settings?.admin_name  ? settings.admin_name  : null;
  const adminTitle = settings?.admin_title_visible !== 'false' && settings?.admin_title ? settings.admin_title : null;
  const adminEmail = settings?.admin_email_visible !== 'false' && settings?.admin_email ? settings.admin_email : null;
  const phone      = settings?.contact_phone_visible !== 'false' && settings?.contact_phone ? settings.contact_phone : null;
  const address    = settings?.address_visible       !== 'false' && settings?.address       ? settings.address       : null;

  const hasContact = adminName || adminTitle || adminEmail || phone || address;

  return (
    <footer className="mt-auto bg-(--color-brand-primary) dark:bg-dark-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Brand */}
          <div>
            <p className="font-display font-bold text-lg text-white mb-2">
              {renderSiteName(siteName)}
            </p>
            {siteDescription && (
              <p className="text-sm text-white/60 leading-relaxed">
                {siteDescription}
              </p>
            )}
          </div>

          {/* Navigation */}
          <div>
            <p className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">
              Navigate
            </p>
            <ul className="space-y-2">
              {footerLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
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
                Contact
              </p>
              <div className="space-y-1">
                {adminName  && <p className="text-sm text-white">{adminName}</p>}
                {adminTitle && <p className="text-sm text-white/60">{adminTitle}</p>}
                {adminEmail && (
                  <a
                    href={`mailto:${adminEmail}`}
                    className="block text-sm text-[hsl(35_60%_50%)] hover:underline"
                  >
                    {adminEmail}
                  </a>
                )}
                {phone && (
                  <a
                    href={`tel:${phone}`}
                    className="block text-sm text-white/60 hover:text-white transition-colors"
                  >
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
          &copy; {new Date().getFullYear()} {siteName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
