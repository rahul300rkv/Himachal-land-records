import { NextRequest, NextResponse } from 'next/server';

const BASE = 'https://bhunakshahp.nic.in/bhunakshaserver';

export async function GET(request: NextRequest) {
  const gisCode = request.nextUrl.searchParams.get('gisCode')?.trim() ?? '';
  if (!/^\d{8}$/.test(gisCode)) return NextResponse.json({ error: 'Invalid BhuNaksha code' }, { status: 400 });
  try {
    const form = new URLSearchParams({ gisLevels: `${gisCode.slice(0, 2)},${gisCode.slice(2, 4)},${gisCode.slice(4)}` });
    const [extentResponse, plotsResponse, attributionResponse] = await Promise.all([
      fetch(`${BASE}/MapInfo/getVVVVExtentGeoref`, { method: 'POST', body: form, cache: 'no-store' }),
      fetch(`${BASE}/masterdata/getPlotNosByBhucode?bhucode=${gisCode}`, { cache: 'no-store' }),
      fetch(`${BASE}/masterdata/getAttributionInfo?gisCode=${gisCode}`, { method: 'POST', cache: 'no-store' }),
    ]);
    if (!extentResponse.ok) throw new Error('extent_failed');
    const extent = await extentResponse.json() as { xmin: number; ymin: number; xmax: number; ymax: number; crs?: string };
    const plots = plotsResponse.ok ? await plotsResponse.json() : [];
    const attribution = attributionResponse.ok ? await attributionResponse.json() : {};
    if (![extent.xmin, extent.ymin, extent.xmax, extent.ymax].every(Number.isFinite)) throw new Error('invalid_extent');
    return NextResponse.json({ extent, plots: Array.isArray(plots) ? plots : [], attribution: attribution.attribution ?? '', gisCode });
  } catch {
    return NextResponse.json({ error: 'BhuNaksha viewer is temporarily unavailable' }, { status: 502 });
  }
}
