export type Deed = 'sale' | 'gift' | 'lease';

export function estimateStampDuty(input: {
  deed: Deed;
  market: number;
  consideration: number;
  woman: boolean;
  familyGift: boolean;
  section118: boolean;
  leaseYears: number;
  indefinite: boolean;
  earlierValue: number;
}) {
  const { deed, market, consideration, woman, familyGift, section118, leaseYears, indefinite, earlierValue } = input;
  const roundDuty = (amount: number) => Math.max(100, Math.round(amount / 10) * 10);
  const value = deed === 'gift' || (deed === 'lease' && !indefinite)
    ? market
    : Math.max(market, consideration);

  if (deed === 'gift' && familyGift) {
    return { value, rate: 0.1, duty: Math.min(10_000, Math.max(5_000, value * 0.001)), linked: false };
  }
  if (deed === 'lease') {
    const rate = section118 ? 12 : 8;
    const factor = indefinite ? 1 : leaseYears / 100;
    return { value, rate, duty: roundDuty(value * rate / 100 * factor), linked: false };
  }
  if (deed === 'sale' && section118) {
    return { value, rate: 12, duty: roundDuty(value * 0.12), linked: false };
  }
  const threshold = woman ? 10_000_000 : 4_000_000;
  const linked = earlierValue > 0 && value + earlierValue > threshold;
  const rate = linked || value > threshold ? 8 : woman ? 4 : 6;
  return { value, rate, duty: roundDuty(value * rate / 100), linked };
}

/**
 * Registration fee for the deed types this calculator covers.
 * Sale (conveyance) and gift deeds: 2% of the higher of market value and
 * consideration, minimum Rs 100, rounded to the nearest Rs 10.
 * Miscellaneous documents (partition, release, settlement, exchange, transfer of
 * lease, mortgage without possession and similar) carry a separate 0.05% fee and
 * are not covered here. A fresh lease deed has no rate in the departmental
 * letter, so it returns null and the Sub-Registrar's quote must be entered.
 */
export const REGISTRATION_FEE_RATE = 2;

export function estimateRegistrationFee(deed: Deed, value: number): number | null {
  if (deed === 'lease') return null;
  return Math.max(100, Math.round((value * REGISTRATION_FEE_RATE) / 100 / 10) * 10);
}