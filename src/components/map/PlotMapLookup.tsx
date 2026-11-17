'use client';

import { ArrowUpRight, Copy, MapPinned, Search } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { LocationFields, type Location } from '@/components/search/LocationFields';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const OFFICIAL_BHUNAKSHA_URL = 'https://bhunakshahp.nic.in/home/';

export function PlotMapLookup() {
  const t = useTranslations('MapExplorer');
  const locale = useLocale();
  const [location, setLocation] = useState<Location>({ district: '', tehsil: '', village: '' });
  const [plot, setPlot] = useState('');
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const reference = useMemo(
    () => [location.district, location.tehsil, location.village, plot && `${t('plotLabel')}: ${plot}`].filter(Boolean).join(' · '),
    [location, plot, t],
  );

  function validate() {
    const next = {
      district: location.district ? '' : t('requiredDistrict'),
      tehsil: location.tehsil ? '' : t('requiredTehsil'),
      village: location.village ? '' : t('requiredVillage'),
      plot: plot.trim() ? '' : t('requiredPlot'),
    };
    setErrors(next);
    return !Object.values(next).some(Boolean);
  }

  function openOfficialMap() {
    if (!validate()) return;
    window.open(OFFICIAL_BHUNAKSHA_URL, '_blank', 'noopener,noreferrer');
  }

  async function copyReference() {
    if (!reference) return;
    await navigator.clipboard.writeText(reference);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  const searchParams = new URLSearchParams({
    ...(location.district && { district: location.district }),
    ...(location.tehsil && { tehsil: location.tehsil }),
    ...(location.village && { village: location.village }),
    ...(plot.trim() && { khasra: plot.trim() }),
  });

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(18rem,.75fr)]">
      <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-7" aria-labelledby="plot-map-form-title">
        <div className="flex items-start gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-notice text-primary">
            <MapPinned className="size-5" aria-hidden="true" />
          </span>
          <div>
            <h2 id="plot-map-form-title" className="text-2xl sm:text-3xl">{t('formTitle')}</h2>
            <p className="mt-1 text-muted-foreground">{t('formIntro')}</p>
          </div>
        </div>

        <div className="mt-7 grid gap-5 sm:grid-cols-2">
          <LocationFields
            {...location}
            fieldClassName="min-w-0"
            errors={{ district: errors.district, tehsil: errors.tehsil, village: errors.village }}
            onChange={(patch) => {
              setLocation((current) => ({ ...current, ...patch }));
              setErrors((current) => ({ ...current, ...Object.fromEntries(Object.keys(patch).map((key) => [key, ''])) }));
            }}
          />
          <div className="min-w-0">
            <Label htmlFor="plot-number">{t('plotLabel')}</Label>
            <Input
              id="plot-number"
              value={plot}
              inputMode="text"
              placeholder={t('plotPlaceholder')}
              aria-invalid={Boolean(errors.plot)}
              aria-describedby={errors.plot ? 'plot-number-error' : 'plot-number-hint'}
              onChange={(event) => {
                setPlot(event.target.value);
                setErrors((current) => ({ ...current, plot: '' }));
              }}
            />
            {errors.plot ? (
              <p id="plot-number-error" role="alert" className="mt-1.5 text-sm text-destructive">{errors.plot}</p>
            ) : (
              <p id="plot-number-hint" className="mt-1.5 text-sm text-muted-foreground">{t('plotHint')}</p>
            )}
          </div>
        </div>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Button type="button" size="lg" onClick={openOfficialMap}>
            {t('openOfficial')} <ArrowUpRight aria-hidden="true" />
          </Button>
          <Button type="button" size="lg" variant="outline" asChild>
            <a href={`/${locale}/search?${searchParams.toString()}`}>
              {t('searchRecords')} <Search aria-hidden="true" />
            </a>
          </Button>
        </div>
      </section>

      <aside className="rounded-2xl border border-primary/15 bg-primary-soft/60 p-5 sm:p-7">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">{t('officialEyebrow')}</p>
        <h2 className="mt-2 text-2xl">{t('officialTitle')}</h2>
        <ol className="mt-5 space-y-4 text-sm leading-6 text-muted-foreground">
          <li><strong className="text-foreground">1.</strong> {t('step1')}</li>
          <li><strong className="text-foreground">2.</strong> {t('step2')}</li>
          <li><strong className="text-foreground">3.</strong> {t('step3')}</li>
        </ol>
        {reference && (
          <div className="mt-6 rounded-xl border bg-background/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{t('reference')}</p>
            <p className="mt-2 break-words text-sm font-medium">{reference}</p>
            <button type="button" onClick={copyReference} className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary hover:underline">
              <Copy className="size-4" aria-hidden="true" /> {copied ? t('copied') : t('copy')}
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
