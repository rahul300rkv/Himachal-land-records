import type { Metadata } from 'next';
import { routing } from '@/i18n/routing';

type PageMetadataInput = {
  locale: string;
  /** Path without the locale, e.g. "/about". Use "" for the home page. */
  path: string;
  title: string;
  description: string;
  /** Keep private or personal-data pages out of search engines. */
  noindex?: boolean;
};

/**
 * Metadata shared by every page: title, description, canonical URL, hreflang alternates,
 * Open Graph. (`metadataBase` is set once in the locale layout.)
 */
export function pageMetadata({ locale, path, title, description, noindex }: PageMetadataInput): Metadata {
  const languages = Object.fromEntries(routing.locales.map((l) => [l, `/${l}${path}`]));
  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}${path}`,
      languages: { ...languages, 'x-default': `/${routing.defaultLocale}${path}` },
    },
    openGraph: {
      title,
      description,
      url: `/${locale}${path}`,
      locale: locale === 'hi' ? 'hi_IN' : 'en_IN',
    },
    robots: noindex ? { index: false, follow: false } : undefined,
  };
}
