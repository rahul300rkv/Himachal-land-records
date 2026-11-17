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
  '/stamp-duty-calculator',
  '/map',
  '/tools',
  '/guides',
  '/blog',
  '/blog/7-documents-before-buying-land',
  ...BLOG_GUIDES.map(({ slug }) => `/blog/${slug}`),
  '/about',
  '/contact',
  '/disclaimer',
  '/privacy',
  '/terms',
];
const CONTENT_UPDATED = new Date('2026-11-17T00:00:00+05:30');

function lastModified(path: string) {
  const guide = BLOG_GUIDES.find(({ slug }) => path === `/blog/${slug}`);
  if (guide) return new Date(guide.publishedAt);
  if (path === '/blog/7-documents-before-buying-land') return new Date('2026-11-15T09:00:00+05:30');
  return CONTENT_UPDATED;
}

function priority(path: string) {
  if (path === '') return 1;
  if (path === '/search' || path === '/verify' || path === '/blog') return 0.8;
  if (path.startsWith('/blog/')) return 0.75;
  return 0.7;
}

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: absoluteUrl(`/${locale}${path}`),
      lastModified: lastModified(path),
      changeFrequency: path === '' || path === '/marketplace'
        ? ('daily' as const)
        : path === '/blog' ? ('weekly' as const) : ('monthly' as const),
      priority: priority(path),
      alternates: {
        languages: {
          ...Object.fromEntries(routing.locales.map((l) => [l, absoluteUrl(`/${l}${path}`)])),
          'x-default': absoluteUrl(`/${routing.defaultLocale}${path}`),
        },
      },
    })),
  );
}
