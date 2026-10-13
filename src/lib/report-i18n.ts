import 'server-only';
import { createTranslator } from 'next-intl';
import en from '@/messages/en.json';
import hi from '@/messages/hi.json';
import type { ReportLocale } from '@/lib/report';

/** Loosely typed translate function (report keys are built dynamically). */
export type ReportT = (key: string, values?: Record<string, string | number>) => string;

/** Translator for use outside a request (route handlers). Uses the full message catalogue. */
export function createReportTranslator(locale: ReportLocale): ReportT {
  const messages = locale === 'hi' ? hi : en;
  return createTranslator({ locale, messages }) as unknown as ReportT;
}
