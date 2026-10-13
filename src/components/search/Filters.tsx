'use client';

import { SlidersHorizontal } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { useRouter } from '@/i18n/navigation';
import { LAND_TYPES } from '@/types/land-record';

type FiltersProps = {
  defaults: { khewat?: string; khatauni?: string; type?: string; year?: number };
};

const FILTER_KEYS = ['khewat', 'khatauni', 'type', 'year'] as const;

/**
 * Refinements applied on top of the current search. They live in the URL, so a filtered
 * view can be bookmarked or shared. Collapsed by default to keep the page compact.
 */
export function Filters({ defaults }: FiltersProps) {
  const t = useTranslations('Search.filters');
  const land = useTranslations('LandTypes');
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [khewat, setKhewat] = useState(defaults.khewat ?? '');
  const [khatauni, setKhatauni] = useState(defaults.khatauni ?? '');
  const [type, setType] = useState(defaults.type ?? '');
  const [year, setYear] = useState(defaults.year ? String(defaults.year) : '');

  const activeCount = [defaults.khewat, defaults.khatauni, defaults.type, defaults.year].filter(Boolean).length;
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1989 }, (_, i) => currentYear - i);

  function push(values: Record<(typeof FILTER_KEYS)[number], string>) {
    const query = Object.fromEntries(searchParams.entries());
    delete query.page; // filters change the result set, so go back to page 1
    FILTER_KEYS.forEach((key) => {
      const value = values[key].trim();
      if (value) query[key] = value;
      else delete query[key];
    });
    startTransition(() => router.push({ pathname: '/search', query }));
  }

  function clear() {
    setKhewat('');
    setKhatauni('');
    setType('');
    setYear('');
    push({ khewat: '', khatauni: '', type: '', year: '' });
  }

  return (
    <details className="group rounded-lg border bg-card" open={activeCount > 0}>
      <summary className="flex min-h-12 cursor-pointer list-none items-center gap-2 px-4 py-3 font-medium [&::-webkit-details-marker]:hidden">
        <SlidersHorizontal className="size-4 text-primary" aria-hidden="true" />
        {t('title')}
        {activeCount > 0 && (
          <span className="rounded-full bg-primary-soft px-2 py-0.5 text-xs font-semibold text-primary">
            {t('active', { count: activeCount })}
          </span>
        )}
      </summary>

      <form
        className="space-y-4 border-t px-4 py-4"
        onSubmit={(event) => {
          event.preventDefault();
          push({ khewat, khatauni, type, year });
        }}
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Label htmlFor="f-khewat">{t('khewat')}</Label>
            <Input id="f-khewat" value={khewat} maxLength={100} onChange={(e) => setKhewat(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="f-khatauni">{t('khatauni')}</Label>
            <Input
              id="f-khatauni"
              value={khatauni}
              maxLength={100}
              onChange={(e) => setKhatauni(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="f-type">{t('landType')}</Label>
            <Select id="f-type" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="">{t('allLandTypes')}</option>
              {LAND_TYPES.map((value) => (
                <option key={value} value={value}>
                  {land(value)}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="f-year">{t('year')}</Label>
            <Select id="f-year" value={year} onChange={(e) => setYear(e.target.value)}>
              <option value="">{t('allYears')}</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button type="submit" disabled={isPending}>
            {t('apply')}
          </Button>
          <Button type="button" variant="ghost" onClick={clear} disabled={isPending || activeCount === 0}>
            {t('clear')}
          </Button>
        </div>
      </form>
    </details>
  );
}
