import { ChevronRight } from 'lucide-react';
import { getLocale, getTranslations } from 'next-intl/server';
import { JsonLd, absoluteUrl } from '@/components/seo/JsonLd';
import { Link } from '@/i18n/navigation';
import { TOOL_HREFS, type ToolKey } from '@/lib/tool-links';

type Props = {
  /** Omit on the /tools index page. */
  current?: ToolKey;
  className?: string;
};

/** Visible breadcrumb trail plus matching BreadcrumbList structured data. */
export async function Breadcrumbs({ current, className }: Props) {
  const [locale, t] = await Promise.all([getLocale(), getTranslations('Seo')]);
  const trail = [
    { name: t('breadcrumb.home'), href: '/' as const },
    { name: t('breadcrumb.tools'), href: '/tools' as const },
    ...(current ? [{ name: t(`tools.${current}.name`), href: TOOL_HREFS[current] }] : []),
  ];

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(locale, item.href),
    })),
  };

  return (
    <nav aria-label={t('breadcrumb.label')} className={className}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
        {trail.map((item, index) => {
          const isLast = index === trail.length - 1;
          return (
            <li key={item.href} className="flex items-center gap-2">
              {index > 0 && <ChevronRight className="size-4 shrink-0" aria-hidden="true" />}
              {isLast ? (
                <span aria-current="page" className="font-medium text-foreground">{item.name}</span>
              ) : (
                <Link href={item.href} className="inline-flex min-h-10 items-center underline-offset-4 hover:text-foreground hover:underline">
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
      <JsonLd data={schema} />
    </nav>
  );
}
