'use client';

import { LayoutDashboard, LogIn, LogOut } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Link, useRouter } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';
import { useAuthUser } from '@/lib/supabase/use-user';

/** Login button for visitors; Dashboard + Log out for signed-in users. */
export function AuthActions({ variant }: { variant: 'desktop' | 'mobile' }) {
  const t = useTranslations('Navigation');
  const router = useRouter();
  const { user, loading } = useAuthUser();

  async function signOut() {
    await createClient().auth.signOut();
    router.push('/');
    router.refresh();
  }

  if (loading) {
    return <Skeleton className={variant === 'mobile' ? 'mt-3 h-12 w-full' : 'h-9 w-24'} />;
  }

  if (!user) {
    return (
      <Button asChild size={variant === 'mobile' ? 'lg' : 'sm'} className={variant === 'mobile' ? 'mt-3' : undefined}>
        <Link href="/login">
          <LogIn />
          {t('login')}
        </Link>
      </Button>
    );
  }

  if (variant === 'mobile') {
    return (
      <div className="mt-3 grid grid-cols-2 gap-3">
        <Button asChild size="lg">
          <Link href="/dashboard">
            <LayoutDashboard />
            {t('dashboard')}
          </Link>
        </Button>
        <Button size="lg" variant="outline" onClick={signOut}>
          <LogOut />
          {t('logout')}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <Button asChild size="sm" variant="outline">
        <Link href="/dashboard">
          <LayoutDashboard />
          {t('dashboard')}
        </Link>
      </Button>
      <Button size="icon" variant="ghost" onClick={signOut} aria-label={t('logout')} title={t('logout')} className="size-9">
        <LogOut />
      </Button>
    </div>
  );
}
