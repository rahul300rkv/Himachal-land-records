'use client';

import 'leaflet/dist/leaflet.css';
import { Layers, LoaderCircle, Maximize2, Minimize2, MapPinned } from 'lucide-react';
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

function latLngToUtm43(lat: number, lon: number): [number, number] {
  const a = 6378137; const eccSquared = 0.00669438; const k0 = 0.9996;
  const latRad = lat * Math.PI / 180; const lonRad = lon * Math.PI / 180; const lonOrigin = 75 * Math.PI / 180;
  const eccPrimeSquared = eccSquared / (1 - eccSquared); const n = a / Math.sqrt(1 - eccSquared * Math.sin(latRad) ** 2);
  const t = Math.tan(latRad) ** 2; const c = eccPrimeSquared * Math.cos(latRad) ** 2; const A = Math.cos(latRad) * (lonRad - lonOrigin);
  const m = a * ((1 - eccSquared / 4 - 3 * eccSquared ** 2 / 64 - 5 * eccSquared ** 3 / 256) * latRad - (3 * eccSquared / 8 + 3 * eccSquared ** 2 / 32 + 45 * eccSquared ** 3 / 1024) * Math.sin(2 * latRad) + (15 * eccSquared ** 2 / 256 + 45 * eccSquared ** 3 / 1024) * Math.sin(4 * latRad) - 35 * eccSquared ** 3 / 3072 * Math.sin(6 * latRad));
  const easting = k0 * n * (A + (1 - t + c) * A ** 3 / 6 + (5 - 18 * t + t ** 2 + 72 * c - 58 * eccPrimeSquared) * A ** 5 / 120) + 500000;
  const northing = k0 * (m + n * Math.tan(latRad) * (A ** 2 / 2 + (5 - t + 9 * c + 4 * c ** 2) * A ** 4 / 24 + (61 - 58 * t + t ** 2 + 600 * c - 330 * eccPrimeSquared) * A ** 6 / 720));
  return [easting, northing];
}
type WebkitFullscreenElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void;
};

