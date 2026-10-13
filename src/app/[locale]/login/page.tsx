import { DatabaseZap, LogIn } from 'lucide-react';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { LoginForm } from '@/components/auth/LoginForm';
import { StateMessage } from '@/components/layout/StateMessage';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { getCurrentUser } from '@/lib/auth';
import { safeNextPath } from '@/lib/phone';
import { pageMetadata } from '@/lib/seo';
import { isSupabaseConfigured } from '@/lib/supabase/config';

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as Locale, namespace: 'Auth' });
  return pageMetadata({ locale, path: '/login', title: t('title'), description: t('metaDescription'), noindex: true });
}

export default async function LoginPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const t = await getTranslations('Auth');
  const raw = await searchParams;
  const nextParam = Array.isArray(raw.next) ? raw.next[0] : raw.next;
  const next = safeNextPath(nextParam);
  const linkError = (Array.isArray(raw.error) ? raw.error[0] : raw.error) === 'link';

  const user = await getCurrentUser();

  return (
    <div className="container flex justify-center py-10 sm:py-16">
      <div className="w-full max-w-md">
        {!isSupabaseConfigured ? (
          <StateMessage icon={DatabaseZap} title={t('title')} body={t('notConfigured')} />
        ) : user ? (
          <StateMessage icon={LogIn} title={t('already.title')} body={t('already.body')}>
            <Button asChild>
              <Link href={next}>{t('already.button')}</Link>
            </Button>
          </StateMessage>
        ) : (
          <div className="rounded-xl border bg-card p-6 shadow-sm sm:p-8">
            <h1 className="text-2xl sm:text-3xl">{t('title')}</h1>
            <p className="mb-6 mt-2 text-muted-foreground">{t('subtitle')}</p>
            {linkError && (
              <p role="alert" className="mb-5 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
                {t('errors.link')}
              </p>
            )}
            <LoginForm next={next} />
            <p className="mt-6 border-t pt-4 text-sm text-muted-foreground">{t('why')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
