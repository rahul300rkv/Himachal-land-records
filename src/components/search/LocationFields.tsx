'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useId, useState } from 'react';
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
  const [suggestions, setSuggestions] = useState<Array<{ key: string; value: string; label: string }>>([]);
  const [isLoadingVillages, setIsLoadingVillages] = useState(false);

  const tehsils = getTehsils(district);
  const tehsilGroups = [
    { kind: 'tehsil', label: t('tehsilGroup') },
    { kind: 'sub-tehsil', label: t('subTehsilGroup') },
    { kind: 'administrative-unit', label: t('administrativeUnitGroup') },
  ] as const;

  // Load the official village dropdown for the selected administrative unit.
  useEffect(() => {
    if (!district || !tehsil) {
      setSuggestions([]);
      setIsLoadingVillages(false);
      return;
    }
    const controller = new AbortController();
    setSuggestions([]);
    setIsLoadingVillages(true);
    const params = new URLSearchParams({ district, tehsil, locale });
    fetch(`/api/villages?${params}`, { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : { villages: [] }))
      .then((data: { villages?: Array<{ key: string; value: string; label: string }> }) => setSuggestions(data.villages ?? []))
      .catch(() => setSuggestions([]))
      .finally(() => setIsLoadingVillages(false));
    return () => controller.abort();
  }, [district, tehsil, locale]);

  const tehsilId = `${uid}-tehsil`;
  const villageId = `${uid}-village`;

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
          {tehsilGroups.map((group) => {
            const items = tehsils.filter((item) => item.kind === group.kind);
            return items.length ? (
              <optgroup key={group.kind} label={group.label}>
                {items.map((item) => (
                  <option key={item.value} value={item.value}>{locale === 'hi' ? item.hi : item.value}</option>
                ))}
              </optgroup>
            ) : null;
          })}
        </Select>
        {errors?.tehsil && (
          <p id={`${tehsilId}-error`} role="alert" className="mt-1.5 text-sm text-destructive">
            {errors.tehsil}
          </p>
        )}
      </div>

      <div className={fieldClassName}>
        <Label htmlFor={villageId}>{t('village')}</Label>
        <Select
          id={villageId}
          name="village"
          value={village}
          disabled={!tehsil || isLoadingVillages}
          onChange={(event) => onChange({ village: event.target.value })}
          aria-invalid={Boolean(errors?.village)}
          aria-describedby={errors?.village ? `${villageId}-error` : undefined}
        >
          <option value="">
            {!tehsil
              ? t('villageFirst')
              : isLoadingVillages
                ? t('villageLoading')
                : suggestions.length
                  ? t('villagePlaceholder')
                  : t('villageEmpty')}
          </option>
          {suggestions.map((item) => (
            <option key={item.key} value={item.value}>{item.label}</option>
          ))}
        </Select>
        {errors?.village && (
          <p id={`${villageId}-error`} role="alert" className="mt-1.5 text-sm text-destructive">
            {errors.village}
          </p>
        )}
      </div>
    </>
  );
}
