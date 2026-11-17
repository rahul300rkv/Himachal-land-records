'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';

export function CircleRateEstimate({ locale }: { locale: string }) {
  const hindi = locale === 'hi';
  const [rate, setRate] = useState('');
  const [area, setArea] = useState('');
  const value = Number(rate) * Number(area);
  const valid = Number(rate) > 0 && Number(area) > 0 && Number.isFinite(value);
  const format = new Intl.NumberFormat(hindi ? 'hi-IN' : 'en-IN', { style: 'currency', currency: 'INR' });

  return (
    <section className="rounded-xl border bg-card p-5 sm:p-6">
      <h2 className="text-2xl">{hindi ? 'भूमि मूल्य का अनुमान' : 'Estimate land value'}</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        {hindi ? 'अधिसूचित दर दर्ज करें और क्षेत्रफल उसी इकाई में लिखें।' : 'Enter the published rate and the plot area in the same unit. For example, use square metres for both fields.'}
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium">
          {hindi ? 'प्रति इकाई दर (₹)' : 'Rate per unit (₹)'}
          <Input type="number" min="0" step="any" value={rate} onChange={(event) => setRate(event.target.value)} />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          {hindi ? 'उसी इकाई में क्षेत्रफल' : 'Area in the same unit'}
          <Input type="number" min="0" step="any" value={area} onChange={(event) => setArea(event.target.value)} />
        </label>
      </div>
      <p className="mt-4 rounded-lg bg-primary-soft p-3" aria-live="polite">
        {valid ? <strong>{format.format(value)}</strong> : hindi ? 'दर और क्षेत्रफल दर्ज करें।' : 'Enter a positive rate and area.'}
      </p>
    </section>
  );
}
