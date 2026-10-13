import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import { districtLabel, tehsilLabel } from '@/lib/data/districts';
import { extractExtras } from '@/lib/record-extras';
import type { ReportLocale, ReportSnapshot } from '@/lib/report';

/** Loosely typed translate function (the route builds it from the message catalogue). */
type T = (key: string, values?: Record<string, string | number>) => string;

type ReportTemplateProps = { snapshot: ReportSnapshot; t: T; locale: ReportLocale };

const color = {
  primary: '#236aa8',
  text: '#1b2430',
  muted: '#5a6675',
  border: '#d6dde6',
  soft: '#eef4fa',
  notice: '#fff4d6',
  noticeBorder: '#e3c36b',
  noticeText: '#5b3a10',
  danger: '#a12a2a',
};

const styles = StyleSheet.create({
  page: {
    // Latin first, Devanagari as per-glyph fallback.
    fontFamily: ['Hind', 'HindDeva'],
    fontSize: 10,
    color: color.text,
    paddingTop: 36,
    paddingBottom: 56,
    paddingHorizontal: 40,
  },
  // Line height lives on this wrapper, NOT on the Page: a Page-level lineHeight stops react-pdf
  // from rendering the fixed footer.
  body: { lineHeight: 0.8 },
  brand: { fontSize: 8.5, color: color.muted },
  title: { fontSize: 22, fontWeight: 700, color: color.primary, marginTop: 8, lineHeight: 1.6 },
  subtitle: { fontSize: 11, color: color.muted, marginTop: 4, lineHeight: 1.5 },
  idBox: {
    marginTop: 14,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: color.border,
    backgroundColor: color.soft,
    borderRadius: 4,
  },
  idCell: { flex: 1, padding: 8 },
  idLabel: { fontSize: 8, color: color.muted },
  idValue: { fontSize: 11, fontWeight: 700, marginTop: 1 },
  demo: {
    marginTop: 10,
    padding: 6,
    textAlign: 'center',
    fontWeight: 700,
    fontSize: 10,
    color: color.danger,
    borderWidth: 1,
    borderColor: color.danger,
    borderStyle: 'dashed',
    borderRadius: 4,
  },
  heading: {
    marginTop: 18,
    paddingBottom: 3,
    fontSize: 12.5,
    fontWeight: 700,
    color: color.primary,
    borderBottomWidth: 1.5,
    borderBottomColor: color.primary,
  },
  fieldsWrap: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 6 },
  field: { width: '50%', paddingVertical: 4, paddingRight: 10 },
  fieldLabel: { fontSize: 8, color: color.muted },
  fieldValue: { fontSize: 10.5, fontWeight: 700, marginTop: 1 },
  note: { marginTop: 8, fontSize: 9, color: color.muted },
  table: { marginTop: 8, borderWidth: 1, borderColor: color.border, borderRadius: 3 },
  tr: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: color.border },
  trHead: { flexDirection: 'row', backgroundColor: color.soft },
  th: { fontSize: 8.5, fontWeight: 700, padding: 5 },
  td: { fontSize: 9, padding: 5 },
  box: {
    marginTop: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: color.border,
    borderStyle: 'dashed',
    borderRadius: 4,
  },
  boxRow: { flexDirection: 'row', justifyContent: 'space-between' },
  flag: { flexDirection: 'row', marginTop: 5 },
  flagMark: { width: 14, fontWeight: 700, color: color.primary },
  flagText: { flex: 1 },
  disclaimer: {
    marginTop: 8,
    padding: 10,
    backgroundColor: color.notice,
    borderWidth: 1,
    borderColor: color.noticeBorder,
    borderRadius: 4,
    color: color.noticeText,
  },
  disclaimerItem: { flexDirection: 'row', marginTop: 4, fontSize: 9 },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: color.border,
    paddingTop: 6,
  },
  footerText: { fontSize: 8, color: color.muted, textAlign: 'center' },
});

const DISCLAIMER_POINTS = [
  'independent',
  'notLegalRecord',
  'accuracy',
  'verify',
  'noAdvice',
  'landLaws',
  'marketplace',
  'liability',
] as const;

function Field({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.field} wrap={false}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>{value}</Text>
    </View>
  );
}

