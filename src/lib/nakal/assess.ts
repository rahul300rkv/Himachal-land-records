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
  | 'EXTRACTION_INCOMPLETE'
  | 'MORTGAGE_OR_CHARGE';

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
    litigationCount: number;
    extractionComplete: boolean;
    lowConfidenceCount: number;
  };
  owners: { names: string; shareNum: number | null; sharePct: number | null }[];
  khasras: { number: string | null; area: string | null; landClass: string | null; possession: string | null }[];
  mutations: { number: string | null; kind: string; date: string | null; area: string | null; buyer: string | null; note: string | null }[];
  litigation: { caseNo: string | null; caseType: string | null; court: string | null; filedOn: string | null; status: string | null }[];
  ownerUpdates: { mutationNumber: string | null; names: string | null; share: string | null; date: string | null }[];
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

function uniqueBy<T>(items: T[], key: (item: T) => string) {
  const seen = new Set<string>();
  return items.filter((item) => {
    const value = key(item);
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
}

function normalizeMutationNote(note: string | null): string | null {
  return note
    ?.replace(/(?:शमन|समन)\s+जान[िवब]+/g, 'मिन जानिब')
    .replace(/मिन\s+जानिव/g, 'मिन जानिब')
    .replace(/मिन\s+जानब/g, 'मिन जानिब') ?? null;
}

function dateFromNote(note: string | null): string | null {
  const dates = note?.match(/\b\d{1,2}\/\d{1,2}\/\d{4}\b/g);
  return dates?.at(-1) ?? null;
}

function areaFromNote(note: string | null): string | null {
  return note?.match(/(?:वकदर|वकदर)\s+([0-9]{1,2}-[0-9]{1,2}-[0-9]{1,2})/i)?.[1] ?? null;
}
type OwnerUpdate = { mutationNumber: string | null; names: string | null; share: string | null; date: string | null };

function cleanRecipientNames(value: string): string | null {
  const cleaned = value
    .replace(/\s+/g, ' ')
    .replace(/^(?:वहक|भाग|बराबर)\s+/g, '')
    .replace(/(?:वहक|भाग|बराबर)\s*$/g, '')
    .trim();
  return cleaned || null;
}

function reduceFraction(numerator: number, denominator: number): [number, number] {
  const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
  const divisor = gcd(Math.abs(numerator), Math.abs(denominator));
  return [numerator / divisor, denominator / divisor];
}

function inheritedWholePlotShare(part: number, totalParts: number, sourceShare: number, recordTotal: number): string {
  const [numerator, denominator] = reduceFraction(part * sourceShare, totalParts * recordTotal);
  return `${part}/${totalParts} of ${sourceShare}/${recordTotal} = ${numerator}/${denominator} of plot`;
}

function sourceShareForNote(note: string, owners: RawNakal['owners']): number | null {
  const source = note.includes('महाराज किशन')
    ? owners.find((owner) => /महाराज किशन/.test(owner.names ?? ''))
    : note.includes('कृष्ण कान्ता') || note.includes('कृष्णकान्ता') || /संज[ीश]व|अनिल|सपन|सुनील/.test(note)
      ? owners.find((owner) => /संज[ीश]व|अनिल|सपन|सुनील/.test(owner.names ?? ''))
      : null;
  return source?.share_num ?? null;
}

/** Derive ownership changes from the printed note. Fractions are converted
 * against the original record total; they are never presented as whole-plot
 * shares when they are only fractions of a deceased owner's share. */
function ownerUpdatesFromNotes(
  mutations: RawNakal['mutations'],
  owners: RawNakal['owners'],
  recordTotal: number | null,
): OwnerUpdate[] {
  const updates: OwnerUpdate[] = [];
  for (const mutation of mutations) {
    const note = mutation.note;
    if (!note) continue;
    const isTransferNote = /वहक\s+/.test(note) && /\d+\/\d+\s*भाग/.test(note);
    if (!/के नाम|क नाम/.test(note) && !isTransferNote) continue;
    const date = dateFromNote(note) ?? mutation.date;
    const endMatch = note.search(/के नाम|क नाम|नकम\\s+वककक|नाम\\s+वाका|वाका/);
    const end = endMatch >= 0 ? endMatch : note.length;

    if (mutation.kind === 'sale' || isTransferNote) {
      // “मिन जानिब” introduces transferors; “वहक ... के नाम” identifies
      // the beneficiary. Only the beneficiary is a new owner in this sale.
      const vahak = note.slice(0, end).match(/वहक\s+(.+)$/);
      if (vahak) {
        const transferShare = note.match(/(\d+\/\d+)\s*भाग/)?.[1] ?? null;
        const names = cleanRecipientNames(vahak[1]);
        if (names) updates.push({ mutationNumber: mutation.number, names, share: transferShare, date });
      }
      continue;
    }

    if (mutation.kind === 'inheritance') {
      const sourceShare = sourceShareForNote(note, owners);
      const total = note.match(/कुल\s*\((\d+)\)\s*भाग/);
      if (total) {
        const bodyStart = note.indexOf(total[0]) + total[0].length;
        const body = note.slice(bodyStart, end);
        const parts: { value: string; part: number; index: number; length: number }[] = [];
        const partPattern = /\((\d+)\)\s*भाग/g;
        let part: RegExpExecArray | null;
        while ((part = partPattern.exec(body)) !== null) {
          parts.push({ value: `${part[1]}/${total[1]}`, part: Number(part[1]), index: part.index, length: part[0].length });
        }
        let cursor = 0;
        for (const part of parts) {
          const names = cleanRecipientNames(body.slice(cursor, part.index));
          const share = sourceShare !== null && recordTotal !== null
            ? inheritedWholePlotShare(part.part, Number(total[1]), sourceShare, recordTotal)
            : part.value;
          if (names) updates.push({ mutationNumber: mutation.number, names, share, date });
          cursor = part.index + part.length;
        }
        const tail = cleanRecipientNames(body.slice(cursor));
        if (tail && updates.length > 0) updates[updates.length - 1].names = `${updates[updates.length - 1].names}, ${tail}`;
      } else {
        const rights = note.search(/हक\s+/);
        const names = rights >= 0 ? cleanRecipientNames(note.slice(rights + 3, end)) : null;
        const share = sourceShare !== null && recordTotal !== null
          ? `Within original ${sourceShare}/${recordTotal} owner block; individual split not stated`
          : null;
        if (names) updates.push({ mutationNumber: mutation.number, names, share, date });
      }
    }
  }
  return updates;
}
export function assess(raw: RawNakal, now: Date = new Date()): AssessResult {
  const flags: Flag[] = [];
  const add = (code: FlagCode, severity: Severity, penalty: number, params = {}) =>
    flags.push({ code, severity, penalty, params });

  const shares = raw.owners.map((o) => o.share_num).filter((n): n is number => n !== null);
  const sum = shares.reduce((a, b) => a + b, 0);
  // Repeated mutation/case stamps can occur across Jamabandi pages. Deduplicate
  // before counting or scoring so repetition does not inflate concern levels.
  const mutations = uniqueBy(raw.mutations.map((mutation) => {
    const note = normalizeMutationNote(mutation.note);
    return {
      ...mutation,
      note,
      date: dateFromNote(note) ?? mutation.date,
      area: areaFromNote(note) ?? mutation.area,
    };
  }), (m) => [m.number, m.kind, m.date, m.area, m.buyer, m.note].join('|'));
  const litigation = uniqueBy(raw.litigation, (l) => l.case_no ? `case:${l.case_no}` : JSON.stringify(l));
  const extractionComplete = raw.owners.length > 0 && raw.total_share !== null && raw.khasras.length > 0;

  // 1. Could we read the essentials?
  if (!extractionComplete) add('EXTRACTION_INCOMPLETE', 'high', 20);
  const mortgages = mutations.filter((m) => m.kind === 'mortgage');
  if (mortgages.length > 0) add('MORTGAGE_OR_CHARGE', 'critical', 30, { count: mortgages.length });

  // 2. Share arithmetic
  if (raw.total_share !== null && raw.owners.length > 0 && shares.length === raw.owners.length && sum !== raw.total_share) {
    add('SHARE_MISMATCH', 'critical', 40, { sum, total: raw.total_share });
  }

  // 3. Pending litigation, and transfers made after a case was filed
  const pending = litigation.filter((l) => isPending(l.status));
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
    for (const m of mutations) {
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
  const recent = mutations.filter((m) => {
    const d = parseDmy(m.date);
    return (m.kind === 'sale' || m.kind === 'gift') && d && d >= cutoff && d <= now;
  });
  if (recent.length >= RAPID_LIMIT) {
    add('RAPID_TRANSFERS', 'high', 15, { count: recent.length, months: RECENT_MONTHS });
  }

  // 6. A mutation cannot move more land than the record holds
  const areaSqm = raw.khasras.reduce((a, k) => a + (parseHaAreSqm(k.area) ?? 0), 0);
  if (areaSqm > 0) {
    for (const m of mutations) {
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
  // A score based on missing essentials must never look reassuring.
  if (!extractionComplete) score = Math.min(score, 35);
  else if (raw.low_confidence_fields.length >= 3) score = Math.min(score, 60);
  const band: Band = score >= 80 ? 'low' : score >= 55 ? 'moderate' : 'high';

  const ownerUpdates = ownerUpdatesFromNotes(mutations, raw.owners, raw.total_share);
  const recipientsByMutation = new Map<string, string>();
  for (const update of ownerUpdates) {
    if (!update.mutationNumber || !update.names) continue;
    const current = recipientsByMutation.get(update.mutationNumber);
    recipientsByMutation.set(update.mutationNumber, current ? `${current}; ${update.names}` : update.names);
  }

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
      mutationCount: mutations.length,
      pendingCases: pending.length,
      litigationCount: litigation.length,
      extractionComplete,
      lowConfidenceCount: raw.low_confidence_fields.length,
    },
    khasras: raw.khasras.map((k) => ({
      number: k.number,
      area: k.area,
      landClass: k.land_class,
      possession: k.possession,
    })),
    mutations: mutations.map((m) => ({
      number: m.number,
      kind: m.kind,
      date: m.date,
      area: m.area,
      buyer: recipientsByMutation.get(m.number ?? '') ?? m.buyer,
      note: m.note,
    })),
    litigation: litigation.map((l) => ({
      caseNo: l.case_no,
      caseType: l.case_type,
      court: l.court,
      filedOn: l.filed_on,
      status: l.status,
    })),
    ownerUpdates: ownerUpdates.length > 0 ? ownerUpdates : raw.owner_updates.map((o) => ({
      mutationNumber: o.mutation_number,
      names: o.names,
      share: o.share,
      date: o.date,
    })),
    owners: raw.owners.map((o) => ({
      // Crystal Reports often leaves a khata/khewat column number attached to
      // the end of the owner line. Remove only a trailing numeric artifact;
      // never alter digits inside a name or a genuine share value.
      names: (o.names ?? '').replace(/[\s|:;,]*(?:\d{1,2})\s*$/, '').trim(),
      shareNum: o.share_num,
      sharePct: o.share_num !== null && raw.total_share ? (o.share_num / raw.total_share) * 100 : null,
    })),
  };
}
