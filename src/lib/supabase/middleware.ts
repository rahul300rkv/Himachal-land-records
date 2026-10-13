import { createServerClient } from '@supabase/ssr';
import type { NextRequest, NextResponse } from 'next/server';
import type { Database } from '@/types/database';
import { supabaseAnonKey, supabaseUrl } from './config';

/**
 * Refreshes the Supabase auth session on every request and writes the refreshed
 * cookies onto the response that was passed in.
 *
 * It takes the response produced by the next-intl middleware, so locale redirects/rewrites
 * and Supabase cookies end up on the same response.
 *
 * If Supabase env vars are missing (e.g. first run before setup) it is a no-op so the
 * site still renders.
 */
export async function updateSession(request: NextRequest, response: NextResponse) {
  if (!supabaseUrl || !supabaseAnonKey) {
    return { response, user: null };
  }

  const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  // IMPORTANT: do not run code between createServerClient and getUser().
  // getUser() validates the token and triggers the refresh.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { response, user };
}
