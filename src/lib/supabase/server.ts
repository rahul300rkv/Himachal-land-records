import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database';
import { getSupabaseConfig } from './config';

/**
 * Supabase client for Server Components, Server Actions and Route Handlers.
 * Reads and writes the auth session via Next.js cookies.
 *
 *   const supabase = await createClient();
 *   const { data: { user } } = await supabase.auth.getUser();
 *
 * Always use `auth.getUser()` (which validates the token with Supabase) rather than
 * `auth.getSession()` when making authorisation decisions on the server.
 */
export async function createClient() {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig();
  const cookieStore = await cookies();

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Called from a Server Component, where cookies are read-only.
          // Safe to ignore: middleware refreshes the session on every request.
        }
      },
    },
  });
}
