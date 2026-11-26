'use client';

import type { Map as LeafletMap } from 'leaflet';
import { Grid3x3, Layers, Maximize2, Minimize2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useState, type RefObject } from 'react';
import { addSatellite, type Leaflet } from '@/components/map/map-layers';
import { cn } from '@/lib/utils';

type WebkitElement = HTMLElement & { webkitRequestFullscreen?: () => Promise<void> | void };
type WebkitDocument = Document & { webkitExitFullscreen?: () => void; webkitFullscreenElement?: Element | null };

type Options = {
  wrapperRef: RefObject<HTMLElement | null>;
  mapRef: RefObject<LeafletMap | null>;
  LRef: RefObject<Leaflet | null>;
  ready: boolean;
};

/**
 * Satellite switch and full screen for a Leaflet map, working like the plot map page:
 * the F key toggles full screen (while the pointer is over the map or focus is inside it),
 * and Escape leaves it. Where the browser has no full screen API (iPhone), the map fills the
 * window instead.
 */
export function useMapChrome({ wrapperRef, mapRef, LRef, ready }: Options) {
  const [native, setNative] = useState(false);
  const [filled, setFilled] = useState(false);
  const [satellite, setSatellite] = useState(false);
  const isFullscreen = native || filled;

  const refresh = useCallback(() => {
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => mapRef.current?.invalidateSize({ animate: false })));
  }, [mapRef]);

  const enter = useCallback(() => {
    const element = wrapperRef.current as WebkitElement | null;
    if (!element) return;
    if (element.requestFullscreen) element.requestFullscreen().catch(() => setFilled(true));
    else if (element.webkitRequestFullscreen) void element.webkitRequestFullscreen();
    else setFilled(true);
  }, [wrapperRef]);

  const exit = useCallback(() => {
    const doc = document as WebkitDocument;
    if (filled) setFilled(false);
    if (doc.fullscreenElement && doc.exitFullscreen) void doc.exitFullscreen();
    else if (doc.webkitFullscreenElement && doc.webkitExitFullscreen) doc.webkitExitFullscreen();
  }, [filled]);

  const toggleFullscreen = useCallback(() => (isFullscreen ? exit() : enter()), [isFullscreen, enter, exit]);

  useEffect(() => {
    function onChange() {
      const doc = document as WebkitDocument;
      setNative((doc.fullscreenElement ?? doc.webkitFullscreenElement) === wrapperRef.current);
    }
    document.addEventListener('fullscreenchange', onChange);
    document.addEventListener('webkitfullscreenchange', onChange);
    return () => {
      document.removeEventListener('fullscreenchange', onChange);
      document.removeEventListener('webkitfullscreenchange', onChange);
    };
  }, [wrapperRef]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && filled) {
        setFilled(false);
        return;
      }
      if (event.key !== 'f' && event.key !== 'F') return;
      const tag = (document.activeElement?.tagName ?? '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
      const wrapper = wrapperRef.current;
      if (!wrapper || (!isFullscreen && !wrapper.matches(':hover') && !wrapper.contains(document.activeElement))) return;
      event.preventDefault();
      toggleFullscreen();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [filled, isFullscreen, toggleFullscreen, wrapperRef]);

  // The map has to re-measure itself whenever its box changes size.
  useEffect(refresh, [isFullscreen, refresh]);

  // Stop the page behind a window-filling map from scrolling.
  useEffect(() => {
    if (!filled) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [filled]);

  useEffect(() => {
    const L = LRef.current;
    const map = mapRef.current;
    if (!ready || !L || !map || !satellite) return;
    return addSatellite(L, map);
  }, [satellite, ready, LRef, mapRef]);

  return {
    isFullscreen,
    toggleFullscreen,
    satellite,
    setSatellite,
    /** Class for the element that goes full screen. */
    wrapperClass: isFullscreen ? 'fixed inset-0 z-[1000] flex flex-col gap-3 overflow-auto bg-background p-3 sm:p-4' : '',
    /** Class for the box around the map canvas (it takes the leftover height in full screen). */
    mapBoxClass: isFullscreen ? 'min-h-[50vh] flex-1' : '',
    /** Class for the map canvas itself. */
    mapClass: isFullscreen ? 'h-full' : 'h-80 sm:h-96',
  };
}

type ButtonsProps = {
  satellite: boolean;
  onSatellite: () => void;
  fullscreen: boolean;
  onFullscreen: () => void;
  /** Optional switch for the plot boundaries of the village. */
  plotLines?: boolean;
  onPlotLines?: () => void;
};

const pill =
  'inline-flex min-h-9 items-center gap-1.5 rounded-full border bg-background px-3 text-sm font-semibold transition-colors hover:bg-muted';

export function MapChromeButtons({ satellite, onSatellite, fullscreen, onFullscreen, plotLines, onPlotLines }: ButtonsProps) {
  const t = useTranslations('Marketplace.mapControls');
  return (
    <div className="flex flex-wrap items-center gap-2">
      {onPlotLines && (
        <button type="button" onClick={onPlotLines} aria-pressed={plotLines} className={cn(pill, plotLines && 'border-primary text-primary')}>
          <Grid3x3 className="size-4" aria-hidden="true" />
          {t('plotLines')}
        </button>
      )}
      <button type="button" onClick={onSatellite} aria-pressed={satellite} className={cn(pill, satellite && 'border-primary text-primary')}>
        <Layers className="size-4" aria-hidden="true" />
        {satellite ? t('mapOnly') : t('satellite')}
      </button>
      <button
        type="button"
        onClick={onFullscreen}
        aria-label={fullscreen ? t('exitFullscreen') : t('fullscreen')}
        title={fullscreen ? t('exitFullscreenHint') : t('fullscreenHint')}
        className={cn(pill, 'w-9 justify-center px-0')}
      >
        {fullscreen ? <Minimize2 className="size-4" aria-hidden="true" /> : <Maximize2 className="size-4" aria-hidden="true" />}
      </button>
    </div>
  );
}
