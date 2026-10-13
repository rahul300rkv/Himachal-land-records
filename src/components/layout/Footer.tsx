import { TriangleAlert } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Logo } from './Logo';
import { NAV_ITEMS } from './nav-items';

const LEGAL_LINKS = [
  { href: '/disclaimer', key: 'disclaimer' },
  { href: '/privacy', key: 'privacy' },
  { href: '/terms', key: 'terms' },
] as const;

const linkClass = 'text-muted-foreground hover:text-primary hover:underline';

export function Footer() {
  const t = useTranslations('Footer');
  const nav = useTranslations('Navigation');
  const year = new Date().getFullYear();

  const exploreLinks = NAV_ITEMS.filter((item) => item.key !== 'about');

  return (
    <footer className="mt-16 border-t bg-muted/50">
      <div className="container py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="max-w-sm space-y-4 sm:col-span-2 lg:col-span-1">
            <Logo />
            <p className="text-sm text-muted-foreground">{t('tagline')}</p>
          </div>

          <nav aria-label={t('explore')}>
            <h2 className="font-sans text-sm font-semibold tracking-normal">{t('explore')}</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {exploreLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {nav(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={t('company')}>
            <h2 className="font-sans text-sm font-semibold tracking-normal">{t('company')}</h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/about" className={linkClass}>
                  {nav('about')}
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label={t('legal')}>
            <h2 className="font-sans text-sm font-semibold tracking-normal">{t('legal')}</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {LEGAL_LINKS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {nav(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Short legal notice on every page; the banner above the header and /disclaimer carry the rest. */}
        <p
          role="note"
          className="mt-10 flex items-start gap-3 rounded-lg border border-notice-border bg-notice p-4 text-sm text-notice-foreground"
        >
          <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <span>
            {t('disclaimerShort')}{' '}
            <Link href="/disclaimer" className="whitespace-nowrap font-semibold underline underline-offset-2">
              {t('readDisclaimer')}
            </Link>
          </span>
        </p>

        <div className="mt-8 flex flex-col gap-1 border-t pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>{t('copyright', { year })}</p>
          <p>{t('independentNote')}</p>
        </div>
      </div>
    </footer>
  );
}
