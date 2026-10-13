/**
 * Indian mobile numbers. Supabase phone auth wants E.164 (+91XXXXXXXXXX).
 * Accepts "98765 43210", "09876543210", "+91 98765 43210", "919876543210".
 */
export function normalizeIndianMobile(input: string): string | null {
  const digits = input.replace(/[\s()-]/g, '').replace(/^\+/, '');
  const national = digits.replace(/^(91|0)(?=\d{10}$)/, '');
  return /^[6-9]\d{9}$/.test(national) ? `+91${national}` : null;
}

/** "+919876543210" -> "+91 98765 43210" */
export function formatIndianMobile(e164: string): string {
  const m = /^\+91(\d{5})(\d{5})$/.exec(e164);
  return m ? `+91 ${m[1]} ${m[2]}` : e164;
}

/** Only allow same-site relative paths after login, to avoid open redirects. */
export function safeNextPath(value: string | null | undefined): string {
  if (!value || !value.startsWith('/') || value.startsWith('//') || value.includes('\\')) return '/dashboard';
  return value;
}
