'use client';

import { Search, Trash2 } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useState, useTransition } from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Link, useRouter } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

export type SavedSearchItem = { id: string; name: string; params: Record<string, string>; created_at: string };

export function SavedSearchList({ items }: { items: SavedSearchItem[] }) {
  const t = useTranslations('Dashboard.saved');
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(false);

  const date = new Intl.DateTimeFormat(locale === 'hi' ? 'hi-IN' : 'en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  async function remove(id: string) {
    setError(false);
    const { error: deleteError } = await createClient().from('saved_searches').delete().eq('id', id);
    if (deleteError) return setError(true);
    startTransition(() => router.refresh());
  }

  return (
    <div>
      <ul className="divide-y rounded-lg border bg-card">
        {items.map((item) => (
          <li key={item.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="font-medium [overflow-wrap:anywhere]">{item.name}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {t('savedOn', { date: date.format(new Date(item.created_at)) })}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Link
                href={{ pathname: '/search', query: item.params }}
                className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
              >
                <Search />
                {t('run')}
              </Link>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                disabled={isPending}
                onClick={() => remove(item.id)}
                aria-label={t('deleteLabel', { name: item.name })}
              >
                <Trash2 />
                {t('delete')}
              </Button>
            </div>
          </li>
        ))}
      </ul>
      {error && (
        <p role="alert" className="mt-3 text-sm text-destructive">
          {t('deleteFailed')}
        </p>
      )}
    </div>
  );
}
