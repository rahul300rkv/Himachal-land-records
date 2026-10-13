'use client';

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database';
import { getSupabaseConfig } from './config';

/**
 * Supabase client for Client Components (runs in the browser).
 *
 *   const supabase = createClient();
 */
export function createClient() {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig();
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}
