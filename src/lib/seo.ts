import type { Metadata } from 'next';
import { routing } from '@/i18n/routing';
import { absoluteUrl } from '@/lib/utils';

type PageMetadataInput = {
  locale: string;
  /** Path without the locale, e.g. "/about". Use "" for the home page. */
  path: string;
  title: string;
  description: string;
  /** Keep private or personal-data pages out of search engines. */
  noindex?: boolean;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
};

/**
 * Metadata shared by every page: title, description, canonical URL, hreflang alternates,
 * Open Graph. (`metadataBase` is set once in the locale layout.)
 */
export function pageMetadata({
  locale,
  path,
  title,
  description,
  noindex,
  type = 'website',
  publishedTime,
  modifiedTime,
}: PageMetadataInput): Metadata {
  const languages = Object.fromEntries(routing.locales.map((l) => [l, `/${l}${path}`]));
  const url = `/${locale}${path}`;
  const image = absoluteUrl('/images/himachal-valley.jpg');
  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}${path}`,
      languages: { ...languages, 'x-default': `/${routing.defaultLocale}${path}` },
    },
    openGraph: {
      type,
      title,
      description,
      url,
      locale: locale === 'hi' ? 'hi_IN' : 'en_IN',
      alternateLocale: locale === 'hi' ? ['en_IN'] : ['hi_IN'],
      images: [{ url: image, width: 1600, height: 900, alt: title }],
      ...(type === 'article' ? { publishedTime, modifiedTime, authors: ['HimachalLand Check'] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    robots: noindex ? { index: false, follow: false } : undefined,
  };
}
