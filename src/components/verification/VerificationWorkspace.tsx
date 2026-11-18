'use client';

import { useMemo, useState } from 'react';
import { Check, Copy, ExternalLink, Gavel, Landmark, UserRoundSearch } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { LAND_SOURCES, type LandSource } from '@/lib/integrations/land-sources';

const ICONS: Record<LandSource['id'], typeof Landmark> = {
  himbhoomi: Landmark,
  'hp-high-court': Gavel,
  'district-courts': UserRoundSearch,
};

export function VerificationWorkspace() {
  const t = useTranslations('Verification');
  const [owner, setOwner] = useState('');
  const [district, setDistrict] = useState('');
  const [tehsil, setTehsil] = useState('');
  const [village, setVillage] = useState('');
  const [khasra, setKhasra] = useState('');
  const [year, setYear] = useState('');
  const [copied, setCopied] = useState(false);

  const brief = useMemo(
    () => [
      `${t('fields.owner')}: ${owner || '—'}`,
      `${t('fields.district')}: ${district || '—'}`,
      `${t('fields.tehsil')}: ${tehsil || '—'}`,
      `${t('fields.village')}: ${village || '—'}`,
      `${t('fields.khasra')}: ${khasra || '—'}`,
      `${t('fields.year')}: ${year || '—'}`,
    ].join('\n'),
    [district, khasra, owner, t, tehsil, village, year],
  );

  async function copyBrief() {
    await navigator.clipboard.writeText(brief);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="space-y-10">
      <section className="rounded-xl border bg-card p-5 shadow-sm sm:p-7">
        <h2 className="text-2xl">{t('brief.title')}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{t('brief.body')}</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(['owner', 'district', 'tehsil', 'village', 'khasra', 'year'] as const).map((field) => {
            const values = { owner, district, tehsil, village, khasra, year };
            const setters = { setOwner, setDistrict, setTehsil, setVillage, setKhasra, setYear };
            const setter = setters[`set${field[0].toUpperCase()}${field.slice(1)}` as keyof typeof setters];
            return (
              <label key={field} className="space-y-1.5 text-sm font-medium">
                <span>{t(`fields.${field}`)}</span>
                <input
                  value={values[field]}
                  onChange={(event) => setter(event.target.value)}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 font-normal"
                  autoComplete="off"
                />
              </label>
            );
          })}
        </div>
        <button type="button" onClick={copyBrief} className="mt-5 inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-semibold hover:bg-accent">
          {copied ? <Check className="size-4" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
          {copied ? t('brief.copied') : t('brief.copy')}
        </button>
        <p className="mt-3 text-xs text-muted-foreground">{t('brief.privacy')}</p>
      </section>

      <section>
        <h2 className="text-2xl">{t('sourcesTitle')}</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          {LAND_SOURCES.map((source) => {
            const Icon = ICONS[source.id];
            return (
              <article key={source.id} className="flex h-full flex-col rounded-xl border bg-card p-5">
                <div className="flex items-start justify-between gap-4">
                  <span className="flex size-11 items-center justify-center rounded-lg bg-primary-soft text-primary"><Icon className="size-5" aria-hidden="true" /></span>
                  <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium">{t(`sources.${source.id}.badge`)}</span>
                </div>
                <h3 className="mt-5 text-xl">{t(`sources.${source.id}.title`)}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{t(`sources.${source.id}.body`)}</p>
                <ul className="mt-4 space-y-2 text-sm">
                  <li>• {t(`sources.${source.id}.step1`)}</li>
                  <li>• {t(`sources.${source.id}.step2`)}</li>
                </ul>
                <a href={source.url} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 font-semibold text-primary-foreground hover:bg-primary/90">
                  {t(`sources.${source.id}.open`)} <ExternalLink className="size-4" aria-hidden="true" />
                </a>
              </article>
            );
          })}
        </div>
      </section>

      <section className="rounded-xl border border-notice-border bg-notice p-5 text-notice-foreground">
        <h2 className="text-xl text-notice-foreground">{t('limits.title')}</h2>
        <p className="mt-2 text-sm leading-relaxed">{t('limits.body')}</p>
      </section>
    </div>
  );
}
