import { FileText, MapPin } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { districtLabel, tehsilLabel } from '@/lib/data/districts';
import { Link } from '@/i18n/navigation';
import type { LandRecord } from '@/types/land-record';

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 font-semibold tabular-nums">{value}</dd>
    </div>
  );
}

export function ResultCard({ record }: { record: LandRecord }) {
  const t = useTranslations('Search.card');
  const land = useTranslations('LandTypes');
  const units = useTranslations('Units');
  const locale = useLocale();

  const number = new Intl.NumberFormat(locale === 'hi' ? 'hi-IN' : 'en-IN', { maximumFractionDigits: 4 });
  const na = t('notAvailable');

  const place = [
    record.village,
    tehsilLabel(record.district, record.tehsil, locale),
    districtLabel(record.district, locale),
  ].join(', ');

  return (
    <article className="flex flex-col rounded-lg border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
      <header>
        <h3 className="font-sans text-lg font-semibold leading-snug tracking-normal">{record.owner_name}</h3>
        {record.father_name && (
          <p className="mt-0.5 text-sm text-muted-foreground">
            {t('fatherName')}: {record.father_name}
          </p>
        )}
        <p className="mt-2 flex items-start gap-1.5 text-sm text-muted-foreground">
          <MapPin className="mt-0.5 size-4 shrink-0 text-leaf" aria-hidden="true" />
          <span>{place}</span>
        </p>
      </header>

      <dl className="mt-4 grid grid-cols-3 gap-3 rounded-md bg-secondary px-3 py-3 text-sm">
        <Field label={t('khasra')} value={record.khasra_number} />
        <Field label={t('khewat')} value={record.khewat_number ?? na} />
        <Field label={t('khatauni')} value={record.khatauni_number ?? na} />
      </dl>

      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm sm:grid-cols-3">
        <Field label={t('area')} value={`${number.format(record.area)} ${units(record.area_unit)}`} />
        <Field label={t('landType')} value={land(record.land_type)} />
        <Field label={t('year')} value={String(record.jamabandi_year)} />
      </dl>

      <div className="mt-5 pt-1">
        <Button asChild variant="outline" className="w-full sm:w-auto">
          <Link href={`/record/${record.id}`} aria-label={t('viewRecordFor', { owner: record.owner_name })}>
            <FileText />
            {t('viewRecord')}
          </Link>
        </Button>
      </div>
    </article>
  );
}
