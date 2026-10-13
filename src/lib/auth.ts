import 'server-only';
import type { User } from '@supabase/supabase-js';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { createClient } from '@/lib/supabase/server';
import { redirect } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';

/** The logged-in user (validated with Supabase), or null. Never throws. */
export async function getCurrentUser(): Promise<User | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  } catch {
    return null;
  }
}

/** Redirects to /login (remembering where to come back to) when nobody is logged in. */
export async function requireUser(locale: string, next: string): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    redirect({ href: { pathname: '/login', query: { next } }, locale: locale as Locale });
  }
  return user as User;
}

/** Display name for greetings: profile name, then phone/email, else null. */
export function userDisplayName(user: User): string | null {
  const meta = user.user_metadata as { full_name?: string } | undefined;
  return meta?.full_name?.trim() || null;
}
