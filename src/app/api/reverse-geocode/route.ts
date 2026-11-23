import { NextRequest, NextResponse } from 'next/server';
import { inHimachal } from '@/lib/geo';
import { NOMINATIM_CACHE, nominatim } from '@/lib/nominatim';

/**
 * "What is near this pin?" for the listing map (OpenStreetMap Nominatim, reverse lookup).
 * Coordinates are rounded to about 10 metres so repeated lookups share one cached answer.
 */
type NominatimAddress = Partial<
  Record<'hamlet' | 'village' | 'suburb' | 'neighbourhood' | 'town' | 'city' | 'county' | 'state_district' | 'state', string>
>;
type NominatimReverse = { display_name?: string; address?: NominatimAddress; error?: string };

export async function GET(request: NextRequest) {
  const lat = Number(request.nextUrl.searchParams.get('lat'));
  const lng = Number(request.nextUrl.searchParams.get('lng'));
  const lang = request.nextUrl.searchParams.get('lang') === 'hi' ? 'hi' : 'en';
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || !inHimachal({ lat, lng })) {
    return NextResponse.json({ error: 'invalid_point' }, { status: 400 });
  }

  try {
    const data = await nominatim<NominatimReverse>('reverse', {
      lat: lat.toFixed(4),
      lon: lng.toFixed(4),
      format: 'jsonv2',
      zoom: '16',
      addressdetails: '1',
      'accept-language': lang,
    });
    const a = data.address ?? {};
    // A short "village, district" line instead of Nominatim's very long display name.
    const parts = [
      a.hamlet ?? a.village ?? a.suburb ?? a.neighbourhood ?? a.town ?? a.city,
      a.county ?? a.state_district,
    ].filter((part, index, all): part is string => Boolean(part) && all.indexOf(part) === index);
    const label = parts.join(', ') || data.display_name?.split(',').slice(0, 2).join(',').trim() || '';
    return NextResponse.json({ label }, { headers: { 'Cache-Control': NOMINATIM_CACHE } });
  } catch (error) {
    console.error('Reverse lookup failed', error);
    return NextResponse.json({ error: 'lookup_failed' }, { status: 502 });
  }
}
