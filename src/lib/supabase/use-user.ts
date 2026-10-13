'use client';

import type { User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { createClient } from './client';
import { isSupabaseConfigured } from './config';

/**
 * The current user in client components. Static pages stay static: the session is read in
 * the browser, so the header can show Dashboard / Log out without making every page dynamic.
 */
export function useAuthUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const supabase = createClient();

    supabase.auth
      .getUser()
      .then(({ data }) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  return { user, loading };
}
