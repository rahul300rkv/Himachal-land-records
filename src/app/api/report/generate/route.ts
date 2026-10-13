import { renderToBuffer, type DocumentProps } from '@react-pdf/renderer';
import { createElement, type ReactElement } from 'react';
import { z } from 'zod';
import { ReportTemplate } from '@/components/reports/ReportTemplate';
import { getCurrentUser } from '@/lib/auth';
import { getCircleRate } from '@/lib/data/circle-rates';
import { registerPdfFonts } from '@/lib/pdf-fonts';
import { getRecordWithMutations } from '@/lib/record';
import { computeFlags, displayReportId, type ReportLocale, type ReportSnapshot } from '@/lib/report';
import { createReportTranslator } from '@/lib/report-i18n';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { districtLabel, tehsilLabel } from '@/lib/data/districts';
import type { Json } from '@/types/database';

// @react-pdf/renderer needs the Node.js runtime (not Edge) and must never be cached.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_REPORTS_PER_HOUR = 10;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const bodySchema = z.object({
  recordId: z.string().min(1).max(64),
  locale: z.enum(['en', 'hi']).default('en'),
});

const json = (body: Record<string, unknown>, status: number) => Response.json(body, { status });

async function renderPdf(snapshot: ReportSnapshot, locale: ReportLocale) {
  registerPdfFonts();
  const element = createElement(ReportTemplate, {
    snapshot,
    t: createReportTranslator(locale),
    locale,
  }) as unknown as ReactElement<DocumentProps>;
  return renderToBuffer(element);
}

function pdfResponse(pdf: Buffer, snapshot: ReportSnapshot, persisted: boolean) {
  return new Response(new Uint8Array(pdf), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${snapshot.displayId}.pdf"`,
      'Cache-Control': 'private, no-store',
      'X-Report-Id': snapshot.displayId,
      'X-Report-Persisted': String(persisted),
    },
  });
}

/**
 * POST /api/report/generate   { recordId, locale }
 * Builds a pre-purchase check report for a land record, stores a snapshot of it (when the
 * service-role key is configured) and returns the PDF.
 */
export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return json({ error: 'invalid_request' }, 400);
  const { recordId, locale } = parsed.data;

  // Demo mode (no Supabase) lets you try the feature on the fictional sample records.
  const demo = !isSupabaseConfigured;
  const user = await getCurrentUser();
  if (!demo && !user) return json({ error: 'unauthorized' }, 401);

  try {
    const result = await getRecordWithMutations(recordId);
    if (!result) return json({ error: 'not_found' }, 404);

    const admin = demo ? null : createAdminClient();

    // Simple abuse guard: limit reports per user per hour.
    if (admin && user) {
      const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      const { count } = await admin
        .from('reports')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', since);
      if ((count ?? 0) >= MAX_REPORTS_PER_HOUR) return json({ error: 'rate_limited' }, 429);
    }

    const now = new Date();
    const reportId = crypto.randomUUID();
    const { record, mutations } = result;

    const snapshot: ReportSnapshot = {
      version: 1,
      reportId,
      displayId: displayReportId(reportId, now),
      generatedAt: now.toISOString(),
      locale,
      demo: result.mode === 'demo',
      record,
      mutations,
      flags: computeFlags(record, mutations, now),
      circleRate: getCircleRate({
        district: record.district,
        tehsil: record.tehsil,
        village: record.village,
        landType: record.land_type,
      }),
    };

    // Store the snapshot so the report can be downloaded again from the dashboard.
    let persisted = false;
    if (admin && user) {
      const place = `${record.village}, ${tehsilLabel(record.district, record.tehsil, 'en')}, ${districtLabel(record.district, 'en')}`;
      const { error } = await admin.from('reports').insert({
        id: reportId,
        user_id: user.id,
        land_record_id: record.id,
        report_type: 'pre_purchase',
        status: 'completed',
        title: `Pre-purchase check: khasra ${record.khasra_number}, ${place}`,
        summary: `${snapshot.flags.length} point(s) to verify.`,
        findings: snapshot as unknown as Json,
        input_params: { locale },
        payment_status: 'unpaid',
        created_at: snapshot.generatedAt,
        completed_at: snapshot.generatedAt,
      });
      if (error) console.error('Could not store report', error);
      persisted = !error;
    }

    const pdf = await renderPdf(snapshot, locale);
    return pdfResponse(pdf, snapshot, persisted);
  } catch (error) {
    console.error('Report generation failed', error);
    return json({ error: 'generation_failed' }, 500);
  }
}

/**
 * GET /api/report/generate?id=<report uuid>&locale=en|hi
 * Re-downloads one of the logged-in user's earlier reports from its stored snapshot.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id') ?? '';
  const requestedLocale = url.searchParams.get('locale');
  if (!UUID.test(id)) return json({ error: 'invalid_request' }, 400);

  const user = await getCurrentUser();
  if (!user) return json({ error: 'unauthorized' }, 401);

  try {
    // Uses the visitor's own session, so Row Level Security guarantees it is their report.
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('reports')
      .select('findings')
      .eq('id', id)
      .eq('user_id', user.id)
      .maybeSingle();
    if (error) throw error;

    const snapshot = data?.findings as unknown as ReportSnapshot | undefined;
    if (!snapshot || snapshot.version !== 1) return json({ error: 'not_found' }, 404);

    const locale: ReportLocale =
      requestedLocale === 'hi' || requestedLocale === 'en' ? requestedLocale : snapshot.locale;
    const pdf = await renderPdf(snapshot, locale);
    return pdfResponse(pdf, snapshot, true);
  } catch (error) {
    console.error('Report download failed', error);
    return json({ error: 'generation_failed' }, 500);
  }
}
