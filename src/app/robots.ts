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

  const disallow = ['/api/', '/auth/', ...privatePaths];

  return {
    rules: [
      // Keep the public answer-engine crawlers explicit while preserving the
      // same private-route protections as the default crawler group.
      {
        userAgent: ['PerplexityBot', 'Perplexity-User', 'OAI-SearchBot', 'Googlebot', 'Google-Extended', 'Bingbot'],
        allow: '/',
        disallow,
      },
      {
        userAgent: '*',
        allow: '/',
        disallow,
      },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: absoluteUrl('/'),
  };
}
