import 'server-only';
import { rawNakalSchema, type RawNakal } from './schema';

/**
 * Reads a nakal PDF with Google's Gemini API (free tier works with an AI Studio key).
 * Model IDs change often: set GEMINI_MODELS (comma separated, tried in order) from the
 * model list in AI Studio. A 429 / 404 / 5xx falls through to the next model.
 */
const ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models';
const MODELS = (process.env.GEMINI_MODELS ?? 'gemini-3.8-flash,gemini-3.5-flash-lite')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
const PER_MODEL_TIMEOUT_MS = 28_000;

export type ExtractionErrorCode = 'not_configured' | 'rate_limited' | 'model_error' | 'bad_output';
export class ExtractionError extends Error {
  constructor(public code: ExtractionErrorCode, message: string) {
    super(message);
  }
}

const PROMPT = `You are reading a Himachal Pradesh Revenue Department "Nakal Jamabandi" (Hindi, Devanagari PDF).
The PDF's embedded text layer is corrupted for Hindi: read the printed text as it appears visually on each page, not the embedded text.

Return ONLY a JSON object of this shape (no markdown):
{
  "ref_no": string,                      // nakal reference number at the top of page 1
  "district": string|null, "tehsil": string|null, "village": string|null, "jamabandi_year": string|null,
  "khata_no": string,                    // exactly as printed, e.g. "365 min/349 min"
  "total_share": integer|null,           // the number printed after the total-share (kul bhag) label
  "owners": [{"names": string, "share_num": integer}],
  "khasras": [{"number": string, "area": string|null, "land_class": string|null, "possession": string|null}],
  "mutations": [{"number": string, "kind": "sale"|"inheritance"|"gift"|"partition"|"mortgage"|"exchange"|"other",
                 "date": "dd/mm/yyyy"|null, "area": string|null, "buyer": string|null}],
  "litigation": [{"case_no": string, "case_type": string|null, "court": string|null,
                  "filed_on": "YYYY-MM-DD"|null, "status": string|null}],
  "low_confidence_fields": [string]
}

Rules:
- Transcribe names and place names in Devanagari exactly as printed. Do not translate.
- Numbers as ASCII digits. Areas stay in printed ha-are-sqm form, e.g. "00-07-15".
- If a value is unreadable or absent use null. Never guess. List unsure fields in low_confidence_fields.
- owners: one entry per printed share line. If several people share one line (e.g. "bhag barabar (989)") keep them together in ONE entry with the printed share number.
- mutations: every intkal number in the khasra rows AND in the "note" lines at the bottom. kind: sale (baiy/bai), inheritance (vrasat), gift (hiba), partition (taqsim), mortgage (rahan), exchange (tabadla), else other. Take date, area transferred (rakba wake) and buyer (name before "ke naam") from the matching note line.
- litigation: the English stamp "A Case Number ... related to ... titled as ... instituted on ... in the court of ... and is currently ...". One entry per distinct case number (the stamp repeats on pages).
- Ignore page headers, footers and page numbers.`;

function parseJson(text: string): unknown {
  const cleaned = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  return JSON.parse(cleaned);
}

export async function extractNakal(pdf: Buffer): Promise<{ raw: RawNakal; model: string }> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new ExtractionError('not_configured', 'GEMINI_API_KEY is not set');

  let last: ExtractionError = new ExtractionError('model_error', 'No model configured');
  for (const model of MODELS) {
    let res: Response;
    try {
      res = await fetch(`${ENDPOINT}/${model}:generateContent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                { inlineData: { mimeType: 'application/pdf', data: pdf.toString('base64') } },
                { text: PROMPT },
              ],
            },
          ],
          generationConfig: { temperature: 0, responseMimeType: 'application/json' },
        }),
        signal: AbortSignal.timeout(PER_MODEL_TIMEOUT_MS),
      });
    } catch {
      last = new ExtractionError('model_error', `${model}: request failed or timed out`);
      continue;
    }

    if (res.status === 429) { last = new ExtractionError('rate_limited', `${model}: quota exhausted`); continue; }
    if (res.status === 404 || res.status >= 500) { last = new ExtractionError('model_error', `${model}: HTTP ${res.status}`); continue; }
    if (!res.ok) throw new ExtractionError('model_error', `${model}: HTTP ${res.status}`);

    const data = (await res.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };
    const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? '').join('') ?? '';
    try {
      return { raw: rawNakalSchema.parse(parseJson(text)), model };
    } catch {
      last = new ExtractionError('bad_output', `${model}: output was not valid`);
    }
  }
  throw last;
}
