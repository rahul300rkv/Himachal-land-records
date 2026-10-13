'use client';

import { BookmarkCheck, BookmarkPlus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';

type SaveSearchButtonProps = {
  /** The /search query string values (without `page`). */
  params: Record<string, string>;
  name: string;
  isAuthenticated: boolean;
};

/** Saves the current search to the user's dashboard. Sends logged-out visitors to log in first. */
export function SaveSearchButton({ params, name, isAuthenticated }: SaveSearchButtonProps) {
  const t = useTranslations('SaveSearch');
  const [state, setState] = useState<'idle' | 'saving' | 'saved' | 'error' | 'limit'>('idle');

  if (!isAuthenticated) {
    const next = `/search?${new URLSearchParams(params)}`;
    return (
      <Button asChild variant="outline" size="sm">
        <Link href={{ pathname: '/login', query: { next } }}>
          <BookmarkPlus />
          {t('loginToSave')}
        </Link>
      </Button>
    );
  }

  async function save() {
    setState('saving');
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return setState('error');

    const { error } = await supabase
      .from('saved_searches')
      .insert({ user_id: user.id, name: name.slice(0, 200) || 'Search', params });

    if (!error) return setState('saved');
    // The database trigger rejects the 26th saved search with a "P0001" error.
    setState(error.code === 'P0001' ? 'limit' : 'error');
  }

  return (
    <div className="flex flex-col items-start gap-1.5 sm:items-end">
      {state === 'saved' ? (
        <p role="status" className="flex items-center gap-2 text-sm font-medium text-leaf">
          <BookmarkCheck className="size-4" aria-hidden="true" />
          {t('saved')}{' '}
          <Link href="/dashboard" className="underline underline-offset-2">
            {t('view')}
          </Link>
        </p>
      ) : (
        <Button type="button" variant="outline" size="sm" onClick={save} disabled={state === 'saving'}>
          <BookmarkPlus />
          {t('button')}
        </Button>
      )}
      {(state === 'error' || state === 'limit') && (
        <p role="alert" className="text-sm text-destructive">
          {state === 'limit' ? t('limit') : t('failed')}
        </p>
      )}
    </div>
  );
}
