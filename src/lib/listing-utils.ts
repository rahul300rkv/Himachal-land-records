import { supabaseUrl } from '@/lib/supabase/config';
import type { ListingPublic } from '@/types/land-record';

/**
 * Pure listing helpers, kept free of server-only imports so both server components and
 * presentational components can use them without pulling the data layer into their graph.
 */

/** Public URL of a photo in the `listing-images` bucket. */
export function listingImageUrl(path: string) {
  return `${supabaseUrl}/storage/v1/object/public/listing-images/${path}`;
}

export type VerificationStatus = 'verified' | 'linked' | 'unlinked';

/** verified = our team did basic checks AND the listing is linked to a land record. */
export function verificationStatus(listing: Pick<ListingPublic, 'is_verified' | 'land_record_id'>): VerificationStatus {
  if (listing.land_record_id && listing.is_verified) return 'verified';
  if (listing.land_record_id) return 'linked';
  return 'unlinked';
}
