import 'server-only';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { rawNakalSchema, type RawNakal } from './schema';

/**
 * Reads a nakal PDF with Google's Gemini API (free tier works with an AI Studio key).
 * Model IDs change often: set GEMINI_MODELS (comma separated, tried in order) from the
 * model list in AI Studio. A 429 / 404 / 5xx falls through to the next model.
 */
const ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models';
// Keep broadly available model IDs as defaults. Override in Vercel with GEMINI_MODELS when needed.
const MODELS = (process.env.GEMINI_MODELS ?? 'gemini-3.5-flash-lite,gemini-3.5-flash')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
// PDF vision requests can take longer than text-only prompts, especially for
// Hindi Crystal Reports documents with two rendered pages.
const EXTRACTION_TIMEOUT_MS = 55_000;

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
                 "date": "dd/mm/yyyy"|null, "area": string|null, "buyer": string|null,
                 "note": string|null}],
  "owner_updates": [{"mutation_number": string|null, "names": string|null,
                     "share": string|null, "date": "dd/mm/yyyy"|null}],
  "litigation": [{"case_no": string, "case_type": string|null, "court": string|null,
                  "filed_on": "YYYY-MM-DD"|null, "status": string|null}],
  "low_confidence_fields": [string]
}

Rules:
- Transcribe names and place names in Devanagari exactly as printed. Do not translate.
- Numbers as ASCII digits. Areas stay in printed ha-are-sqm form, e.g. "00-07-15".
- If a value is unreadable or absent use null. Never guess. List unsure fields in low_confidence_fields.
- owners: one entry per printed share line. If several people share one line (e.g. "bhag barabar (989)") keep them together in ONE entry with the printed share number.
- mutations: every intkal number in the khasra rows AND in the "note" lines at the bottom. kind: sale (baiy/bai), inheritance (vrasat), gift (hiba), partition (taqsim), mortgage/charge (rahan, bank, ऋण, गिरवी, बंधक), exchange (tabadla), else other. Take date, area transferred, lender/bank or buyer, and the complete printed note text when visible. A bank loan or rahan entry is an encumbrance and must never be treated as a clean record.
- owner_updates: this is separate from the original owners block. For every accepted inheritance, sale, gift or partition note that names a new owner, create one entry for each printed recipient group. Copy the recipient names exactly as printed and copy the fractional share exactly as printed, such as "45/715", "209/715" or "22/715". Do not treat the old Jamabandi owners as the post-mutation owners, and do not invent a share when the note does not state one.
- HimBhoomi PDFs may have a corrupted Hindi text layer (Crystal Reports). Read the rendered page visually. Do not infer a name or number from a broken glyph. Preserve each khasra row separately.
- litigation: the English stamp "A Case Number ... related to ... titled as ... instituted on ... in the court of ... and is currently ...". One entry per distinct case number (the stamp repeats on pages).
- Ignore page headers, footers and page numbers.`;

function parseJson(text: string): unknown {
  const cleaned = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  return JSON.parse(cleaned);
}

type PdfTextItem = { str?: string; transform?: number[] };

/**
 * Crystal Reports preserves the numeric mutation index and the English case
 * stamp in its text objects even when the Hindi glyph mapping is corrupted.
 * Recover those stable signals deterministically after the model pass. This
 * avoids a second model request and prevents the vision model from having to
 * infer a mutation number that is already present in the PDF structure.
 */
async function supplementCrystalReport(pdf: Buffer, raw: RawNakal): Promise<RawNakal> {
  try {
    const doc = await getDocument({ data: Uint8Array.from(pdf) }).promise;
    const pages: string[] = [];
    const mutationRows: { number: string; kind: RawNakal['mutations'][number]['kind'] }[] = [];
    for (let pageNumber = 1; pageNumber <= doc.numPages; pageNumber++) {
      const page = await doc.getPage(pageNumber);
      const content = await page.getTextContent();
      const items = content.items as PdfTextItem[];
      pages.push(items.map((item) => item.str ?? '').join('\n'));

      // On the landscape HimBhoomi Crystal Reports layout, the mutation index
      // is the left edge of the right-hand remarks column on page 1. Restrict
      // the y-range to the index list so reference numbers and dates are not
      // mistaken for mutation numbers.
      if (pageNumber === 1) {
        for (const item of items) {
          const x = item.transform?.[4] ?? 0;
          const y = item.transform?.[5] ?? 0;
          const number = item.str?.trim();
          if (x < 675 || x > 705 || y < 255 || y > 375 || !number || !/^\d{3,4}$/.test(number)) continue;
          const nearby = items
            .filter((candidate) => Math.abs((candidate.transform?.[5] ?? 0) - y) <= 2 && (candidate.transform?.[4] ?? 0) >= x)
            .map((candidate) => candidate.str ?? '')
            .join(' ');
          const kind = /वरासत|वरकसत|वकसत/.test(nearby)
            ? 'inheritance'
            : /ब[ैह]|बह/.test(nearby)
              ? 'sale'
              : 'other';
          mutationRows.push({ number, kind });
        }
      }
      page.cleanup();
    }
    const mergedMutations = [...raw.mutations];
    for (const row of mutationRows) {
      if (!mergedMutations.some((mutation) => mutation.number === row.number)) {
        mergedMutations.push({ number: row.number, kind: row.kind, date: null, area: null, buyer: null, note: null });
      }
    }

    const text = pages.join('\\n');

    // Crystal Reports wraps remarks across pages. The vision model can attach
    // a wrapped remark to the next mutation number, so re-associate each
    // remark from its own printed mutation marker and number.
    const markerPositions = [...text.matchAll(/ननट|नोट|ननटट/g)]
      .map((match) => match.index ?? -1)
      .filter((index) => index >= 0);
    const crystalNotes = new Map<string, string>();
    for (const row of mutationRows) {
      const numberPosition = text.lastIndexOf(row.number);
      if (numberPosition < 0) continue;
      const start = markerPositions.filter((position) => position < numberPosition).at(-1);
      if (start === undefined) continue;
      const nextMarker = markerPositions.find((position) => position > start + 4);
      const casePosition = text.indexOf('A Case Number', start + 4);
      const endCandidates = [nextMarker, casePosition >= 0 ? casePosition : undefined].filter(
        (position): position is number => position !== undefined && position > start,
      );
      const end = endCandidates.length > 0 ? Math.min(...endCandidates) : text.length;
      const note = text.slice(start, end).replace(/\\s+/g, ' ').trim();
      if (note) crystalNotes.set(row.number, note);
    }

    const correctedMutations = mergedMutations.map((mutation) => {
      const note = mutation.number ? crystalNotes.get(mutation.number) : undefined;
      const indexed = mutation.number ? mutationRows.find((row) => row.number === mutation.number) : undefined;
      return note || indexed
        ? { ...mutation, kind: indexed?.kind ?? mutation.kind, note: note ?? mutation.note }
        : mutation;
    });

    const caseMatch = text.match(new RegExp(
      'Case Number\\s+(\\d{5,}\\/\\d{4})\\s+related to\\s+([\\s\\S]+?)\\s+titled as\\s+([\\s\\S]+?)\\s+instituted on\\s+(\\d{4}-\\d{2}-\\d{2})\\s+in the court of\\s+([\\s\\S]+?)\\s+and is currently\\s+([A-Za-z]+)',
      'i',
    ));
    const mergedLitigation = [...raw.litigation];
    if (caseMatch && !mergedLitigation.some((item) => item.case_no === caseMatch[1])) {
      mergedLitigation.push({
        case_no: caseMatch[1],
        case_type: caseMatch[2].replace(/\s+/g, ' ').trim(),
        court: caseMatch[5].replace(/\s+/g, ' ').trim(),
        filed_on: caseMatch[4],
        status: caseMatch[6],
      });
    }
    return rawNakalSchema.parse({ ...raw, mutations: correctedMutations, litigation: mergedLitigation });
  } catch {
    // Supplementation is best effort. The original model result remains valid
    // if a particular PDF has a different layout or pdfjs cannot read it.
    return raw;
  }
}

export async function extractNakal(pdf: Buffer): Promise<{ raw: RawNakal; model: string }> {
  const key = process.env.GEMINI_API_KEY;
  const nvidiaKey = process.env.NVIDIA_API_KEY?.trim();
  if (!key && !nvidiaKey) throw new ExtractionError('not_configured', 'No document provider is configured');
  const deadline = Date.now() + EXTRACTION_TIMEOUT_MS;
  const geminiDeadline = deadline - (nvidiaKey ? 25_000 : 0);

  let last: ExtractionError = new ExtractionError('model_error', 'No model configured');
  for (const [index, model] of MODELS.entries()) {
    const remaining = geminiDeadline - Date.now();
    if (!key || remaining <= 0) break;
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
        signal: AbortSignal.timeout(nvidiaKey ? Math.ceil(remaining / (MODELS.length - index)) : remaining),
      });
    } catch {
      last = new ExtractionError('model_error', `${model}: request failed or timed out`);
      continue;
    }

    if (res.status === 429) { last = new ExtractionError('rate_limited', `${model}: quota exhausted`); continue; }
    if (res.status === 404 || res.status >= 500) { last = new ExtractionError('model_error', `${model}: HTTP ${res.status}`); continue; }
    if (!res.ok) {
      last = new ExtractionError('model_error', `${model}: HTTP ${res.status}`);
      break;
    }

    const data = (await res.json().catch(() => null)) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    } | null;
    const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text ?? '').join('') ?? '';
    if (!text) {
      last = new ExtractionError('bad_output', `${model}: empty response`);
      continue;
    }
    try {
      const parsed = rawNakalSchema.parse(parseJson(text));
      return { raw: await supplementCrystalReport(pdf, parsed), model };
    } catch {
      last = new ExtractionError('bad_output', `${model}: output was not valid`);
    }
  }
  if (nvidiaKey && Date.now() < deadline) {
    let stage = 'NVIDIA renderer initialization failed';
    try {
      const { readWithNvidia } = await import('./nvidia');
      stage = 'NVIDIA processing failed';
      const { text, model } = await readWithNvidia(pdf, PROMPT, nvidiaKey, AbortSignal.timeout(Math.max(1, deadline - Date.now())));
      stage = 'NVIDIA output failed JSON or schema validation';
      const raw = rawNakalSchema.parse(parseJson(text));
      if (!raw.owners.some((owner) => owner.names) || !raw.khasras.some((plot) => plot.number)) {
        stage = 'NVIDIA output missing ownership or parcels';
        throw new Error(stage);
      }
      return { raw: await supplementCrystalReport(pdf, raw), model };
    } catch (error) {
      const safeDetail = error instanceof Error
        ? /^NVIDIA (?:HTTP \d{3}|render timeout|render failed \(page \d+\)|request timeout|connection failed|response timeout|invalid response|output truncated|empty or unfinished output)$/.exec(error.message)?.[0]
        : undefined;
      throw new ExtractionError('model_error', `${last.message}; ${safeDetail ?? stage}`);
    }
  }
  throw last;
}
