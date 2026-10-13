import createIntlMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { routing } from '@/i18n/routing';

// Detects the visitor's language (NEXT_LOCALE cookie, then Accept-Language header)
// and redirects "/" -> "/hi" or "/en".
const handleI18nRouting = createIntlMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const intlResponse = handleI18nRouting(request);
  const { response } = await updateSession(request, intlResponse);
  return response;
}

export const config = {
  // Run on all paths except API routes, Next.js internals and files with an extension.
  matcher: ['/((?!api|trpc|_next|_vercel|.*\\..*).*)'],
};
