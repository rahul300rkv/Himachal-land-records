'use client';

import type { DivIcon, GridLayer, LatLngBounds, Map as LeafletMap, Marker, Rectangle } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Crosshair, Loader2, MapPin, Search, Trash2 } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { MapChromeButtons, useMapChrome } from '@/components/map/MapChrome';
import { plotHighlight, villageLines, type Leaflet } from '@/components/map/map-layers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GIS_CODE, inHimachal, plotCenterLatLng, round6, utm43ToLatLng, type LatLng, type MapPoint } from '@/lib/geo';
import { cn } from '@/lib/utils';

type Place = { id: number; label: string; lat: number; lng: number };

type Props = {
  /** 10-digit BhuNaksha code of the chosen village ('' until one is chosen). */
  gisCode: string;
  /** Khasra number. When it is given, the pin goes to the centre of that plot's shape. Optional. */
  khasra: string;
  value: MapPoint | null;
  onChange: (point: MapPoint | null) => void;
  /** Reports the village centre so the form can fall back to it when no pin is placed. */
  onVillageCenter?: (center: LatLng | null) => void;
};

function pinIcon(L: Leaflet): DivIcon {
  return L.divIcon({
    className: '',
    iconSize: [28, 36],
    iconAnchor: [14, 34],
    html:
      '<svg width="28" height="36" viewBox="0 0 28 36" aria-hidden="true" style="filter:drop-shadow(0 2px 2px rgba(0,0,0,.35))">' +
      '<path d="M14 1C7 1 1.5 6.5 1.5 13.4 1.5 22.6 14 35 14 35S26.5 22.6 26.5 13.4C26.5 6.5 21 1 14 1Z" fill="#b91c1c" stroke="#fff" stroke-width="2"/>' +
      '<circle cx="14" cy="13.5" r="4.5" fill="#fff"/></svg>',
  });
}

/**
 * Map where the seller drops a pin. It centres on the chosen village and outlines the village's
 * plots. Typing a khasra number loads that plot's shape from the official BhuNaksha map and puts
 * the pin at its centre; the pin can still be dragged. Place search is OpenStreetMap.
 */