/** The pre-purchase check report. Rendered to PDF on the server by @react-pdf/renderer. */
export function ReportTemplate({ snapshot, t, locale }: ReportTemplateProps) {
  const { record, mutations, flags, circleRate } = snapshot;
  const intl = locale === 'hi' ? 'hi-IN' : 'en-IN';

  const number = new Intl.NumberFormat(intl, { maximumFractionDigits: 4 });
  const fmtDate = (iso: string) =>
    new Intl.DateTimeFormat(intl, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' }).format(
      new Date(iso),
    );
  const fmtDateTime = (iso: string) =>
    `${new Intl.DateTimeFormat(intl, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Kolkata',
    }).format(new Date(iso))} IST`;

  const extras = extractExtras(record.raw_data);
  const na = t('Report.pdf.fields.notProvided');
  const f = (key: string) => t(`Report.pdf.fields.${key}`);
  const areaText = `${number.format(record.area)} ${t(`Units.${record.area_unit}`)}`;

  const flagText = (flag: ReportSnapshot['flags'][number]) => {
    const values: Record<string, string | number> = {};
    for (const [key, value] of Object.entries(flag.values ?? {})) {
      values[key] =
        key === 'date' ? fmtDate(String(value)) : key === 'landType' ? t(`LandTypes.${value}`) : value;
    }
    return t(`Report.pdf.flags.${flag.code}`, values);
  };

  // Column widths (percent) of the mutation table
  const col = { number: '14%', date: '17%', type: '14%', status: '13%', parties: '30%', area: '12%' };

  return (
    <Document
      title={`${t('Report.pdf.title')} ${snapshot.displayId}`}
      author="HimLand Check"
      subject={t('Report.pdf.subtitle')}
      language={locale}
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.body}>
        {/* Header */}
        <Text style={styles.brand}>{t('Report.pdf.brandLine')}</Text>
        <Text style={styles.title}>{t('Report.pdf.title')}</Text>
        <Text style={styles.subtitle}>{t('Report.pdf.subtitle')}</Text>

        <View style={styles.idBox}>
          <View style={styles.idCell}>
            <Text style={styles.idLabel}>{t('Report.pdf.reportId')}</Text>
            <Text style={styles.idValue}>{snapshot.displayId}</Text>
          </View>
          <View style={styles.idCell}>
            <Text style={styles.idLabel}>{t('Report.pdf.generatedOn')}</Text>
            <Text style={styles.idValue}>{fmtDateTime(snapshot.generatedAt)}</Text>
          </View>
        </View>

        {snapshot.demo && <Text style={styles.demo}>{t('Report.pdf.demoMark')}</Text>}

        {/* 1. Land details summary */}
        <Text style={styles.heading} minPresenceAhead={60}>{t('Report.pdf.sections.summary')}</Text>
        <View style={styles.fieldsWrap}>
          <Field label={f('district')} value={districtLabel(record.district, locale)} />
          <Field label={f('tehsil')} value={tehsilLabel(record.district, record.tehsil, locale)} />
          <Field label={f('village')} value={record.village} />
          <Field label={f('year')} value={String(record.jamabandi_year)} />
          <Field label={f('khasra')} value={record.khasra_number} />
          <Field label={f('khewat')} value={record.khewat_number ?? na} />
          <Field label={f('khatauni')} value={record.khatauni_number ?? na} />
          <Field label={f('landType')} value={t(`LandTypes.${record.land_type}`)} />
          <Field label={f('area')} value={areaText} />
          {extras.areaText && <Field label={f('areaAsRecorded')} value={extras.areaText} />}
        </View>

        {/* 2. Ownership information */}
        <Text style={styles.heading} minPresenceAhead={60}>{t('Report.pdf.sections.ownership')}</Text>
        <View style={styles.fieldsWrap}>
          <Field label={f('owner')} value={record.owner_name} />
          <Field label={f('fatherName')} value={record.father_name ?? na} />
          <Field label={f('share')} value={extras.share ?? na} />
          <Field label={f('cultivator')} value={extras.cultivator ?? na} />
          <Field
            label={f('review')}
            value={t(`Record.jamabandi.reviewValues.${record.is_verified ? 'verified' : 'unverified'}`)}
          />
        </View>
        <Text style={styles.note}>{t('Report.pdf.ownershipNote')}</Text>

        {/* 3. Mutation history */}
        <Text style={styles.heading} minPresenceAhead={60}>{t('Report.pdf.sections.mutations')}</Text>
        {mutations.length === 0 ? (
          <Text style={styles.note}>{t('Report.pdf.mutationsEmpty')}</Text>
        ) : (
          <View style={styles.table}>
            <View style={styles.trHead} minPresenceAhead={60}>
              <Text style={[styles.th, { width: col.number }]}>{t('Report.pdf.mutationsTable.number')}</Text>
              <Text style={[styles.th, { width: col.date }]}>{t('Report.pdf.mutationsTable.date')}</Text>
              <Text style={[styles.th, { width: col.type }]}>{t('Report.pdf.mutationsTable.type')}</Text>
              <Text style={[styles.th, { width: col.status }]}>{t('Report.pdf.mutationsTable.status')}</Text>
              <Text style={[styles.th, { width: col.parties }]}>{t('Report.pdf.mutationsTable.parties')}</Text>
              <Text style={[styles.th, { width: col.area }]}>{t('Report.pdf.mutationsTable.area')}</Text>
            </View>
            {mutations.map((m) => (
              <View key={m.id} style={styles.tr} wrap={false}>
                <Text style={[styles.td, { width: col.number }]}>{m.mutation_number}</Text>
                <Text style={[styles.td, { width: col.date }]}>{m.mutation_date ? fmtDate(m.mutation_date) : '-'}</Text>
                <Text style={[styles.td, { width: col.type }]}>{t(`MutationTypes.${m.mutation_type}`)}</Text>
                <Text style={[styles.td, { width: col.status }]}>{t(`MutationStatus.${m.status}`)}</Text>
                <View style={{ width: col.parties, padding: 5 }}>
                  <Text style={{ fontSize: 9 }}>{`${t('Record.mutations.from')}: ${m.previous_owner ?? '-'}`}</Text>
                  <Text style={{ fontSize: 9 }}>{`${t('Record.mutations.to')}: ${m.new_owner ?? '-'}`}</Text>
                </View>
                <Text style={[styles.td, { width: col.area }]}>
                  {m.area_affected !== null ? `${number.format(m.area_affected)} ${t(`Units.${m.area_unit}`)}` : '-'}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* 4. Circle rate (placeholder) */}
        <Text style={styles.heading} minPresenceAhead={60}>{t('Report.pdf.sections.circleRate')}</Text>
        <View style={styles.box} wrap={false}>
          <View style={styles.boxRow}>
            <Text style={styles.fieldLabel}>{t('Report.pdf.circleRate.rate')}</Text>
            <Text style={styles.fieldValue}>
              {circleRate.status === 'available'
                ? `₹${new Intl.NumberFormat(intl).format(circleRate.perUnit)} / ${t(`Units.${circleRate.unit}`)}`
                : t('Report.pdf.circleRate.value')}
            </Text>
          </View>
          <Text style={[styles.note, { marginTop: 6 }]}>{t('Report.pdf.circleRate.body')}</Text>
        </View>

        {/* 5. Points to verify */}
        <Text style={styles.heading} minPresenceAhead={60}>{t('Report.pdf.sections.verify')}</Text>
        <Text style={styles.note}>{t('Report.pdf.flagsIntro')}</Text>
        {flags.length === 0 ? (
          <Text style={[styles.note, { color: color.text }]}>{t('Report.pdf.flagsNone')}</Text>
        ) : (
          flags.map((flag, index) => (
            <View key={`${flag.code}-${index}`} style={styles.flag} wrap={false}>
              <Text style={styles.flagMark}>{index + 1}.</Text>
              <Text style={styles.flagText}>{flagText(flag)}</Text>
            </View>
          ))
        )}

        {/* 6. Legal disclaimer */}
        <Text style={styles.heading} minPresenceAhead={60}>{t('Report.pdf.sections.disclaimer')}</Text>
        <View style={styles.disclaimer}>
          <Text style={{ fontWeight: 700, fontSize: 9.5 }}>{t('Report.pdf.reportDisclaimer')}</Text>
          {DISCLAIMER_POINTS.map((key, index) => (
            <View key={key} style={styles.disclaimerItem} wrap={false}>
              <Text style={{ width: 14, fontWeight: 700 }}>{index + 1}.</Text>
              <Text style={{ flex: 1 }}>{t(`Disclaimer.points.${key}`)}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.note}>{t('Report.pdf.snapshot', { date: fmtDate(snapshot.generatedAt) })}</Text>

        </View>

        {/* Footer on every page */}
        <View fixed style={styles.footer}>
          <Text
            style={styles.footerText}
            render={({ pageNumber, totalPages }) =>
              t('Report.pdf.footer', { id: snapshot.displayId, page: pageNumber, total: totalPages })
            }
          />
        </View>
      </Page>
    </Document>
  );
}
