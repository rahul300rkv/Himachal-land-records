import { NextRequest, NextResponse } from 'next/server';
import { HP_VIEWBOX } from '@/lib/geo';
import { NOMINATIM_CACHE, nominatim } from '@/lib/nominatim';

/**
 * Place search for the listing map (OpenStreetMap Nominatim). The form searches only when the
 * seller presses Enter or the button, never while typing. See lib/nominatim.ts for the rules.
 */
type NominatimPlace = { place_id: number; lat: string; lon: string; display_name: string };

export async function GET(request: NextRequest) {
  const q = (request.nextUrl.searchParams.get('q') ?? '').trim().slice(0, 120);
  const lang = request.nextUrl.searchParams.get('lang') === 'hi' ? 'hi' : 'en';
  if (q.length < 3) return NextResponse.json({ results: [] });

  try {
    const places = await nominatim<NominatimPlace[]>('search', {
      q,
      format: 'jsonv2',
      limit: '6',
      countrycodes: 'in',
      // left, top, right, bottom. Results are kept inside Himachal Pradesh.
      viewbox: `${HP_VIEWBOX.west},${HP_VIEWBOX.north},${HP_VIEWBOX.east},${HP_VIEWBOX.south}`,
      bounded: '1',
      'accept-language': lang,
    });
    const results = places
      .map((place) => ({
        id: place.place_id,
        label: place.display_name,
        lat: Number(place.lat),
        lng: Number(place.lon),
      }))
      .filter((place) => Number.isFinite(place.lat) && Number.isFinite(place.lng));
    return NextResponse.json({ results }, { headers: { 'Cache-Control': NOMINATIM_CACHE } });
  } catch (error) {
    console.error('Place search failed', error);
    return NextResponse.json({ error: 'search_failed' }, { status: 502 });
  }
}
