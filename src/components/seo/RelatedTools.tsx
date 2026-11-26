import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { RELATED_TOOLS, TOOL_HREFS, type ToolKey } from '@/lib/tool-links';

/** Descriptive internal links to the next logical tools, driven by lib/tool-links.ts. */
export async function RelatedTools({ current }: { current: ToolKey }) {
  const t = await getTranslations('Seo');
  return (
    <section aria-labelledby="related-tools" className="mt-12 border-t border-border pt-8">
      <h2 id="related-tools" className="text-2xl sm:text-3xl">{t('related.title')}</h2>
      <p className="mt-2 max-w-3xl text-muted-foreground">{t('related.intro')}</p>
      <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {RELATED_TOOLS[current].map((key) => (
          <li key={key}>
            <Link href={TOOL_HREFS[key]} className="flex h-full min-h-12 flex-col rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/50">
              <span className="font-semibold text-primary">{t(`tools.${key}.name`)}</span>
              <span className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(`tools.${key}.hint`)}</span>
            </Link>
          </li>
        ))}
      </ul>
      <Link href="/tools" className="mt-4 inline-flex min-h-12 items-center font-medium text-primary underline underline-offset-4">
        {t('related.all')}
      </Link>
    </section>
  );
}
