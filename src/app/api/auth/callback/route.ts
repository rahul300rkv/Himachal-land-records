import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { routing } from '@/i18n/routing';
import { safeNextPath } from '@/lib/phone';
import { getSupabaseConfig } from '@/lib/supabase/config';

/**
 * GET /api/auth/callback
 *
 * Handles three flows:
 * 1. token_hash + type  — when email template uses token_hash link
 * 2. code               — OAuth / PKCE
 * 3. Fragment fallback  — Supabase implicit flow sends #access_token in fragment;
 *                         server never sees it, so we serve a client page that
 *                         reads the fragment and sets the session via the browser client.
 *
 * The fragment fallback page is needed when Supabase's own verify endpoint
 * handles the token and redirects here with #access_token=...&refresh_token=...
 * in the URL hash (which servers cannot read).
 */
export async function GET(request: Request) {
  const { searchParams, origin, hash } = new URL(request.url);

  const token_hash = searchParams.get('token_hash');
  const type       = searchParams.get('type') as 'magiclink' | 'email' | 'signup' | 'recovery' | null;
  const code       = searchParams.get('code');
  const next       = safeNextPath(searchParams.get('next'));

  const cookieStore = await cookies();
  const stored  = cookieStore.get('NEXT_LOCALE')?.value;
  const locale  = routing.locales.find((l) => l === stored) ?? routing.defaultLocale;

  const successUrl = `${origin}/${locale}${next}`;
  const errorUrl   = `${origin}/${locale}/login?error=link`;

  const response = NextResponse.redirect(successUrl);
  const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig();

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() { return cookieStore.getAll(); },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  // Flow 1: token_hash (email template sends this)
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash, type });
    if (!error) return response;
    console.error('[auth/callback] verifyOtp error:', error.message);
    return NextResponse.redirect(errorUrl);
  }

  // Flow 2: OAuth PKCE code
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return response;
    console.error('[auth/callback] exchangeCodeForSession error:', error.message);
    return NextResponse.redirect(errorUrl);
  }

  // Flow 3: Supabase implicit flow — access_token is in the URL fragment.
  // The server cannot read fragments. Serve a tiny HTML page that reads
  // the fragment in the browser, calls setSession, then redirects.
  return new NextResponse(
    `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Signing in…</title></head>
<body>
<script>
(async () => {
  try {
    const hash = window.location.hash.slice(1);
    const params = new URLSearchParams(hash);
    const access_token = params.get('access_token');
    const refresh_token = params.get('refresh_token');
    if (!access_token || !refresh_token) {
      window.location.replace(${JSON.stringify(errorUrl)});
      return;
    }
    // Use the Supabase browser client to set the session from the tokens
    const { createClient } = await import(${JSON.stringify(`${origin}/_next/static/chunks/supabase-browser.js`)}).catch(() => ({ createClient: null }));
    // Fallback: call the Supabase REST session endpoint directly via fetch
    const res = await fetch(${JSON.stringify(supabaseUrl)} + '/auth/v1/token?grant_type=refresh_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': ${JSON.stringify(supabaseAnonKey)},
      },
      body: JSON.stringify({ refresh_token }),
    });
    if (res.ok) {
      const session = await res.json();
      // Store tokens in cookies so the server middleware can read them
      const expires = new Date(Date.now() + session.expires_in * 1000).toUTCString();
      document.cookie = 'sb-access-token=' + session.access_token + '; path=/; expires=' + expires + '; SameSite=Lax';
      document.cookie = 'sb-refresh-token=' + session.refresh_token + '; path=/; SameSite=Lax';
    }
    window.location.replace(${JSON.stringify(successUrl)});
  } catch(e) {
    console.error('Auth fragment error', e);
    window.location.replace(${JSON.stringify(errorUrl)});
  }
})();
</script>
<p style="font-family:sans-serif;padding:2rem">Signing in, please wait…</p>
</body>
</html>`,
    { status: 200, headers: { 'Content-Type': 'text/html' } }
  );
}