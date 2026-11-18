'use client';

import 'leaflet/dist/leaflet.css';
import { Layers, LoaderCircle, MapPinned } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type Props = { gisCode: string; plot: string; attribution?: string };
type Extent = { xmin: number; ymin: number; xmax: number; ymax: number };
type SelectedPlot = { minx: number; miny: number; maxx: number; maxy: number; id: string; kide: string };

// Convert UTM zone 43N (the CRS used by HP BhuNaksha) to WGS84 coordinates.
function utm43ToLatLng(easting: number, northing: number): [number, number] {
  const a = 6378137; const eccSquared = 0.00669438; const k0 = 0.9996;
  const x = easting - 500000; const y = northing;
  const eccPrimeSquared = eccSquared / (1 - eccSquared);
  const m = y / k0; const mu = m / (a * (1 - eccSquared / 4 - 3 * eccSquared ** 2 / 64 - 5 * eccSquared ** 3 / 256));
  const e1 = (1 - Math.sqrt(1 - eccSquared)) / (1 + Math.sqrt(1 - eccSquared));
  const phi1 = mu + (3 * e1 / 2 - 27 * e1 ** 3 / 32) * Math.sin(2 * mu) + (21 * e1 ** 2 / 16 - 55 * e1 ** 4 / 32) * Math.sin(4 * mu) + 151 * e1 ** 3 / 96 * Math.sin(6 * mu);
  const n1 = a / Math.sqrt(1 - eccSquared * Math.sin(phi1) ** 2); const t1 = Math.tan(phi1) ** 2; const c1 = eccPrimeSquared * Math.cos(phi1) ** 2;
  const r1 = a * (1 - eccSquared) / (1 - eccSquared * Math.sin(phi1) ** 2) ** 1.5; const d = x / (n1 * k0);
  const lat = phi1 - (n1 * Math.tan(phi1) / r1) * (d ** 2 / 2 - (5 + 3 * t1 + 10 * c1 - 4 * c1 ** 2 - 9 * eccPrimeSquared) * d ** 4 / 24 + (61 + 90 * t1 + 298 * c1 + 45 * t1 ** 2 - 252 * eccPrimeSquared - 3 * c1 ** 2) * d ** 6 / 720);
  const lon = (75 * Math.PI / 180) + (d - (1 + 2 * t1 + c1) * d ** 3 / 6 + (5 - 2 * c1 + 28 * t1 - 3 * c1 ** 2 + 8 * eccPrimeSquared + 24 * t1 ** 2) * d ** 5 / 120) / Math.cos(phi1);
  return [lat * 180 / Math.PI, lon * 180 / Math.PI];
}

