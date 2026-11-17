import { NextRequest, NextResponse } from 'next/server';
import { getMeghOffices, getMeghReports, meghDistricts } from '@/lib/megh-circle-rates';

export const maxDuration = 30;

export async function GET(request: NextRequest) {
  const district = request.nextUrl.searchParams.get('district') ?? '';
  const office = request.nextUrl.searchParams.get('office');
  if (!meghDistricts.some(([id]) => id === district) || (office !== null && !/^\d{1,6}$/.test(office))) {
    return NextResponse.json({ error: 'invalid_selection' }, { status: 400 });
  }
  try {
    if (office === null) return NextResponse.json({ offices: await getMeghOffices(district) });
    const reports = await getMeghReports(district, office);
    if (reports === null) {
      return NextResponse.json({ error: 'invalid_selection' }, { status: 400 });
    }
    return NextResponse.json({ reports });
  } catch (error) {
    console.error('[circle-rate]', {
      region: process.env.VERCEL_REGION,
      lookup: office === null ? 'offices' : 'reports',
      reason: error instanceof Error ? error.message : 'Unknown error',
    });
    return NextResponse.json({ error: 'megh_unavailable' }, { status: 502 });
  }
}
