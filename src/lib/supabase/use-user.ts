'use client';

import type { User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { createClient } from './client';
import { isSupabaseConfigured } from './config';

/**
 * The current user in client components. Static pages stay static: the session is read in
 * the browser, so the header can show Dashboard / Log out without making every page dynamic.
 *
 * Also handles Supabase implicit-flow magic links — when Supabase verifies the token on
 * its own servers it redirects to SITE_URL with tokens in the URL fragment:
 *   https://yoursite.com/#access_token=xxx&refresh_token=xxx&type=magiclink
 *
 * Servers never see fragments. This hook reads them, calls setSession(), then does a
 * hard navigation so Next.js middleware picks up the new cookies and the user is
 * properly authenticated server-side.
 */
export function useAuthUser() {
  const [user, setUser]       = useState<User | null>(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const supabase = createClient();

    // ── Handle magic-link fragment ──────────────────────────────────────────
    const hash = window.location.hash;
    if (hash.includes('access_token')) {
      const params        = new URLSearchParams(hash.slice(1));
      const access_token  = params.get('access_token');
      const refresh_token = params.get('refresh_token');
      const type          = params.get('type');

      if (access_token && refresh_token) {
        // Clear tokens from address bar immediately
        window.history.replaceState(
          null, '',
          window.location.pathname + window.location.search
        );

        supabase.auth.setSession({ access_token, refresh_token }).then(({ data, error }) => {
          if (error || !data.session) {
            console.error('[useAuthUser] setSession failed:', error?.message);
            window.location.replace('/login?error=link');
            return;
          }
          // Hard navigation — middleware sees the new cookies on this request
          const destination = type === 'recovery' ? '/account' : '/dashboard';
          window.location.replace(destination);
        });

        return; // skip normal getUser/subscription until after redirect
      }
    }

    // ── Normal session check ────────────────────────────────────────────────
    supabase.auth
      .getUser()
      .then(({ data }) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading };
}
