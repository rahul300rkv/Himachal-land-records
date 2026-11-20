const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://himachal-land-records.vercel.app').replace(/\/$/, '');

/** Absolute URL for a locale-prefixed path. Reuse your lib/seo helper instead if it already has one. */
export function absoluteUrl(locale: string, path: string) {
  return `${SITE_URL}/${locale}${path === '/' ? '' : path}`;
}

export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  // Escape "<" so the JSON can never close the script tag early.
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
