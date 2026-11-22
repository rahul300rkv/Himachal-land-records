import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

export async function HomeExtraSections() {
  const t = await getTranslations('Home');

  return (
    <>
      <section className="border-t bg-background">
        <div className="container max-w-4xl py-16 sm:py-20">
          <h2 className="text-2xl sm:text-3xl">{t('section118.title')}</h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{t('section118.body')}</p>
        </div>
      </section>

      <section className="border-t bg-muted/30">
        <div className="container max-w-4xl py-16 sm:py-20">
          <h2 className="text-2xl sm:text-3xl">{t('checklistTitle')}</h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{t('checklistBody')}</p>
          <Link href="/verify" className="mt-6 inline-flex items-center gap-2 font-semibold text-primary underline-offset-4 hover:underline">
            Open the verification checklist
          </Link>
        </div>
      </section>
    </>
  );
}
