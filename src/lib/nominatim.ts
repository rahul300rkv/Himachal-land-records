/**
 * Shared access to OpenStreetMap's free Nominatim service, for the place search and the
 * reverse lookup. Nominatim's usage policy asks for a real User-Agent that identifies the
 * site, at most one request a second, no search-as-you-type, and caching. The default
 * User-Agent below names the app and its public site address, so no personal data is sent.
 * NOMINATIM_USER_AGENT can override it, but it is optional.
 */
const USER_AGENT =
  process.env.NOMINATIM_USER_AGENT ?? 'HimLandCheck/1.0 (+https://himachal-land-records.vercel.app)';

let nextSlot = 0;
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function nominatim<T>(endpoint: 'search' | 'reverse', params: Record<string, string>): Promise<T> {
  const url = new URL(`https://nominatim.openstreetmap.org/${endpoint}`);
  url.search = new URLSearchParams(params).toString();

  // Keep to one request a second from this server instance, including requests that arrive together.
  const now = Date.now();
  const start = Math.max(now, nextSlot);
  nextSlot = start + 1100;
  if (start > now) await sleep(start - now);

  const response = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' },
    signal: AbortSignal.timeout(8_000),
  });
  if (!response.ok) throw new Error(`Nominatim ${response.status}`);
  return (await response.json()) as T;
}

export const NOMINATIM_CACHE = 'public, s-maxage=86400, stale-while-revalidate=604800';
