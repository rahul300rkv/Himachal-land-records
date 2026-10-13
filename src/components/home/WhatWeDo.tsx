import { useTranslations } from 'next-intl';
import { Reveal } from '@/components/ui/reveal';

const RECORDS = ['jamabandi', 'khasra', 'khatauni', 'khewat', 'mutations', 'shajra'] as const;

export function WhatWeDo() {
  const t = useTranslations('Home.whatWeDo');

  return (
    <section className="border-y bg-secondary/60">
      <div className="container grid gap-10 py-12 sm:py-16 lg:grid-cols-[2fr_3fr] lg:gap-16">
        <Reveal>
          <h2 className="text-3xl sm:text-4xl">{t('title')}</h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{t('body')}</p>
        </Reveal>

        <Reveal delay={0.1}>
          <h3 className="sr-only">{t('glossary')}</h3>
          <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
            {RECORDS.map((key) => (
              <div key={key} className="border-l-2 border-leaf/40 pl-4">
                <dt className="font-serif text-lg font-semibold">{t(`records.${key}.title`)}</dt>
                <dd className="mt-1 text-muted-foreground">{t(`records.${key}.description`)}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
