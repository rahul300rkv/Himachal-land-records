import { z } from 'zod';
import {
  createCaptchaSession,
  continueOfficialSearch,
  getDependentOptions,
  getDistricts,
  prepareOfficialSearch,
  submitOfficialSearch,
} from '@/lib/himbhoomi';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const preferredRegion = 'bom1';
export const maxDuration = 60;

const requestSchema = z.discriminatedUnion('action', [
  z.object({ action: z.literal('districts') }),
  z.object({ action: z.literal('tehsils'), district: z.string().min(1).max(10) }),
  z.object({ action: z.literal('villages'), district: z.string().min(1).max(10), tehsil: z.string().min(1).max(10) }),
  z.object({ action: z.literal('years'), district: z.string().min(1).max(10), tehsil: z.string().min(1).max(10), village: z.string().min(1).max(20) }),
  z.object({ action: z.literal('recordOptions'), district: z.string().min(1).max(10), tehsil: z.string().min(1).max(10), village: z.string().min(1).max(20), year: z.string().regex(/^\d{4}$/) }),
  z.object({ action: z.literal('captcha'), token: z.string().min(1).max(250_000) }),
  z.object({ action: z.literal('search'), token: z.string().min(1).max(250_000), captcha: z.string().trim().min(1).max(12) }),
  z.object({
    action: z.literal('continue'),
    token: z.string().min(1).max(250_000),
    fields: z.record(z.string(), z.string()),
    eventTarget: z.string().max(150).optional(),
  }),
]);

function diagnosticCode(error: unknown) {
  const outer = error instanceof Error ? error.name : 'UnknownError';
  const cause = (error as { cause?: { code?: unknown; name?: unknown } } | null)?.cause;
  const detail = typeof cause?.code === 'string' ? cause.code
    : typeof cause?.name === 'string' ? cause.name : outer;
  return detail.replace(/[^A-Z0-9_-]/gi, '').slice(0, 48) || 'UNKNOWN';
}

export async function POST(request: Request) {
  try {
    const input = requestSchema.parse(await request.json());
    if (input.action === 'districts') return Response.json({ options: await getDistricts() });
    if (input.action === 'tehsils') return Response.json({ options: await getDependentOptions(input) });
    if (input.action === 'villages') return Response.json({ options: await getDependentOptions(input) });
    if (input.action === 'years') return Response.json({ options: await getDependentOptions(input) });
    if (input.action === 'recordOptions') return Response.json(await prepareOfficialSearch(input));
    if (input.action === 'captcha') return Response.json(await createCaptchaSession(input.token));
    if (input.action === 'search') return Response.json(await submitOfficialSearch(input.token, input.captcha));
    return Response.json(await continueOfficialSearch(input.token, input.fields, input.eventTarget));
  } catch (error) {
    console.error('HimBhoomi relay failed', {
      region: process.env.VERCEL_REGION || 'local',
      code: diagnosticCode(error),
      ...(error instanceof TypeError && error.cause instanceof Error
        ? { networkStage: error.cause.name }
        : {}),
    });
    const message = error instanceof z.ZodError
      ? 'Invalid request'
      : `HimBhoomi is temporarily unavailable [${diagnosticCode(error)}]`;
    return Response.json({ error: message }, { status: error instanceof z.ZodError ? 400 : 502 });
  }
}

