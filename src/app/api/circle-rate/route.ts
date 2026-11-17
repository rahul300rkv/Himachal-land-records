import { NextRequest, NextResponse } from 'next/server';
import { getMeghOffices, getMeghReports, meghDistricts } from '@/lib/megh-circle-rates';

export async function GET(request: NextRequest) {
  const district = request.nextUrl.searchParams.get('district') ?? '';
  const office = request.nextUrl.searchParams.get('office');
  if (!meghDistricts.some(([id]) => id === district) || (office !== null && !/^\d{1,6}$/.test(office))) {
    return NextResponse.json({ error: 'invalid_selection' }, { status: 400 });
  }
  try {
    const offices = await getMeghOffices(district);
    if (office === null) return NextResponse.json({ offices });
    if (!offices.some(({ id }) => id === office)) {
      return NextResponse.json({ error: 'invalid_selection' }, { status: 400 });
    }
    return NextResponse.json({ reports: await getMeghReports(district, office) });
  } catch {
    return NextResponse.json({ error: 'megh_unavailable' }, { status: 502 });
  }
}
