import subdistricts from './hp-subdistricts.json';

export type Named = { value: string; hi: string };
export type District = Named & { tehsils: readonly Named[] };

const DISTRICT_HI: Record<string, string> = {
  Bilaspur: 'बिलासपुर',
  Chamba: 'चंबा',
  Hamirpur: 'हमीरपुर',
  Kangra: 'कांगड़ा',
  Kinnaur: 'किन्नौर',
  Kullu: 'कुल्लू',
  'Lahaul and Spiti': 'लाहौल और स्पीति',
  Mandi: 'मंडी',
  Shimla: 'शिमला',
  Sirmaur: 'सिरमौर',
  Solan: 'सोलन',
  Una: 'ऊना',
};

/**
 * Complete district and tehsil/sub-tehsil hierarchy imported from the supplied
 * Himachal Pradesh village directory (15 November 2026).
 *
 * The source workbook does not contain local-language sub-district names, so
 * those labels intentionally fall back to their canonical English values.
 */
export const HP_DISTRICTS: readonly District[] = Object.entries(subdistricts).map(
  ([district, tehsils]) => ({
    value: district,
    hi: DISTRICT_HI[district] ?? district,
    tehsils: tehsils.map((tehsil) => ({ value: tehsil, hi: tehsil })),
  }),
);

const label = (item: Named | undefined, fallback: string, locale: string) =>
  item ? (locale === 'hi' ? item.hi : item.value) : fallback;

/** Tehsils and sub-tehsils for a canonical English district name. */
export function getTehsils(district: string): readonly Named[] {
  return HP_DISTRICTS.find((item) => item.value === district)?.tehsils ?? [];
}

export function districtLabel(value: string, locale: string) {
  return label(
    HP_DISTRICTS.find((district) => district.value === value),
    value,
    locale,
  );
}

export function tehsilLabel(district: string, value: string, locale: string) {
  return label(
    getTehsils(district).find((tehsil) => tehsil.value === value),
    value,
    locale,
  );
}

export function isValidTehsil(district: string, tehsil: string) {
  return getTehsils(district).some((item) => item.value === tehsil);
}
