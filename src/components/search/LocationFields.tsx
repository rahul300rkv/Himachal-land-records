'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useId, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { getTehsils } from '@/lib/data/districts';
import { DistrictSelect } from './DistrictSelect';

export type Location = { district: string; tehsil: string; village: string };

type LocationFieldsProps = Location & {
  /** Called with only the fields that changed. Child fields are reset automatically. */
  onChange: (patch: Partial<Location>) => void;
  errors?: { district?: string; tehsil?: string; village?: string };
  /** Applied to each of the three field wrappers (use for grid layout). */
  fieldClassName?: string;
};

/**
 * District -> Tehsil -> Village cascade.
 *  - Choosing a district resets the tehsil and village.
 *  - Choosing a tehsil resets the village and loads village suggestions.
 * Renders three sibling fields so the parent decides the grid layout.
 */
export function LocationFields({
  district,
  tehsil,
  village,
  onChange,
  errors,
  fieldClassName,
}: LocationFieldsProps) {
  const t = useTranslations('Search.form');
  const locale = useLocale();
  const uid = useId();
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const tehsils = getTehsils(district);

  // Load village suggestions for the selected tehsil (optional; the field also accepts free text).
  useEffect(() => {
    if (!district || !tehsil) {
      setSuggestions([]);
      return;
    }
    const controller = new AbortController();
    const params = new URLSearchParams({ district, tehsil });
    fetch(`/api/villages?${params}`, { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : { villages: [] }))
      .then((data: { villages?: string[] }) => setSuggestions(data.villages ?? []))
      .catch(() => setSuggestions([]));
    return () => controller.abort();
  }, [district, tehsil]);

  const tehsilId = `${uid}-tehsil`;
  const villageId = `${uid}-village`;
  const listId = `${uid}-villages`;

  return (
    <>
      <DistrictSelect
        id={`${uid}-district`}
        value={district}
        error={errors?.district}
        className={fieldClassName}
        onChange={(next) => onChange({ district: next, tehsil: '', village: '' })}
      />

      <div className={fieldClassName}>
        <Label htmlFor={tehsilId}>{t('tehsil')}</Label>
        <Select
          id={tehsilId}
          name="tehsil"
          value={tehsil}
          disabled={!district}
          onChange={(event) => onChange({ tehsil: event.target.value, village: '' })}
          aria-invalid={Boolean(errors?.tehsil)}
          aria-describedby={errors?.tehsil ? `${tehsilId}-error` : undefined}
        >
          <option value="">{district ? t('tehsilPlaceholder') : t('tehsilFirst')}</option>
          {tehsils.map((item) => (
            <option key={item.value} value={item.value}>
              {locale === 'hi' ? item.hi : item.value}
            </option>
          ))}
        </Select>
        {errors?.tehsil && (
          <p id={`${tehsilId}-error`} role="alert" className="mt-1.5 text-sm text-destructive">
            {errors.tehsil}
          </p>
        )}
      </div>

      <div className={fieldClassName}>
        <Label htmlFor={villageId}>{t('village')}</Label>
        <Input
          id={villageId}
          name="village"
          value={village}
          list={listId}
          disabled={!tehsil}
          autoComplete="off"
          maxLength={100}
          placeholder={tehsil ? t('villagePlaceholder') : t('villageFirst')}
          onChange={(event) => onChange({ village: event.target.value })}
          aria-invalid={Boolean(errors?.village)}
          aria-describedby={errors?.village ? `${villageId}-error` : undefined}
        />
        {errors?.village && (
          <p id={`${villageId}-error`} role="alert" className="mt-1.5 text-sm text-destructive">
            {errors.village}
          </p>
        )}
        <datalist id={listId}>
          {suggestions.map((name) => (
            <option key={name} value={name} />
          ))}
        </datalist>
      </div>
    </>
  );
}