type WebkitFullscreenDocument = Document & {
  webkitExitFullscreen?: () => Promise<void> | void;
  webkitFullscreenElement?: Element | null;
};
export function BhunakshaViewer({ gisCode, plot, attribution }: Props) {
  const containerRef  = useRef<HTMLDivElement>(null);
  const wrapperRef    = useRef<HTMLDivElement>(null);  // ← fullscreen target
  const mapRef        = useRef<import('leaflet').Map | null>(null);
  const viewRef       = useRef<{ center: [number, number]; zoom: number } | null>(null);

  const [state,       setState]       = useState<'loading' | 'ready' | 'error'>('loading');
  const [satellite,   setSatellite]   = useState(false);
  const [coordinates, setCoordinates] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  /* ── fullscreen helpers ──────────────────────────────────────────── */
function enterFullscreen() {
  const el = wrapperRef.current as WebkitFullscreenElement | null;
  if (!el) return;
  if (el.requestFullscreen) {
    void el.requestFullscreen();
  } else if (el.webkitRequestFullscreen) {
    void el.webkitRequestFullscreen();
  }
}

function exitFullscreen() {
  const doc = document as WebkitFullscreenDocument;
  if (doc.exitFullscreen) {
    void doc.exitFullscreen();
  } else if (doc.webkitExitFullscreen) {
    void doc.webkitExitFullscreen();
  }
}

function toggleFullscreen() {
  if (isFullscreen) {
    exitFullscreen();
  } else {
    enterFullscreen();
  }
}

/* ── sync React state with native fullscreen changes (Esc key etc.) */
useEffect(() => {
  function onFsChange() {
    const doc = document as WebkitFullscreenDocument;
    const fsEl = doc.fullscreenElement ?? doc.webkitFullscreenElement;
    setIsFullscreen(fsEl === wrapperRef.current);
  }
  document.addEventListener('fullscreenchange', onFsChange);
  document.addEventListener('webkitfullscreenchange', onFsChange);
  return () => {
    document.removeEventListener('fullscreenchange', onFsChange);
    document.removeEventListener('webkitfullscreenchange', onFsChange);
  };
}, []);

/* ── keyboard shortcut: F to toggle fullscreen ───────────────────── */
useEffect(() => {
  function onKeyDown(e: KeyboardEvent) {
    if (e.key !== 'f' && e.key !== 'F') return;
    const tag = (document.activeElement?.tagName ?? '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
    if (!wrapperRef.current) return;
    e.preventDefault();
    if (isFullscreen) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  }
  document.addEventListener('keydown', onKeyDown);
  return () => document.removeEventListener('keydown', onKeyDown);
}, [isFullscreen]);
 /* ── keep Leaflet sized & tiles drawn across fullscreen / resize ─── */
useEffect(() => {
  const el = containerRef.current;
  if (!el) return;

  const refreshMap = () => {
    const map = mapRef.current;
    if (!map || el.clientWidth === 0 || el.clientHeight === 0) return;
    map.invalidateSize({ animate: false });
    map.eachLayer((layer) => {
      const candidate = layer as { redraw?: () => void };
      if (typeof candidate.redraw === 'function') {
        candidate.redraw();
      }
    });
  };

  const observer = new ResizeObserver(() => {
    window.requestAnimationFrame(refreshMap);
  });
  observer.observe(el);

  const timer = window.setTimeout(refreshMap, 150);
  return () => {
    observer.disconnect();
    window.clearTimeout(timer);
  };
}, [isFullscreen]);

  /* ── map initialisation (unchanged logic) ────────────────────────── */
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
          const plotWidth  = Math.max(1, data.selectedPlot.maxx - data.selectedPlot.minx);
          const plotHeight = Math.max(1, data.selectedPlot.maxy - data.selectedPlot.miny);
          const viewWidth  = Math.max(620, plotWidth  * 40);
          const viewHeight = Math.max(485, plotHeight * 28);
          const centerX = (data.selectedPlot.minx + data.selectedPlot.maxx) / 2;
          const centerY = (data.selectedPlot.miny + data.selectedPlot.maxy) / 2;
          xmin = centerX - viewWidth  / 2; xmax = centerX + viewWidth  / 2;
          ymin = centerY - viewHeight / 2; ymax = centerY + viewHeight / 2;
        }
        map = L.map(containerRef.current, { scrollWheelZoom: false, attributionControl: false });
        mapRef.current = map;
        const southWest = utm43ToLatLng(xmin, ymin);
        const northEast = utm43ToLatLng(xmax, ymax);
        const bounds: [[number, number], [number, number]] = [southWest, northEast];
       if (satellite) {
  const activeMap = map;
  let errorCount = 0;
  let switchedToFallback = false;

  const primaryLayer = L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    {
      maxNativeZoom: 18,
      maxZoom: 21,
      attribution: 'Tiles &copy; Esri',
    },
  ).addTo(activeMap);

  primaryLayer.on('tileerror', () => {
    if (switchedToFallback) return;
    errorCount += 1;

    if (errorCount >= 3) {
      switchedToFallback = true;
      if (activeMap.hasLayer(primaryLayer)) {
        activeMap.removeLayer(primaryLayer);
      }
      L.tileLayer(
        'https://bhuvan-ras2.nrsc.gov.in/tilecache/tilecache.py/1.0.0/bhuvan_imagery2/{z}/{x}/{y}.jpg',
        {
          maxZoom: 22,
          attribution: 'Satellite &copy; NRSC / Bhuvan',
        },
      ).addTo(activeMap);
    }
  });
}
        const createWmsGrid = (style: string, layerName: string, extra: Record<string, string>, opacity: number) => {
          const Grid = L.GridLayer.extend({
            createTile(this: L.GridLayer & { _map: import('leaflet').Map }, coords: { x: number; y: number; z: number }, done: (error?: Error | null, tile?: HTMLElement) => void) {
              const size = 282;
              const nw = this._map.unproject(L.point(coords.x * size, coords.y * size), coords.z);
              const se = this._map.unproject(L.point((coords.x + 1) * size, (coords.y + 1) * size), coords.z);
              const [minx, maxy] = latLngToUtm43(nw.lat, nw.lng);
              const [maxx, miny] = latLngToUtm43(se.lat, se.lng);
              const params = new URLSearchParams({ REQUEST: 'GetMap', SERVICE: 'WMS', VERSION: '1.3.0', FORMAT: 'image/png', STYLES: style, TRANSPARENT: 'TRUE', LAYERS: layerName, CRS: 'EPSG:32643', FORMAT_OPTIONS: 'dpi:99', WIDTH: String(size), HEIGHT: String(size), BBOX: `${minx},${miny},${maxx},${maxy}`, ...extra });
              const tile = document.createElement('img');
              tile.alt = ''; tile.width = size; tile.height = size;
              tile.onload  = () => done(null, tile);
              tile.onerror = () => done(new Error('WMS tile failed'), tile);
              tile.src = `https://bhunakshahp.nic.in/bhunakshaserver/WMS/tile?${params}`;
              return tile;
            },
          });
          const GridConstructor = Grid as unknown as new (options: L.GridLayerOptions) => L.GridLayer;
          return new GridConstructor({ tileSize: 282, opacity, updateWhenZooming: false, keepBuffer: 2 });
        };
        createWmsGrid('VILLAGE_MAP', 'VILLAGE_MAP', { transparent: 'true', state: '', gis_code: gisCode, overlay_codes: '' }, 0.95).addTo(map);
        if (data.selectedPlot) {
          createWmsGrid('OWNER_PLOTS',    'SAME_OWNER_PLOT_LIST', { state: '', giscode: gisCode, plot_no: plot }, 0.8).addTo(map);
          createWmsGrid('PLOT_SELECTION', 'PLOT_LIST',            { transparent: 'true', state: '', gis_code: gisCode, overlay_codes: '', plot_id: data.selectedPlot.id }, 1).addTo(map);
        }
        if (viewRef.current) {
          map.setView(viewRef.current.center, viewRef.current.zoom, { animate: false });
        } else if (data.selectedPlot) {
          const center = utm43ToLatLng(
            (data.selectedPlot.minx + data.selectedPlot.maxx) / 2,
            (data.selectedPlot.miny + data.selectedPlot.maxy) / 2,
          );
          map.setView(center, 17, { animate: false });
        } else {
          map.fitBounds(bounds, { padding: [24, 24], maxZoom: 15 });
        }
        map.on('moveend', () => {
          if (!map || !containerRef.current) return;
if (containerRef.current.clientHeight === 0) return;
          const center = map.getCenter();
          viewRef.current = { center: [center.lat, center.lng], zoom: map.getZoom() };
        });
        map.on('mousemove', (event) => setCoordinates(`${event.latlng.lat.toFixed(6)}, ${event.latlng.lng.toFixed(6)}`));
        map.on('mouseout',  () => setCoordinates(''));
        setState('ready');
      } catch {
        if (!cancelled) setState('error');
      }
    })();
    return () => { cancelled = true; map?.remove(); mapRef.current = null; };
  }, [gisCode, plot, satellite]);

  /* ── render ───────────────────────────────────────────────────────── */
  return (
    /*
     * wrapperRef is the fullscreen target.
     * When the browser goes fullscreen it stretches this element to cover
     * the whole screen, so we need bg-white + flex-col so the toolbar and
     * map fill the space correctly.
     */
    <div
      ref={wrapperRef}
      className="overflow-hidden rounded-2xl border bg-white shadow-inner"
      style={isFullscreen ? { display: 'flex', flexDirection: 'column', borderRadius: 0, border: 'none' } : undefined}
    >
      {/* ── toolbar ─────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b bg-white px-4 py-3 text-sm">

        {/* left: pin + label */}
        <span className="flex items-center gap-2 font-semibold">
          <MapPinned className="size-4 text-primary" />
          {plot ? `Khasra ${plot}` : 'Village map'}
        </span>

        {/* right: coords / attribution · satellite · fullscreen */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-muted-foreground">
            {coordinates || attribution || 'Himachal BhuNaksha'}
          </span>

          {/* satellite toggle */}
          <button
            type="button"
            onClick={() => setSatellite((v) => !v)}
            aria-pressed={satellite}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-full border bg-white px-3 text-sm font-semibold hover:bg-muted transition-colors"
          >
            <Layers className="size-4" aria-hidden="true" />
            {satellite ? 'Map only' : 'Satellite'}
          </button>

          {/* fullscreen toggle */}
          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? 'Exit full screen' : 'View full screen'}
            title={isFullscreen ? 'Exit full screen (F)' : 'Full screen (F)'}
            className="inline-flex min-h-9 w-9 items-center justify-center rounded-full border bg-white hover:bg-muted transition-colors"
          >
            {isFullscreen
              ? <Minimize2 className="size-4" aria-hidden="true" />
              : <Maximize2 className="size-4" aria-hidden="true" />
            }
          </button>
        </div>
      </div>

      {/* ── map canvas ──────────────────────────────────────────────── */}
      <div
  ref={containerRef}
  role="region"
  aria-label="BhuNaksha village map"
  className={
    isFullscreen
      ? 'w-full flex-1 min-h-0 bg-white'
      : 'h-[420px] w-full bg-white sm:h-[480px]'
  }
/>

      {/* ── status bar ──────────────────────────────────────────────── */}
      {state !== 'ready' && (
        <div className="flex items-center justify-center gap-2 border-t bg-card px-4 py-3 text-sm text-muted-foreground">
          {state === 'loading'
            ? <><LoaderCircle className="size-4 animate-spin" /> Loading official map…</>
            : 'The official map could not be loaded. Use Open map report to continue.'
          }
        </div>
      )}
    </div>
  );
}