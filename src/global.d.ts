import type { routing } from '@/i18n/routing';
import type en from './messages/en.json';

// Type-safe translation keys and locales across the app.
declare module 'next-intl' {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof en;
  }
}
