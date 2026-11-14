'use client';

import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState, useTransition } from 'react';
import { LocationFields, type Location } from '@/components/search/LocationFields';
import { Button } from '@/components/ui/button';
import { useRouter } from '@/i18n/navigation';

/** Main search bar: District -> Tehsil -> Village, then straight to /search. */
export function HeroSearch() {
  const t = useTranslations('Home.hero');
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [location, setLocation] = useState<Location>({ district: '', tehsil: '', village: '' });
  const [errors, setErrors] = useState<{ district?: string; tehsil?: string }>({});

  function onChange(patch: Partial<Location>) {
    setLocation((current) => ({ ...current, ...patch }));
    setErrors({});
  }

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const next = {
      district: location.district ? undefined : t('errors.district'),
      tehsil: location.tehsil ? undefined : t('errors.tehsil'),
    };
    if (next.district || next.tehsil) {
      setErrors(next);
      return;
    }

    const query: Record<string, string> = { district: location.district, tehsil: location.tehsil };
    if (location.village.trim()) query.village = location.village.trim();
    startTransition(() => router.push({ pathname: '/search', query }));
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      aria-label={t('searchTitle')}
      className="land-search p-6 sm:p-9 lg:p-10"
    >
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">01</p>
          <h2 className="mt-2 text-3xl sm:text-4xl">{t('searchTitle')}</h2>
        </div>
        <p className="max-w-md text-sm text-muted-foreground sm:text-right">{t('searchHint')}</p>
      </div>

      <div className="mt-8 grid items-start gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto]">
        <LocationFields {...location} onChange={onChange} errors={errors} />
        {/* Spacer label keeps the button aligned with the inputs on wide screens */}
        <div className="sm:col-span-2 lg:col-span-1 lg:pt-[1.625rem]">
          <Button type="submit" size="lg" className="w-full rounded-full px-7 lg:w-auto" disabled={isPending}>
            <Search />
            {t('submit')}
          </Button>
        </div>
      </div>
    </form>
  );
}
