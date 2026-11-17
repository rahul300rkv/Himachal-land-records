const base = 'https://ngdrshp.gov.in/NGDRS_HP_LIVE/';
const reportUrl = new URL('MISReports/rpt_publiccirclerates', base);

export const meghDistricts = [
  ['10', 'Bilaspur'], ['11', 'Chamba'], ['12', 'Hamirpur'], ['13', 'Kangra'],
  ['17', 'Kinnaur'], ['14', 'Kullu'], ['19', 'Lahaul-Spiti'], ['9', 'Mandi'],
  ['8', 'Shimla'], ['15', 'Sirmaur'], ['18', 'Solan'], ['16', 'Una'],
] as const;

export type MeghOffice = { id: string; name: string };
export type MeghReport = { office: string; file: string; uploaded: string; url: string };

function decode(text: string) {
  const entities: Record<string, string> = { amp: '&', quot: '"', apos: "'", lt: '<', gt: '>', nbsp: ' ' };
  return text.replace(/&(#x[\da-f]+|#\d+|\w+);/gi, (match, entity: string) => {
    if (!entity.startsWith('#')) return entities[entity] ?? match;
    const hex = entity[1].toLowerCase() === 'x';
    const value = Number.parseInt(entity.slice(hex ? 2 : 1), hex ? 16 : 10);
    return value <= 0x10ffff ? String.fromCodePoint(value) : match;
  });
}

function attribute(tag: string, name: string) {
  const match = tag.match(new RegExp(`\\s${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`, 'i'));
  return match ? decode(match[1] ?? match[2]) : undefined;
}

async function meghFetch(url: URL, init?: RequestInit) {
  const result = await fetch(url, {
    ...init,
    cache: 'no-store',
    redirect: 'error',
    signal: AbortSignal.timeout(8000),
  });
  if (!result.ok) throw new Error(`MEGH returned ${result.status}`);
  return result;
}

export async function getMeghOffices(district: string): Promise<MeghOffice[]> {
  const url = new URL('MISReports/get_office_name', base);
  url.searchParams.set('district', district);
  const response = await meghFetch(url, { headers: { Referer: reportUrl.href, 'X-Requested-With': 'XMLHttpRequest' } });
  const entries: unknown = await response.json();
  if (!entries || typeof entries !== 'object' || Array.isArray(entries)) throw new Error('Unexpected MEGH office response');
  return Object.entries(entries)
    .filter(([id, name]) => /^\d+$/.test(id) && id !== '0' && typeof name === 'string' && name.trim() !== '')
    .map(([id, name]) => ({ id, name: (name as string).trim() }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function getMeghReports(district: string, office: string): Promise<MeghReport[]> {
  const formResponse = await meghFetch(reportUrl);
  const html = await formResponse.text();
  const form = [...html.matchAll(/<form\b[^>]*>[\s\S]*?<\/form>/gi)]
    .find(([markup]) => attribute(markup.split('>')[0], 'id') === 'rpt_publiccirclerates')?.[0];
  if (!form) throw new Error('MEGH lookup form missing');

  const body = new URLSearchParams();
  for (const [tag] of form.matchAll(/<input\b[^>]*>/gi)) {
    if (attribute(tag, 'type') !== 'hidden') continue;
    const name = attribute(tag, 'name');
    if (name) body.set(name, attribute(tag, 'value') ?? '');
  }
  body.set('data[rpt_publiccirclerates][district_id]', district);
  body.set('data[rpt_publiccirclerates][office_id]', office);
  const cookie = (formResponse.headers.getSetCookie?.() ?? [])
    .map((header) => header.split(';', 1)[0]).join('; ');
  const response = await meghFetch(reportUrl, {
    method: 'POST',
    headers: { Origin: reportUrl.origin, Referer: reportUrl.href, ...(cookie ? { Cookie: cookie } : {}) },
    body,
  });
  const result = await response.text();
  if (!/id=["']rpt_publiccirclerates["']/i.test(result)) throw new Error('MEGH response missing report form');
  const reports: MeghReport[] = [];

  for (const [row] of result.matchAll(/<tr\b[^>]*>[\s\S]*?<\/tr>/gi)) {
    const link = [...row.matchAll(/<a\b[^>]*>/gi)]
      .map(([tag]) => attribute(tag, 'href'))
      .find((href) => href?.startsWith('/NGDRS_HP_LIVE/Registration/rate_download/'));
    if (!link) continue;
    const url = new URL(link, base);
    if (url.origin !== reportUrl.origin || !/^\/NGDRS_HP_LIVE\/Registration\/rate_download\/[\w%+=-]+\/\d+$/.test(url.pathname)) continue;

    const cells = [...row.matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/gi)]
      .map(([, cell]) => decode(cell.replace(/<[^>]*>/g, '')).trim());
    if (cells.length >= 4) reports.push({ office: cells[0], file: cells[1], uploaded: cells[2], url: url.href });
  }
  return reports;
}
