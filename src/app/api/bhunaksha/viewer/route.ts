import { NextRequest, NextResponse } from 'next/server';

const BASE = 'https://bhunakshahp.nic.in/bhunakshaserver';
const BROWSER_HEADERS = {
  Accept: 'application/json, text/plain, */*',
  Origin: 'https://bhunakshahp.nic.in',
  Referer: 'https://bhunakshahp.nic.in/home',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131 Safari/537.36',
};

export async function GET(request: NextRequest) {
  const gisCode = request.nextUrl.searchParams.get('gisCode')?.trim() ?? '';
  // BhuNaksha codes are district (2) + tehsil/sub-tehsil (2) + village (6).
  if (!/^\d{10}$/.test(gisCode)) return NextResponse.json({ error: 'Invalid BhuNaksha code' }, { status: 400 });
  try {
    const form = new URLSearchParams({ gisLevels: `${gisCode.slice(0, 2)},${gisCode.slice(2, 4)},${gisCode.slice(4, 10)}` });
    const [extentResult, plotsResult, attributionResult] = await Promise.allSettled([
      fetch(`${BASE}/MapInfo/getVVVVExtentGeoref`, { method: 'POST', headers: { ...BROWSER_HEADERS, 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }, body: form.toString(), cache: 'no-store', signal: AbortSignal.timeout(20_000) }),
      fetch(`${BASE}/masterdata/getPlotNosByBhucode?bhucode=${encodeURIComponent(gisCode)}`, { headers: BROWSER_HEADERS, cache: 'no-store', signal: AbortSignal.timeout(20_000) }),
      fetch(`${BASE}/masterdata/getAttributionInfo?gisCode=${encodeURIComponent(gisCode)}`, { method: 'POST', headers: { ...BROWSER_HEADERS, 'Content-Type': 'application/json' }, body: '{}', cache: 'no-store', signal: AbortSignal.timeout(20_000) }),
    ]);
    if (extentResult.status === 'rejected') {
      return NextResponse.json({ error: 'BhuNaksha extent request failed', stage: 'extent_connection' }, { status: 502 });
    }
    if (!extentResult.value.ok) {
      return NextResponse.json({ error: 'BhuNaksha extent request failed', stage: 'extent_http', upstreamStatus: extentResult.value.status }, { status: 502 });
    }
    const extentResponse = extentResult.value;
    const plotsResponse = plotsResult.status === 'fulfilled' ? plotsResult.value : null;
    const attributionResponse = attributionResult.status === 'fulfilled' ? attributionResult.value : null;
    const extent = await extentResponse.json() as { xmin: number; ymin: number; xmax: number; ymax: number; crs?: string };
    const plots = plotsResponse?.ok ? await plotsResponse.json() : [];
    const attribution = attributionResponse?.ok ? await attributionResponse.json() : {};
    if (![extent.xmin, extent.ymin, extent.xmax, extent.ymax].every(Number.isFinite)) throw new Error('invalid_extent');
    return NextResponse.json({ extent, plots: Array.isArray(plots) ? plots : [], attribution: attribution.attribution ?? '', gisCode });
  } catch {
    return NextResponse.json({ error: 'BhuNaksha viewer is temporarily unavailable' }, { status: 502 });
  }
}
