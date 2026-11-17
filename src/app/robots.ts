import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { absoluteUrl } from '@/lib/utils';

export default function robots(): MetadataRoute.Robots {
  const privatePaths = routing.locales.flatMap((l) => [
    `/${l}/dashboard`,
    `/${l}/dashboard/`,
    `/${l}/login`,
    `/${l}/login/`,
    `/${l}/record/`,
    `/${l}/marketplace/list`,
    `/${l}/marketplace/list/`,
  ]);

  return {
    rules: [{
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/auth/', ...privatePaths],
    }],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: absoluteUrl('/'),
  };
}
