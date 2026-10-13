'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { HP_DISTRICTS } from '@/lib/data/districts';

type DistrictSelectProps = {
  id: string;
  value: string;
  onChange: (district: string) => void;
  error?: string;
  className?: string;
};

/** District dropdown (all 12 districts of Himachal Pradesh), labelled in the active language. */
export function DistrictSelect({ id, value, onChange, error, className }: DistrictSelectProps) {
  const t = useTranslations('Search.form');
  const locale = useLocale();

  return (
    <div className={className}>
      <Label htmlFor={id}>{t('district')}</Label>
      <Select
        id={id}
        name="district"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
      >
        <option value="">{t('districtPlaceholder')}</option>
        {HP_DISTRICTS.map((district) => (
          <option key={district.value} value={district.value}>
            {locale === 'hi' ? district.hi : district.value}
          </option>
        ))}
      </Select>
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
