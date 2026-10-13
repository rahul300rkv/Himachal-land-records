import type { AreaUnit, LandType } from '@/types/database';

/**
 * Circle rates (minimum valuation rates notified by the district administration for
 * registration) are a PLACEHOLDER for now. Replace `getCircleRate` with a lookup against
 * your own table or an official data source. Reports already render whatever it returns.
 */
export type CircleRate =
  | { status: 'unavailable' }
  | { status: 'available'; perUnit: number; unit: AreaUnit; effectiveFrom: string; source: string };

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getCircleRate(_input: {
  district: string;
  tehsil: string;
  village: string;
  landType: LandType;
}): CircleRate {
  return { status: 'unavailable' };
}
