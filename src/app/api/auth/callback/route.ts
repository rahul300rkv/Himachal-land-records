import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { routing } from '@/i18n/routing';
import { safeNextPath } from '@/lib/phone';
import { getSupabaseConfig } from '@/lib/supabase/config';

/**
 * GET /api/auth/callback?code=...&next=/dashboard
 *
 * Completes the PKCE magic-link flow. The session cookies MUST be written
 * onto the redirect response itself — not onto a separate client — otherwise
 * the browser never receives them and the user appears logged out.
 *
 * Supabase dashboard → Authentication → URL Configuration:
 *   Add <SITE_URL>/api/auth/callback to "Redirect URLs"
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = safeNextPath(searchParams.get('next'));

  const cookieStore = await cookies();
  const stored = cookieStore.get('NEXT_LOCALE')?.value;
  const locale = routing.locales.find((l) => l === stored) ?? routing.defaultLocale;

  const successUrl = `${origin}/${locale}${next}`;
  const errorUrl   = `${origin}/${locale}/login?error=link`;

  if (!code) {
    return NextResponse.redirect(errorUrl);
  }

  // Build the redirect response first, then attach the Supabase client to it
  // so that exchangeCodeForSession writes the session cookies onto THIS response.
  const response = NextResponse.redirect(successUrl);
  const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig();

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          // Write onto both the request store and the outgoing response
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error('[auth/callback] exchangeCodeForSession error:', error.message);
    return NextResponse.redirect(errorUrl);
  }

  return response;
}