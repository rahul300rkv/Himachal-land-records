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
  try {
    signal.throwIfAborted();
    const doc = await loading.promise;
    if (doc.numPages > 8) throw new Error('NVIDIA fallback supports up to 8 pages');
    for (let index = 1; index <= doc.numPages; index++) {
      signal.throwIfAborted();
      const page = await doc.getPage(index);
      const base = page.getViewport({ scale: 1 });
      const viewport = page.getViewport({ scale: 1800 / Math.max(base.width, base.height) });
      const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
      try {
        await page.render({ canvas: canvas as unknown as HTMLCanvasElement, viewport }).promise;
        let jpeg = canvas.toBuffer('image/jpeg', 78);
        if (jpeg.length > 130_000) jpeg = canvas.toBuffer('image/jpeg', 50);
        if (jpeg.length > 130_000) throw new Error('Rendered page exceeds NVIDIA inline image limit');
        images.push({ type: 'image_url', image_url: { url: `data:image/jpeg;base64,${jpeg.toString('base64')}` } });
      } finally {
        page.cleanup();
        canvas.width = canvas.height = 1;
      }
    }
  } finally {
    signal.removeEventListener('abort', abort);
    await loading.destroy();
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
  });
  if (response.status !== 200) throw new Error(`NVIDIA HTTP ${response.status}`);
  const data = await response.json() as { choices?: { finish_reason?: string; message?: { content?: string } }[] };
  const choice = data.choices?.[0];
  if (choice?.finish_reason !== 'stop' || !choice.message?.content) {
    throw new Error('NVIDIA extraction did not finish');
  }
  return { model, text: choice.message.content };
}
