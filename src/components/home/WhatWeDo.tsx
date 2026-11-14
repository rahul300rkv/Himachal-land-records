import { useTranslations } from 'next-intl';
import { Reveal } from '@/components/ui/reveal';

const RECORDS = ['jamabandi', 'khasra', 'khatauni', 'khewat', 'mutations', 'shajra'] as const;

export function WhatWeDo() {
  const t = useTranslations('Home.whatWeDo');

  return (
    <section className="border-y bg-[#f7f7f4]">
      <div className="container grid gap-12 py-20 sm:py-28 lg:grid-cols-[2fr_3fr] lg:gap-24">
        <Reveal>
          <h2 className="text-4xl sm:text-6xl">{t('title')}</h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{t('body')}</p>
        </Reveal>

        <Reveal delay={0.1}>
          <h3 className="sr-only">{t('glossary')}</h3>
          <dl className="grid gap-x-10 gap-y-0 sm:grid-cols-2">
            {RECORDS.map((key) => (
              <div key={key} className="border-t border-black/10 py-6">
                <dt className="text-2xl">{t(`records.${key}.title`)}</dt>
                <dd className="mt-2 leading-relaxed text-muted-foreground">{t(`records.${key}.description`)}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
