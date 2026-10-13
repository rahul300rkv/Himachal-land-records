import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { SAMPLE_RECORDS } from '@/lib/data/sample-records';
import {
  LAND_TYPES,
  SEARCH_PAGE_SIZE,
  landRecordSearchSchema,
  type LandRecord,
  type LandRecordSearchParams,
} from '@/types/land-record';

type RawParams = Record<string, string | string[] | undefined>;

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);
const text = (value: string | string[] | undefined) => first(value)?.trim() || undefined;
const int = (value: string | string[] | undefined) => {
  const n = Number.parseInt(first(value) ?? '', 10);
  return Number.isFinite(n) ? n : undefined;
};

/** Values to pre-fill the search form with (always plain strings). */
export type SearchDefaults = {
  district: string;
  tehsil: string;
  village: string;
  khasra: string;
  owner: string;
};

export type ParsedSearch =
  | { status: 'idle'; defaults: SearchDefaults }
  | { status: 'invalid'; defaults: SearchDefaults }
  | { status: 'ok'; defaults: SearchDefaults; query: LandRecordSearchParams };

/** Reads the URL query string of /search into a validated query. Bad values are dropped. */
export function parseSearchParams(raw: RawParams): ParsedSearch {
  const defaults: SearchDefaults = {
    district: text(raw.district) ?? '',
    tehsil: text(raw.tehsil) ?? '',
    village: text(raw.village) ?? '',
    khasra: text(raw.khasra) ?? '',
    owner: text(raw.owner) ?? '',
  };

  const hasAnyInput = Object.values(raw).some((v) => (Array.isArray(v) ? v.length : Boolean(v)));
  if (!hasAnyInput) return { status: 'idle', defaults };

  const type = text(raw.type);
  const parsed = landRecordSearchSchema.safeParse({
    district: defaults.district,
    tehsil: defaults.tehsil,
    village: defaults.village,
    khasraNumber: defaults.khasra,
    khewatNumber: text(raw.khewat),
    khatauniNumber: text(raw.khatauni),
    ownerName: defaults.owner,
    landType: LAND_TYPES.find((t) => t === type),
    jamabandiYear: int(raw.year),
    page: int(raw.page) ?? 1,
  });

  return parsed.success
    ? { status: 'ok', defaults, query: parsed.data }
    : { status: 'invalid', defaults };
}

export type SearchResult = {
  mode: 'live' | 'demo';
  records: LandRecord[];
  hasMore: boolean;
  page: number;
  error: boolean;
};

/** Escape characters that have a special meaning inside LIKE / ILIKE patterns. */
const escapeLike = (value: string) => value.replace(/[\\%_]/g, (c) => `\\${c}`);

export async function searchLandRecords(q: LandRecordSearchParams): Promise<SearchResult> {
  if (!isSupabaseConfigured) return demoSearch(q);

  try {
    const supabase = await createClient();
    let query = supabase.from('land_records').select('*').eq('district', q.district);

    if (q.tehsil) query = query.eq('tehsil', q.tehsil);
    if (q.village) query = query.ilike('village', `%${escapeLike(q.village)}%`);
    if (q.khasraNumber) query = query.eq('khasra_number', q.khasraNumber);
    if (q.khewatNumber) query = query.eq('khewat_number', q.khewatNumber);
    if (q.khatauniNumber) query = query.eq('khatauni_number', q.khatauniNumber);
    if (q.ownerName) query = query.ilike('owner_name', `%${escapeLike(q.ownerName)}%`);
    if (q.landType) query = query.eq('land_type', q.landType);
    if (q.jamabandiYear) query = query.eq('jamabandi_year', q.jamabandiYear);

    const from = (q.page - 1) * SEARCH_PAGE_SIZE;
    // Ask for one extra row so we know whether a next page exists.
    const { data, error } = await query
      .order('jamabandi_year', { ascending: false })
      .order('village')
      .order('khasra_number')
      .range(from, from + SEARCH_PAGE_SIZE);

    if (error) throw error;

    const rows = data ?? [];
    return {
      mode: 'live',
      records: rows.slice(0, SEARCH_PAGE_SIZE),
      hasMore: rows.length > SEARCH_PAGE_SIZE,
      page: q.page,
      error: false,
    };
  } catch (error) {
    console.error('Land record search failed', error);
    return { mode: 'live', records: [], hasMore: false, page: q.page, error: true };
  }
}

function demoSearch(q: LandRecordSearchParams): SearchResult {
  const contains = (value: string | null, needle?: string) =>
    !needle || (value ?? '').toLowerCase().includes(needle.toLowerCase());

  const matches = SAMPLE_RECORDS.filter(
    (r) =>
      r.district === q.district &&
      (!q.tehsil || r.tehsil === q.tehsil) &&
      contains(r.village, q.village) &&
      (!q.khasraNumber || r.khasra_number === q.khasraNumber) &&
      (!q.khewatNumber || r.khewat_number === q.khewatNumber) &&
      (!q.khatauniNumber || r.khatauni_number === q.khatauniNumber) &&
      contains(r.owner_name, q.ownerName) &&
      (!q.landType || r.land_type === q.landType) &&
      (!q.jamabandiYear || r.jamabandi_year === q.jamabandiYear),
  );

  const from = (q.page - 1) * SEARCH_PAGE_SIZE;
  return {
    mode: 'demo',
    records: matches.slice(from, from + SEARCH_PAGE_SIZE),
    hasMore: matches.length > from + SEARCH_PAGE_SIZE,
    page: q.page,
    error: false,
  };
}

/** Distinct village names for a district + tehsil (powers the village suggestions). */
export async function listVillages(district: string, tehsil: string): Promise<string[]> {
  const unique = (names: (string | null)[]) =>
    [...new Set(names.filter((n): n is string => Boolean(n)))].sort((a, b) => a.localeCompare(b));

  if (!isSupabaseConfigured) {
    return unique(
      SAMPLE_RECORDS.filter((r) => r.district === district && r.tehsil === tehsil).map((r) => r.village),
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('land_records')
    .select('village')
    .eq('district', district)
    .eq('tehsil', tehsil)
    .limit(2000);

  if (error) throw error;
  return unique((data ?? []).map((r) => r.village));
}
