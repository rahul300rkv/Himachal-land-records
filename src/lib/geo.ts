/**
 * Small map helpers shared by the listing form and the listing page.
 * BhuNaksha publishes extents in UTM zone 43N (EPSG:32643); maps need latitude / longitude.
 */

export type LatLng = { lat: number; lng: number };

/** Rough bounding box of Himachal Pradesh, used to keep place search inside the state. */
export const HP_VIEWBOX = { west: 75.58, north: 33.26, east: 79.05, south: 30.37 };

/** Where the seller's pin came from. */
export type PinSource = 'pin' | 'plot' | 'village';

export type MapPoint = LatLng & { source: PinSource };

export const GIS_CODE = /^\d{10}$/;

export function round6(value: number) {
  return Math.round(value * 1e6) / 1e6;
}

export function inHimachal({ lat, lng }: LatLng) {
  return lat >= HP_VIEWBOX.south && lat <= HP_VIEWBOX.north && lng >= HP_VIEWBOX.west && lng <= HP_VIEWBOX.east;
}

export function utm43ToLatLng(easting: number, northing: number): [number, number] {
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

export function latLngToUtm43(lat: number, lon: number): [number, number] {
  const a = 6378137; const eccSquared = 0.00669438; const k0 = 0.9996;
  const latRad = lat * Math.PI / 180; const lonRad = lon * Math.PI / 180; const lonOrigin = 75 * Math.PI / 180;
  const eccPrimeSquared = eccSquared / (1 - eccSquared); const n = a / Math.sqrt(1 - eccSquared * Math.sin(latRad) ** 2);
  const t = Math.tan(latRad) ** 2; const c = eccPrimeSquared * Math.cos(latRad) ** 2; const A = Math.cos(latRad) * (lonRad - lonOrigin);
  const m = a * ((1 - eccSquared / 4 - 3 * eccSquared ** 2 / 64 - 5 * eccSquared ** 3 / 256) * latRad - (3 * eccSquared / 8 + 3 * eccSquared ** 2 / 32 + 45 * eccSquared ** 3 / 1024) * Math.sin(2 * latRad) + (15 * eccSquared ** 2 / 256 + 45 * eccSquared ** 3 / 1024) * Math.sin(4 * latRad) - 35 * eccSquared ** 3 / 3072 * Math.sin(6 * latRad));
  const easting = k0 * n * (A + (1 - t + c) * A ** 3 / 6 + (5 - 18 * t + t ** 2 + 72 * c - 58 * eccPrimeSquared) * A ** 5 / 120) + 500000;
  const northing = k0 * (m + n * Math.tan(latRad) * (A ** 2 / 2 + (5 - t + 9 * c + 4 * c ** 2) * A ** 4 / 24 + (61 - 58 * t + t ** 2 + 600 * c - 330 * eccPrimeSquared) * A ** 6 / 720));
  return [easting, northing];
}

/**
 * The official BhuNaksha layers sit slightly off the OpenStreetMap base map. The plot map
 * page corrects this by sliding the layer 15 px west and 21 px south at zoom 17, which is
 * about 15.3 m west and 21.5 m south on the ground in Himachal. The listing maps use the same
 * correction, applied in metres so it stays right at every zoom.
 */
export const WMS_DATUM_SHIFT_M = { east: -15.3, north: -21.5 };

/** Centre of a plot's bounding box (UTM zone 43N) as latitude / longitude, with the correction above. */
export function plotCenterLatLng(box: { minx: number; miny: number; maxx: number; maxy: number }): LatLng {
  const [lat, lng] = utm43ToLatLng(
    (box.minx + box.maxx) / 2 + WMS_DATUM_SHIFT_M.east,
    (box.miny + box.maxy) / 2 + WMS_DATUM_SHIFT_M.north,
  );
  return { lat, lng };
}
