import { type NextRequest } from 'next/server';
import { listVillages } from '@/lib/search';

/** GET /api/villages?district=Shimla&tehsil=Theog -> { villages: string[] } */
export async function GET(request: NextRequest) {
  const district = request.nextUrl.searchParams.get('district')?.trim() ?? '';
  const tehsil = request.nextUrl.searchParams.get('tehsil')?.trim() ?? '';

  if (!district || !tehsil || district.length > 100 || tehsil.length > 100) {
    return Response.json({ villages: [] });
  }

  try {
    const villages = await listVillages(district, tehsil);
    return Response.json(
      { villages },
      { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } },
    );
  } catch (error) {
    console.error('Village lookup failed', error);
    // Suggestions are optional: fail soft so the form keeps working.
    return Response.json({ villages: [] });
  }
}
