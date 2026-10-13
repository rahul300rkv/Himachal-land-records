import type { CircleRate } from '@/lib/data/circle-rates';
import type { LandRecord, Mutation } from '@/types/land-record';

export type ReportLocale = 'en' | 'hi';

export type FlagCode =
  | 'noKhewat'
  | 'noKhatauni'
  | 'pendingMutation'
  | 'rejectedMutation'
  | 'recentMutation'
  | 'mortgage'
  | 'courtOrder'
  | 'oldJamabandi'
  | 'agricultural'
  | 'unreviewed';

/** A point the buyer should verify. Values are raw (ISO dates, keys); the PDF formats them. */
export type ReportFlag = { code: FlagCode; values?: Record<string, string | number> };

/** Everything needed to (re)generate a report PDF. Stored in `reports.findings`. */
export type ReportSnapshot = {
  version: 1;
  reportId: string;
  displayId: string;
  generatedAt: string;
  locale: ReportLocale;
  demo: boolean;
  record: LandRecord;
  mutations: Mutation[];
  flags: ReportFlag[];
  circleRate: CircleRate;
};

/** Human-friendly report number, e.g. HLC-2026-9F3A1C2B (derived from the UUID, so unique). */
export function displayReportId(uuid: string, date: Date) {
  const tail = uuid.replace(/-/g, '').slice(0, 8).toUpperCase();
  return `HLC-${date.getUTCFullYear()}-${tail}`;
}

const AGRICULTURAL = new Set(['irrigated', 'unirrigated', 'orchard', 'pasture']);
const MONTH_MS = 30 * 24 * 60 * 60 * 1000;

/**
 * Objective, rule-based points to verify. This is a checklist, deliberately NOT a risk
 * score: the report must never read like an assurance that a plot is safe to buy.
 */
export function computeFlags(record: LandRecord, mutations: Mutation[], now = new Date()): ReportFlag[] {
  const flags: ReportFlag[] = [];

  if (!record.khewat_number) flags.push({ code: 'noKhewat' });
  if (!record.khatauni_number) flags.push({ code: 'noKhatauni' });

  const pending = mutations.find((m) => m.status === 'pending');
  if (pending) flags.push({ code: 'pendingMutation', values: { number: pending.mutation_number } });

  const rejected = mutations.find((m) => m.status === 'rejected');
  if (rejected) flags.push({ code: 'rejectedMutation', values: { number: rejected.mutation_number } });

  const dated = mutations
    .filter((m) => m.mutation_date)
    .sort((a, b) => (b.mutation_date ?? '').localeCompare(a.mutation_date ?? ''));
  const latest = dated[0];
  if (latest?.mutation_date && now.getTime() - new Date(latest.mutation_date).getTime() < 12 * MONTH_MS) {
    flags.push({ code: 'recentMutation', values: { number: latest.mutation_number, date: latest.mutation_date } });
  }

  const mortgage = mutations.find((m) => m.mutation_type === 'mortgage');
  if (mortgage) flags.push({ code: 'mortgage', values: { number: mortgage.mutation_number } });

  const court = mutations.find((m) => m.mutation_type === 'court_order');
  if (court) flags.push({ code: 'courtOrder', values: { number: court.mutation_number } });

  if (now.getFullYear() - record.jamabandi_year >= 5) {
    flags.push({ code: 'oldJamabandi', values: { year: record.jamabandi_year } });
  }

  if (AGRICULTURAL.has(record.land_type)) {
    flags.push({ code: 'agricultural', values: { landType: record.land_type } });
  }

  if (!record.is_verified) flags.push({ code: 'unreviewed' });

  return flags;
}
