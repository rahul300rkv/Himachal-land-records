'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';

type Item = { id: string; name: string; hi?: string };

export type BhunakshaLocation = {
  /** BhuNaksha ids */
  districtId: string;
  tehsilId: string;
  villageId: string;
  /** Names stored with the listing. The district is the English name the filters use. */
  district: string;
  tehsil: string;
  village: string;
};

export const EMPTY_LOCATION: BhunakshaLocation = {
  districtId: '', tehsilId: '', villageId: '', district: '', tehsil: '', village: '',
};

/** The 10-digit BhuNaksha code, or '' until a village is chosen. */
export const gisCodeOf = (l: Pick<BhunakshaLocation, 'districtId' | 'tehsilId' | 'villageId'>) =>
  l.districtId && l.tehsilId && l.villageId ? `${l.districtId}${l.tehsilId}${l.villageId}` : '';

type Props = {
  /** Ids to show as selected, for example when editing a listing. */
  value: Pick<BhunakshaLocation, 'districtId' | 'tehsilId' | 'villageId'>;
  onChange: (next: BhunakshaLocation) => void;
  errors?: { district?: string; tehsil?: string; village?: string };
  disabled?: boolean;
};

async function load<T>(query: string): Promise<T> {
  const response = await fetch(`/api/bhunaksha/locations${query}`);
  if (!response.ok) throw new Error('locations');
  return response.json() as Promise<T>;
}

/**
 * District, tehsil and village dropdowns backed by the same BhuNaksha catalogue as the plot
 * map, so a listing's location always matches a village the plot map can open. It renders
 * three fields; place it inside a grid.
 */
export function BhunakshaLocationFields({ value, onChange, errors, disabled }: Props) {
  const t = useTranslations('Marketplace.form');
  const locale = useLocale();
  const [districts, setDistricts] = useState<Item[]>([]);
  const [tehsils, setTehsils] = useState<Item[]>([]);
  const [villages, setVillages] = useState<Item[]>([]);
  const [loading, setLoading] = useState<'' | 'districts' | 'tehsils' | 'villages'>('districts');
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let live = true;
    load<{ districts: Item[] }>('')
      .then((data) => live && setDistricts(data.districts))
      .catch(() => live && setFailed(true))
      .finally(() => live && setLoading((l) => (l === 'districts' ? '' : l)));
    return () => { live = false; };
  }, []);

  useEffect(() => {
    let live = true;
    setTehsils([]);
    if (!value.districtId) return;
    setLoading('tehsils');
    load<{ tehsils: Item[] }>(`?districtId=${value.districtId}`)
      .then((data) => live && setTehsils(data.tehsils))
      .catch(() => live && setFailed(true))
      .finally(() => live && setLoading((l) => (l === 'tehsils' ? '' : l)));
    return () => { live = false; };
  }, [value.districtId]);

  useEffect(() => {
    let live = true;
    setVillages([]);
    if (!value.districtId || !value.tehsilId) return;
    setLoading('villages');
    load<{ villages: Item[] }>(`?districtId=${value.districtId}&tehsilId=${value.tehsilId}`)
      .then((data) => live && setVillages(data.villages))
      .catch(() => live && setFailed(true))
      .finally(() => live && setLoading((l) => (l === 'villages' ? '' : l)));
    return () => { live = false; };
  }, [value.districtId, value.tehsilId]);

  const label = (item: Item) => (locale === 'hi' && item.hi ? item.hi : item.name);
  const district = districts.find((d) => d.id === value.districtId);
  const tehsil = tehsils.find((x) => x.id === value.tehsilId);

  const placeholder = (kind: 'districts' | 'tehsils' | 'villages', text: string) =>
    loading === kind ? t('loadingShort') : text;

  const err = (key?: string) =>
    key ? (
      <p role="alert" className="mt-1.5 text-sm font-medium text-destructive">
        {t(`errors.${key}` as 'errors.district')}
      </p>
    ) : null;

  return (
    <>
      {failed && (
        <p role="alert" className="text-sm text-destructive sm:col-span-3">
          {t('locationFailed')}
        </p>
      )}
      <div>
        <Label htmlFor="listing-district">{t('fields.district')}</Label>
        <Select
          id="listing-district"
          value={value.districtId}
          disabled={disabled || districts.length === 0}
          aria-invalid={Boolean(errors?.district)}
          onChange={(e) => {
            const next = districts.find((d) => d.id === e.target.value);
            onChange({ ...EMPTY_LOCATION, districtId: e.target.value, district: next?.name ?? '' });
          }}
        >
          <option value="">{placeholder('districts', t('fields.districtPlaceholder'))}</option>
          {districts.map((item) => (
            <option key={item.id} value={item.id}>{label(item)}</option>
          ))}
        </Select>
        {err(errors?.district)}
      </div>
      <div>
        <Label htmlFor="listing-tehsil">{t('fields.tehsil')}</Label>
        <Select
          id="listing-tehsil"
          value={value.tehsilId}
          disabled={disabled || tehsils.length === 0}
          aria-invalid={Boolean(errors?.tehsil)}
          onChange={(e) => {
            const next = tehsils.find((x) => x.id === e.target.value);
            onChange({
              ...EMPTY_LOCATION,
              districtId: value.districtId,
              district: district?.name ?? '',
              tehsilId: e.target.value,
              tehsil: next?.name ?? '',
            });
          }}
        >
          <option value="">{placeholder('tehsils', t('fields.tehsilPlaceholder'))}</option>
          {tehsils.map((item) => (
            <option key={item.id} value={item.id}>{label(item)}</option>
          ))}
        </Select>
        {err(errors?.tehsil)}
      </div>
      <div>
        <Label htmlFor="listing-village">{t('fields.village')}</Label>
        <Select
          id="listing-village"
          value={value.villageId}
          disabled={disabled || villages.length === 0}
          aria-invalid={Boolean(errors?.village)}
          onChange={(e) => {
            const next = villages.find((x) => x.id === e.target.value);
            onChange({
              districtId: value.districtId,
              district: district?.name ?? '',
              tehsilId: value.tehsilId,
              tehsil: tehsil?.name ?? '',
              villageId: e.target.value,
              village: next?.name ?? '',
            });
          }}
        >
          <option value="">{placeholder('villages', t('fields.villagePlaceholder'))}</option>
          {villages.map((item) => (
            <option key={item.id} value={item.id}>{label(item)}</option>
          ))}
        </Select>
        {err(errors?.village)}
      </div>
    </>
  );
}
