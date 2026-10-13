import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'hi'],
  // Used when the visitor's browser language is neither English nor Hindi.
  // Most visitors are expected to be Hindi readers; change to 'en' if you prefer.
  defaultLocale: 'hi',
  // Always show the locale in the URL (/hi/..., /en/...) so pages are shareable and indexable.
  localePrefix: 'always',
});

export type Locale = (typeof routing.locales)[number];
