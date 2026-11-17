import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const API = 'https://api.mypatta.com/api/v1/hp/bhunaksha';
const output = resolve('src/lib/data/bhunaksha-locations.json');
const districtEnglish = {
  '01': 'Chamba',
  '02': 'Kangra',
  '03': 'Hamirpur',
  '04': 'Una',
  '05': 'Bilaspur',
  '06': 'Mandi',
  '07': 'Kullu',
  '08': 'Lahaul and Spiti',
  '09': 'Shimla',
  '10': 'Solan',
  '11': 'Sirmaur',
  '12': 'Kinnaur',
};

async function get(path) {
  const response = await fetch(`${API}${path}`);
  if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`);
  const body = await response.json();
  return body.data ?? [];
}

const districts = await get('/districts');
const catalog = [];

for (const district of districts) {
  const tehsils = await get(`/tehsils?districtId=${district.districtId}`);
  const units = [];
  for (const tehsil of tehsils) {
    const villages = await get(`/villages?districtId=${district.districtId}&tehsilId=${tehsil.tehsilId}`);
    units.push({
      id: tehsil.tehsilId,
      name: tehsil.tehsilName,
      villages: villages.map((village) => ({ id: village.villageId, name: village.villageName })),
    });
  }
  catalog.push({
    id: district.districtId,
    name: districtEnglish[district.districtId] ?? district.districtName,
    hi: district.districtName,
    tehsils: units,
  });
}

catalog.sort((a, b) => a.id.localeCompare(b.id));
await mkdir(dirname(output), { recursive: true });
await writeFile(output, `${JSON.stringify(catalog)}\n`, 'utf8');
console.log(`Saved ${catalog.length} districts to ${output}`);
