/**
 * Site-wide constants used by the legal pages and metadata.
 *
 * TODO before launch: replace the placeholder values marked below, and have the
 * legal pages (About, Disclaimer, Privacy, Terms) reviewed by a qualified advocate.
 */
export const SITE = {
  name: 'HimachalLand Check',
  /** TODO: replace with the registered name of the LLP (the pages append "LLP"). */
  companyName: '[Your Company Name]',
  /** TODO: replace with a monitored support / grievance email address. */
  contactEmail: 'hello@your-domain.example',
  /** TODO: confirm the place whose courts have jurisdiction (see Terms of use). */
  jurisdiction: 'Shimla, Himachal Pradesh',
  /** Update this date (YYYY-MM-DD) whenever the legal pages change. */
  legalLastUpdated: '2026-10-11',
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
