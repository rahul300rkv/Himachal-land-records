'use client';

import 'leaflet/dist/leaflet.css';
import { Layers, LoaderCircle, Maximize2, Minimize2, MapPinned } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

export type ViewerState = 'loading' | 'ready' | 'error' | 'plot-found' | 'plot-unavailable';
type Props = {
  gisCode: string;
  plot: string;
  attribution?: string;
  onStateChange?: (state: ViewerState) => void;
};
type Extent = { xmin: number; ymin: number; xmax: number; ymax: number };
type SelectedPlot = { minx: number; miny: number; maxx: number; maxy: number; id: string; kide: string };
type WebkitEl  = HTMLElement & { webkitRequestFullscreen?: () => Promise<void> | void };
type WebkitDoc = Document   & { webkitExitFullscreen?: () => void; webkitFullscreenElement?: Element | null };

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

export function BhunakshaViewer({ gisCode, plot, attribution, onStateChange }: Props) {
  const t = useTranslations('MapExplorer');
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef   = useRef<HTMLDivElement>(null);
  const toolbarRef   = useRef<HTMLDivElement>(null);
  const statusRef    = useRef<HTMLDivElement>(null);

  // keep live Leaflet objects in refs — never in state
  const mapRef        = useRef<import('leaflet').Map | null>(null);
  const satLayerRef   = useRef<import('leaflet').Layer | null>(null);
  const viewRef       = useRef<{ center: [number, number]; zoom: number } | null>(null);
  const LRef          = useRef<typeof import('leaflet') | null>(null);

  const [state,        setState]        = useState<'loading' | 'ready' | 'error'>('loading');
  const [satellite,    setSatellite]    = useState(false);
  const [coordinates,  setCoordinates]  = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  /* ─── canvas sizing (never touches height via className) ─────────── */
  function setCanvasHeight() {
    const wrapper   = wrapperRef.current;
    const container = containerRef.current;
    const toolbar   = toolbarRef.current;
    const status    = statusRef.current;
    if (!wrapper || !container) return;

    const isFs = !!(document.fullscreenElement ?? (document as WebkitDoc).webkitFullscreenElement);
    let height: number;
    if (isFs) {
      const toolbarH = toolbar?.offsetHeight ?? 48;
      const statusH  = status?.offsetHeight  ?? 0;
      height = window.innerHeight - toolbarH - statusH;
    } else {
      height = window.innerWidth >= 640
        ? 480
        : Math.min(560, Math.max(360, Math.round(window.innerHeight * 0.55)));
    }
    container.style.height = `${height}px`;

    window.requestAnimationFrame(() => {
      mapRef.current?.invalidateSize({ animate: false });
    });
  }

  /* ─── fullscreen API ─────────────────────────────────────────────── */
  function enterFullscreen() {
    const el = wrapperRef.current as WebkitEl | null;
    if (!el) return;
    if (el.requestFullscreen)            void el.requestFullscreen();
    else if (el.webkitRequestFullscreen) void el.webkitRequestFullscreen();
  }
  function exitFullscreen() {
    const doc = document as WebkitDoc;
    if (doc.exitFullscreen)              void doc.exitFullscreen();
    else if (doc.webkitExitFullscreen)   doc.webkitExitFullscreen();
  }
  function toggleFullscreen() { isFullscreen ? exitFullscreen() : enterFullscreen(); }

  useEffect(() => {
    function onFsChange() {
      const doc  = document as WebkitDoc;
      const fsEl = doc.fullscreenElement ?? doc.webkitFullscreenElement;
      setIsFullscreen(fsEl === wrapperRef.current);
      window.requestAnimationFrame(() => window.requestAnimationFrame(setCanvasHeight));
    }
    document.addEventListener('fullscreenchange', onFsChange);
    document.addEventListener('webkitfullscreenchange', onFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', onFsChange);
      document.removeEventListener('webkitfullscreenchange', onFsChange);
    };
  }, []);

  /* ─── keyboard shortcut F ────────────────────────────────────────── */
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== 'f' && e.key !== 'F') return;
      const tag = (document.activeElement?.tagName ?? '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
      e.preventDefault();
      isFullscreen ? exitFullscreen() : enterFullscreen();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isFullscreen]);

  /* ─── ResizeObserver keeps canvas sized correctly ────────────────── */
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const ro = new ResizeObserver(() => window.requestAnimationFrame(setCanvasHeight));
    ro.observe(wrapper);
    setCanvasHeight();
    return () => ro.disconnect();
  }, []);

  /* ─── satellite toggle: imperatively add/remove layer, NO map rebuild */
  useEffect(() => {
    const map = mapRef.current;
    const L   = LRef.current;
    if (!map || !L) return;

    if (satellite) {
      if (satLayerRef.current && map.hasLayer(satLayerRef.current)) {
        map.removeLayer(satLayerRef.current);
        satLayerRef.current = null;
      }
      let errorCount = 0;
      let switchedToFallback = false;
      const primary = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        { maxNativeZoom: 18, maxZoom: 21, zIndex: 1 },
      );
      primary.on('tileerror', () => {
        if (switchedToFallback) return;
        errorCount += 1;
        if (errorCount >= 3) {
          switchedToFallback = true;
          if (map.hasLayer(primary)) map.removeLayer(primary);
          const fallback = L.tileLayer(
            'https://bhuvan-ras2.nrsc.gov.in/tilecache/tilecache.py/1.0.0/bhuvan_imagery2/{z}/{x}/{y}.jpg',
            { maxZoom: 22, zIndex: 1 },
          );
          fallback.addTo(map);
          satLayerRef.current = fallback;
        }
      });
      primary.addTo(map);
      satLayerRef.current = primary;
    } else {
      if (satLayerRef.current && map.hasLayer(satLayerRef.current)) {
        map.removeLayer(satLayerRef.current);
        satLayerRef.current = null;
      }
    }
  }, [satellite]);

  /* ─── map init: runs once per gisCode+plot change ───────────────── */
  useEffect(() => {
    let cancelled = false;

    (async () => {
      onStateChange?.('loading');
      try {
        const response = await fetch(
          `/api/bhunaksha/viewer?gisCode=${encodeURIComponent(gisCode)}&plot=${encodeURIComponent(plot)}`,
        );
        if (!response.ok) throw new Error('viewer');
        const data = await response.json() as {
          extent: Extent;
          selectedPlot?: SelectedPlot | null;
        };

        const mod = await import('leaflet');
        const L = ('default' in mod ? mod.default : mod) as typeof import('leaflet');
        if (cancelled || !containerRef.current) return;

        // tear down any previous instance
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }
        satLayerRef.current = null;
        // capture previous view BEFORE clearing the ref (avoids TS "never" error)
        const savedView = viewRef.current;
        viewRef.current = null;
        LRef.current = L;

        let { xmin, ymin, xmax, ymax } = data.extent;
        if (data.selectedPlot) {
          const plotW  = Math.max(1, data.selectedPlot.maxx - data.selectedPlot.minx);
          const plotH  = Math.max(1, data.selectedPlot.maxy - data.selectedPlot.miny);
          const viewW  = Math.max(620, plotW * 40);
          const viewH  = Math.max(485, plotH * 28);
          const cx     = (data.selectedPlot.minx + data.selectedPlot.maxx) / 2;
          const cy     = (data.selectedPlot.miny + data.selectedPlot.maxy) / 2;
          xmin = cx - viewW / 2; xmax = cx + viewW / 2;
          ymin = cy - viewH / 2; ymax = cy + viewH / 2;
        }

        const map = L.map(containerRef.current, {
          scrollWheelZoom: false,
          attributionControl: true,
        });
        mapRef.current = map;

        // Separate display panes keep the official WMS geometry intact while making
        // the visual hierarchy readable over both OSM and satellite imagery.
        const createDisplayPane = (name: string, zIndex: number, opacity: number, filter: string) => {
          const pane = map.createPane(name);
          pane.style.zIndex = String(zIndex);
          pane.style.pointerEvents = 'none';
          pane.style.opacity = String(opacity);
          pane.style.filter = filter;
          pane.style.transform = 'translate(-15px, -21px)';
          pane.style.willChange = 'transform';
          return pane;
        };

        // Village parcels: neutral, low-contrast background context.
        createDisplayPane(
          'villageParcelPane',
          430,
          0.34,
          'grayscale(1) brightness(1.42) contrast(0.76)',
        );
        // Selected Khasra: recolour the official raster pixels toward plum
        // and keep the layer above both OSM and satellite imagery.
        createDisplayPane(
          'selectedKhasraPane',
          470,
          0.94,
          'brightness(0) saturate(100%) invert(21%) sepia(25%) saturate(2200%) hue-rotate(286deg) brightness(86%) contrast(96%) drop-shadow(0 0 1.5px #4b1643) drop-shadow(0 0 3px rgba(75,22,67,0.72))',
        );

        const sw = utm43ToLatLng(xmin, ymin);
        const ne = utm43ToLatLng(xmax, ymax);

        const createWmsGrid = (
          style: string,
          layerName: string,
          extra: Record<string, string>,
          opacity: number,
          paneName: string,
        ) => {
          const Grid = L.GridLayer.extend({
            createTile(
              this: L.GridLayer & { _map: import('leaflet').Map },
              coords: { x: number; y: number; z: number },
              done: (err?: Error | null, tile?: HTMLElement) => void,
            ) {
              const size = 282;
              const nw = this._map.unproject(L.point(coords.x * size,       coords.y * size),       coords.z);
              const se = this._map.unproject(L.point((coords.x + 1) * size, (coords.y + 1) * size), coords.z);
              const [mnx, may] = latLngToUtm43(nw.lat, nw.lng);
              const [mxx, mny] = latLngToUtm43(se.lat, se.lng);
              const params = new URLSearchParams({
                REQUEST: 'GetMap',
                SERVICE: 'WMS',
                VERSION: '1.3.0',
                FORMAT: 'image/png',
                STYLES: style,
                TRANSPARENT: 'TRUE',
                LAYERS: layerName,
                CRS: 'EPSG:32643',
                FORMAT_OPTIONS: 'dpi:99',
                WIDTH: String(size),
                HEIGHT: String(size),
                BBOX: `${mnx},${mny},${mxx},${may}`,
                ...extra,
              });
              const tile = document.createElement('img');
              tile.alt = '';
              tile.width = size;
              tile.height = size;
              tile.onload  = () => done(null, tile);
              tile.onerror = () => done(new Error('WMS tile failed'), tile);
              tile.src = `https://bhunakshahp.nic.in/bhunakshaserver/WMS/tile?${params}`;
              return tile;
            },
          });
          const C = Grid as unknown as new (o: L.GridLayerOptions) => L.GridLayer;
          return new C({
            tileSize: 282,
            opacity,
            updateWhenZooming: false,
            keepBuffer: 2,
            pane: paneName,
          });
        };

        // Base map — OSM roads and place labels remain unchanged beneath the
        // independently styled official cadastral layers.
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 21,
          zIndex: 0,
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        const wmsLayers = [
          createWmsGrid(
            'VILLAGE_MAP',
            'VILLAGE_MAP',
            { transparent: 'true', state: '', gis_code: gisCode, overlay_codes: '' },
            0.72,
            'villageParcelPane',
          ),
          ...(data.selectedPlot ? [
            createWmsGrid(
              'PLOT_SELECTION',
              'PLOT_LIST',
              { transparent: 'true', state: '', gis_code: gisCode, overlay_codes: '', plot_id: data.selectedPlot.id },
              1,
              'selectedKhasraPane',
            ),
          ] : []),
        ];
        wmsLayers.forEach((l) => l.addTo(map));

        // Initial view
        if (savedView) {
          map.setView(savedView.center, savedView.zoom, { animate: false });
        } else if (data.selectedPlot) {
          const c = utm43ToLatLng(
            (data.selectedPlot.minx + data.selectedPlot.maxx) / 2,
            (data.selectedPlot.miny + data.selectedPlot.maxy) / 2,
          );
          map.setView(c, 17, { animate: false });
        } else {
          map.fitBounds([sw, ne], { padding: [24, 24], maxZoom: 15 });
        }

        map.on('moveend', () => {
          if (!map || !containerRef.current || containerRef.current.clientHeight === 0) return;
          const c = map.getCenter();
          viewRef.current = { center: [c.lat, c.lng], zoom: map.getZoom() };
        });
        map.on('mousemove', (e) =>
          setCoordinates(`${e.latlng.lat.toFixed(6)}, ${e.latlng.lng.toFixed(6)}`),
        );
        map.on('mouseout', () => setCoordinates(''));

        // Re-add satellite if it was already enabled
        if (satellite) {
          const satL = L.tileLayer(
            'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            { maxNativeZoom: 18, maxZoom: 21, zIndex: 1 },
          ).addTo(map);
          satLayerRef.current = satL;
        }

        setState('ready');
        onStateChange?.(plot ? (data.selectedPlot ? 'plot-found' : 'plot-unavailable') : 'ready');
      } catch {
        if (!cancelled) {
          setState('error');
          onStateChange?.('error');
        }
      }
    })();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      satLayerRef.current = null;
      viewRef.current = null;
      LRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gisCode, plot]);

  /* ─── render ─────────────────────────────────────────────────────── */
  return (
    <div
      ref={wrapperRef}
      className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
      style={isFullscreen ? { display: 'flex', flexDirection: 'column', borderRadius: 0, border: 'none' } : undefined}
    >
      {/* toolbar */}
      <div ref={toolbarRef} className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 bg-card px-4 py-3 text-sm">
        <span className="flex items-center gap-2 font-semibold">
          <MapPinned className="size-4 text-primary" />
          {plot ? `${t('viewer.khasra')} ${plot}` : t('viewer.villageMap')}
        </span>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-muted-foreground">
            {coordinates || attribution || 'Himachal BhuNaksha'}
          </span>

          <button
            type="button"
            onClick={() => setSatellite((v) => !v)}
            aria-pressed={satellite}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-full border bg-background px-3 text-sm font-semibold transition-colors hover:bg-muted"
          >
            <Layers className="size-4" aria-hidden="true" />
            {satellite ? t('viewer.mapOnly') : t('viewer.satellite')}
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? t('viewer.exitFullscreen') : t('viewer.fullscreen')}
            title={isFullscreen ? t('viewer.exitFullscreenHint') : t('viewer.fullscreenHint')}
            className="inline-flex min-h-9 w-9 items-center justify-center rounded-full border bg-background transition-colors hover:bg-muted"
          >
            {isFullscreen
              ? <Minimize2 className="size-4" aria-hidden="true" />
              : <Maximize2 className="size-4" aria-hidden="true" />
            }
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-border/70 bg-background px-4 py-2 text-[11px] text-muted-foreground" aria-label="Map layer legend">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-3 rounded-sm border border-[#4b1643] bg-amber-400" aria-hidden="true" />
          Selected Khasra
        </span>
         <span className="inline-flex items-center gap-1.5">
          <span className="size-3 rounded-sm border border-slate-300 bg-slate-200" aria-hidden="true" />
          Other village parcels
        </span>
      </div>

      {/* map canvas */}
      <div
        ref={containerRef}
        role="region"
        aria-label={t('viewer.mapLabel')}
        className="w-full bg-muted/30"
        style={{ height: '420px' }}
      />

      {/* status bar */}
      {state !== 'ready' && (
        <div ref={statusRef} className="flex items-center justify-center gap-2 border-t bg-card px-4 py-3 text-sm text-muted-foreground">
          {state === 'loading'
            ? <><LoaderCircle className="size-4 animate-spin" /> {t('viewer.loading')}</>
            : t('viewer.error')
          }
        </div>
      )}
    </div>
  );
}