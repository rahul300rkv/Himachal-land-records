import { ArrowRight, History } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { StateMessage } from '@/components/layout/StateMessage';
import { Badge } from '@/components/ui/badge';
import type { Mutation } from '@/types/land-record';

const STATUS_TONE = { pending: 'warning', attested: 'success', rejected: 'danger' } as const;

/** Vertical timeline of mutations (intkal), newest first. */
export function MutationTimeline({ mutations }: { mutations: Mutation[] }) {
  const t = useTranslations('Record.mutations');
  const types = useTranslations('MutationTypes');
  const statuses = useTranslations('MutationStatus');
  const units = useTranslations('Units');
  const locale = useLocale();

  if (mutations.length === 0) {
    return <StateMessage icon={History} title={t('empty.title')} body={t('empty.body')} />;
  }

  const intl = locale === 'hi' ? 'hi-IN' : 'en-IN';
  const date = new Intl.DateTimeFormat(intl, { day: 'numeric', month: 'long', year: 'numeric' });
  const number = new Intl.NumberFormat(intl, { maximumFractionDigits: 4 });

  return (
    <ol className="relative ml-3 space-y-6 border-l-2 border-primary/20">
      {mutations.map((m) => (
        <li key={m.id} className="relative pl-6 sm:pl-8">
          <span
            className="absolute -left-[9px] top-1.5 size-4 rounded-full border-2 border-background bg-primary"
            aria-hidden="true"
          />

          <div className="rounded-lg border bg-card p-4 shadow-sm">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <time
                dateTime={m.mutation_date ?? undefined}
                className="font-serif text-base font-semibold"
              >
                {m.mutation_date ? date.format(new Date(m.mutation_date)) : t('dateUnknown')}
              </time>
              <Badge tone={STATUS_TONE[m.status]}>{statuses(m.status)}</Badge>
              <Badge tone="info">{types(m.mutation_type)}</Badge>
            </div>

            <p className="mt-1 text-sm text-muted-foreground">{t('number', { number: m.mutation_number })}</p>

            {(m.previous_owner || m.new_owner) && (
              <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1">
                <span>
                  <span className="sr-only">{t('from')}: </span>
                  {m.previous_owner ?? '-'}
                </span>
                <ArrowRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                <span className="font-medium">
                  <span className="sr-only">{t('to')}: </span>
                  {m.new_owner ?? '-'}
                </span>
              </p>
            )}

            {m.area_affected !== null && (
              <p className="mt-2 text-sm">
                <span className="text-muted-foreground">{t('area')}: </span>
                <span className="font-medium tabular-nums">
                  {number.format(m.area_affected)} {units(m.area_unit)}
                </span>
              </p>
            )}

            {m.remarks && (
              <p className="mt-2 text-sm text-muted-foreground">
                {t('remarks')}: {m.remarks}
              </p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
