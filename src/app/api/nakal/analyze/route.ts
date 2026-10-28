import { getCurrentUser } from '@/lib/auth';
import { assess } from '@/lib/nakal/assess';
import { ExtractionError, extractNakal } from '@/lib/nakal/extract';
import { isSupabaseConfigured } from '@/lib/supabase/config';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60; // reading a PDF can take 20-50 s

const MAX_BYTES = 4 * 1024 * 1024; // Vercel rejects request bodies over ~4.5 MB
const MAX_PER_HOUR = 5;

// Best-effort limiter (per server instance). The free Gemini quota is small, so also
// require login whenever Supabase is configured.
const hits = new Map<string, number[]>();
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
  const user = await getCurrentUser();
  if (isSupabaseConfigured && !user) return json({ error: 'unauthorized' }, 401);

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (limited(user?.id ?? ip)) return json({ error: 'rate_limited' }, 429);

  const form = await request.formData().catch(() => null);
  const file = form?.get('file');
  if (!(file instanceof File)) return json({ error: 'invalid_file' }, 400);
  if (file.size > MAX_BYTES) return json({ error: 'too_large' }, 413);
  const bytes = Buffer.from(await file.arrayBuffer());
  if (bytes.subarray(0, 5).toString('latin1') !== '%PDF-') return json({ error: 'invalid_file' }, 400);

  try {
    const { raw, model } = await extractNakal(bytes);
    return json({ model, result: assess(raw) }, 200);
  } catch (e) {
    const code = e instanceof ExtractionError ? e.code : 'model_error';
    // Never log file contents or owner names.
    console.error('nakal analyze failed:', code);
    const status = code === 'not_configured' ? 503 : code === 'rate_limited' ? 429 : 502;
    return json({ error: code }, status);
  }
}
