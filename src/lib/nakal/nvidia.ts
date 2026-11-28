import 'server-only';
import { createCanvas } from '@napi-rs/canvas';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

const DEFAULT_MODEL = 'microsoft/phi-4-multimodal-instruct';

export async function readWithNvidia(pdf: Buffer, prompt: string, key: string, signal: AbortSignal) {
  const model = process.env.NVIDIA_MODEL?.trim() || DEFAULT_MODEL;
  if (!/^[\w.-]+\/[\w.-]+$/.test(model)) throw new Error('Invalid NVIDIA model ID');

  const loading = getDocument({ data: Uint8Array.from(pdf), maxImageSize: 8_000_000 });
  const abort = () => { void loading.destroy().catch(() => {}); };
  signal.addEventListener('abort', abort, { once: true });
  const images: { type: 'image_url'; image_url: { url: string } }[] = [];
  let pageNumber = 0;
  try {
    signal.throwIfAborted();
    const doc = await loading.promise;
    if (doc.numPages > 8) throw new Error('NVIDIA fallback supports up to 8 pages');
    for (let index = 1; index <= doc.numPages; index++) {
      pageNumber = index;
      signal.throwIfAborted();
      const page = await doc.getPage(index);
      const base = page.getViewport({ scale: 1 });
      const viewport = page.getViewport({ scale: 1800 / Math.max(base.width, base.height) });
      const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
      try {
        await page.render({ canvas: canvas as unknown as HTMLCanvasElement, viewport }).promise;
        // Crystal Reports puts the useful mutation history and case stamp in
        // the narrow right-hand remarks column. Keep page 1 complete for the
        // header/owner/khasra fields, but send a focused crop for continuation
        // pages. This keeps the same three-image request while giving the
        // fallback model materially more pixels for the evidence column.
        const evidenceCanvas = index === 1
          ? canvas
          : (() => {
              const crop = createCanvas(Math.ceil(canvas.width * 0.4), canvas.height);
              const context = crop.getContext('2d');
              context.drawImage(
                canvas,
                Math.floor(canvas.width * 0.6), 0,
                Math.ceil(canvas.width * 0.4), canvas.height,
                0, 0,
                crop.width, crop.height,
              );
              return crop;
            })();
        let jpeg = evidenceCanvas.toBuffer('image/jpeg', 78);
        if (jpeg.length > 130_000) jpeg = evidenceCanvas.toBuffer('image/jpeg', 50);
        if (jpeg.length > 130_000) jpeg = evidenceCanvas.toBuffer('image/jpeg', 50);
        if (jpeg.length > 130_000) jpeg = evidenceCanvas.toBuffer('image/jpeg', 32);
        if (jpeg.length > 130_000) throw new Error('Rendered page exceeds NVIDIA inline image limit');
        images.push({ type: 'image_url', image_url: { url: `data:image/jpeg;base64,${jpeg.toString('base64')}` } });
        if (evidenceCanvas !== canvas) evidenceCanvas.width = evidenceCanvas.height = 1;
      } finally {
        page.cleanup();
        canvas.width = canvas.height = 1;
      }
    }
  } catch {
    throw new Error(signal.aborted ? 'NVIDIA render timeout' : `NVIDIA render failed (page ${pageNumber})`);
  } finally {
    signal.removeEventListener('abort', abort);
    await loading.destroy().catch(() => {});
  }

  const endpoint = model === DEFAULT_MODEL ? model : 'chat/completions';
  const response = await fetch(`https://integrate.api.nvidia.com/v1/${endpoint}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: [...images, { type: 'text', text: prompt }] }],
      max_tokens: 4096,
      temperature: 0,
    }),
    signal,
  }).catch(() => {
    throw new Error(signal.aborted ? 'NVIDIA request timeout' : 'NVIDIA connection failed');
  });
  if (response.status !== 200) throw new Error(`NVIDIA HTTP ${response.status}`);
  const data = await response.json().catch(() => {
    throw new Error(signal.aborted ? 'NVIDIA response timeout' : 'NVIDIA invalid response');
  }) as { choices?: { finish_reason?: string; message?: { content?: string } }[] };
  const choice = data.choices?.[0];
  if (choice?.finish_reason !== 'stop' || !choice.message?.content) {
    throw new Error(choice?.finish_reason === 'length' ? 'NVIDIA output truncated' : 'NVIDIA empty or unfinished output');
  }
  return { model, text: choice.message.content };
}
