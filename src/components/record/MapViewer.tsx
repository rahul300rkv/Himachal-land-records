'use client';

import 'leaflet/dist/leaflet.css';
import { MapPinOff } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useRef, useState } from 'react';
import { StateMessage } from '@/components/layout/StateMessage';
import type { Json } from '@/types/database';

const GEOJSON_TYPES = new Set([
  'Feature',
  'FeatureCollection',
  'Polygon',
  'MultiPolygon',
  'LineString',
  'MultiLineString',
  'Point',
  'MultiPoint',
  'GeometryCollection',
]);

function isGeoJson(value: Json | null): value is { type: string } & Record<string, Json> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    typeof value.type === 'string' &&
    GEOJSON_TYPES.has(value.type)
  );
}

/**
 * Interactive Leaflet map (OpenStreetMap tiles) showing the plot outline from `map_geojson`.
 * Without boundary data it shows a clear placeholder and never loads Leaflet.
 *
 * Production note: OpenStreetMap's public tile server is meant for light use. For real traffic
 * switch the tile URL below to a commercial provider (MapTiler, Mapbox, Stadia, ...).
 */
export function MapViewer({ geojson }: { geojson: Json | null }) {
  const t = useTranslations('Record.map');
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const valid = useMemo(() => isGeoJson(geojson), [geojson]);

  useEffect(() => {
    if (!valid || !containerRef.current) return;

    let cancelled = false;
    let map: import('leaflet').Map | undefined;

    (async () => {
      try {
        const mod = await import('leaflet');
        const L = ('default' in mod ? mod.default : mod) as typeof import('leaflet');
        if (cancelled || !containerRef.current) return;

        map = L.map(containerRef.current, { scrollWheelZoom: false });
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        const layer = L.geoJSON(geojson as unknown as GeoJSON.GeoJsonObject, {
          style: { color: '#236aa8', weight: 2.5, fillColor: '#236aa8', fillOpacity: 0.22 },
        }).addTo(map);
        map.fitBounds(layer.getBounds(), { maxZoom: 18, padding: [28, 28] });
        setStatus('ready');
      } catch {
        if (!cancelled) setStatus('error');
      }
    })();

    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [geojson, valid]);

  if (!valid) {
    return <StateMessage icon={MapPinOff} title={t('placeholderTitle')} body={t('placeholderBody')} />;
  }

  return (
    // `isolate` keeps Leaflet's internal z-indexes below the sticky header and menus.
    <div className="relative isolate overflow-hidden rounded-lg border bg-muted">
      <div
        ref={containerRef}
        role="region"
        aria-label={t('ariaLabel')}
        className="h-72 w-full sm:h-96"
      />
      {status !== 'ready' && (
        <p className="absolute inset-0 z-[500] flex items-center justify-center bg-muted/80 text-sm text-muted-foreground">
          {status === 'error' ? t('error') : t('loading')}
        </p>
      )}
    </div>
  );
}
