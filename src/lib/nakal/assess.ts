/**
 * Deterministic risk rules. The AI model only READS the document (see extract.ts);
 * every flag and the score below come from plain code so they are explainable and testable.
 * Flags carry a code + params; the text is translated in src/messages/*.json (NakalCheck.flags).
 */
import type { RawNakal } from './schema';
import { parseHaAreSqm, sqmToKanalMarla } from './units';

export type Severity = 'critical' | 'high' | 'medium' | 'low';
export type FlagCode =
  | 'SHARE_MISMATCH'
  | 'PENDING_CASE'
  | 'SALE_AFTER_CASE'
  | 'MANY_COOWNERS'
  | 'COOWNERS'
  | 'RAPID_TRANSFERS'
  | 'MUTATION_EXCEEDS_AREA'
  | 'AGRI_LAND'
  | 'LOW_CONFIDENCE'
  | 'EXTRACTION_INCOMPLETE';

export type Flag = {
  code: FlagCode;
  severity: Severity;
  penalty: number;
  params: Record<string, string | number>;
};
export type Band = 'low' | 'moderate' | 'high';

export type AssessResult = {
  score: number;
  band: Band;
  flags: Flag[];
  summary: {
    refNo: string | null;
    khata: string | null;
    village: string | null;
    tehsil: string | null;
    areaSqm: number;
    area: { kanal: number; marla: number; sqm: number };
    shareHolders: number;
    mutationCount: number;
    pendingCases: number;
  };
  owners: { names: string; shareNum: number | null; sharePct: number | null }[];
};

const RECENT_MONTHS = 24;
const RAPID_LIMIT = 4;
const AGRI_WORDS = [
  'खेतर', 'खादेतर', 'खेती', 'कृषि', 'सेरी', 'बराणी', 'बाराणी', 'अव्वल', 'दोयम', 'सोयम',
  'बागीचा', 'बगीचा', 'agri', 'irrigated',
];

/** dd/mm/yyyy -> Date (UTC) */
function parseDmy(s: string | null): Date | null {
  const m = s?.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!m) return null;
  const d = new Date(Date.UTC(Number(m[3]), Number(m[2]) - 1, Number(m[1])));
  return Number.isNaN(d.getTime()) ? null : d;
}
function parseIso(s: string | null): Date | null {
  const d = s ? new Date(s) : null;
  return d && !Number.isNaN(d.getTime()) ? d : null;
}
const isPending = (status: string | null) => /pending|लंबित|विचाराधीन/i.test(status ?? '');

export function assess(raw: RawNakal, now: Date = new Date()): AssessResult {
  const flags: Flag[] = [];
  const add = (code: FlagCode, severity: Severity, penalty: number, params = {}) =>
    flags.push({ code, severity, penalty, params });

  const shares = raw.owners.map((o) => o.share_num).filter((n): n is number => n !== null);
  const sum = shares.reduce((a, b) => a + b, 0);

  // 1. Could we read the essentials?
  if (raw.owners.length === 0 || raw.total_share === null) add('EXTRACTION_INCOMPLETE', 'high', 20);

  // 2. Share arithmetic
  if (raw.total_share !== null && raw.owners.length > 0 && sum !== raw.total_share) {
    add('SHARE_MISMATCH', 'critical', 40, { sum, total: raw.total_share });
  }

  // 3. Pending litigation, and transfers made after a case was filed
  const pending = raw.litigation.filter((l) => isPending(l.status));
  for (const l of pending) {
    const partition = /partition|बंटवारा|तक़सीम|तकसीम/i.test(l.case_type ?? '');
    add('PENDING_CASE', partition ? 'critical' : 'high', partition ? 35 : 25, {
      caseNo: l.case_no ?? '?',
      caseType: l.case_type ?? '?',
      court: l.court ?? '?',
      filedOn: l.filed_on ?? '?',
    });
    const filed = parseIso(l.filed_on);
    if (!filed) continue;
    for (const m of raw.mutations) {
      const d = parseDmy(m.date);
      if ((m.kind === 'sale' || m.kind === 'gift') && d && d > filed) {
        add('SALE_AFTER_CASE', 'critical', 30, { number: m.number ?? '?', date: m.date ?? '?' });
      }
    }
  }

  // 4. Many joint holders
  const holders = raw.owners.length;
  if (holders >= 5) add('MANY_COOWNERS', 'high', 15, { count: holders });
  else if (holders >= 3) add('COOWNERS', 'medium', 8, { count: holders });

  // 5. Rapid recent transfers
  const cutoff = new Date(now);
  cutoff.setMonth(cutoff.getMonth() - RECENT_MONTHS);
  const recent = raw.mutations.filter((m) => {
    const d = parseDmy(m.date);
    return (m.kind === 'sale' || m.kind === 'gift') && d && d >= cutoff && d <= now;
  });
  if (recent.length >= RAPID_LIMIT) {
    add('RAPID_TRANSFERS', 'high', 15, { count: recent.length, months: RECENT_MONTHS });
  }

  // 6. A mutation cannot move more land than the record holds
  const areaSqm = raw.khasras.reduce((a, k) => a + (parseHaAreSqm(k.area) ?? 0), 0);
  if (areaSqm > 0) {
    for (const m of raw.mutations) {
      const a = parseHaAreSqm(m.area);
      if (a !== null && a > areaSqm) add('MUTATION_EXCEEDS_AREA', 'high', 25, { number: m.number ?? '?' });
    }
  }

  // 7. Agricultural land: Section 118 (HP Tenancy and Land Reforms Act) applies to non-agriculturists
  if (raw.khasras.some((k) => AGRI_WORDS.some((w) => (k.land_class ?? '').toLowerCase().includes(w)))) {
    add('AGRI_LAND', 'low', 5);
  }

  // 8. Reader unsure
  if (raw.low_confidence_fields.length >= 3) {
    add('LOW_CONFIDENCE', 'medium', 10, { count: raw.low_confidence_fields.length });
  }

  flags.sort((a, b) => b.penalty - a.penalty);
  let score = Math.max(0, 100 - flags.reduce((a, f) => a + f.penalty, 0));
  if (flags.some((f) => f.severity === 'critical')) score = Math.min(score, 45); // a critical flag caps the score
  const band: Band = score >= 80 ? 'low' : score >= 55 ? 'moderate' : 'high';

  return {
    score,
    band,
    flags,
    summary: {
      refNo: raw.ref_no,
      khata: raw.khata_no,
      village: raw.village,
      tehsil: raw.tehsil,
      areaSqm,
      area: sqmToKanalMarla(areaSqm),
      shareHolders: holders,
      mutationCount: raw.mutations.length,
      pendingCases: pending.length,
    },
    owners: raw.owners.map((o) => ({
      names: o.names ?? '',
      shareNum: o.share_num,
      sharePct: o.share_num !== null && raw.total_share ? (o.share_num / raw.total_share) * 100 : null,
    })),
  };
}
