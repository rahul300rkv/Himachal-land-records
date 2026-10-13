import 'server-only';
import { HP_DISTRICTS } from '@/lib/data/districts';
import { SAMPLE_CONTACT, SAMPLE_LISTINGS } from '@/lib/data/sample-records';
import { verificationStatus } from '@/lib/listing-utils';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { createClient } from '@/lib/supabase/server';
import { AREA_UNITS, LAND_TYPES, type ListingPublic, type SellerContact } from '@/types/land-record';
import type { AreaUnit, LandType } from '@/types/database';

export const LISTINGS_PAGE_SIZE = 12;

/**
 * Columns visible to everyone. Seller contact columns are deliberately absent: logged-out
 * visitors are not allowed to read them (see migration 002). Never use `select('*')`.
 */
export const LISTING_PUBLIC_COLUMNS =
  'id, seller_id, land_record_id, title, description, district, tehsil, village, price, price_negotiable, area, area_unit, land_type, images, latitude, longitude, status, is_verified, is_featured, expires_at, created_at, updated_at';

export { listingImageUrl, verificationStatus, type VerificationStatus } from '@/lib/listing-utils';

// ---------------------------------------------------------------------------
// Query parsing
// ---------------------------------------------------------------------------
type RawParams = Record<string, string | string[] | undefined>;
const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)?.trim() || undefined;
const num = (v: string | string[] | undefined) => {
  const n = Number.parseFloat(first(v) ?? '');
  return Number.isFinite(n) && n >= 0 ? n : undefined;
};

export type ListingSort = 'new' | 'price_asc' | 'price_desc';

export type ListingQuery = {
  district?: string;
  priceMin?: number;
  priceMax?: number;
  areaMin?: number;
  areaMax?: number;
  areaUnit?: AreaUnit;
  landType?: LandType;
  verifiedOnly: boolean;
  sort: ListingSort;
  page: number;
};

export function parseListingParams(raw: RawParams): ListingQuery {
  const district = first(raw.district);
  const type = first(raw.type);
  const unit = first(raw.unit);
  const sort = first(raw.sort);
  const page = Number.parseInt(first(raw.page) ?? '1', 10);
  const hasArea = num(raw.amin) !== undefined || num(raw.amax) !== undefined;

  return {
    district: HP_DISTRICTS.find((d) => d.value === district)?.value,
    priceMin: num(raw.pmin),
    priceMax: num(raw.pmax),
    // Areas in different units are not comparable, so an area range always needs a unit.
    areaMin: hasArea ? num(raw.amin) : undefined,
    areaMax: hasArea ? num(raw.amax) : undefined,
    areaUnit: hasArea ? (AREA_UNITS.find((u) => u === unit) ?? 'bigha') : undefined,
    landType: LAND_TYPES.find((t) => t === type),
    verifiedOnly: first(raw.verified) === '1',
    sort: sort === 'price_asc' || sort === 'price_desc' ? sort : 'new',
    page: Number.isFinite(page) && page >= 1 && page <= 1000 ? page : 1,
  };
}

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------
export type ListingsResult = {
  mode: 'live' | 'demo';
  listings: ListingPublic[];
  hasMore: boolean;
  page: number;
  error: boolean;
};

export async function searchListings(q: ListingQuery): Promise<ListingsResult> {
  if (!isSupabaseConfigured) return demoSearch(q);

  try {
    const supabase = await createClient();
    const nowIso = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');

    let query = supabase
      .from('listings')
      .select(LISTING_PUBLIC_COLUMNS)
      .eq('status', 'active')
      .or(`expires_at.is.null,expires_at.gt.${nowIso}`);

    if (q.district) query = query.eq('district', q.district);
    if (q.priceMin !== undefined) query = query.gte('price', q.priceMin);
    if (q.priceMax !== undefined) query = query.lte('price', q.priceMax);
    if (q.areaUnit) {
      query = query.eq('area_unit', q.areaUnit);
      if (q.areaMin !== undefined) query = query.gte('area', q.areaMin);
      if (q.areaMax !== undefined) query = query.lte('area', q.areaMax);
    }
    if (q.landType) query = query.eq('land_type', q.landType);
    if (q.verifiedOnly) query = query.eq('is_verified', true).not('land_record_id', 'is', null);

    if (q.sort === 'price_asc') query = query.order('price', { ascending: true });
    else if (q.sort === 'price_desc') query = query.order('price', { ascending: false });
    else query = query.order('is_featured', { ascending: false }).order('created_at', { ascending: false });

    const from = (q.page - 1) * LISTINGS_PAGE_SIZE;
    const { data, error } = await query.range(from, from + LISTINGS_PAGE_SIZE);
    if (error) throw error;

    const rows = (data ?? []) as unknown as ListingPublic[];
    return {
      mode: 'live',
      listings: rows.slice(0, LISTINGS_PAGE_SIZE),
      hasMore: rows.length > LISTINGS_PAGE_SIZE,
      page: q.page,
      error: false,
    };
  } catch (error) {
    console.error('Listing search failed', error);
    return { mode: 'live', listings: [], hasMore: false, page: q.page, error: true };
  }
}

function demoSearch(q: ListingQuery): ListingsResult {
  const matches = SAMPLE_LISTINGS.filter(
    (l) =>
      (!q.district || l.district === q.district) &&
      (q.priceMin === undefined || l.price >= q.priceMin) &&
      (q.priceMax === undefined || l.price <= q.priceMax) &&
      (!q.areaUnit ||
        (l.area_unit === q.areaUnit &&
          (q.areaMin === undefined || l.area >= q.areaMin) &&
          (q.areaMax === undefined || l.area <= q.areaMax))) &&
      (!q.landType || l.land_type === q.landType) &&
      (!q.verifiedOnly || verificationStatus(l) === 'verified'),
  ).sort((a, b) =>
    q.sort === 'price_asc'
      ? a.price - b.price
      : q.sort === 'price_desc'
        ? b.price - a.price
        : Number(b.is_featured) - Number(a.is_featured) || b.created_at.localeCompare(a.created_at),
  );

  const from = (q.page - 1) * LISTINGS_PAGE_SIZE;
  return {
    mode: 'demo',
    listings: matches.slice(from, from + LISTINGS_PAGE_SIZE),
    hasMore: matches.length > from + LISTINGS_PAGE_SIZE,
    page: q.page,
    error: false,
  };
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** One listing (RLS decides visibility: active ones for everyone, others for their owner). */
export async function getListing(id: string): Promise<{ mode: 'live' | 'demo'; listing: ListingPublic } | null> {
  if (!isSupabaseConfigured) {
    const listing = SAMPLE_LISTINGS.find((l) => l.id === id);
    return listing ? { mode: 'demo', listing } : null;
  }
  if (!UUID.test(id)) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('listings')
    .select(LISTING_PUBLIC_COLUMNS)
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data ? { mode: 'live', listing: data as unknown as ListingPublic } : null;
}

/**
 * Seller contact details. Only works for logged-in users: the database refuses these
 * columns to anonymous requests. Call it only when the visitor is logged in.
 */
export async function getSellerContact(id: string): Promise<SellerContact | null> {
  if (!isSupabaseConfigured) return SAMPLE_LISTINGS.some((l) => l.id === id) ? SAMPLE_CONTACT : null;
  if (!UUID.test(id)) return null;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('listings')
      .select('contact_name, contact_phone')
      .eq('id', id)
      .maybeSingle();
    if (error || !data) return null;
    return { name: data.contact_name, phone: data.contact_phone };
  } catch {
    return null;
  }
}
