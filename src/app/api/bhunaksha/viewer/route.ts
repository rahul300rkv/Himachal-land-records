import { NextRequest, NextResponse } from 'next/server';
import https from 'node:https';
import { constants } from 'node:crypto';

const BASE = 'https://bhunakshahp.nic.in/bhunakshaserver';
const BROWSER_HEADERS = {
  Accept: 'application/json, text/plain, */*',
  Origin: 'https://bhunakshahp.nic.in',
  Referer: 'https://bhunakshahp.nic.in/home',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131 Safari/537.36',
};

function requestJson<T>(url: string, method: 'GET' | 'POST' = 'GET', body = '', contentType?: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const headers: Record<string, string> = { ...BROWSER_HEADERS };
    if (contentType) headers['Content-Type'] = contentType;
    if (body) headers['Content-Length'] = String(Buffer.byteLength(body));
    const request = https.request(url, {
      method,
      headers,
      timeout: 20_000,
      secureOptions: constants.SSL_OP_LEGACY_SERVER_CONNECT,
    }, (response) => {
      let text = '';
      response.setEncoding('utf8');
      response.on('data', (chunk) => { text += chunk; });
      response.on('end', () => {
        if (!response.statusCode || response.statusCode < 200 || response.statusCode >= 300) {
          reject(new Error(`HTTP_${response.statusCode ?? 0}`)); return;
        }
        try { resolve(JSON.parse(text) as T); } catch { reject(new Error('INVALID_JSON')); }
      });
    });
    request.on('timeout', () => request.destroy(new Error('TIMEOUT')));
    request.on('error', reject);
    request.end(body);
  });
}

export async function GET(request: NextRequest) {
  const gisCode = request.nextUrl.searchParams.get('gisCode')?.trim() ?? '';
  const plot = request.nextUrl.searchParams.get('plot')?.trim() ?? '';
  // BhuNaksha codes are district (2) + tehsil/sub-tehsil (2) + village (6).
  if (!/^\d{10}$/.test(gisCode)) return NextResponse.json({ error: 'Invalid BhuNaksha code' }, { status: 400 });
  try {
    const form = new URLSearchParams({ gisLevels: `${gisCode.slice(0, 2)},${gisCode.slice(2, 4)},${gisCode.slice(4, 10)}` });
    const plotBody = new URLSearchParams({ giscode: gisCode, plotno: plot }).toString();
    const [extentResult, plotsResult, attributionResult, plotResult] = await Promise.allSettled([
      requestJson<{ xmin: number; ymin: number; xmax: number; ymax: number; crs?: string }>(`${BASE}/MapInfo/getVVVVExtentGeoref`, 'POST', form.toString(), 'application/x-www-form-urlencoded;charset=UTF-8'),
      requestJson<unknown>(`${BASE}/masterdata/getPlotNosByBhucode?bhucode=${encodeURIComponent(gisCode)}`),
      requestJson<{ attribution?: string }>(`${BASE}/masterdata/getAttributionInfo?gisCode=${encodeURIComponent(gisCode)}`, 'POST', '{}', 'application/json'),
      plot
        ? requestJson<{ minx: number; miny: number; maxx: number; maxy: number; id: string; kide: string }>(`${BASE}/MapInfo/getPlotByPlotNo`, 'POST', plotBody, 'application/x-www-form-urlencoded;charset=UTF-8')
        : Promise.resolve(null),
    ]);
    if (extentResult.status === 'rejected') {
      const code = extentResult.reason instanceof Error ? extentResult.reason.message : 'UNKNOWN';
      return NextResponse.json({ error: 'BhuNaksha extent request failed', stage: 'extent_connection', code }, { status: 502 });
    }
    const extent = extentResult.value;
    const plots = plotsResult.status === 'fulfilled' ? plotsResult.value : [];
    const attribution = attributionResult.status === 'fulfilled' ? attributionResult.value : {};
    if (![extent.xmin, extent.ymin, extent.xmax, extent.ymax].every(Number.isFinite)) throw new Error('invalid_extent');
    const selectedPlot = plotResult.status === 'fulfilled' ? plotResult.value : null;
    return NextResponse.json({ extent, plots: Array.isArray(plots) ? plots : [], selectedPlot, attribution: attribution.attribution ?? '', gisCode });
  } catch {
    return NextResponse.json({ error: 'BhuNaksha viewer is temporarily unavailable' }, { status: 502 });
  }
}
