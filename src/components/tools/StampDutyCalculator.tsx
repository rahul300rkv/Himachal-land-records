'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { estimateRegistrationFee, estimateStampDuty, type Deed } from '@/lib/stamp-duty';
import type { StampDutyCopy } from '@/lib/stamp-duty-copy';

export function StampDutyCalculator({ copy, locale }: { copy: StampDutyCopy; locale: string }) {
  const [deed, setDeed] = useState<Deed>('sale');
  const [market, setMarket] = useState('');
  const [consideration, setConsideration] = useState('');
  const [fee, setFee] = useState('');
  const [earlierValue, setEarlierValue] = useState('');
  const [years, setYears] = useState('');
  const [woman, setWoman] = useState(false);
  const [familyGift, setFamilyGift] = useState(false);
  const [section118, setSection118] = useState(false);
  const [indefinite, setIndefinite] = useState(false);
  const [exemptLease, setExemptLease] = useState(false);
  const useConsideration = deed === 'sale' || (deed === 'lease' && indefinite);
  const standardTransfer = (deed === 'sale' && !section118) || (deed === 'gift' && !familyGift);
  const values = [market, fee, useConsideration ? consideration : '', standardTransfer ? earlierValue : ''];
  const valid = Number(market) > 0 && values.every((value) => Number.isFinite(Number(value)) && Number(value) >= 0)
    && (deed !== 'lease' || indefinite || exemptLease || (Number(years) > 0 && Number.isFinite(Number(years))));
  const estimate = valid ? estimateStampDuty({
    deed, market: Number(market), consideration: Number(consideration), woman, familyGift, section118,
    leaseYears: Number(years), indefinite, earlierValue: standardTransfer ? Number(earlierValue) : 0,
  }) : null;
  const duty = deed === 'lease' && exemptLease ? 0 : estimate?.duty;
  const registration = estimate ? (fee === '' ? estimateRegistrationFee(estimate.value) : Number(fee)) : 0;
  const money = new Intl.NumberFormat(locale === 'hi' ? 'hi-IN' : 'en-IN', { style: 'currency', currency: 'INR' });

  return (
    <div className="mt-8 grid gap-5 lg:grid-cols-2">
      <div className="grid gap-4 rounded-xl border bg-card p-5 sm:grid-cols-2">
        <label className="grid content-start gap-2 text-sm font-medium">{copy.deed}
          <Select value={deed} onChange={(event) => {
            setDeed(event.target.value as Deed);
            setConsideration('');
            setEarlierValue('');
            setSection118(false);
            setFee('');
          }}>
            <option value="sale">{copy.sale}</option>
            <option value="gift">{copy.gift}</option>
            <option value="lease">{copy.lease}</option>
          </Select>
        </label>
        {deed === 'lease' && (
          <label className="grid content-start gap-2 text-sm font-medium">{copy.term}
            <Select value={indefinite ? 'indefinite' : 'fixed'} onChange={(event) => setIndefinite(event.target.value === 'indefinite')}>
              <option value="fixed">{copy.fixed}</option>
              <option value="indefinite">{copy.indefinite}</option>
            </Select>
          </label>
        )}
        <label className="grid content-start gap-2 text-sm font-medium">{copy.market}
          <Input type="number" min="1" step="any" value={market} onChange={(event) => setMarket(event.target.value)} />
        </label>
        {useConsideration && (
          <label className="grid content-start gap-2 text-sm font-medium">{deed === 'lease' ? copy.leaseAmount : copy.consideration}
            <Input type="number" min="0" step="any" value={consideration} onChange={(event) => setConsideration(event.target.value)} />
          </label>
        )}
        {deed === 'lease' && !indefinite && (
          <label className="grid content-start gap-2 text-sm font-medium">{copy.years}
            <Input type="number" min="0" step="any" value={years} onChange={(event) => setYears(event.target.value)} />
          </label>
        )}
        {deed === 'gift' && <label className="flex min-h-12 items-center gap-3 text-sm sm:col-span-2">
          <input type="checkbox" className="size-5 shrink-0" checked={familyGift} onChange={(event) => setFamilyGift(event.target.checked)} />
          {copy.family}
        </label>}
        {deed !== 'gift' && <label className="flex min-h-12 items-center gap-3 text-sm sm:col-span-2">
          <input type="checkbox" className="size-5 shrink-0" checked={section118} onChange={(event) => {
            setSection118(event.target.checked);
            if (event.target.checked) setExemptLease(false);
          }} />
          {copy.section118}
        </label>}
        {deed === 'lease' && !section118 && <label className="flex min-h-12 items-center gap-3 text-sm sm:col-span-2">
          <input type="checkbox" className="size-5 shrink-0" checked={exemptLease} onChange={(event) => setExemptLease(event.target.checked)} />
          {copy.exempt}
        </label>}
        {standardTransfer && <>
          <label className="grid content-start gap-2 text-sm font-medium">{copy.recipient}
            <Select value={woman ? 'woman' : 'other'} onChange={(event) => setWoman(event.target.value === 'woman')}>
              <option value="other">{copy.other}</option>
              <option value="woman">{copy.woman}</option>
            </Select>
          </label>
          <label className="grid content-start gap-2 text-sm font-medium">{copy.earlier}
            <Input type="number" min="0" step="any" value={earlierValue} onChange={(event) => setEarlierValue(event.target.value)} />
          </label>
        </>}
        <label className="grid content-start gap-2 text-sm font-medium">{copy.fee}
          <Input type="number" min="0" step="any" value={fee} onChange={(event) => setFee(event.target.value)} />
        </label>
      </div>
      <section className="rounded-xl border bg-primary-soft p-5" aria-live="polite">
        <h2 className="text-2xl">{copy.result}</h2>
        {estimate && duty !== undefined ? <>
          <dl className="mt-4 grid grid-cols-[1fr_auto] gap-3">
            <dt>{copy.base}</dt><dd>{money.format(estimate.value)}</dd>
            <dt>{copy.rate}</dt><dd>{duty === 0 ? 0 : estimate.rate}%</dd>
            <dt>{copy.duty}</dt><dd className="font-semibold">{money.format(duty)}</dd>
            <dt>{fee === '' ? copy.registration : copy.registrationQuoted}</dt><dd>{money.format(registration)}</dd>
            <dt className="font-semibold">{copy.total}</dt><dd className="font-semibold">{money.format(duty + registration)}</dd>
          </dl>
          {estimate.linked && <p className="mt-4 text-sm">{copy.linked}</p>}
        </> : <p className="mt-4 text-sm">{copy.empty}</p>}
        <p className="mt-4 text-sm text-muted-foreground">{copy.verify}</p>
      </section>
    </div>
  );
}