export function BhunakshaViewer({ gisCode, plot, attribution }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [satellite, setSatellite] = useState(false);
  const [coordinates, setCoordinates] = useState('');
  useEffect(() => {
    let cancelled = false;
    let map: import('leaflet').Map | undefined;
    (async () => {
      try {
        const response = await fetch(`/api/bhunaksha/viewer?gisCode=${encodeURIComponent(gisCode)}&plot=${encodeURIComponent(plot)}`);
        if (!response.ok) throw new Error('viewer');
        const data = await response.json() as { extent: Extent; selectedPlot?: SelectedPlot | null; attribution?: string };
        const mod = await import('leaflet');
        const L = ('default' in mod ? mod.default : mod) as typeof import('leaflet');
        if (cancelled || !containerRef.current) return;
        let { xmin, ymin, xmax, ymax } = data.extent;
        if (data.selectedPlot) {
          const plotWidth = Math.max(1, data.selectedPlot.maxx - data.selectedPlot.minx);
          const plotHeight = Math.max(1, data.selectedPlot.maxy - data.selectedPlot.miny);
          const viewWidth = Math.max(620, plotWidth * 40);
          const viewHeight = Math.max(485, plotHeight * 28);
          const centerX = (data.selectedPlot.minx + data.selectedPlot.maxx) / 2;
          const centerY = (data.selectedPlot.miny + data.selectedPlot.maxy) / 2;
          xmin = centerX - viewWidth / 2; xmax = centerX + viewWidth / 2;
          ymin = centerY - viewHeight / 2; ymax = centerY + viewHeight / 2;
        }
        map = L.map(containerRef.current, { scrollWheelZoom: false, attributionControl: false });
        const southWest = utm43ToLatLng(xmin, ymin); const northEast = utm43ToLatLng(xmax, ymax);
        const bounds: [[number, number], [number, number]] = [southWest, northEast];
        if (satellite) L.tileLayer('https://bhuvan-ras2.nrsc.gov.in/tilecache/tilecache.py/1.0.0/bhuvan_imagery2/{z}/{x}/{y}.jpg', { maxZoom: 22 }).addTo(map);
        const common = `REQUEST=GetMap&SERVICE=WMS&VERSION=1.3.0&FORMAT=image%2Fpng&TRANSPARENT=TRUE&CRS=EPSG%3A32643&FORMAT_OPTIONS=dpi%3A99&WIDTH=1233&HEIGHT=964&BBOX=${encodeURIComponent(`${xmin},${ymin},${xmax},${ymax}`)}`;
        const base = `https://bhunakshahp.nic.in/bhunakshaserver/WMS?${common}&STYLES=VILLAGE_MAP&LAYERS=VILLAGE_MAP&transparent=true&state=&gis_code=${encodeURIComponent(gisCode)}&overlay_codes=`;
        L.imageOverlay(base, bounds, { opacity: 0.95 }).addTo(map);
        if (data.selectedPlot) {
          const owners = `https://bhunakshahp.nic.in/bhunakshaserver/WMS?${common}&STYLES=OWNER_PLOTS&LAYERS=SAME_OWNER_PLOT_LIST&state=&giscode=${encodeURIComponent(gisCode)}&plot_no=${encodeURIComponent(plot)}`;
          const selected = `https://bhunakshahp.nic.in/bhunakshaserver/WMS?${common}&STYLES=PLOT_SELECTION&LAYERS=PLOT_LIST&transparent=true&state=&gis_code=${encodeURIComponent(gisCode)}&overlay_codes=&plot_id=${encodeURIComponent(data.selectedPlot.id)}`;
          L.imageOverlay(owners, bounds, { opacity: 0.8 }).addTo(map);
          L.imageOverlay(selected, bounds, { opacity: 1 }).addTo(map);
        }
        map.fitBounds(bounds);
        map.on('mousemove', (event) => setCoordinates(`${event.latlng.lat.toFixed(6)}, ${event.latlng.lng.toFixed(6)}`));
        map.on('mouseout', () => setCoordinates(''));
        setState('ready');
      } catch { if (!cancelled) setState('error'); }
    })();
    return () => { cancelled = true; map?.remove(); };
  }, [gisCode, plot, satellite]);
  return <div className="overflow-hidden rounded-2xl border bg-white shadow-inner">
    <div className="flex flex-wrap items-center justify-between gap-3 border-b bg-white px-4 py-3 text-sm"><span className="flex items-center gap-2 font-semibold"><MapPinned className="size-4 text-primary" /> {plot ? `Khasra ${plot}` : 'Village map'}</span><div className="flex items-center gap-3"><span className="font-mono text-xs text-muted-foreground">{coordinates || attribution || 'Himachal BhuNaksha'}</span><button type="button" onClick={() => setSatellite((value) => !value)} className="inline-flex min-h-10 items-center gap-2 rounded-full border bg-white px-3 font-semibold hover:bg-muted" aria-pressed={satellite}><Layers className="size-4" /> {satellite ? 'Map only' : 'Satellite'}</button></div></div>
    <div ref={containerRef} role="region" aria-label="BhuNaksha village map" className="h-[26rem] w-full bg-white sm:h-[34rem]" />
    {state !== 'ready' && <div className="flex items-center justify-center gap-2 border-t bg-card px-4 py-3 text-sm text-muted-foreground">{state === 'loading' ? <><LoaderCircle className="size-4 animate-spin" /> Loading official map…</> : 'The official map could not be loaded. Use Open map report to continue.'}</div>}
  </div>;
}
