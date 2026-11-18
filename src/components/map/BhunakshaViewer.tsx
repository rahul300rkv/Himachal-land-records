'use client';

import 'leaflet/dist/leaflet.css';
import { LoaderCircle, MapPinned } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type Props = { gisCode: string; plot: string; attribution?: string };
type Extent = { xmin: number; ymin: number; xmax: number; ymax: number };
type SelectedPlot = { minx: number; miny: number; maxx: number; maxy: number; id: string; kide: string };

export function BhunakshaViewer({ gisCode, plot, attribution }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
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
        map = L.map(containerRef.current, { crs: L.CRS.Simple, minZoom: -2, maxZoom: 4, scrollWheelZoom: false, attributionControl: false });
        const bounds: [[number, number], [number, number]] = [[0, 0], [1000, 1000]];
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
        setState('ready');
      } catch { if (!cancelled) setState('error'); }
    })();
    return () => { cancelled = true; map?.remove(); };
  }, [gisCode, plot]);
  return <div className="overflow-hidden rounded-2xl border bg-muted shadow-inner">
    <div className="flex items-center justify-between gap-3 border-b bg-card px-4 py-3 text-sm"><span className="flex items-center gap-2 font-semibold"><MapPinned className="size-4 text-primary" /> {plot ? `Khasra ${plot}` : 'Village map'}</span><span className="text-xs text-muted-foreground">{attribution || 'Himachal BhuNaksha'}</span></div>
    <div ref={containerRef} role="region" aria-label="BhuNaksha village map" className="h-[26rem] w-full sm:h-[34rem]" />
    {state !== 'ready' && <div className="flex items-center justify-center gap-2 border-t bg-card px-4 py-3 text-sm text-muted-foreground">{state === 'loading' ? <><LoaderCircle className="size-4 animate-spin" /> Loading official map…</> : 'The official map could not be loaded. Use Open map report to continue.'}</div>}
  </div>;
}
