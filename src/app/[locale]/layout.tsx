import type { Metadata, Viewport } from 'next';
import { Hind, Noto_Serif, Noto_Serif_Devanagari } from 'next/font/google';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { DisclaimerBanner } from '@/components/layout/DisclaimerBanner';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { routing, type Locale } from '@/i18n/routing';
import '../globals.css';

// Hind: one family that covers both Latin and Devanagari for body/UI text.
const hind = Hind({
  subsets: ['latin', 'devanagari'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

// Noto Serif for headings: Latin glyphs from Noto Serif, Hindi from Noto Serif Devanagari.
const serifLatin = Noto_Serif({
  subsets: ['latin'],
  variable: '--font-serif-latin',
  display: 'swap',
});
const serifDeva = Noto_Serif_Devanagari({
  subsets: ['devanagari'],
  variable: '--font-serif-deva',
  display: 'swap',
});

// Only these message namespaces are sent to the browser (for Client Components). Long legal
// text, PDF strings and the like stay on the server, which keeps every page lighter.
const CLIENT_NAMESPACES = [
  'Metadata',
  'Navigation',
  'Common',
  'Home',
  'Search',
  'LandTypes',
  'Units',
  'Converter',
  'Record',
  'Marketplace',
  'MutationTypes',
  'MutationStatus',
  'ListingStatus',
  'Auth',
  'Dashboard',
  'SaveSearch',
  'Errors',
  'NotFound',
] as const;

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as Locale, namespace: 'Metadata' });

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
    title: { default: t('title'), template: `%s | ${t('siteName')}` },
    description: t('description'),
    applicationName: t('siteName'),
    openGraph: {
      type: 'website',
      siteName: t('siteName'),
      title: t('title'),
      description: t('description'),
      locale: locale === 'hi' ? 'hi_IN' : 'en_IN',
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enables static rendering for next-intl in Server Components.
  setRequestLocale(locale);

  const allMessages = await getMessages();
  const messages = Object.fromEntries(
    CLIENT_NAMESPACES.filter((ns) => ns in allMessages).map((ns) => [ns, allMessages[ns as keyof typeof allMessages]]),
  );
  const t = await getTranslations('Common');

  return (
    <html
      lang={locale}
      className={`${hind.variable} ${serifLatin.variable} ${serifDeva.variable}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
          >
            {t('skipToContent')}
          </a>

          {/* Legal notice stays visible on every page */}
          <DisclaimerBanner />
          <Header />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
