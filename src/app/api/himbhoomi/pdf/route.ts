import { renderToBuffer, type DocumentProps } from '@react-pdf/renderer';
import { createElement, type ReactElement } from 'react';
import { z } from 'zod';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { JamabandiCopy } from '@/components/reports/JamabandiCopy';
import { cleanDisplayText } from '@/lib/himbhoomi';
import { registerPdfFonts } from '@/lib/pdf-fonts';

export const runtime = 'nodejs';
export const maxDuration = 60;

const schema = z.object({
  receiptNumber: z.string().regex(/^\d{8,20}$/),
  labels: z.array(z.object({ id: z.string().max(160), value: z.string().max(30000) })).max(200),
  parcelTable: z.object({
    headers: z.array(z.string().max(500)).length(7),
    rows: z.array(z.array(z.string().max(10000)).length(7)).min(1).max(1000),
  }),
});

export async function POST(request: Request) {
  const text = await request.text();
  if (text.length > 1_000_000) return Response.json({ error: 'too_large' }, { status: 413 });
  let input: unknown;
  try { input = JSON.parse(text); } catch { return Response.json({ error: 'invalid_request' }, { status: 400 }); }
  const parsed = schema.safeParse(input);
  if (!parsed.success) return Response.json({ error: 'invalid_request' }, { status: 400 });
  try {
    registerPdfFonts();
    const data = {
      ...parsed.data,
      labels: parsed.data.labels.map((label) => ({ ...label, value: cleanDisplayText(label.value) })),
      parcelTable: {
        headers: parsed.data.parcelTable.headers.map(cleanDisplayText),
        rows: parsed.data.parcelTable.rows.map((row) => row.map(cleanDisplayText)),
      },
    };
    const document = createElement(JamabandiCopy, { data }) as unknown as ReactElement<DocumentProps>;
    const pdf = await renderToBuffer(document);
    return new Response(new Uint8Array(pdf), { headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="HimLand-Check-information-${parsed.data.receiptNumber}.pdf"`,
      'Cache-Control': 'private, no-store',
    } });
  } catch (error) {
    // Record diagnostic metadata without logging uploaded record values.
    const message = error instanceof Error ? error.message : '';
    const category = /ENOENT|font|woff/i.test(message) ? 'font_or_asset'
      : /memory|heap|allocation/i.test(message) ? 'memory'
        : /layout|page|height|width|render/i.test(message) ? 'rendering'
          : 'unexpected';
    console.error('Jamabandi information PDF generation failed', {
      category,
      errorType: error instanceof Error ? error.name : 'UnknownError',
      region: process.env.VERCEL_REGION || 'local',
      rowCount: parsed.data.parcelTable.rows.length,
      fontFiles: ['hind-latin-400.ttf', 'hind-devanagari-400.ttf'].map((name) => ({
        name,
        exists: existsSync(path.join(process.cwd(), 'src/assets/fonts', name)),
      })),
      stack: error instanceof Error ? error.stack?.split('\n').slice(1, 5).join('\n') : undefined,
    });
    // Include a short parser detail so deployment failures can be diagnosed from
    // the browser response; never include submitted record values or the full stack.
    const detail = message.replace(/\s+/g, ' ').slice(0, 240) || 'PDF renderer failed';
    return Response.json({ error: 'generation_failed', category, detail }, { status: 500 });
  }
}