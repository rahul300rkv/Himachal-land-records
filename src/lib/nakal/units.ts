/**
 * Area units for Himachal Pradesh records.
 * Nakal areas are metric ha-are-sqm: "00-07-15" = 0 ha, 7 are, 15 sq m = 715 sq m.
 * Marla/kanal values match the existing land converter (LandConverter.tsx).
 */
export const SQM_PER_MARLA = 19.2;
export const MARLA_PER_KANAL = 20;
export const SQM_PER_KANAL = SQM_PER_MARLA * MARLA_PER_KANAL; // 384

/** "00-07-15" -> 715. Returns null when the string is not three numbers. */
export function parseHaAreSqm(value: string | null | undefined): number | null {
  const parts = value?.match(/\d+/g);
  if (!parts || parts.length !== 3) return null;
  const [ha, are, sqm] = parts.map(Number);
  return ha * 10_000 + are * 100 + sqm;
}

export function sqmToKanalMarla(sqm: number) {
  const kanal = Math.floor(sqm / SQM_PER_KANAL);
  const rest = sqm - kanal * SQM_PER_KANAL;
  const marla = Math.floor(rest / SQM_PER_MARLA + 1e-9);
  const left = rest - marla * SQM_PER_MARLA;
  return { kanal, marla, sqm: Math.round(left * 100) / 100 };
}
