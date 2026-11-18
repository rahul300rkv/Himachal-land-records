'use client';

import 'leaflet/dist/leaflet.css';
import { LoaderCircle, MapPinned } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type Props = { gisCode: string; plot: string; attribution?: string };
type Extent = { xmin: number; ymin: number; xmax: number; ymax: number };

export function BhunakshaViewer({ gisCode, plot, attribution }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  useEffect(() => {
    let cancelled = false;
    let map: import('leaflet').Map | undefined;
    (async () => {
      try {
        const response = await fetch(`/api/bhunaksha/viewer?gisCode=${encodeURIComponent(gisCode)}`);
        if (!response.ok) throw new Error('viewer');
        const data = await response.json() as { extent: Extent; attribution?: string };
        const mod = await import('leaflet');
        const L = ('default' in mod ? mod.default : mod) as typeof import('leaflet');
        if (cancelled || !containerRef.current) return;
        const { xmin, ymin, xmax, ymax } = data.extent;
        const width = xmax - xmin;
        const height = ymax - ymin;
        map = L.map(containerRef.current, { crs: L.CRS.Simple, minZoom: -2, maxZoom: 4, scrollWheelZoom: false, attributionControl: false });
        const bounds: [[number, number], [number, number]] = [[0, 0], [1000, 1000]];
        const wms = `https://bhunakshahp.nic.in/bhunakshaserver/WMS/tile?REQUEST=GetMap&SERVICE=WMS&VERSION=1.3.0&FORMAT=image/png&STYLES=VILLAGE_MAP&TRANSPARENT=TRUE&LAYERS=VILLAGE_MAP&CRS=EPSG:32643&FORMAT_OPTIONS=dpi:99&WIDTH=1000&HEIGHT=1000&gis_code=${encodeURIComponent(gisCode)}&BBOX=${xmin},${ymin},${xmax},${ymax}`;
        L.imageOverlay(wms, bounds, { opacity: 0.95 }).addTo(map);
        map.fitBounds(bounds);
        setState('ready');
      } catch { if (!cancelled) setState('error'); }
    })();
    return () => { cancelled = true; map?.remove(); };
  }, [gisCode]);
  return <div className="overflow-hidden rounded-2xl border bg-muted shadow-inner">
    <div className="flex items-center justify-between gap-3 border-b bg-card px-4 py-3 text-sm"><span className="flex items-center gap-2 font-semibold"><MapPinned className="size-4 text-primary" /> {plot ? `Khasra ${plot}` : 'Village map'}</span><span className="text-xs text-muted-foreground">{attribution || 'Himachal BhuNaksha'}</span></div>
    <div ref={containerRef} role="region" aria-label="BhuNaksha village map" className="h-[26rem] w-full sm:h-[34rem]" />
    {state !== 'ready' && <div className="flex items-center justify-center gap-2 border-t bg-card px-4 py-3 text-sm text-muted-foreground">{state === 'loading' ? <><LoaderCircle className="size-4 animate-spin" /> Loading official map…</> : 'The official map could not be loaded. Use Open map report to continue.'}</div>}
  </div>;
}
