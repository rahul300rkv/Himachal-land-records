import { useTranslations } from 'next-intl';
import { Reveal } from '@/components/ui/reveal';

const STEPS = ['search', 'review', 'verify'] as const;

export function HowItWorks() {
  const t = useTranslations('Home.howItWorks');

  return (
    <section className="blueprint-grid text-white">
      <div className="container py-20 sm:py-28">
        <Reveal>
          <h2 className="text-3xl text-white sm:text-4xl lg:text-5xl">{t('title')}</h2>
        </Reveal>

        {/* The steps are a real sequence, so numbering carries meaning here */}
        <ol className="mt-10 grid gap-8 md:grid-cols-3">
          {STEPS.map((key, index) => (
            <li key={key}>
              <Reveal delay={index * 0.1} className="concept-card flex gap-5 border border-dashed border-white/25 bg-white/[0.035] p-6">
                <span
                  className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/30 font-serif text-lg text-white"
                  aria-hidden="true"
                >
                  {index + 1}
                </span>
                <div>
                  <h3 className="text-2xl text-white">{t(`steps.${key}.title`)}</h3>
                  <p className="mt-2 leading-relaxed text-white/65">{t(`steps.${key}.description`)}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
