import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { routing } from '@/i18n/routing';
import { safeNextPath } from '@/lib/phone';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/auth/callback?code=...&next=/dashboard
 * Completes sign-in when a visitor clicks the link in the email (PKCE code exchange).
 * Add `<SITE_URL>/api/auth/callback` to Supabase -> Authentication -> URL Configuration.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = safeNextPath(searchParams.get('next'));

  const stored = (await cookies()).get('NEXT_LOCALE')?.value;
  const locale = routing.locales.find((l) => l === stored) ?? routing.defaultLocale;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}/${locale}${next}`);
  }

  return NextResponse.redirect(`${origin}/${locale}/login?error=link`);
}
