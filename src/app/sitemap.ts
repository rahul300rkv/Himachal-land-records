import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { absoluteUrl } from '@/lib/utils';

// Public, indexable pages. (Record pages hold personal data and are deliberately excluded;
// add individual marketplace listings here once you want them indexed.)
const PATHS = ['', '/search', '/marketplace', '/reports', '/about', '/disclaimer', '/privacy', '/terms'];

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: absoluteUrl(`/${locale}${path}`),
      lastModified: new Date(),
      changeFrequency: path === '' || path === '/marketplace' ? ('daily' as const) : ('monthly' as const),
      priority: path === '' ? 1 : 0.7,
      alternates: {
        languages: Object.fromEntries(routing.locales.map((l) => [l, absoluteUrl(`/${l}${path}`)])),
      },
    })),
  );
}
