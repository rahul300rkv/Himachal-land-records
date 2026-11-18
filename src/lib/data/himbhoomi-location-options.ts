export type Option = { value: string; label: string };

export type LocationCodes = { district: string; tehsil: string; village: string };

export async function loadOfficialLocations(level: 'districts' | 'tehsils' | 'villages' | 'years', district?: string, tehsil?: string, village?: string): Promise<Option[]> {
  const response = await fetch('/api/himbhoomi', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: level, district, tehsil, village }),
  });
  const data = await response.json() as { options?: Option[]; error?: string };
  if (!response.ok) throw new Error(data.error || 'HimBhoomi is unavailable');
  return data.options ?? [];
}
