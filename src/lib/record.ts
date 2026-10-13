import 'server-only';
import { cache } from 'react';
import { SAMPLE_MUTATIONS, SAMPLE_RECORDS } from '@/lib/data/sample-records';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { createClient } from '@/lib/supabase/server';
import type { LandRecord, Mutation } from '@/types/land-record';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const DEMO_ID = /^demo-\d{4}$/;

export type RecordResult = {
  mode: 'live' | 'demo';
  record: LandRecord;
  mutations: Mutation[];
};

/** Oldest-last: newest mutation first, records without a date at the end. */
function sortMutations(list: Mutation[]) {
  return [...list].sort((a, b) => (b.mutation_date ?? '').localeCompare(a.mutation_date ?? ''));
}

/** A single land record (no mutations). Returns null when it does not exist. */
export const getLandRecord = cache(async (id: string): Promise<{ mode: 'live' | 'demo'; record: LandRecord } | null> => {
  if (!isSupabaseConfigured) {
    const record = DEMO_ID.test(id) ? SAMPLE_RECORDS.find((r) => r.id === id) : undefined;
    return record ? { mode: 'demo', record } : null;
  }
  if (!UUID.test(id)) return null;

  const supabase = await createClient();
  const { data, error } = await supabase.from('land_records').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data ? { mode: 'live', record: data } : null;
});

/** A land record with its mutation history. Returns null when the record does not exist. */
export async function getRecordWithMutations(id: string): Promise<RecordResult | null> {
  const found = await getLandRecord(id);
  if (!found) return null;

  if (found.mode === 'demo') {
    return { ...found, mutations: sortMutations(SAMPLE_MUTATIONS.filter((m) => m.land_record_id === id)) };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('mutations')
    .select('*')
    .eq('land_record_id', id)
    .order('mutation_date', { ascending: false, nullsFirst: false });
  if (error) throw error;
  return { ...found, mutations: data ?? [] };
}

export { extractExtras, extractShajra, type RecordExtras } from '@/lib/record-extras';
