import { type NextRequest } from 'next/server';
import { getOfficialVillages } from '@/lib/data/location-villages';

/** Fast, static lookup from the complete supplied village directory. */
export async function GET(request: NextRequest) {
  const district = request.nextUrl.searchParams.get('district')?.trim() ?? '';
  const tehsil = request.nextUrl.searchParams.get('tehsil')?.trim() ?? '';
  const locale = request.nextUrl.searchParams.get('locale') === 'hi' ? 'hi' : 'en';

  if (!district || !tehsil || district.length > 100 || tehsil.length > 100) {
    return Response.json({ villages: [] });
  }

  const official = getOfficialVillages(district, tehsil, locale);
  return Response.json(
    { villages: official },
    { headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800' } },
  );
}
