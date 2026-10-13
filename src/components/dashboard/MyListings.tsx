'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useState, useTransition } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Link, useRouter } from '@/i18n/navigation';
import { districtLabel, tehsilLabel } from '@/lib/data/districts';
import { createClient } from '@/lib/supabase/client';
import { cn, formatPrice } from '@/lib/utils';
import type { ListingStatus } from '@/types/database';

export type MyListingItem = {
  id: string;
  title: string;
  status: ListingStatus;
  district: string;
  tehsil: string;
  village: string;
  price: number;
  created_at: string;
};

const TONE = {
  draft: 'neutral',
  pending_review: 'warning',
  active: 'success',
  sold: 'info',
  withdrawn: 'neutral',
  rejected: 'danger',
  expired: 'neutral',
} as const;

/** The seller's own listings with status and quick actions (mark sold, withdraw, delete). */
export function MyListings({ items }: { items: MyListingItem[] }) {
  const t = useTranslations('Dashboard.listings');
  const statuses = useTranslations('ListingStatus');
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(false);

  async function run(action: () => PromiseLike<{ error: unknown }>) {
    setError(false);
    const { error: actionError } = await action();
    if (actionError) return setError(true);
    startTransition(() => router.refresh());
  }

  const supabase = () => createClient();
  const setStatus = (id: string, status: 'sold' | 'withdrawn') =>
    run(() => supabase().from('listings').update({ status }).eq('id', id));
  const remove = (id: string) => {
    if (!window.confirm(t('confirmDelete'))) return;
    return run(() => supabase().from('listings').delete().eq('id', id));
  };

  return (
    <div>
      <ul className="divide-y rounded-lg border bg-card">
        {items.map((item) => {
          const place = [item.village, tehsilLabel(item.district, item.tehsil, locale), districtLabel(item.district, locale)].join(', ');
          const open = item.status === 'active';
          const editable = open || item.status === 'pending_review' || item.status === 'draft';
          return (
            <li key={item.id} className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium [overflow-wrap:anywhere]">{item.title}</p>
                  <Badge tone={TONE[item.status]}>{statuses(item.status)}</Badge>
                </div>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {place} <span aria-hidden="true">·</span> {formatPrice(item.price, locale)}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link href={`/marketplace/${item.id}`} className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}>
                  {t('view')}
                </Link>
                {open && (
                  <Button size="sm" variant="outline" disabled={isPending} onClick={() => setStatus(item.id, 'sold')}>
                    {t('markSold')}
                  </Button>
                )}
                {editable && (
                  <Button size="sm" variant="ghost" disabled={isPending} onClick={() => setStatus(item.id, 'withdrawn')}>
                    {t('withdraw')}
                  </Button>
                )}
                <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" disabled={isPending} onClick={() => remove(item.id)}>
                  {t('delete')}
                </Button>
              </div>
            </li>
          );
        })}
      </ul>
      {error && (
        <p role="alert" className="mt-3 text-sm text-destructive">
          {t('actionFailed')}
        </p>
      )}
    </div>
  );
}
