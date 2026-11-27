import { Mail, TriangleAlert } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Logo } from './Logo';
import { SITE } from '@/lib/site';

const LEGAL_LINKS = [
  { href: '/disclaimer', key: 'disclaimer' },
  { href: '/privacy', key: 'privacy' },
  { href: '/terms', key: 'terms' },
] as const;

const linkClass = 'inline-flex min-h-12 items-center text-muted-foreground hover:text-primary hover:underline';

export function Footer() {
  const t = useTranslations('Footer');
  const nav = useTranslations('Navigation');
  const year = new Date().getFullYear();

  return (
    <footer className="mt-12 border-t bg-muted/50 pb-20 lg:pb-24">
      <div className="container py-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr]">
          <div className="max-w-sm space-y-4 sm:col-span-2 lg:col-span-1">
            <Logo />
            <p className="text-sm text-muted-foreground">{t('tagline')}</p>
          </div>

          <nav aria-label={t('company')}>
            <h2 className="font-sans text-sm font-semibold tracking-normal">{t('company')}</h2>
            <ul className="mt-3 text-base">
              <li>
                <Link href="/about" className={linkClass}>
                  {nav('about')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className={linkClass}>
                  {nav('contact')}
                </Link>
              </li>
              <li>
                <a href={`mailto:${SITE.contactEmail}`} className={linkClass}>
                  <Mail className="mr-2 size-4" aria-hidden="true" />
                  {SITE.contactEmail}
                </a>
              </li>
              {SITE.bloggerUrl && (
                <li>
                  <a href={SITE.bloggerUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    <Image src="/images/blogger-logo.webp" alt="" width={16} height={16} className="mr-2 size-4 rounded-[3px]" />
                    Blogger
                  </a>
                </li>
              )}
            </ul>
          </nav>

          <nav aria-label={t('legal')}>
            <h2 className="font-sans text-sm font-semibold tracking-normal">{t('legal')}</h2>
            <ul className="mt-3 text-base">
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
