'use client';

import { useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

/** Himachal Pradesh rates: 1 marla = 19.2 sq m, 1 kanal = 20 marla. */
const SQ_M_PER_UNIT = { kanal: 384, marla: 19.2, sq_m: 1, sq_ft: 0.09290304 } as const;
type Unit = keyof typeof SQ_M_PER_UNIT;
const UNITS: Unit[] = ['kanal', 'marla', 'sq_m', 'sq_ft'];

export function LandConverter() {
  const t = useTranslations('Converter');
  const u = useTranslations('Units');
  const locale = useLocale();
  const [value, setValue] = useState('1');
  const [from, setFrom] = useState<Unit>('kanal');
  const [to, setTo] = useState<Unit>('marla');

  const fmt = (n: number) =>
    new Intl.NumberFormat(locale === 'hi' ? 'hi-IN' : 'en-IN', { maximumFractionDigits: 4 }).format(n);

  const result = useMemo(() => {
    const n = parseFloat(value);
    if (value.trim() === '' || Number.isNaN(n) || n < 0) return null;
    return (n * SQ_M_PER_UNIT[from]) / SQ_M_PER_UNIT[to];
  }, [value, from, to]);

  const selectClass =
    'h-10 w-full rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

  return (
    <div className="land-search rounded-xl border bg-card p-6 shadow-sm sm:p-8">
      <div className="grid gap-5 sm:grid-cols-[1fr_1fr_1fr]">
        <div className="space-y-2">
          <Label htmlFor="conv-value">{t('value')}</Label>
          <Input
            id="conv-value"
            type="number"
            inputMode="decimal"
            min={0}
            step="any"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="conv-from">{t('from')}</Label>
          <select id="conv-from" className={selectClass} value={from} onChange={(e) => setFrom(e.target.value as Unit)}>
            {UNITS.map((unit) => (
              <option key={unit} value={unit}>
                {u(unit)}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="conv-to">{t('to')}</Label>
          <select id="conv-to" className={selectClass} value={to} onChange={(e) => setTo(e.target.value as Unit)}>
            {UNITS.map((unit) => (
              <option key={unit} value={unit}>
                {u(unit)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="mt-6 rounded-md bg-muted px-4 py-3 text-base font-medium" aria-live="polite">
        {result === null
          ? t('enterValue')
          : t('result', { value: fmt(parseFloat(value)), from: u(from), result: fmt(+result.toFixed(6)), to: u(to) })}
      </p>

      <ul className="mt-6 space-y-1 text-sm text-muted-foreground">
        <li>{t('rateMarla')}</li>
        <li>{t('rateKanal')}</li>
        <li>{t('rateSqft')}</li>
      </ul>
    </div>
  );
}
