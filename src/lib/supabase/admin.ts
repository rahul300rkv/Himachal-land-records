import 'server-only';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

/**
 * Supabase client with the SERVICE ROLE key. It bypasses Row Level Security.
 *
 * Server-only (the `server-only` import makes the build fail if a client component ever
 * imports it). Use it only after you have verified the user yourself, for example to
 * store a generated report. Returns null when the key is not configured.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;

  return createSupabaseClient<Database>(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
