import 'server-only';
import villageDirectory from './hp-villages.json';

type VillageEntry = [english: string, local: string, code: string];
type VillageDirectory = Record<string, Record<string, VillageEntry[]>>;

const villages = villageDirectory as unknown as VillageDirectory;

export type VillageOption = { key: string; value: string; label: string };

/** Complete village list for one district + tehsil/sub-tehsil. */
export function getOfficialVillages(district: string, tehsil: string, locale: string): VillageOption[] {
  const entries = villages[district]?.[tehsil] ?? [];
  return entries.map(([english, local, code]) => ({
    key: code,
    value: english,
    label: `${locale === 'hi' && local ? `${local} — ${english}` : english} · ${code}`,
  }));
}
