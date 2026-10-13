import type { Json } from '@/types/database';
import type { ShajraNode } from '@/types/land-record';

/**
 * Pure helpers for reading optional fields out of `land_records.raw_data` (free-form JSON).
 * No server-only imports, so they can be used by the PDF template and by pages alike.
 */
const asRecord = (value: Json | undefined): Record<string, Json | undefined> =>
  value && typeof value === 'object' && !Array.isArray(value) ? value : {};

const asText = (value: Json | undefined): string | undefined =>
  typeof value === 'string' && value.trim() ? value.trim().slice(0, 500) : undefined;

export type RecordExtras = { share?: string; cultivator?: string; areaText?: string; remarks?: string };

/** Optional jamabandi columns kept in raw_data (share, cultivator, area as written, remarks). */
export function extractExtras(raw: Json): RecordExtras {
  const data = asRecord(raw);
  return {
    share: asText(data.share),
    cultivator: asText(data.cultivator),
    areaText: asText(data.area_text),
    remarks: asText(data.remarks),
  };
}

const MAX_DEPTH = 8;
const MAX_NODES = 200;

/** Family tree from `raw_data.shajra_nasb`; null when absent or malformed. */
export function extractShajra(raw: Json): ShajraNode[] | null {
  let count = 0;

  const parse = (value: Json | undefined, depth: number): ShajraNode | null => {
    if (depth > MAX_DEPTH || count >= MAX_NODES) return null;
    const node = asRecord(value);
    const name = asText(node.name);
    if (!name) return null;
    count += 1;

    const children = Array.isArray(node.children)
      ? node.children.map((child) => parse(child, depth + 1)).filter((c): c is ShajraNode => c !== null)
      : [];

    return {
      name,
      relation: asText(node.relation),
      deceased: node.deceased === true,
      children: children.length ? children : undefined,
    };
  };

  const roots = asRecord(raw).shajra_nasb;
  if (!Array.isArray(roots)) return null;
  const tree = roots.map((root) => parse(root, 0)).filter((n): n is ShajraNode => n !== null);
  return tree.length ? tree : null;
}
