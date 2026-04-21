import Link from 'next/link';

const footerLinks = [
  { href: '/about', label: 'About' },
  { href: '/mission', label: 'Mission' },
  { href: '/events', label: 'Events' },
  { href: '/blogs', label: 'Blogs' },
  { href: '/reading-list', label: 'Reading List' },
  { href: '/partners', label: 'Partners' },
];

export function Footer() {
  return (
    <footer className="mt-auto bg-(--color-brand-primary) dark:bg-dark-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <p className="font-display font-bold text-lg text-white mb-2">
              Kustawi Institute
            </p>
            <p className="text-sm text-white/60 leading-relaxed">
              A modern school institute committed to academic excellence and
              community.
            </p>
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
          <div>
            <p className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">
              Contact
            </p>
            <div className="space-y-2 text-sm text-white/60">
              <p>contact@kustawi.org</p>
              <p>+000 000 0000</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/20 text-center text-xs text-white/40">
          &copy; {new Date().getFullYear()} Kustawi Institute. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
}
