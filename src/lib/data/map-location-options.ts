export type Option = { value: string; label: string };

export type LocationCodes = { district: string; tehsil: string; village: string };

export async function loadMapLocations(level: 'districts' | 'tehsils' | 'villages', district?: string, tehsil?: string): Promise<Option[]> {
  const params = new URLSearchParams();
  if (district) params.set('districtId', district);
  if (tehsil) params.set('tehsilId', tehsil);
  const response = await fetch(`/api/bhunaksha/locations?${params}`);
  if (!response.ok) throw new Error('Location catalog unavailable');
  const data = await response.json() as Record<string, { id: string; name: string; hi?: string }[]>;
  return (data[level] ?? []).map(({ id, name, hi }) => ({ value: id, label: hi ?? name }));
}
