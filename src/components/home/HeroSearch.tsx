'use client';

import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState, useTransition } from 'react';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { loadMapLocations, type LocationCodes, type Option } from '@/lib/data/map-location-options';
import { Button } from '@/components/ui/button';
import { useRouter } from '@/i18n/navigation';

/** Main search bar: District -> Tehsil -> Village, then straight to /search. */
export function HeroSearch() {
  const t = useTranslations('Home.hero');
  const labels = useTranslations('Search.official');
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [location, setLocation] = useState<LocationCodes>({ district: '', tehsil: '', village: '' });
  const [districts, setDistricts] = useState<Option[]>([]);
  const [tehsils, setTehsils] = useState<Option[]>([]);
  const [villages, setVillages] = useState<Option[]>([]);
  const [error, setError] = useState(false);
  const { district, tehsil, village } = location;

  useEffect(() => {
    let active = true;
    const level = !district ? 'districts' : !tehsil ? 'tehsils' : 'villages';
    const setOptions = { districts: setDistricts, tehsils: setTehsils, villages: setVillages }[level];
    void loadMapLocations(level, district, tehsil)
      .then((options) => { if (active) setOptions(options); })
      .catch(() => { if (active) setError(true); });
    return () => { active = false; };
  }, [district, tehsil]);

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!district) return;
    const query: Record<string, string> = { districtCode: district };
    if (tehsil) query.tehsilCode = tehsil;
    if (village) query.villageCode = village;
    startTransition(() => router.push({ pathname: '/search', query }));
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      aria-label={t('searchTitle')}
      className="land-search concept-card p-6 sm:p-9 lg:p-10"
    >
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
        <div>
          <p className="field-note text-primary">01 / 01</p>
          <h2 className="mt-2 text-3xl sm:text-4xl">{t('searchTitle')}</h2>
        </div>
        <p className="max-w-md text-sm text-muted-foreground sm:text-right">{t('searchHint')}</p>
      </div>

      <div className="mt-8 grid items-start gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto]">
        {([
          { key: 'district', value: district, options: districts, placeholder: 'districtPlaceholder' },
          { key: 'tehsil', value: tehsil, options: tehsils, placeholder: 'tehsilPlaceholder' },
          { key: 'village', value: village, options: villages, placeholder: 'villagePlaceholder' },
        ] as const).map(({ key, value, options, placeholder }) => (
          <div className="min-w-0" key={key}>
            <Label htmlFor={`hero-${key}`}>{labels(key)}</Label>
            <Select id={`hero-${key}`} value={value} disabled={isPending || !options.length} onChange={(event) => {
              const next = event.target.value;
              setError(false);
              if (key === 'district') {
                setTehsils([]);
                setVillages([]);
                setLocation({ district: next, tehsil: '', village: '' });
              } else if (key === 'tehsil') {
                setVillages([]);
                setLocation({ district, tehsil: next, village: '' });
              } else {
                setLocation({ district, tehsil, village: next });
              }
            }}>
              <option value="">{labels(placeholder)}</option>
              {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </Select>
          </div>
        ))}
        {/* Spacer label keeps the button aligned with the inputs on wide screens */}
        <div className="sm:col-span-2 lg:col-span-1 lg:pt-[1.625rem]">
          <Button type="submit" size="lg" className="w-full rounded-full px-7 lg:w-auto" disabled={isPending || !district}>
            {t('submit')}
            <ArrowRight aria-hidden="true" />
          </Button>
        </div>
      </div>
      {error && <p role="alert" className="mt-3 text-sm text-destructive">{labels('unavailable')}</p>}
    </form>
  );
}
