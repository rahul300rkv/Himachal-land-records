import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { absoluteUrl } from '@/lib/utils';
import { BLOG_GUIDES } from '@/lib/blog-guides';

// Public, indexable pages. (Record pages hold personal data and are deliberately excluded;
// add individual marketplace listings here once you want them indexed.)
const PATHS = [
  '',
  '/search',
  '/verify',
  '/check',
  '/marketplace',
  '/reports',
  '/converter',
  '/map',
  '/tools',
  '/guides',
  '/blog',
  '/blog/7-documents-before-buying-land',
  ...BLOG_GUIDES.map(({ slug }) => `/blog/${slug}`),
  '/about',
  '/disclaimer',
  '/privacy',
  '/terms',
];
const CONTENT_UPDATED = new Date('2026-11-15T00:00:00+05:30');

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: absoluteUrl(`/${locale}${path}`),
      lastModified: CONTENT_UPDATED,
      changeFrequency: path === '' || path === '/marketplace' ? ('daily' as const) : ('monthly' as const),
      priority: path === '' ? 1 : 0.7,
      alternates: {
        languages: {
          ...Object.fromEntries(routing.locales.map((l) => [l, absoluteUrl(`/${l}${path}`)])),
          'x-default': absoluteUrl(`/${routing.defaultLocale}${path}`),
        },
      },
    })),
  );
}
