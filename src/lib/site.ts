/**
 * Site-wide constants used by the legal pages and metadata.
 *
 * Have the legal pages (About, Disclaimer, Privacy, Terms) reviewed by a
 * qualified advocate before relying on them in production.
 */
export const SITE = {
  name: 'HimachalLand Check',
  companyName: 'Himland Check',
  contactEmail: 'himlandcheck@gmail.com',
  /** TODO: set your Blogger address (e.g. https://yourblog.blogspot.com). Leave empty to hide the footer link. */
  bloggerUrl: 'https://himlandcheck.blogspot.com/',
  /** TODO: confirm the place whose courts have jurisdiction (see Terms of use). */
  jurisdiction: 'Shimla, Himachal Pradesh',
  /** Update this date (YYYY-MM-DD) whenever the legal pages change. */
  legalLastUpdated: '2026-11-17',
} as const;

/** Formats the "last updated" date for the visitor's language, e.g. "11 October 2026". */
export function formatLegalDate(locale: string) {
  return new Intl.DateTimeFormat(locale === 'hi' ? 'hi-IN' : 'en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  }).format(new Date(`${SITE.legalLastUpdated}T00:00:00+05:30`));
}

/** Values substituted into {company}, {email}, {jurisdiction} placeholders in legal copy. */
export const LEGAL_VARS = {
  company: SITE.companyName,
  email: SITE.contactEmail,
  jurisdiction: SITE.jurisdiction,
} as const;

/** Replaces {company}, {email} and {jurisdiction} in raw legal copy (t.raw skips ICU formatting). */
export function fillLegalVars(text: string) {
  return text.replace(/\{(company|email|jurisdiction)\}/g, (_, key: keyof typeof LEGAL_VARS) => LEGAL_VARS[key]);
}
