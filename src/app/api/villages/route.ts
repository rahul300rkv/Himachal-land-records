import { type NextRequest } from 'next/server';
import { getOfficialVillages, type VillageOption } from '@/lib/data/location-villages';
import { listVillages } from '@/lib/search';

/** Complete directory plus any extra village names already stored in the records database. */
export async function GET(request: NextRequest) {
  const district = request.nextUrl.searchParams.get('district')?.trim() ?? '';
  const tehsil = request.nextUrl.searchParams.get('tehsil')?.trim() ?? '';
  const locale = request.nextUrl.searchParams.get('locale') === 'hi' ? 'hi' : 'en';

  if (!district || !tehsil || district.length > 100 || tehsil.length > 100) {
    return Response.json({ villages: [] });
  }

  const official = getOfficialVillages(district, tehsil, locale);

  try {
    const stored = await listVillages(district, tehsil);
    const merged = new Map<string, VillageOption>(official.map((village) => [village.key, village]));
    const officialValues = new Set(official.map((village) => village.value));
    stored.forEach((value) => {
      if (!officialValues.has(value)) merged.set(`stored:${value}`, { key: `stored:${value}`, value, label: value });
    });
    const villages = [...merged.values()].sort((a, b) => a.label.localeCompare(b.label, locale === 'hi' ? 'hi' : 'en'));
    return Response.json(
      { villages },
      { headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800' } },
    );
  } catch (error) {
    console.error('Village lookup failed', error);
    return Response.json({ villages: official });
  }
}
