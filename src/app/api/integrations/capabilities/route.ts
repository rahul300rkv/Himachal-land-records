import { NextResponse } from 'next/server';
import { LAND_SOURCES } from '@/lib/integrations/land-sources';

export const dynamic = 'force-static';

export function GET() {
  return NextResponse.json({
    generatedAt: new Date().toISOString(),
    policy: 'Public entry points only; protected requests, CAPTCHAs and account sessions are never proxied.',
    sources: LAND_SOURCES,
  });
}
