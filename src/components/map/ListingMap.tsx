'use client';

import type { GridLayer, Map as LeafletMap } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { MapChromeButtons, useMapChrome } from '@/components/map/MapChrome';
import { villageLines, type Leaflet } from '@/components/map/map-layers';
import { GIS_CODE } from '@/lib/geo';
import { cn } from '@/lib/utils';

type Props = {
  lat: number;
  lng: number;
  /** true: the exact pin (logged-in visitors). false: a circle around the approximate spot. */
  exact: boolean;
  /** Village code. With an exact pin it enables the "Plot lines" switch. */
  gisCode?: string | null;
};

/** Read-only map for a listing page, with satellite, full screen and (for the exact pin) plot lines. */
export function ListingMap({ lat, lng, exact, gisCode }: Props) {
  const t = useTranslations('Marketplace.detail.map');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const LRef = useRef<Leaflet | null>(null);
  const linesRef = useRef<GridLayer | null>(null);
  const [ready, setReady] = useState(false);
  const [plotLines, setPlotLines] = useState(false);
  const chrome = useMapChrome({ wrapperRef, mapRef, LRef, ready });
  const canShowLines = exact && Boolean(gisCode && GIS_CODE.test(gisCode));

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const mod = await import('leaflet');
      const L = ('default' in mod ? mod.default : mod) as Leaflet;
      if (cancelled || !containerRef.current) return;
      const map = L.map(containerRef.current, { center: [lat, lng], zoom: exact ? 17 : 15, scrollWheelZoom: false });
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 21,
        maxNativeZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
      }).addTo(map);
      if (exact) {
        L.marker([lat, lng], {
          title: t('exactTitle'),
          zIndexOffset: 1000,
          icon: L.divIcon({
            className: '',
            iconSize: [28, 36],
            iconAnchor: [14, 34],
            html:
              '<svg width="28" height="36" viewBox="0 0 28 36" aria-hidden="true" style="filter:drop-shadow(0 2px 2px rgba(0,0,0,.35))">' +
              '<path d="M14 1C7 1 1.5 6.5 1.5 13.4 1.5 22.6 14 35 14 35S26.5 22.6 26.5 13.4C26.5 6.5 21 1 14 1Z" fill="#b91c1c" stroke="#fff" stroke-width="2"/>' +
              '<circle cx="14" cy="13.5" r="4.5" fill="#fff"/></svg>',
          }),
        }).addTo(map);
      } else {
        // The real spot is up to about 100 m from the centre, so 160 m always covers it.
        L.circle([lat, lng], { radius: 160, color: '#b91c1c', weight: 2, fillColor: '#b91c1c', fillOpacity: 0.15 }).addTo(map);
      }
      mapRef.current = map;
      LRef.current = L;
      setReady(true);
      setTimeout(() => map.invalidateSize(), 0);
    })();
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      linesRef.current = null;
      setReady(false);
    };
  }, [lat, lng, exact, t]);

  // Plot boundaries of the village, from the official map.
  useEffect(() => {
    const L = LRef.current;
    const map = mapRef.current;
    if (!ready || !L || !map || !plotLines || !canShowLines || !gisCode) return;
    const layer = villageLines(L, map, gisCode).addTo(map);
    linesRef.current = layer;
    return () => {
      layer.remove();
      linesRef.current = null;
    };
  }, [ready, plotLines, canShowLines, gisCode]);

  return (
    <div ref={wrapperRef} className={cn('space-y-2', chrome.wrapperClass)}>
      <div className="flex justify-end">
        <MapChromeButtons
          satellite={chrome.satellite}
          onSatellite={() => chrome.setSatellite((on) => !on)}
          fullscreen={chrome.isFullscreen}
          onFullscreen={chrome.toggleFullscreen}
          plotLines={canShowLines ? plotLines : undefined}
          onPlotLines={canShowLines ? () => setPlotLines((on) => !on) : undefined}
        />
      </div>
      <div className={cn('relative z-0 isolate', chrome.mapBoxClass)}>
        <div
          ref={containerRef}
          className={cn('w-full overflow-hidden rounded-lg border bg-secondary', chrome.isFullscreen ? 'h-full' : 'h-72 sm:h-80')}
          role="application"
          aria-label={exact ? t('exactLabel') : t('approxLabel')}
        />
        {!ready && (
          <p className="absolute inset-0 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            {t('loading')}
          </p>
        )}
      </div>
    </div>
  );
}
