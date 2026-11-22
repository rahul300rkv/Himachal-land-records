import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { routing } from '@/i18n/routing';
import { safeNextPath } from '@/lib/phone';
import { getSupabaseConfig } from '@/lib/supabase/config';

/**
 * GET /api/auth/callback
 *
 * Handles two distinct flows that Supabase sends to this URL:
 *
 * 1. Magic link / email OTP
 *    Supabase emails: <SITE_URL>/api/auth/callback?token_hash=xxx&type=magiclink&next=...
 *    Handled with: supabase.auth.verifyOtp({ token_hash, type })
 *
 * 2. OAuth / PKCE (Google, GitHub, etc.)
 *    Supabase redirects: <SITE_URL>/api/auth/callback?code=xxx&next=...
 *    Handled with: supabase.auth.exchangeCodeForSession(code)
 *
 * In BOTH cases the session cookies must be written onto the redirect
 * response object itself, not via Next.js cookies() — otherwise the
 * browser never receives them.
 *
 * Supabase dashboard → Authentication → URL Configuration:
 *   Add <SITE_URL>/api/auth/callback to "Redirect URLs"
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);

  const token_hash = searchParams.get('token_hash');
  const type       = searchParams.get('type') as 'magiclink' | 'email' | 'recovery' | null;
  const code       = searchParams.get('code');
  const next       = safeNextPath(searchParams.get('next'));

  const cookieStore = await cookies();
  const stored  = cookieStore.get('NEXT_LOCALE')?.value;
  const locale  = routing.locales.find((l) => l === stored) ?? routing.defaultLocale;

  const successUrl = `${origin}/${locale}${next}`;
  const errorUrl   = `${origin}/${locale}/login?error=link`;

  // Build the redirect response first so we can attach cookies to it directly
  const response = NextResponse.redirect(successUrl);
  const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig();

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        // Write session cookies onto the outgoing redirect response
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  // ── Flow 1: magic link / email OTP (token_hash + type) ──────────────────
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash, type });
    if (!error) return response;
    console.error('[auth/callback] verifyOtp error:', error.message);
    return NextResponse.redirect(errorUrl);
  }

  // ── Flow 2: OAuth / PKCE code exchange ──────────────────────────────────
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return response;
    console.error('[auth/callback] exchangeCodeForSession error:', error.message);
    return NextResponse.redirect(errorUrl);
  }

  // No recognised parameters
  return NextResponse.redirect(errorUrl);
}