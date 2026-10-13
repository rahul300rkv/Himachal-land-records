/**
 * Domain types and validation for land records.
 * DB row types live in ./database.ts; this file adds app-level types and zod schemas.
 */
import { z } from 'zod';
import type {
  AreaUnit,
  LandRecordRow,
  LandType,
  ListingRow,
  MutationRow,
  MutationType,
  ReportRow,
} from './database';

// ---------------------------------------------------------------------------
// Row aliases
// ---------------------------------------------------------------------------
export type LandRecord = LandRecordRow;
export type Mutation = MutationRow;
export type Listing = ListingRow;
export type Report = ReportRow;

/** A land record together with its mutation history (for the record detail page). */
export type LandRecordWithMutations = LandRecord & {
  mutations: Mutation[];
};

// ---------------------------------------------------------------------------
// Value lists (single source of truth for selects, filters and translations)
// ---------------------------------------------------------------------------
export const LAND_TYPES = [
  'irrigated',
  'unirrigated',
  'orchard',
  'residential',
  'commercial',
  'forest',
  'pasture',
  'barren',
  'other',
] as const satisfies readonly LandType[];

export const AREA_UNITS = [
  'sq_m',
  'hectare',
  'bigha',
  'biswa',
  'kanal',
  'marla',
  'acre',
] as const satisfies readonly AreaUnit[];

export const MUTATION_TYPES = [
  'sale',
  'inheritance',
  'gift',
  'partition',
  'lease',
  'mortgage',
  'court_order',
  'other',
] as const satisfies readonly MutationType[];

// ---------------------------------------------------------------------------
// Search
// ---------------------------------------------------------------------------
/** Empty strings from form inputs / URLs are treated as "not provided". */
const optionalText = z
  .string()
  .trim()
  .max(100)
  .optional()
  .transform((value) => (value ? value : undefined));

export const SEARCH_PAGE_SIZE = 20;

/**
 * Validated search query. A district is always required, plus at least one more
 * detail so that a search never tries to return a whole district.
 */
export const landRecordSearchSchema = z
  .object({
    district: z.string().trim().min(1),
    tehsil: optionalText,
    village: optionalText,
    khasraNumber: optionalText,
    khewatNumber: optionalText,
    khatauniNumber: optionalText,
    ownerName: optionalText,
    landType: z.enum(LAND_TYPES).optional(),
    jamabandiYear: z.number().int().min(1800).max(2200).optional(),
    page: z.number().int().min(1).max(1000).default(1),
  })
  .refine(
    (v) =>
      Boolean(
        v.tehsil || v.village || v.khasraNumber || v.khewatNumber || v.khatauniNumber || v.ownerName,
      ),
    { message: 'at_least_one_identifier', path: ['tehsil'] },
  );

export type LandRecordSearchInput = z.input<typeof landRecordSearchSchema>;
export type LandRecordSearchParams = z.output<typeof landRecordSearchSchema>;

// ---------------------------------------------------------------------------
// Shajra nasb (family tree) and marketplace
// ---------------------------------------------------------------------------
/** One person in the family tree stored under `raw_data.shajra_nasb`. */
export type ShajraNode = {
  name: string;
  relation?: string;
  deceased?: boolean;
  children?: ShajraNode[];
};

/** A listing as visible to logged-out visitors (no seller contact details). */
export type ListingPublic = Omit<ListingRow, 'contact_name' | 'contact_phone'>;

export type SellerContact = { name: string | null; phone: string | null };
