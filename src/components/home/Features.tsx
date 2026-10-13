import { FileSearch, Map, ShieldCheck, Store } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Reveal } from '@/components/ui/reveal';
import { Link } from '@/i18n/navigation';

const FEATURES = [
  { key: 'search', icon: FileSearch, href: '/search' },
  { key: 'maps', icon: Map, href: null },
  { key: 'reports', icon: ShieldCheck, href: '/reports' },
  { key: 'marketplace', icon: Store, href: '/marketplace' },
] as const;

export function Features() {
  const t = useTranslations('Home.features');

  return (
    <section className="container py-12 sm:py-16">
      <Reveal className="max-w-2xl">
        <h2 className="text-3xl sm:text-4xl">{t('title')}</h2>
        <p className="mt-3 text-lg text-muted-foreground">{t('subtitle')}</p>
      </Reveal>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map(({ key, icon: Icon, href }, index) => (
          <li key={key}>
            <Reveal delay={index * 0.07} className="land-feature">
              <span className="flex size-11 items-center justify-center rounded-lg bg-primary-soft text-primary">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-xl">
                {href ? (
                  <Link href={href} className="rounded-sm text-primary hover:underline">
                    {t(`items.${key}.title`)}
                  </Link>
                ) : (
                  t(`items.${key}.title`)
                )}
              </h3>
              <p className="mt-2 text-muted-foreground">{t(`items.${key}.description`)}</p>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
