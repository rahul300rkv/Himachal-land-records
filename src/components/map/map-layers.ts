import type { GridLayer, GridLayerOptions, Map as LeafletMap } from 'leaflet';
import { latLngToUtm43, WMS_DATUM_SHIFT_M } from '@/lib/geo';

export type Leaflet = typeof import('leaflet');

const WMS_URL = 'https://bhunakshahp.nic.in/bhunakshaserver/WMS/tile';
const TILE_SIZE = 282;

/**
 * One layer of the official BhuNaksha map, drawn over the base map. Same requests as the
 * plot map page. The layer is lined up with the base map by asking the server for the area
 * shifted by WMS_DATUM_SHIFT_M, so it stays aligned at every zoom.
 */
function wmsLayer(
  L: Leaflet,
  map: LeafletMap,
  style: string,
  layerName: string,
  extra: Record<string, string>,
  opacity: number,
): GridLayer {
  if (!map.getPane('bhunakshaPane')) {
    const pane = map.createPane('bhunakshaPane');
    pane.style.zIndex = '450';
    pane.style.pointerEvents = 'none';
  }
  const { east, north } = WMS_DATUM_SHIFT_M;
  const Grid = L.GridLayer.extend({
    createTile(coords: { x: number; y: number; z: number }, done: (error?: Error | null, tile?: HTMLElement) => void) {
      const nw = map.unproject(L.point(coords.x * TILE_SIZE, coords.y * TILE_SIZE), coords.z);
      const se = map.unproject(L.point((coords.x + 1) * TILE_SIZE, (coords.y + 1) * TILE_SIZE), coords.z);
      const [minX, maxY] = latLngToUtm43(nw.lat, nw.lng);
      const [maxX, minY] = latLngToUtm43(se.lat, se.lng);
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
        WIDTH: String(TILE_SIZE),
        HEIGHT: String(TILE_SIZE),
        BBOX: `${minX - east},${minY - north},${maxX - east},${maxY - north}`,
        ...extra,
      });
      const tile = document.createElement('img');
      tile.alt = '';
      tile.width = TILE_SIZE;
      tile.height = TILE_SIZE;
      tile.onload = () => done(null, tile);
      tile.onerror = () => done(new Error('WMS tile failed'), tile);
      tile.src = `${WMS_URL}?${params}`;
      return tile;
    },
  });
  const Layer = Grid as unknown as new (options: GridLayerOptions) => GridLayer;
  return new Layer({ tileSize: TILE_SIZE, opacity, updateWhenZooming: false, keepBuffer: 2, pane: 'bhunakshaPane' });
}

/** Plot boundaries of a whole village. */
export function villageLines(L: Leaflet, map: LeafletMap, gisCode: string) {
  return wmsLayer(L, map, 'VILLAGE_MAP', 'VILLAGE_MAP', { transparent: 'true', state: '', gis_code: gisCode, overlay_codes: '' }, 0.6);
}

/** Highlights one plot (the shape BhuNaksha holds for it). `plotId` comes from the plot lookup. */
export function plotHighlight(L: Leaflet, map: LeafletMap, gisCode: string, plotId: string) {
  return wmsLayer(
    L, map, 'PLOT_SELECTION', 'PLOT_LIST',
    { transparent: 'true', state: '', gis_code: gisCode, overlay_codes: '', plot_id: plotId },
    1,
  );
}

/** Satellite imagery under the overlays, like the plot map page. Returns a function that removes it. */
export function addSatellite(L: Leaflet, map: LeafletMap): () => void {
  let errors = 0;
  let fallback: ReturnType<Leaflet['tileLayer']> | null = null;
  const primary = L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    { maxNativeZoom: 18, maxZoom: 21, zIndex: 2, attribution: 'Imagery &copy; Esri' },
  );
  primary.on('tileerror', () => {
    errors += 1;
    if (errors < 3 || fallback) return;
    map.removeLayer(primary);
    fallback = L.tileLayer('https://bhuvan-ras2.nrsc.gov.in/tilecache/tilecache.py/1.0.0/bhuvan_imagery2/{z}/{x}/{y}.jpg', {
      maxZoom: 22,
      zIndex: 2,
      attribution: 'Imagery &copy; ISRO Bhuvan',
    }).addTo(map);
  });
  primary.addTo(map);
  return () => {
    map.removeLayer(primary);
    if (fallback) map.removeLayer(fallback);
  };
}
