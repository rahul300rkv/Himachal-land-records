'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

/** Himachal Pradesh rates: 1 marla = 19.2 sq m, 1 kanal = 20 marla. */
const SQ_M_PER_UNIT = { marla: 19.2, kanal: 384, sq_m: 1 } as const;
type Unit = keyof typeof SQ_M_PER_UNIT;
const UNITS: Unit[] = ['kanal', 'marla', 'sq_m'];

export function LandConverter() {
  const t = useTranslations('Converter');
  const u = useTranslations('Units');
  const locale = useLocale();
  const [values, setValues] = useState<Record<Unit, string>>({ kanal: '1', marla: '20', sq_m: '384' });

  const fmt = (n: number) =>
    new Intl.NumberFormat(locale === 'hi' ? 'hi-IN' : 'en-IN', { maximumFractionDigits: 4 }).format(n);

  function update(unit: Unit, raw: string) {
    const n = parseFloat(raw);
    if (raw.trim() === '' || Number.isNaN(n) || n < 0) {
      setValues((v) => ({ ...v, [unit]: raw }));
      return;
    }
    const sqm = n * SQ_M_PER_UNIT[unit];
    const next = {} as Record<Unit, string>;
    for (const k of UNITS) next[k] = k === unit ? raw : String(+(sqm / SQ_M_PER_UNIT[k]).toFixed(4));
    setValues(next);
  }

  const sqm = parseFloat(values.sq_m) || 0;
  const wholeKanal = Math.floor(sqm / 384 + 1e-9);
  const restMarla = (sqm - wholeKanal * 384) / 19.2;

  return (
    <div className="land-search rounded-xl border bg-card p-6 shadow-sm sm:p-8">
      <div className="grid gap-5 sm:grid-cols-3">
        {UNITS.map((unit) => (
          <div key={unit} className="space-y-2">
            <Label htmlFor={`conv-${unit}`}>{u(unit)}</Label>
            <Input
              id={`conv-${unit}`}
              type="number"
              inputMode="decimal"
              min={0}
              step="any"
              value={values[unit]}
              onChange={(e) => update(unit, e.target.value)}
            />
          </div>
        ))}
      </div>

      <p className="mt-6 rounded-md bg-muted px-4 py-3 text-base" aria-live="polite">
        {t('result', { kanal: fmt(wholeKanal), marla: fmt(+restMarla.toFixed(4)), sqm: fmt(sqm) })}
      </p>

      <ul className="mt-6 space-y-1 text-sm text-muted-foreground">
        <li>{t('rateMarla')}</li>
        <li>{t('rateKanal')}</li>
      </ul>
    </div>
  );
}
