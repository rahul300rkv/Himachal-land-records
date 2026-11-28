import { createHash } from 'node:crypto';
import { assess } from '@/lib/nakal/assess';
import { ExtractionError, extractNakal } from '@/lib/nakal/extract';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60; // PDF vision requests can take up to 55 s

const MAX_BYTES = 4 * 1024 * 1024; // Vercel rejects request bodies over ~4.5 MB
const MAX_PER_HOUR = 20;
// Changing the extraction contract must invalidate partial results held by a
// warm server instance. Keep this separate from the PDF digest so the same PDF
// can be reprocessed after an extractor improvement without another AI pass in
// the client.
const EXTRACTOR_VERSION = 'nakal-extractor-v18-generic-name-reading';

// Best-effort limiter and cache, both scoped to the server instance.
const hits = new Map<string, number[]>();
const resultCache = new Map<string, { expiresAt: number; value: { model: string; result: ReturnType<typeof assess> } }>();
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;
function limited(key: string) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < 3_600_000);
  if (recent.length >= MAX_PER_HOUR) { hits.set(key, recent); return true; }
  recent.push(now);
  hits.set(key, recent);
  return false;
}

const json = (body: Record<string, unknown>, status: number) =>
  Response.json(body, { status, headers: { 'Cache-Control': 'private, no-store' } });

/** POST multipart/form-data { file: PDF } -> { model, result } */
export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';

  const form = await request.formData().catch(() => null);
  const file = form?.get('file');
  if (!(file instanceof File)) return json({ error: 'invalid_file' }, 400);
  if (file.size > MAX_BYTES) return json({ error: 'too_large' }, 413);
  const bytes = Buffer.from(await file.arrayBuffer());
  if (bytes.subarray(0, 5).toString('latin1') !== '%PDF-') return json({ error: 'invalid_file' }, 400);
  const digest = createHash('sha256').update(EXTRACTOR_VERSION).update(bytes).digest('hex');
  const cached = resultCache.get(digest);
  if (cached && cached.expiresAt > Date.now()) {
    return json({ ...cached.value, cached: true }, 200);
  }
  resultCache.delete(digest);
  // Count only valid PDF analysis attempts. Invalid uploads and configuration
  // errors should not lock a user out while they are correcting a submission.
  if (limited(ip)) return json({ error: 'rate_limited' }, 429);

  try {
    const { raw, model } = await extractNakal(bytes);
    const value = { model, result: assess(raw) };
    resultCache.set(digest, { expiresAt: Date.now() + CACHE_TTL_MS, value });
    return json({ ...value, cached: false }, 200);
  } catch (e) {
    const code = e instanceof ExtractionError ? e.code : 'model_error';
    // Never log file contents or owner names.
    console.error('nakal analyze failed:', {
      code,
      message: e instanceof Error ? e.message.slice(0, 500) : 'unknown error',
    });
    const status = code === 'not_configured' ? 503 : code === 'rate_limited' ? 429 : 502;
    return json({ error: code }, status);
  }
}
