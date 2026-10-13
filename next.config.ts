import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

// Points next-intl at the per-request config (loads the right messages file).
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

// Allow <Image> to load files stored in Supabase Storage (listing photos etc.).
const supabaseHostname = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // @react-pdf/renderer must run as a normal Node.js dependency, not be bundled.
  serverExternalPackages: ['@react-pdf/renderer'],
  // Make sure the PDF fonts are shipped with the serverless function (e.g. on Vercel).
  outputFileTracingIncludes: {
    '/api/report/generate': ['./src/assets/fonts/**/*'],
  },
  images: {
    remotePatterns: supabaseHostname
      ? [
          {
            protocol: 'https',
            hostname: supabaseHostname,
            pathname: '/storage/v1/object/public/**',
          },
        ]
      : [],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self)' },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
