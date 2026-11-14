import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'HimachalLand Check',
    short_name: 'HimachalLand',
    description: 'Independent Himachal Pradesh land-record search, verification tools and buyer guides.',
    start_url: '/hi',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ffffff',
    icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }],
  };
}
