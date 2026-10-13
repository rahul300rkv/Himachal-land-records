import { useTranslations } from 'next-intl';
import { Reveal } from '@/components/ui/reveal';

const STEPS = ['search', 'review', 'verify'] as const;

export function HowItWorks() {
  const t = useTranslations('Home.howItWorks');

  return (
    <section className="bg-primary-soft">
      <div className="container py-12 sm:py-16">
        <Reveal>
          <h2 className="text-3xl sm:text-4xl">{t('title')}</h2>
        </Reveal>

        {/* The steps are a real sequence, so numbering carries meaning here */}
        <ol className="mt-10 grid gap-8 md:grid-cols-3">
          {STEPS.map((key, index) => (
            <li key={key}>
              <Reveal delay={index * 0.1} className="flex gap-4">
                <span
                  className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary font-serif text-lg font-semibold text-primary-foreground"
                  aria-hidden="true"
                >
                  {index + 1}
                </span>
                <div>
                  <h3 className="text-xl">{t(`steps.${key}.title`)}</h3>
                  <p className="mt-2 text-muted-foreground">{t(`steps.${key}.description`)}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