export function LocationPicker({ gisCode, khasra, value, onChange, onVillageCenter }: Props) {
  const t = useTranslations('Marketplace.form.map');
  const locale = useLocale();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const LRef = useRef<Leaflet | null>(null);
  const markerRef = useRef<Marker | null>(null);
  const areaRef = useRef<Rectangle | null>(null);
  const villageLayerRef = useRef<GridLayer | null>(null);
  const plotLayerRef = useRef<GridLayer | null>(null);
  const centeredOnValue = useRef(false);
  // "village:khasra" the pin was last placed for. Editing a listing starts as already handled,
  // so opening the form never moves a saved pin.
  const locatedKey = useRef(value && khasra.trim() ? `${gisCode}:${khasra.trim()}` : '');
  const onChangeRef = useRef(onChange);
  const onCenterRef = useRef(onVillageCenter);
  const valueRef = useRef(value);
  const gisRef = useRef(gisCode);
  const khasraRef = useRef(khasra);
  onChangeRef.current = onChange;
  onCenterRef.current = onVillageCenter;
  valueRef.current = value;
  gisRef.current = gisCode;
  khasraRef.current = khasra;

  const [ready, setReady] = useState(false);
  const [bounds, setBounds] = useState<LatLngBounds | null>(null);
  const [villageState, setVillageState] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [query, setQuery] = useState('');
  const [searchState, setSearchState] = useState<'idle' | 'loading' | 'empty' | 'error'>('idle');
  const [results, setResults] = useState<Place[]>([]);
  const [plotState, setPlotState] = useState<'idle' | 'loading' | 'found' | 'notFound' | 'error'>('idle');
  const [geoState, setGeoState] = useState<'idle' | 'loading' | 'denied' | 'outside'>('idle');
  const [nearPlace, setNearPlace] = useState('');

  const chrome = useMapChrome({ wrapperRef, mapRef, LRef, ready });

  function place(point: LatLng, source: MapPoint['source']) {
    onChangeRef.current({ lat: round6(point.lat), lng: round6(point.lng), source });
  }

  function clearPlotShape() {
    plotLayerRef.current?.remove();
    plotLayerRef.current = null;
  }

  // Create the map once.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const mod = await import('leaflet');
      const L = ('default' in mod ? mod.default : mod) as Leaflet;
      if (cancelled || !containerRef.current || mapRef.current) return;
      const map = L.map(containerRef.current, { center: [31.9, 77.2], zoom: 7, scrollWheelZoom: true });
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 21,
        maxNativeZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
      }).addTo(map);
      map.on('click', (event) => place(event.latlng, 'pin'));
      mapRef.current = map;
      LRef.current = L;
      setReady(true);
      setTimeout(() => map.invalidateSize(), 0);
    })();
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markerRef.current = null;
      areaRef.current = null;
      villageLayerRef.current = null;
      plotLayerRef.current = null;
      setReady(false);
    };
  }, []);

  // Keep the marker in step with the chosen point.
  useEffect(() => {
    const L = LRef.current;
    const map = mapRef.current;
    if (!ready || !L || !map) return;
    if (!value) {
      markerRef.current?.remove();
      markerRef.current = null;
      return;
    }
    const position: [number, number] = [value.lat, value.lng];
    if (!markerRef.current) {
      const marker = L.marker(position, { draggable: true, icon: pinIcon(L), title: t('pinTitle'), zIndexOffset: 1000 }).addTo(map);
      marker.on('dragend', () => place(marker.getLatLng(), 'pin'));
      markerRef.current = marker;
    } else {
      markerRef.current.setLatLng(position);
    }
    // Start on an existing pin (editing a listing) once.
    if (!centeredOnValue.current) {
      centeredOnValue.current = true;
      map.setView(position, 17);
    }
  }, [value, ready, t]);

  // Centre on the chosen village, outline it and draw its plot boundaries.
  useEffect(() => {
    const L = LRef.current;
    const map = mapRef.current;
    if (!ready || !L || !map) return;
    areaRef.current?.remove();
    areaRef.current = null;
    villageLayerRef.current?.remove();
    villageLayerRef.current = null;
    clearPlotShape();
    locatedKey.current = '';
    setPlotState('idle');
    setBounds(null);
    onCenterRef.current?.(null);
    if (!GIS_CODE.test(gisCode)) {
      setVillageState('idle');
      return;
    }
    const controller = new AbortController();
    setVillageState('loading');
    fetch(`/api/bhunaksha/viewer?gisCode=${gisCode}`, { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error('viewer'))))
      .then((data: { extent: { xmin: number; ymin: number; xmax: number; ymax: number } }) => {
        const sw = utm43ToLatLng(data.extent.xmin, data.extent.ymin);
        const ne = utm43ToLatLng(data.extent.xmax, data.extent.ymax);
        const box = L.latLngBounds(sw, ne);
        if (!box.isValid() || !inHimachal({ lat: box.getCenter().lat, lng: box.getCenter().lng })) throw new Error('extent');
        areaRef.current = L.rectangle(box, { color: '#2563eb', weight: 2, dashArray: '6 6', fill: false, interactive: false }).addTo(map);
        villageLayerRef.current = villageLines(L, map, gisCode).addTo(map);
        if (!valueRef.current) map.fitBounds(box, { padding: [24, 24] });
        const center = box.getCenter();
        onCenterRef.current?.({ lat: round6(center.lat), lng: round6(center.lng) });
        setBounds(box);
        setVillageState('ready');
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setVillageState('error');
      });
    return () => controller.abort();
  }, [gisCode, ready]);

  async function locatePlot() {
    const L = LRef.current;
    const map = mapRef.current;
    const plot = khasraRef.current.trim();
    const code = gisRef.current;
    if (!L || !map || !plot || !GIS_CODE.test(code)) return;
    const key = `${code}:${plot}`;
    locatedKey.current = key; // handled, so the automatic lookup does not repeat it
    setPlotState('loading');
    try {
      const response = await fetch(`/api/bhunaksha/viewer?gisCode=${code}&plot=${encodeURIComponent(plot)}`);
      if (!response.ok) throw new Error('viewer');
      const data = (await response.json()) as {
        selectedPlot?: { minx: number; miny: number; maxx: number; maxy: number; id: string } | null;
      };
      if (`${gisRef.current}:${khasraRef.current.trim()}` !== key) return; // changed while loading
      const p = data.selectedPlot;
      if (!p || ![p.minx, p.miny, p.maxx, p.maxy].every(Number.isFinite)) {
        clearPlotShape();
        setPlotState('notFound');
        return;
      }
      const center = plotCenterLatLng(p);
      if (!inHimachal(center)) {
        clearPlotShape();
        setPlotState('notFound');
        return;
      }
      clearPlotShape();
      if (p.id) plotLayerRef.current = plotHighlight(L, map, code, p.id).addTo(map);
      place(center, 'plot');
      map.setView([center.lat, center.lng], 18);
      setPlotState('found');
    } catch {
      if (`${gisRef.current}:${khasraRef.current.trim()}` === key) setPlotState('error');
    }
  }

  // When a khasra number is typed, find the plot by itself once the seller stops typing.
  useEffect(() => {
    if (!ready) return;
    const plot = khasra.trim();
    if (!plot || !GIS_CODE.test(gisCode)) {
      clearPlotShape();
      locatedKey.current = '';
      setPlotState('idle');
      return;
    }
    if (locatedKey.current === `${gisCode}:${plot}`) return;
    const timer = setTimeout(() => void locatePlot(), 900);
    return () => clearTimeout(timer);
    // locatePlot only reads refs and state setters, so it does not need to be a dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [khasra, gisCode, ready]);

  // Name the area around the pin ("Theog, Shimla"). It is only a hint, so failures are ignored.
  // The wait after each move keeps lookups well inside OpenStreetMap's usage policy.
  const pinLat = value?.lat;
  const pinLng = value?.lng;
  useEffect(() => {
    setNearPlace('');
    if (pinLat === undefined || pinLng === undefined) return;
    const controller = new AbortController();
    const timer = setTimeout(() => {
      fetch(`/api/reverse-geocode?lat=${pinLat}&lng=${pinLng}&lang=${locale}`, { signal: controller.signal })
        .then((response) => (response.ok ? response.json() : null))
        .then((data: { label?: string } | null) => setNearPlace(data?.label ?? ''))
        .catch(() => undefined);
    }, 900);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [pinLat, pinLng, locale]);

  async function search() {
    const text = query.trim();
    if (text.length < 3) return;
    setSearchState('loading');
    setResults([]);
    try {
      const response = await fetch(`/api/geocode?q=${encodeURIComponent(text)}&lang=${locale}`);
      if (!response.ok) throw new Error('geocode');
      const data = (await response.json()) as { results: Place[] };
      setResults(data.results);
      setSearchState(data.results.length === 0 ? 'empty' : 'idle');
    } catch {
      setSearchState('error');
    }
  }

  function goTo(item: Place) {
    mapRef.current?.setView([item.lat, item.lng], 16);
    setResults([]);
  }

  function useMyLocation() {
    if (!navigator.geolocation) {
      setGeoState('denied');
      return;
    }
    setGeoState('loading');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const point = { lat: position.coords.latitude, lng: position.coords.longitude };
        if (!inHimachal(point)) {
          setGeoState('outside');
          return;
        }
        place(point, 'pin');
        mapRef.current?.setView([point.lat, point.lng], 17);
        setGeoState('idle');
      },
      () => setGeoState('denied'),
      { enableHighAccuracy: true, timeout: 10_000 },
    );
  }

  const outside = Boolean(value && bounds && !bounds.pad(0.2).contains([value.lat, value.lng]));
  const message = (text: string, tone: 'muted' | 'warn' | 'error' = 'muted') => (
    <p
      role={tone === 'muted' ? undefined : 'alert'}
      className={
        tone === 'error' ? 'text-sm font-medium text-destructive' : tone === 'warn' ? 'text-sm font-medium text-notice-foreground' : 'text-sm text-muted-foreground'
      }
    >
      {text}
    </p>
  );

  return (
    <div>
      <div ref={wrapperRef} className={cn('space-y-3', chrome.wrapperClass)}>
        <form
          className="flex gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            void search();
          }}
        >
          <Input
            aria-label={t('searchLabel')}
            placeholder={t('searchPlaceholder')}
            value={query}
            maxLength={120}
            onChange={(event) => setQuery(event.target.value)}
          />
          <Button type="submit" variant="outline" disabled={searchState === 'loading' || query.trim().length < 3}>
            {searchState === 'loading' ? <Loader2 className="animate-spin" /> : <Search />}
            {t('searchButton')}
          </Button>
        </form>

        <div aria-live="polite" className="min-h-5">
          {searchState === 'empty' && message(t('noResults'))}
          {searchState === 'error' && message(t('searchFailed'), 'error')}
        </div>
        {results.length > 0 && (
          <ul className="max-h-48 divide-y overflow-auto rounded-md border bg-background text-sm">
            {results.map((item) => (
              <li key={item.id}>
                <button type="button" onClick={() => goTo(item)} className="flex w-full items-start gap-2 px-3 py-2 text-left hover:bg-accent">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => void locatePlot()} disabled={!khasra.trim() || !GIS_CODE.test(gisCode) || plotState === 'loading'}>
              {plotState === 'loading' ? <Loader2 className="animate-spin" /> : <MapPin />}
              {t('locatePlot')}
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={useMyLocation} disabled={geoState === 'loading'}>
              {geoState === 'loading' ? <Loader2 className="animate-spin" /> : <Crosshair />}
              {t('useMyLocation')}
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => onChange(null)} disabled={!value}>
              <Trash2 />
              {t('removePin')}
            </Button>
          </div>
          <MapChromeButtons
            satellite={chrome.satellite}
            onSatellite={() => chrome.setSatellite((on) => !on)}
            fullscreen={chrome.isFullscreen}
            onFullscreen={chrome.toggleFullscreen}
          />
        </div>

        <div className={cn('relative z-0 isolate', chrome.mapBoxClass)}>
          <div ref={containerRef} className={cn('w-full overflow-hidden rounded-lg border bg-secondary', chrome.mapClass)} role="application" aria-label={t('mapLabel')} />
          {!ready && (
            <p className="absolute inset-0 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              {t('loadingMap')}
            </p>
          )}
        </div>

        <div aria-live="polite" className="min-h-5 space-y-1">
          {!GIS_CODE.test(gisCode) && message(t('selectVillageFirst'))}
          {villageState === 'loading' && message(t('loadingVillage'))}
          {villageState === 'error' && message(t('villageFailed'), 'warn')}
          {plotState === 'loading' && message(t('plotLoading', { plot: khasra.trim() }))}
          {plotState === 'found' && message(t('plotFound', { plot: khasra.trim() }))}
          {plotState === 'notFound' && message(t('plotNotFound', { plot: khasra.trim() }), 'warn')}
          {plotState === 'error' && message(t('plotFailed'), 'warn')}
          {geoState === 'denied' && message(t('locationDenied'), 'warn')}
          {geoState === 'outside' && message(t('locationOutside'), 'warn')}
          {outside && message(t('outside'), 'warn')}
          {value ? message(t(`source.${value.source}`, { plot: khasra.trim() })) : GIS_CODE.test(gisCode) && message(t('noPin'))}
          {value && nearPlace && message(t('nearPlace', { place: nearPlace }))}
        </div>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{t('privacy')}</p>
    </div>
  );
}
