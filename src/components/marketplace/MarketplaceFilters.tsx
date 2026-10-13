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
import { HP_DISTRICTS } from '@/lib/data/districts';
import { AREA_UNITS, LAND_TYPES } from '@/types/land-record';
import { useLocale } from 'next-intl';

type Values = {
  district: string;
  pmin: string;
  pmax: string;
  amin: string;
  amax: string;
  unit: string;
  type: string;
  verified: boolean;
  sort: string;
};

const KEYS = ['district', 'pmin', 'pmax', 'amin', 'amax', 'unit', 'type', 'verified', 'sort'] as const;

/** Filter listings by district, price range, area, land type and verification. State lives in the URL. */
export function MarketplaceFilters() {
  const t = useTranslations('Marketplace.filters');
  const land = useTranslations('LandTypes');
  const units = useTranslations('Units');
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const get = (key: string) => searchParams.get(key) ?? '';
  const [values, setValues] = useState<Values>({
    district: get('district'),
    pmin: get('pmin'),
    pmax: get('pmax'),
    amin: get('amin'),
    amax: get('amax'),
    unit: get('unit') || 'bigha',
    type: get('type'),
    verified: get('verified') === '1',
    sort: get('sort') || 'new',
  });

  const set = <K extends keyof Values>(key: K, value: Values[K]) => setValues((v) => ({ ...v, [key]: value }));

  const activeCount = [
    get('district'),
    get('pmin') || get('pmax'),
    get('amin') || get('amax'),
    get('type'),
    get('verified'),
  ].filter(Boolean).length;

  function push(next: Values) {
    const query: Record<string, string> = {};
    KEYS.forEach((key) => {
      const value = next[key];
      if (key === 'unit') {
        if (next.amin.trim() || next.amax.trim()) query.unit = next.unit;
      } else if (key === 'verified') {
        if (next.verified) query.verified = '1';
      } else if (key === 'sort') {
        if (next.sort !== 'new') query.sort = next.sort;
      } else if (typeof value === 'string' && value.trim()) {
        query[key] = value.trim();
      }
    });
    startTransition(() => router.push({ pathname: '/marketplace', query }));
  }

  function clear() {
    const empty: Values = {
      district: '', pmin: '', pmax: '', amin: '', amax: '', unit: 'bigha', type: '', verified: false, sort: 'new',
    };
    setValues(empty);
    push(empty);
  }

  const numberProps = { type: 'number', inputMode: 'decimal' as const, min: 0, step: 'any' };

  return (
    <details className="rounded-lg border bg-card" open={activeCount > 0}>
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
        className="space-y-5 border-t px-4 py-4"
        onSubmit={(event) => {
          event.preventDefault();
          push(values);
        }}
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Label htmlFor="m-district">{t('district')}</Label>
            <Select id="m-district" value={values.district} onChange={(e) => set('district', e.target.value)}>
              <option value="">{t('allDistricts')}</option>
              {HP_DISTRICTS.map((d) => (
                <option key={d.value} value={d.value}>
                  {locale === 'hi' ? d.hi : d.value}
                </option>
              ))}
            </Select>
          </div>

          <fieldset>
            <legend className="mb-1.5 text-sm font-medium">{t('price')}</legend>
            <div className="grid grid-cols-2 gap-2">
              <Input aria-label={`${t('price')}: ${t('min')}`} placeholder={t('min')} value={values.pmin} onChange={(e) => set('pmin', e.target.value)} {...numberProps} />
              <Input aria-label={`${t('price')}: ${t('max')}`} placeholder={t('max')} value={values.pmax} onChange={(e) => set('pmax', e.target.value)} {...numberProps} />
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-1.5 text-sm font-medium">{t('area')}</legend>
            <div className="grid grid-cols-[1fr_1fr_1.2fr] gap-2">
              <Input aria-label={`${t('area')}: ${t('min')}`} placeholder={t('min')} value={values.amin} onChange={(e) => set('amin', e.target.value)} {...numberProps} />
              <Input aria-label={`${t('area')}: ${t('max')}`} placeholder={t('max')} value={values.amax} onChange={(e) => set('amax', e.target.value)} {...numberProps} />
              <Select aria-label={t('areaUnit')} value={values.unit} onChange={(e) => set('unit', e.target.value)} className="pl-2 pr-7">
                {AREA_UNITS.map((u) => (
                  <option key={u} value={u}>
                    {units(u)}
                  </option>
                ))}
              </Select>
            </div>
          </fieldset>

          <div>
            <Label htmlFor="m-type">{t('landType')}</Label>
            <Select id="m-type" value={values.type} onChange={(e) => set('type', e.target.value)}>
              <option value="">{t('allLandTypes')}</option>
              {LAND_TYPES.map((v) => (
                <option key={v} value={v}>
                  {land(v)}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="grid items-end gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Label htmlFor="m-sort">{t('sort')}</Label>
            <Select id="m-sort" value={values.sort} onChange={(e) => set('sort', e.target.value)}>
              <option value="new">{t('sortNew')}</option>
              <option value="price_asc">{t('sortPriceAsc')}</option>
              <option value="price_desc">{t('sortPriceDesc')}</option>
            </Select>
          </div>

          <label className="flex min-h-11 items-center gap-2.5 text-sm font-medium sm:col-span-1 lg:col-span-2">
            <input
              type="checkbox"
              checked={values.verified}
              onChange={(e) => set('verified', e.target.checked)}
              className="size-5 rounded border-input accent-[hsl(var(--primary))]"
            />
            {t('verifiedOnly')}
          </label>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button type="submit" disabled={isPending}>
            {t('apply')}
          </Button>
          <Button type="button" variant="ghost" onClick={clear} disabled={isPending}>
            {t('clear')}
          </Button>
        </div>
      </form>
    </details>
  );
}
