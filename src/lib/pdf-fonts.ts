import 'server-only';
import { Font } from '@react-pdf/renderer';
import path from 'node:path';

let registered = false;

/**
 * Registers the Hind font for PDFs. The font files are split by script, so two families are
 * registered and used together as a fallback list: ['Hind', 'HindDeva'] renders Latin
 * letters, digits, ₹ and Devanagari in the same line. (Fonts: SIL Open Font License, see
 * src/assets/fonts/OFL-LICENSE.txt.)
 */
export function registerPdfFonts() {
  if (registered) return;
  const dir = path.join(process.cwd(), 'src', 'assets', 'fonts');

  Font.register({
    family: 'Hind',
    fonts: [
      { src: path.join(dir, 'hind-latin-400.woff'), fontWeight: 400 },
      { src: path.join(dir, 'hind-latin-700.woff'), fontWeight: 700 },
    ],
  });
  Font.register({
    family: 'HindDeva',
    fonts: [
      { src: path.join(dir, 'hind-devanagari-400.woff'), fontWeight: 400 },
      { src: path.join(dir, 'hind-devanagari-700.woff'), fontWeight: 700 },
    ],
  });
  // Never hyphenate: automatic hyphenation breaks Devanagari words and long numbers.
  Font.registerHyphenationCallback((word) => [word]);
  registered = true;
}
