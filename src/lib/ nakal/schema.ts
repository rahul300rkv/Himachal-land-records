import { z } from 'zod';

/** Empty strings and nulls from the model all become null. */
const text = z
  .string()
  .nullish()
  .transform((v) => (v && v.trim() ? v.trim() : null));

const int = z
  .union([z.number(), z.string().regex(/^\s*\d+\s*$/).transform(Number)])
  .nullish()
  .transform((v) => (typeof v === 'number' && Number.isFinite(v) ? Math.round(v) : null));

export const MUTATION_KINDS = [
  'sale',
  'inheritance',
  'gift',
  'partition',
  'mortgage',
  'exchange',
  'other',
] as const;

/** What the vision model must return for one nakal. */
export const rawNakalSchema = z.object({
  ref_no: text,
  district: text,
  tehsil: text,
  village: text,
  jamabandi_year: text,
  khata_no: text,
  total_share: int,
  owners: z.array(z.object({ names: text, share_num: int })).default([]),
  khasras: z
    .array(z.object({ number: text, area: text, land_class: text, possession: text }))
    .default([]),
  mutations: z
    .array(
      z.object({
        number: text,
        kind: z.enum(MUTATION_KINDS).catch('other'),
        date: text,
        area: text,
        buyer: text,
      }),
    )
    .default([]),
  litigation: z
    .array(
      z.object({ case_no: text, case_type: text, court: text, filed_on: text, status: text }),
    )
    .default([]),
  low_confidence_fields: z.array(z.string()).default([]),
});

export type RawNakal = z.infer<typeof rawNakalSchema>;
