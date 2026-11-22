'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

/**
 * Handles Supabase implicit-flow magic links.
 *
 * When Supabase verifies the token on its own servers it redirects to your
 * SITE_URL with the session in the URL fragment:
 *   https://yoursite.com/#access_token=xxx&refresh_token=xxx&type=magiclink
 *
 * Servers never see URL fragments. This component runs in the browser,
 * reads the fragment, calls setSession() so @supabase/ssr writes the
 * auth cookies, then does a hard replace to the same path (without the
 * fragment) so Next.js middleware picks up the cookies on the next request
 * and the user is properly logged in.
 *
 * Place <AuthSessionHandler /> once in your root locale layout, inside
 * NextIntlClientProvider but before any other children.
 */
export function AuthSessionHandler() {
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash || !hash.includes('access_token')) return;

    const params = new URLSearchParams(hash.slice(1)); // strip leading #
    const access_token  = params.get('access_token');
    const refresh_token = params.get('refresh_token');
    const type          = params.get('type'); // 'magiclink' | 'signup' | 'recovery'

    if (!access_token || !refresh_token) return;

    // Wipe the fragment from the address bar immediately — tokens should
    // not sit in browser history or be accidentally shared.
    const cleanUrl = window.location.pathname + window.location.search;
    window.history.replaceState(null, '', cleanUrl);

    const supabase = createClient();

    supabase.auth.setSession({ access_token, refresh_token }).then(({ data, error }) => {
      if (error || !data.session) {
        console.error('[AuthSessionHandler] setSession failed:', error?.message);
        // Redirect to login with error flag
        window.location.replace('/login?error=link');
        return;
      }

      // Determine where to send the user after sign-in.
      // Default to dashboard; fall back to home if that's unavailable.
      const destination = type === 'recovery' ? '/account' : '/dashboard';

      // Hard navigation — Next.js middleware will see the new Supabase
      // cookies on this request and treat the user as authenticated.
      window.location.replace(destination);
    });
  }, []);

  return null;
}
