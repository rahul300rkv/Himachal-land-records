import { NextRequest, NextResponse } from 'next/server';
import catalog from '@/lib/data/bhunaksha-locations.json';

export function GET(request: NextRequest) {
  const districtId = request.nextUrl.searchParams.get('districtId');
  const tehsilId = request.nextUrl.searchParams.get('tehsilId');

  if (!districtId) {
    return NextResponse.json({
      districts: catalog.map(({ id, name, hi }) => ({ id, name, hi })),
    });
  }

  const district = catalog.find((item) => item.id === districtId);
  if (!district) return NextResponse.json({ error: 'District not found' }, { status: 404 });

  if (!tehsilId) {
    return NextResponse.json({
      tehsils: district.tehsils.map(({ id, name }) => ({ id, name })),
    });
  }

  const tehsil = district.tehsils.find((item) => item.id === tehsilId);
  if (!tehsil) return NextResponse.json({ error: 'Tehsil not found' }, { status: 404 });

  return NextResponse.json({ villages: tehsil.villages });
}
