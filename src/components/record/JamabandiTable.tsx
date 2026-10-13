import { useLocale, useTranslations } from 'next-intl';
import { districtLabel, tehsilLabel } from '@/lib/data/districts';
import type { RecordExtras } from '@/lib/record';
import type { LandRecord } from '@/types/land-record';

type Row = { label: string; value: string };
type Group = { key: 'location' | 'identifiers' | 'ownership' | 'land' | 'source'; rows: Row[] };

/** All jamabandi details of a record in one clean, scannable table. */
export function JamabandiTable({ record, extras }: { record: LandRecord; extras: RecordExtras }) {
  const t = useTranslations('Record.jamabandi');
  const land = useTranslations('LandTypes');
  const units = useTranslations('Units');
  const locale = useLocale();

  const na = t('notProvided');
  const intl = locale === 'hi' ? 'hi-IN' : 'en-IN';
  const number = new Intl.NumberFormat(intl, { maximumFractionDigits: 4 });
  const date = new Intl.DateTimeFormat(intl, { day: 'numeric', month: 'long', year: 'numeric' });

  const groups: Group[] = [
    {
      key: 'location',
      rows: [
        { label: t('fields.district'), value: districtLabel(record.district, locale) },
        { label: t('fields.tehsil'), value: tehsilLabel(record.district, record.tehsil, locale) },
        { label: t('fields.village'), value: record.village },
      ],
    },
    {
      key: 'identifiers',
      rows: [
        { label: t('fields.khasra'), value: record.khasra_number },
        { label: t('fields.khewat'), value: record.khewat_number ?? na },
        { label: t('fields.khatauni'), value: record.khatauni_number ?? na },
      ],
    },
    {
      key: 'ownership',
      rows: [
        { label: t('fields.owner'), value: record.owner_name },
        { label: t('fields.fatherName'), value: record.father_name ?? na },
        { label: t('fields.share'), value: extras.share ?? na },
        { label: t('fields.cultivator'), value: extras.cultivator ?? na },
      ],
    },
    {
      key: 'land',
      rows: [
        { label: t('fields.area'), value: `${number.format(record.area)} ${units(record.area_unit)}` },
        ...(extras.areaText ? [{ label: t('fields.areaAsRecorded'), value: extras.areaText }] : []),
        { label: t('fields.landType'), value: land(record.land_type) },
        { label: t('fields.year'), value: String(record.jamabandi_year) },
      ],
    },
    {
      key: 'source',
      rows: [
        { label: t('fields.source'), value: record.source ?? na },
        {
          label: t('fields.review'),
          value: record.is_verified ? t('reviewValues.verified') : t('reviewValues.unverified'),
        },
        { label: t('fields.updated'), value: date.format(new Date(record.updated_at)) },
        ...(extras.remarks ? [{ label: t('fields.remarks'), value: extras.remarks }] : []),
      ],
    },
  ];

  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <table className="w-full border-collapse text-left text-base">
        <caption className="border-b bg-secondary/60 px-4 py-2.5 text-left text-sm text-muted-foreground">
          {t('caption')}
        </caption>
        {groups.map((group) => (
          <tbody key={group.key} className="border-b last:border-b-0">
            <tr>
              <th
                colSpan={2}
                scope="colgroup"
                className="bg-primary-soft px-4 py-2 text-sm font-semibold text-primary"
              >
                {t(`groups.${group.key}`)}
              </th>
            </tr>
            {group.rows.map((row) => (
              <tr key={row.label} className="border-t">
                <th
                  scope="row"
                  className="w-2/5 px-4 py-3 align-top text-sm font-normal text-muted-foreground sm:w-1/3"
                >
                  {row.label}
                </th>
                <td className="px-4 py-3 align-top font-medium [overflow-wrap:anywhere]">{row.value}</td>
              </tr>
            ))}
          </tbody>
        ))}
      </table>
    </div>
  );
}
